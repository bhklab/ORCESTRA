/**
 * @fileoverview Contains API functions for dataset retrieval and modification.
 */
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const auth = require('./auth');
const dataObjectHelper = require('../../helper/data-object');
const DataObject = require('../../new-db/models/data-object').DataObject;
const DataFilter = require('../../new-db/models/data-filter');
const User = require('../../new-db/models/user');

/**
 * Retrieves filtered datasets.
 * @param {*} req 
 * @param {*} res 
 */
 const search = async (req, res) => {
    console.log(req.query)
    let result = [];
    try{
        let queryObj = await dataObjectHelper.getQuery(req.query);
        result  = await DataObject.find(queryObj).lean().populate('dataset', 'name version sensitivity');

        // get the doi and downloadlink for specific data version. Only applicable to PSets. For other datasets, use 1.0.
        result = result.map(obj => {
            let repo = obj.repositories.find(r => r.version === dataObjectHelper.getDataVersion(req.query.datasetType));
            delete obj.repositories;
            return({
                ...obj,
                doi: repo.doi,
                downloadLink: repo.downloadLink
            });
        });
        let canonicals = result.filter(item => item.info.canonical).sort((a, b) => a.name.localeCompare(b.name));
        let noncanonicals = result.filter(item => !item.info.canonical).sort((a, b) => a.name.localeCompare(b.name));
        result = canonicals.concat(noncanonicals);

        if(req.query.datasetType === 'pset'){
            const filter = await DataFilter.findOne({datasetType: 'pset'}).lean();
            result = result.map(obj => {
                if(obj.tools){
                    obj.tools.rna = filter.tools.find(item => item.name === obj.tools.rna).label;
                }
                if(obj.references){
                    obj.references.rna = filter.references.find(item => item.name === obj.references.rna).label;
                }
                return(obj)
            });
        }
    }catch(error){
        console.log(error);
        result = error;
        res.status(500);
    }finally{
        res.send(result);
    }
}

const download = async (req, res) => {
    let result = {};
    try{
        await DataObject.updateOne(
            {datasetType: req.body.datasetType, 'repositories.doi': req.body.datasetDOI},
            {$inc: {'info.numDownload': 1}}
        );
    }catch(error){
        result = error;
        res.status(500);
    }finally{
        res.send(result);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const checkPrivate = async (req, res, next) => {
    try{
        // check if the dataset is private
        const dataObject = await DataObject.findOne({
            datasetType: req.query.datasetType, 
            'repositories.doi': req.query.doi
        }).select({name: 1, info: 1, repositories: 1});

        // // if private, check if the user is authenticated, and owns the dataset
        if(dataObject.info.private){
            const username = auth.getUsername(req.cookies.orcestratoken);
            if(username){
                const user = await User.findOne({email: username});
                const userDatasets = user.userDataObjects.map(id => id.toString());
                let isOwner = userDatasets.includes(dataObject._id.toString());
                if(isOwner){
                    req.authorized = true;
                }else if(req.query.shareToken && req.query.shareToken.length > 0){
                    req.authorized = req.query.shareToken === dataObject.info.shareToken;
                }
            }else if(req.query.shareToken && req.query.shareToken.length > 0){
                req.authorized = req.query.shareToken === dataObject.info.shareToken;
            }
        }else{
            req.authorized = true;
        }
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        if(req.authorized){
            next();
        }else{
            res.send({authorized: false});
        }
    }
}

/**
 * Creates and returns a sharable link to a private dataset if the authenticated user owns the dataset.
 * Only creates a link if it has not been already created.
 * @param {*} req 
 * @param {*} res 
 */
const createShareLink = async (req, res) => {
    let link = null;
    try{
        const datasetType = req.body.datasetType;
        const doi = req.body.doi;
        const dataObject = await DataObject.findOne({datasetType: datasetType, 'repositories.doi': doi}).select({name: 1, info: 1});
        const user = await User.findOne({email: req.decoded.username});
        const found = user.userDataObjects.map(id => id.toString()).find(item => item === dataObject._id.toString());
        if(found){
            if(dataObject.info.shareToken){
                link = `${process.env.BASE_URL}${datasetType}/${doi}?shared=${dataObject.info.shareToken}`;
            }else{
                let uid = uuidv4();
                await DataObject.updateOne(
                    {_id: dataObject._id},
                    {'info.shareToken': uid} 
                );
                link = `${process.env.BASE_URL}${datasetType}/${doi}?shared=${uid}`;
            }
        }
    }catch(err){
        console.log(err);
        res.status(500);
    }finally{
        res.send(link);
    }
}

/**
 * Route used to publish a private dataset
 * @param {*} req 
 * @param {*} res 
 */
const publish = async (req, res) => {
    let result = null;
    try{
        console.log(req.body);
        let doi = req.body.doi;
        let depositionId = doi.split('.').pop();

        // open the repository for editting
        let resp = await axios.post(
            `${process.env.ZENODO_URL}${depositionId}/actions/edit?access_token=${process.env.ZENODO_ACCESS_TOKEN}`
        );
        console.log(resp.status);

        // update the editied data (make the access_right 'open')
        let metadata = resp.data.metadata;
        delete metadata.access_conditions;
        let updated = {
            metadata: {...metadata, access_right: 'open'}
        }    
        resp = await axios.put(
            `${process.env.ZENODO_URL}${depositionId}?access_token=${process.env.ZENODO_ACCESS_TOKEN}`,
            updated
        );
        console.log(resp.status);

        // publish the editted deposition
        resp = await axios.post(
            `${process.env.ZENODO_URL}${depositionId}/actions/publish?access_token=${process.env.ZENODO_ACCESS_TOKEN}`
        );
        console.log(resp.status);

        // make the dataset public
        await DataObject.updateOne(
            {datasetType: req.body.datasetType, 'repositories.doi': doi}, 
            {'info.private': false}
        );
        result = {status: 'published'};
    }catch(error){  
        console.log(error);
        res.status(500);
    }finally{
        res.send(result);
    }
}

// const updateCanonicalPSets = async (req, res) => {
//     try{
//         await datasetUpdate.updateCanonicalStatus(req.body.selected.map(s => {return(s._id)}))
//         res.send();
//     }catch(error){
//         res.status(500).send(error);
//     }
// }

module.exports = {
    search,
    download,
    checkPrivate,
    createShareLink,
    publish,
    // updateCanonicalPSets,
};
