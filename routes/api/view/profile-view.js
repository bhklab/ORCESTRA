const User = require('../../../db/models/user');
const DatasetObject = require('../../../db/models/dataset-object');
const { dataTypes } = require('../../../helper/enum');
const dataObjectHelper = require('../../../helper/data-object');

const getDatasetTypeLabel = (datatype) => {
    switch(datatype){
        case dataTypes.pharmacogenomics:
            return 'Pharmacogenomics';
        case dataTypes.toxicogenomics:
            return 'Toxicogenomics';
        case dataTypes.xenographic:
            return 'Xenographic Pharmacogenomics';
        case dataTypes.clinicalgenomics:
            return 'Clinical Genomics';
        case dataTypes.radiogenomics:
            return 'Radiogenomics';
        default:
            return '';
    }
}

const get = async (req, res) => {
    let result = {};
    try{
        let userDatasets = [];
        const user = await User.findOne({email: req.query.username});
        for(const type of Object.values(dataTypes)){
            let found = await DatasetObject.find({datasetType: type, _id: {$in: user.userDataObjects}}).populate('dataset', 'name').lean();
            found = found.map(item => {
                let repository = item.repositories.find(repo => repo.version === dataObjectHelper.getDataVersion(type))
                return({
                    ...item,
                    doi: repository.doi,
                    downlodLink: repository.downloadLink,
                    datasetType: {
                        name: type, 
                        label: getDatasetTypeLabel(type)
                    }
                })

            });
            userDatasets = userDatasets.concat(found);
        }
        
        result = {datasets: userDatasets, submissions: []};
    }catch(error){
        console.log(error);
        result = error;
        res.status(500);
    }finally{
        res.send(result);
    }
}

module.exports = {
    get
}