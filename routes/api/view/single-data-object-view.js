const DataObject = require("../../../db/models/data-object").DataObject;
const Dataset = require("../../../db/models/dataset");
const DataFilter = require("../../../db/models/data-filter");
const PachydermPipeline = require("../../../db/models/pachyderm-pipeline");
const enums = require("../../../helper/enum");
const dataObjectHelper = require("../../../helper/data-object");
require("../../../db/models/dataset-note");

const getTabData = async (dataObject, dataset, filter) => {
  let tabData = [];
  if (dataset.datasetNote) {
    tabData.push({
      header: "Disclaimer",
      data: dataset.datasetNote,
    });
  }

  let datasetTab = {
    header: "Dataset",
    data: {
      dataset: {
        name: dataset.name,
        version: dataset.version,
        sensitivity: dataset.sensitivity,
        publications: dataset.publications,
        info: dataset.info,
        filteredSensitivity: dataObject.info.filteredSensitivity,
      },
      genome: dataObject.genome,
	  description: dataset.description,
	  descriptionExpanded: dataset?.descriptionExpanded || [],
	  rna: dataset?.rna || [],
	  microRna: dataset?.microRna || [],
	  dna: dataset?.dna || [],
	  cnv: dataset?.cnv || [],
	  mutation: dataset?.mutation || [],
	  drugResponse: dataset?.drugResponse || [],
	  chromatin: dataset?.chromatin || [],
	  exon: dataset?.exon || [],
	  fusion: dataset?.fusion || [],
	  methylation: dataset?.methylation || [],
	  metabolomics: dataset?.metabolomics || [],
	  proteomics: dataset?.proteomics || [],
	  imagingFeatures: dataset?.imagingFeatures || [],
	  imaging: dataset?.imaging || [],
	  qualityControl: dataset?.qualityControl || [],
	  compoundOverview: dataset?.compoundOverview || [],
	  hepatotoxicity: dataset?.hepatotoxicity || [],
	  drugStatus: dataset?.drugStatus || [],
	  compoundMetadata: dataset?.compoundMetadata || [],
	  expAssays: dataset?.expAssays || [],
    },
  };
  if (dataset.datasetType === enums.dataTypes.toxicogenomics) {
    datasetTab.data.dataset.availableData = dataset.availableData;
  }
  tabData.push(datasetTab);

  if (
    [
      enums.dataTypes.pharmacogenomics,
      enums.dataTypes.xenographic,
      enums.dataTypes.radiogenomics,
    ].includes(dataset.datasetType)
  ) {
    let rnaData = {};
    let dnaData = {};

    if (dataObject.tools && dataObject.tools.rna) {
      rnaData.rnaTool = filter.tools.find(
        (item) => item.name === dataObject.tools.rna
      );
    }
    if (dataObject.references && dataObject.references.rna) {
      rnaData.rnaRef = filter.references.find(
        (item) => item.name === dataObject.references.rna
      );
    }
    let rawSeqDataRNA = dataset.availableData.find(
      (item) => item.name === "rnaseq"
    );
    if (rawSeqDataRNA) {
      rnaData.rawSeqDataRNA = rawSeqDataRNA;
    }
    let processedDataSource = dataset.availableData.find(
      (item) => item.name === "rnaseqProcessed"
    );
    if (processedDataSource) {
      rnaData.processedDataSource = processedDataSource;
    }
    if (dataObject.availableDatatypes.length > 0) {
      let molDataTypes = filter.availableData.filter(
        (item) => item.genomicType === "RNA" && !item.default
      );
      rnaData.accRNA = molDataTypes
        .filter((molData) =>
          dataObject.availableDatatypes.find(
            (item) => item.name === molData.name
          )
        )
        .map((molData) => ({
          ...molData,
          source: dataset.availableData.find(
            (item) => item.name === molData.name
          ).source,
        }));

      molDataTypes = filter.availableData.filter(
        (item) => item.genomicType === "DNA" && !item.default
      );
      dnaData.accDNA = molDataTypes
        .filter((molData) =>
          dataObject.availableDatatypes.find(
            (item) => item.name === molData.name
          )
        )
        .map((molData) => ({
          ...molData,
          source: dataset.availableData.find(
            (item) => item.name === molData.name
          ).source,
        }));
    }
    if (Object.keys(rnaData).length > 0) {
      tabData.push({ header: "RNA", data: rnaData });
    }

    let rawSeqDataDNA = dataset.availableData.find(
      (item) => item.name === "dnaseq"
    );
    if (rawSeqDataDNA) {
      dnaData.rawSeqDataDNA = rawSeqDataDNA;
    }
    if (Object.keys(dnaData).length > 0) {
      tabData.push({ header: "DNA", data: dnaData });
    }
  }

  return tabData;
};

