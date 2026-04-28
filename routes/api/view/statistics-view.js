const mongoose = require('mongoose');
const DataObject = require('../../../db/models/data-object').DataObject;
const DatasetObject = require('../../../db/models/dataset-object');
const DatasetNote = require('../../../db/models/dataset-note')
const Datatype = require('../../../db/models/datatype')

/**
 * Retrives a dataset by dataType and dataset_id to be used for the single dataset page.
 * @param {*} req datatype (dataset type, ex. pset), dataset_id (database _id)
 * @param {*} res datasetObject (extracted dataset information from db)
 */
const datatypeStats = async (req, res) => {
    try {
        const datatypes = await Datatype.find(); // get all datatypes entries
        const objectsByType = await Promise.all(
            datatypes.map(async item => { //iterate each datatype and compile stats
                const objects = await DatasetObject.find({ datasetType: item.path });

                const dataSources = new Set();
                let canonicalCount = 0;
                const datasetCount = objects.length;
                objects.forEach(object => { //iterate each dataset in the current datatype
                    if (object.dataSources) {
                        Object.keys(object.dataSources).forEach(source => {
                            dataSources.add(source.toLowerCase());
                        });
                    }

                    if (object.info?.canonical) {
                        canonicalCount += 1;
                    }
                });

                return {
                    ...item._doc,
                    dataSources: Array.from(dataSources),
                    canonicalCount,
                    datasetCount
                };
            })
        );

        return res.status(200).json(objectsByType);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to retrieve datatype stats' });
    }
};

module.exports = {
    datatypeStats
}