const DatasetObject = require('../../../db/models/dataset-object');
const DatasetNote = require('../../../db/models/dataset-note')

/**
 * Retrives a dataset by dataType and dataset_id to be used for the single dataset page.
 * @param {*} req datatype (dataset type, ex. pset), dataset_id (database _id)
 * @param {*} res datasetObject (extracted dataset information from db)
 */
const get = async (req, res) => {
	const { datatype, dataset_id } = req.params
	let datasetObject = {}
	try {
		datasetObject = await DatasetObject.findOne({datasetType: datatype, _id: dataset_id});
		const datasetNote = await DatasetNote.findOne({ _id: { $in: datasetObject.datasetNote } }); // Retrieve needed dataset notes
		datasetObject.datasetNote = datasetNote;
	} catch (error) {
		console.log(error);
		res.status(500);
	} finally {
		res.send(datasetObject);
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