/**
 * Retrives a dataset by datasettype, DOI and parses it into an object form to be used for the single dataset page.
 * @param {*} req
 * @param {*} res
 */
const get = async (req, res) => {
  let dataObj = {};
  try {
	let dataObject = {};
  
	if (req.query.id.includes('zenodo')){ // Deprecated way of retrieving data for a datasets (using doi)
		dataObject = await DataObject.findOne({
			datasetType: req.query.datasetType,
			"repositories.doi": req.query.id,
		  }).lean();
	}
	else{ // Current way of retrieving data for a dataset (using _id)
		dataObject = await DataObject.findOne({
			datasetType: req.query.datasetType,
			"_id": req.query.id,
		}).lean();
	}
    if (dataObject) {
      const dataset = await Dataset.findOne({ _id: dataObject.dataset })
        .select(["-stats"])
        .populate("datasetNote")
        .lean();
      const filter = await DataFilter.findOne({ datasetType: "pset" }).lean();

      // get the doi and downloadlink for specific data version. Only applicable to PSets. For other datasets, use 1.0.
		let repo = dataObject.repositories.find(
			(r) => r.version === dataObjectHelper.getDataVersion(req.query.datasetType)
		);
      dataObj = {
        _id: dataObject._id,
        name: dataObject.name,
        info: dataObject.info,
		pipeline: dataObject.info.other?.pipeline ?? undefined,
		doi: repo.doi,
        downloadLink: dataObject.info.private
          ? `${repo.downloadLink}&access_token=${process.env.ZENODO_ACCESS_TOKEN}`
          : repo.downloadLink,
        bioComputeObject: repo.bioComputeObject,
		legacy: dataObject.legacy,
		tools: dataObject.tools,
		csvs: dataObject.info.private && repo.csvLinks
          ? `${repo.downloadLink}&access_token=${process.env.ZENODO_ACCESS_TOKEN}`
          : repo.csvLinks,
      };
      dataObj.tabData = [];
      dataObj.tabData = await getTabData(dataObject, dataset, filter);

      // add pachyderm pipeline config json: to be replaced with the new data processing layer API data.
      if (req.query.datasetType === enums.dataTypes.pharmacogenomics && !dataObject.info.other) {
        const pipelines = await PachydermPipeline.find();
        console.log(dataObject._id.toString());
        let found = pipelines.find(
          (pipeline) => pipeline.data._id === dataObject._id.toString()
        );
        let pipelineConfig = null;
        if (!found) {
          found = pipelines.find(
            (pipeline) =>
              pipeline.original &&
              pipeline.data.pipeline.name === dataset.info.pachydermPipeline
          );
          pipelineConfig = found ? found.data : null;
        } else {
          pipelineConfig = found ? found.data.config : null;
        }
        
        if (pipelineConfig) {
          dataObj.tabData.push({
            header: "Pipeline",
            data: {
              commitID: dataObject.info.commitID,
              config: pipelineConfig,
            },
          });
        }
      }

      // add snakemake pipeline data
      if (dataObject.info.other && dataObject.info.other.pipeline) {
        dataObj.tabData.push({
          header: "Pipeline",
          data: {
            pipeline: dataObject.info.other.pipeline,
            additionalRepo: dataObject.info.other.additionalRepo
              ? dataObject.info.other.additionalRepo
              : [],
          },
        });
      }

      let molData = dataset.availableData.map((item) => {
        let availData = dataObject.availableDatatypes.find(
          (avail) => avail.name === item.name
        );
        let filterItem = filter.availableData.find(
          (avail) => avail.name === item.name
        );
        let obj = {
          name: item.name,
          label: filterItem ? filterItem.label : null,
        };
        if (availData) {
          (obj.expCount = item.expCount),
            (obj.noUpdates = item.noUpdates),
            (obj.available = true);
        }
        return obj;
      });
      let releaseNotesTab = {
        header: "Release Notes",
        data: {
          datasetName: dataset.name,
          releaseNotes: {
            ...dataset.releaseNotes,
            molData: molData.filter((item) => item.label),
          },
        },
      };

      dataObj.tabData.push(releaseNotesTab);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    res.send(dataObj);
  }
};

const qualityControlHTML = async (req, res) => {
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
  qualityControlHTML
};
