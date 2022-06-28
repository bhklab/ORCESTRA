const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = { typekey: '$type', discriminatorKey: 'dataObjType' } // discriminator key to get all schema in one place

const dataObjectSchema = new Schema(
    {
        datasetType: String,
        name: {
            type: String,
            required: true,
            trim: true
        },
        dataset: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset' },
        info: {
            status: {type: String, required: true},
            private: Boolean,
            canonical: Boolean,
            numDownload: Number,
            createdBy: String,
            email: String,
            shareToken: String,
            filteredSensitivity: Boolean,
            commitID: String,
            date: {
                submitted: Date,
                processed: Date,
                created: Date
            },
            other: Object
        },
        repositories: [{
            version: String,
            doi: String,
            downloadLink: Schema.Types.Mixed,
            bioComputeObject: {
                doi: String,
                downloadLink: String
            }
        }],
        availableDatatypes: [{
            name: String,
            genomeType: String,
            details: Object
        }]
    },
    options
);

const DataObject = mongoose.model("DataObject", dataObjectSchema);

const BaseDataObject = DataObject.discriminator(
    'BaseDataObject',
    new Schema()
);

const GenomeDataObject = DataObject.discriminator(
    'GenomeDataObject',
    new Schema(
        {
            tools: {
                rna: String,
                dna: String
            },
            references: {
                rna: String,
                dna: String
            },
            genome: String
        }
    )
);

module.exports = {
    DataObject,
    BaseDataObject,
    GenomeDataObject
}