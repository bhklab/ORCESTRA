const User = require('../../db/models/user');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const DatasetNote = require('../../db/models/dataset-note');
const DatasetObject = require('../../db/models/dataset-object');
const auth = require('./auth');

const THREE_DAY_MS = 3 * 24 * 60 * 60 * 1000;

const submitDataset = async (req, res) => {
    let result = [];
    try {
        const note = await DatasetNote.create(req.body.datasetNote);
        req.body.datasetNote = note._id;
        req.body.dateSubmitted = new Date();
        req.body.info.status = 'complete';
        const createdDataset = await DatasetObject.create(req.body);

        if (req.cookies && req.cookies.orcestratoken) {
            const username = auth.getUsername(req.cookies.orcestratoken);
            if (username) {
                await User.updateOne(
                    { email: username },
                    { $addToSet: { userDataObjects: createdDataset._id } }
                );
            }
        }
    } catch (error) {
        console.log("Validation error:", error.message);
        res.status(500);
    } finally {
        res.send(result);
    }
}

/**
 * Generates (or returns an existing non-expired) 1-week shareable link token
 * stored on the authenticated User document for a dataset in userDataObjects.
 */
const createShareLink = async (req, res) => {
    try {
        const { datasetId } = req.body;
        if (!datasetId) {
            return res.status(400).send({ message: 'Missing datasetId' });
        }

        const user = await User.findOne({ email: req.decoded.username });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const isOwner = (user.userDataObjects || []).some(id => id.toString() === datasetId.toString());
        if (!isOwner) {
            return res.status(403).send({ message: 'You do not own this dataset' });
        }

        const now = Date.now();

		// If shareable already exists and is valid, return to client
        const existingValid = (user.shareLinks || []).find(
            item => item.datasetId && item.datasetId.toString() === datasetId.toString() && item.expire > now
        );
        if (existingValid) {
            return res.send({
                token: existingValid.token,
                expire: existingValid.expire
            });
        }

        const token = uuidv4();
        const expire = now + THREE_DAY_MS;

        // Keep only non-expired links for other datasets and add the new 3 day limit link
        const activeLinks = (user.shareLinks || []).filter(
            item => item.datasetId && item.datasetId.toString() !== datasetId.toString() && item.expire > now
        );
        activeLinks.push({
            datasetId: new mongoose.Types.ObjectId(datasetId),
            token,
            expire
        });

        await User.updateOne(
            { _id: user._id },
            { $set: { shareLinks: activeLinks } }
        );

        return res.send({ token, expire });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Failed to create shareable link' });
    }
};

module.exports = {
    submitDataset,
    createShareLink
}