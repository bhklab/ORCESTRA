const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = { typekey: '$type', discriminatorKey: 'dataobjtype' } // discriminator key to get all schema in one place

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
            download: Number,
            createdBy: String,
            email: String,
            shareToken: String,
            filteredSensitivity: Boolean,
            date: {
                submitted: Date,
                processed: Date,
                completed: Date
            },
        },
        repositories: [{
            version: String,
            doi: String,
            downloadLink: String,
            biocomputeObj: {
                doi: String,
                downloadLink: String
            }
        }],
        availableDatatypes: [{
            name: String,
            type: String
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
                rna: [String],
                dna: [String]
            },
            references: {
                rna: [String],
                dna: [String]
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