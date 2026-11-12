const DatasetObject = require('../../../db/models/dataset-object');
const DatasetNote = require('../../../db/models/dataset-note');
const User = require('../../../db/models/user');
const auth = require('../auth');

/**
 * Retrives a dataset by dataType and dataset_id to be used for the single dataset page.
 * Enforces privacy checks via owner's userDataObjects or a non-expired shareLink on User.
 * @param {*} req datatype (dataset type, ex. pset), dataset_id (database _id)
 * @param {*} res datasetObject (extracted dataset information from db)
 */
const get = async (req, res) => {
	const { datatype, dataset_id } = req.params;
	const { shared } = req.query;
	try {
		const datasetObject = await DatasetObject.findOne({ datasetType: datatype, _id: dataset_id }).lean();
		if (!datasetObject) {
			return res.status(404).send({ message: 'Dataset not found.' });
		}

		let isOwner = false;
		if (req.cookies && req.cookies.orcestratoken) {
			const username = auth.getUsername(req.cookies.orcestratoken);
			if (username) {
				const user = await User.findOne({ email: username }).select('userDataObjects').lean();
				if (user && user.userDataObjects) {
					isOwner = user.userDataObjects.some(id => id.toString() === datasetObject._id.toString());
				}
			}
		}

		if (datasetObject.info && datasetObject.info.private && !isOwner) {
			let validShare = false;
			if (shared) {
				const sharingOwner = await User.findOne({
					userDataObjects: datasetObject._id,
					shareLinks: {
						$elemMatch: {
							datasetId: datasetObject._id,
							token: shared,
							expire: { $gt: Date.now() }
						}
					}
				}).select('_id').lean();
				validShare = Boolean(sharingOwner);
			}

			if (!validShare) {
				return res.status(403).send({
					authorized: false,
					message: 'This dataset is private or the shareable link has expired.'
				});
			}
		}

		const datasetNote = await DatasetNote.findOne({ _id: { $in: datasetObject.datasetNote } }).lean();
		datasetObject.datasetNote = datasetNote;
		datasetObject.isOwner = isOwner;
		return res.send(datasetObject);
	} catch (error) {
		console.log(error);
		return res.status(500).send({ message: 'Internal Server Error' });
	}
};


/**
 * Retrieve and render the QC data from Zenodo
 * @param {*} req zenodo url link to qc download
 * @param {*} res HTML page of rendered qc 
 */
const qualityControl = async (req, res) => {
	try {
		const { url } = req.query;
		if(!url) return res.status(400).send('No valid QC url')

		const parsed = new URL(url);

		// Ensuring malicious links cannot be passed back to the user
		if (!parsed.pathname.includes('/records/') || !parsed.pathname.includes('/files/') || !parsed.hostname.includes('zenodo.org') ) {
			return res.status(400).send('URL path not allowed');
		}

		const upstream = await fetch(parsed.toString(), {
			redirect: 'follow',
			headers: {
				Accept: 'text/html,*/*',
				'User-Agent': 'qc-proxy/1.0',
			},
		});

		if (!upstream.ok) {
			const msg = `Upstream error: ${upstream.status} ${upstream.statusText}`;
			return res.status(upstream.status).send(msg);
		}

		const html = await upstream.text();
		res.setHeader('Content-Type', 'text/html; charset=utf-8');
		return res.status(200).send(html);
	} catch (err) {
		console.error(err);
		return res.status(500).send(err?.stack || String(err));
	} 
};

module.exports = {
  	get,
	qualityControl
};
