export const baseDataObject = {
  info: {
    date: {
      created: ""
    },
    status: "complete",
    private: false,
    canonical: true,
    numDownload: 0,
    createdBy: "BHK Lab",
    other: {
      pipeline: {
        url: "",
        commit_id: ""
      },
      additionalRepo: [
        {
          repo_type: "",
          git_url: "",
          commit_id: ""
        }
      ],
      data_preprocessing: [
        {
          data_type: "",
          pipeline: {
            git_url: "",
            commit_id: ""
          }
        }
      ],
      rna_ref: ""
    }
  },
  dataObjType: "BaseDataObject",
  datasetType: "",
  name: "",
  dataset: "",
  repositories: [
    {
      version: "1.0",
      doi: "",
      downloadLink: "",
    }
  ],
  availableDatatypes: [
    {
      name: "rnaseq",
      genomeType: "RNA"
    }
  ],
}

export const genomeDataObject = {
  info: {
    date: {
      created: ""
    },
    status: "complete",
    private: false,
    canonical: true,
    numDownload: 0,
    createdBy: "BHK Lab",
    filteredSensitivity: true,
    other: {
      pipeline: {
        url: "",
        commit_id: ""
      },
      additionalRepo: [
        {
          repo_type: "",
          git_url: "",
          commit_id: ""
        }
      ],
      data_preprocessing: [
        {
          data_type: "",
          pipeline: {
            git_url: "",
            commit_id: ""
          }
        }
      ],
      rna_ref: ""
    }
  },
  dataObjType: "GenomeDataObject",
  datasetType: "",
  name: "",
  dataset: "",
  repositories: [
    {
      version: "3.13",
      doi: "",
      downloadLink: ""
    }
  ],
  availableDatatypes: [
    {
      name: "rnaseq",
      genomeType: "RNA"
    },
    {
      name: "microarray",
      genomeType: "RNA"
    },
    {
      name: "cnv",
      genomeType: "DNA"
    },
    {
      name: "fusion",
      genomeType: "DNA"
    },
    {
      name: "mutation",
      genomeType: "DNA"
    }
  ],
  tools: {
    rna: "kallisto_0_46_1"
  },
  references: {
    rna: "Gencode_v33"
  },
  genome: "GRCh38",
}