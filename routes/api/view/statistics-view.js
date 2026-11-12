const mongoose = require('mongoose');
const DataObject = require('../../../db/models/data-object').DataObject;
const DatasetObject = require('../../../db/models/dataset-object');
const DatasetNote = require('../../../db/models/dataset-note');
const Datatype = require('../../../db/models/datatype');
const User = require('../../../db/models/user');
const auth = require('../auth');

/**
 * Retrives datatype statistics to be used on the /datatypes page.
 * Only counts datasets visible to the requesting user (public + user-owned private).
 * @param {*} req
 * @param {*} res
 */
const datatypeStats = async (req, res) => {
    try {
        let userOwnedIds = [];
        if (req.cookies && req.cookies.orcestratoken) {
            const username = auth.getUsername(req.cookies.orcestratoken);
            if (username) {
                const user = await User.findOne({ email: username }).select('userDataObjects').lean();
                if (user && user.userDataObjects) {
                    userOwnedIds = user.userDataObjects;
                }
            }
        }

        const datatypes = await Datatype.find(); // get all datatypes entries
        const objectsByType = await Promise.all(
            datatypes.map(async item => { //iterate each datatype and compile stats
                const objects = await DatasetObject.find({
                    datasetType: item.path,
                    $or: [
                        { 'info.private': { $ne: true } },
                        ...(userOwnedIds.length > 0 ? [{ _id: { $in: userOwnedIds } }] : [])
                    ]
                });

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