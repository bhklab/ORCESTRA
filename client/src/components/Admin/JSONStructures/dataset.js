export const psetDataset = {
  stats: {
    cellLines: [],
    drugs: [],
    tissues: [],
    numGenes: 0
  },
  name: "",
  version: "",
  datasetType: "pset",
  publications: [
    {
      citation: "",
      link: ""
    }
  ],
  sensitivity: {
    version: "",
    source: ""
  },
  availableData: [
    {
      name: "microarray",
      datatype: "RNA",
      source: "",
      expCount: 0,
      noUpdates: true,
      options: []
    },
    {
      name: "cnv",
      datatype: "DNA",
      source: "",
      expCount: 0,
      noUpdates: true,
      options: []
    },
    {
      name: "fusion",
      datatype: "DNA",
      source: "",
      expCount: 0,
      noUpdates: true,
      options: []
    },
    {
      name: "mutation",
      datatype: "DNA",
      source: "",
      expCount: 0,
      noUpdates: true,
      options: []
    },
    {
      name: "mutationExome",
      datatype: "DNA",
      source: "",
      expCount: 0,
      noUpdates: true,
      options: []
    },
    {
      name: "rnaseq",
      datatype: "RNA",
      source: "",
      expCount: 0,
      noUpdates: true,
      options: []
    }
  ],
  datasetNote: {
    $oid: ""
  },
  releaseNotes: {
    counts: [
      {
        name: "cellLines",
        current: 0,
        new: 0,
        removed: 0
      },
      {
        name: "drugs",
        current: 0,
        new: 0,
        removed: 0,
      },
      {
        name: "experiments",
        current: 0,
        new: 0,
        removed: 0,
      }
    ],
    additionalNotes: {
      link: ""
    }
  },
  status: {
    unavailable: false,
    disabled: false,
    requestDisabled: false
  },
  info: {
    includedData: "sensitivity",
    pachydermPipeline: "getGDSCv1"
  }
}

export const genericDataset = {
  stats: {
    cellLines: [],
    drugs: [],
    tissues: []
  },
  name: "",
  version: "1.0",
  datasetType: "",
  publications: [
    {
      citation: "",
      link: ""
    }
  ],
  sensitivity: {
    version: "",
    source: ""
  },
  availableData: [
    {
      name: "",
      source: "",
      options: []
    }
  ],
  datasetNote: {
    $oid: ""
  },
  releaseNotes: {
    counts: [
      {
        name: "cellLines",
        current: 0,
        new: 0,
        removed: 0
      },
      {
        name: "drugs",
        current: 0,
        new: 0,
        remove: 0
      },
      {
        name: "experiments",
        current: 0,
        new: 0,
        removed: 0
      }
    ]
  },
  status: {
    unavailable: false,
    disabled: false,
    requestDisabled: false
  }
}

export const clinicalDataset = {
  stats: {
    cellLines: [],
    drugs: [],
    tissues: []
  },
  name: "",
  version: "1.0",
  datasetType: "",
  publications: [
    {
      citation: "",
      link: ""
    }
  ],
  availableData: [
    {
      name: "rnaseq",
      datatype: "RNA",
      source: "",
      options: []
    }
  ],
  datasetNote: {
    $oid: ""
  },
  status: {
    unavailable: false,
    disabled: false,
    requestDisabled: false
  },
  releaseNotes: {
    counts: [
      {
        name: "samples",
        current: null,
        new: null,
        removed: null
      }
    ]
  },
  survival: {
    recistCriteria: true,
    clinicalEndpoints: "None"
  }
}