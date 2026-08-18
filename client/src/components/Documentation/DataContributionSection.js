import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import download from 'downloadjs';

const exampleTemplates = [
    {
        filename: 'example_sample_annotation.csv',
        title: 'Sample Annotation Template',
        description: 'Maps sample identifiers with Cellosaurus Accession IDs, tissue types, and sample-level metadata.',
        content: `unique.sample.id,sample.id,Cellosaurus.Accession.id,tissue.id
MPP 89,MPP-89,CVCL_1427,pleura
NCI-H1048,NCI-H1048,CVCL_1453,lung
380,380,NA,haematopoietic_and_lymphoid_tissue`
    },
    {
        filename: 'example_drug_annotation.csv',
        title: 'Drug / Compound Annotation Template',
        description: 'Standardizes chemical compound identifiers, aliases, and PubChem Compound Identifiers (CID).',
        content: `unique.drug.id,drug.id,PubChem.cid
Acadesine,AICAR,17513
Vincaleukoblastine,Vinblastine,241902
XMD8-85,XMD8-85,NA`
    },
    {
        filename: 'example_raw_drug_dose.csv',
        title: 'Raw Drug Doses Template',
        description: 'Tested drug concentration values (in micromolar, µM) for each experiment (sample + drug pair).',
        content: `unique.experiment.id,dose1,dose2,dose3,dose4,dose5,dose6
NCI-H1048_Acadesine,0.001528,0.004583,0.01375,0.04125,0.12375,0.37125
380_XMD8-85,0.001528,0.004583,0.01375,0.04125,0.12375,NA`
    },
    {
        filename: 'example_raw_drug_viability.csv',
        title: 'Raw Drug Viability Template',
        description: 'Cell viability percentage (%) measurements corresponding to each tested drug concentration.',
        content: `unique.experiment.id,dose1,dose2,dose3,dose4,dose5,dose6
NCI-H1048_Acadesine,99.89466,89.47876,86.5826733,73.9341949,71.748281,68.829123
380_XMD8-85,97.3491,96.482238,90.8890157,106.2000039,84.8888717,NA`
    },
    {
        filename: 'example_sensitivity_info.csv',
        title: 'Sensitivity Metadata Template',
        description: 'Experiment-level metadata specifying sample ID, drug ID, and tested concentration ranges.',
        content: `unique.experiment.id,unique.sample.id,unique.drug.id,min.dose,max.dose
NCI-H1048_Acadesine,NCI-H1048,Acadesine,0.001528,0.37125
380_XMD8-85,380,XMD8-85,0.001528,0.12375`
    },
    {
        filename: 'example_rnaseq.csv',
        title: 'Molecular Profile Matrix Template (RNA-seq)',
        description: 'Expression matrix where rows denote genes/transcripts (Ensembl IDs) and columns denote samples.',
        content: `Gene.id,MPP 89,NCI-H1048,380
ENSG00000000003.15,5.677246,6.117843,6.828962
ENSG00000067048.17,6.748462,6.621223,7.518115
ENSG00000066557.6,7.296302,5.793411,11.341132`
    }
];

export const DataContributionSection = ({ scrollTarget }) => {
    const navigate = useNavigate();
    const [previewFile, setPreviewFile] = useState(null);

    useEffect(() => {
        async function scrollTo() {
            await new Promise(resolve => setTimeout(resolve, 75));
            if (!scrollTarget) return;
            const el = document.getElementById(scrollTarget);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        scrollTo();
    }, [scrollTarget]);

    const handleDownload = template => {
        const blob = new Blob([template.content], { type: 'text/csv;charset=utf-8;' });
        download(blob, template.filename, 'text/csv');
    };

    return (
        <div className="flex flex-col gap-12 text-darkBlue">
            {/* Header / Hero */}
            <div className="flex flex-col gap-3 pb-6 border-b border-gray-100">
                <h1 className="text-heading3Xl md:text-heading2Xl font-bold text-darkBlue">Contributing Your Data</h1>
                <p className="text-bodyLg text-gray-600 leading-relaxed">
                    Learn how to format, structure, and submit your experimental or computational datasets to ORCESTRA
                    to generate FAIR-compliant, version-controlled multi-omic data objects.
                </p>
            </div>

            {/* Subsection 1: Submission & Publishing Workflow */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 className="text-headingXl font-bold text-darkBlue scroll-mt-32" id="submission-workflow">
                        Submission & Processing Lifecycle
                    </h3>
                    <p className="text-bodyLg text-gray-700 leading-relaxed">
                        ORCESTRA streamlines dataset ingestion into 4 standardized phases, automating data
                        harmonization, pipeline orchestration with Snakemake and Pixi, and publication to Zenodo.
                    </p>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-2 xs:grid-cols-1 gap-4">
                    <div className="flex flex-col p-5 bg-gray-50 rounded-2xl border border-gray-200 gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-lightBlue flex items-center justify-center font-bold text-headingSm">
                            1
                        </div>
                        <h4 className="text-headingMd font-bold text-darkBlue">Prepare Files</h4>
                        <p className="text-bodySm text-gray-600">
                            Format your sample annotations, drug IDs, raw viability data, and molecular matrices
                            according to ORCESTRA schemas.
                        </p>
                    </div>

                    <div className="flex flex-col p-5 bg-gray-50 rounded-2xl border border-gray-200 gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-headingSm">
                            2
                        </div>
                        <h4 className="text-headingMd font-bold text-darkBlue">Submit via Portal</h4>
                        <p className="text-bodySm text-gray-600">
                            Upload your data tables or connect your pipeline Git repository using our authenticated
                            submission portal.
                        </p>
                    </div>

                    <div className="flex flex-col p-5 bg-gray-50 rounded-2xl border border-gray-200 gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-headingSm">
                            3
                        </div>
                        <h4 className="text-headingMd font-bold text-darkBlue">Automated Pipeline & QC</h4>
                        <p className="text-bodySm text-gray-600">
                            Jenkins executes your Snakemake workflow inside isolated Pixi/Conda environments and
                            produces Quality Control reports.
                        </p>
                    </div>

                    <div className="flex flex-col p-5 bg-gray-50 rounded-2xl border border-gray-200 gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-100 text-green-900 flex items-center justify-center font-bold text-headingSm">
                            4
                        </div>
                        <h4 className="text-headingMd font-bold text-darkBlue">DOI & DNL Published</h4>
                        <p className="text-bodySm text-gray-600">
                            Indicated dataset files are deposited on Zenodo with a permanent DOI attachhed.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                    <button
                        disabled={true}
                        // onClick={() => navigate('/app/data_submission')}
                        // className="bg-lightBlue text-white font-bold px-6 py-3 rounded-xl hover:bg-darkBlue duration-200 ease-in-out flex items-center gap-2 shadow-sm"
                        className="bg-lightBlue text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-600 duration-200 ease-in-out flex items-center gap-2 shadow-sm hover:cursor-not-allowed"
                    >
                        <span>Go to Data Submission</span>
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                    <button
                        disabled={true}
                        // onClick={() => navigate('/submit-dataset')}
                        // className="bg-lightBlue text-white font-bold px-6 py-3 rounded-xl hover:bg-darkBlue duration-200 ease-in-out flex items-center gap-2 shadow-sm"
                        className="bg-lightBlue text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-600 duration-200 ease-in-out flex items-center gap-2 shadow-sm hover:cursor-not-allowed"
                    >
                        <span>Create Data Nutrition Entry</span>
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Subsection 2: Data Specifications & Schemas */}
            <div className="flex flex-col gap-6 pt-6 border-t border-gray-100">
                <div className="flex flex-col gap-2">
                    <h3 className="text-headingXl font-bold text-darkBlue scroll-mt-32" id="data-specifications">
                        Recommended Formats & Schemas
                    </h3>
                    <p className="text-bodyLg text-gray-600">
                        To ensure interoperability and automated validation, submitted files must follow standard
                        annotations and field naming (in both csvs and RDS'):
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Item 1 */}
                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-headingLg font-bold text-darkBlue">1. Sample Annotation File (.csv)</h4>
                            <span className="text-bodyXs font-mono bg-blue-100 text-lightBlue px-2.5 py-1 rounded">
                                example_sample_annotation.csv
                            </span>
                        </div>
                        <p className="text-bodyMd text-gray-700">
                            Must include every sample with a unique identifier (<code>unique.sample.id</code>). For
                            human cancer cell lines, provide the <strong>Cellosaurus Accession ID</strong> (e.g.{' '}
                            <code>CVCL_1427</code>). If a sample is not present in Cellosaurus, indicate with{' '}
                            <code>NA</code>. Include tissue ontology names (<code>tissue.id</code>) and any
                            supplementary sample metadata (e.g. disease subtype, ethnicity).
                        </p>
                        <div className="text-bodySm text-gray-500">
                            Cellosaurus Reference:{' '}
                            <a
                                href="https://web.expasy.org/cellosaurus/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 font-semibold underline"
                            >
                                https://web.expasy.org/cellosaurus/
                            </a>
                        </div>

                        {/* AnnotationDB Cell Line Reference & Examples */}
                        <div className="flex flex-col p-4 bg-white border border-gray-200 rounded-xl gap-3 mt-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-lightYellow text-darkBlue text-headingXs font-bold px-2 py-0.5 rounded uppercase">
                                        AnnotationDB Reference
                                    </span>
                                    <span className="text-bodySm font-bold text-darkBlue">
                                        Automated Cell Line Lookup via BHKLab AnnotationDB
                                    </span>
                                </div>
                                <a
                                    href="https://annotationdb.bhklab.ca/docs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-bodySm font-semibold text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    <span>AnnotationDB Docs</span>
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </a>
                            </div>
                            <p className="text-bodySm text-gray-600">
                                You can query BHK Lab's <strong>AnnotationDB API</strong> to automatically search,
                                validate, and retrieve standardized Cellosaurus accession IDs, derived tissue sites, sex
                                of origin, donor demographics, and disease ontologies:
                            </p>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col bg-gray-900 rounded-lg overflow-hidden text-bodyXs font-mono">
                                    <div className="px-3 py-1.5 bg-gray-800 text-gray-300 font-semibold flex justify-between items-center">
                                        <span>Retrieve all available cell line identifiers</span>
                                        <span className="text-gray-400">GET</span>
                                    </div>
                                    <div className="p-3 text-gray-100 overflow-x-auto">
                                        <code>curl https://annotationdb.bhklab.ca/cell_line/all</code>
                                    </div>
                                </div>
                                <div className="flex flex-col bg-gray-900 rounded-lg overflow-hidden text-bodyXs font-mono">
                                    <div className="px-3 py-1.5 bg-gray-800 text-gray-300 font-semibold flex justify-between items-center">
                                        <span>
                                            Query full metadata for cell lines (comma-separated names or CVCL IDs)
                                        </span>
                                        <span className="text-gray-400">GET</span>
                                    </div>
                                    <div className="p-3 text-gray-100 overflow-x-auto">
                                        <code>
                                            curl
                                            "https://annotationdb.bhklab.ca/cell_line/many?cell_lines=HL-60,HeLa,CVCL_0060,CVCL_2030"
                                        </code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-headingLg font-bold text-darkBlue">
                                2. Drug & Compound Annotation File (.csv)
                            </h4>
                            <span className="text-bodyXs font-mono bg-blue-100 text-lightBlue px-2.5 py-1 rounded">
                                example_drug_annotation.csv
                            </span>
                        </div>
                        <p className="text-bodyMd text-gray-700">
                            Must include each tested compound with a unique identifier (<code>unique.drug.id</code>) and
                            common alias (<code>drug.id</code>). Provide the <strong>PubChem Compound ID (CID)</strong>{' '}
                            for cross-database chemical resolution. If an experimental compound lacks a PubChem entry,
                            indicate CID with <code>NA</code>.
                        </p>
                        <div className="text-bodySm text-gray-500">
                            PubChem Compound Search:{' '}
                            <a
                                href="https://pubchem.ncbi.nlm.nih.gov"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 font-semibold underline"
                            >
                                https://pubchem.ncbi.nlm.nih.gov
                            </a>
                        </div>

                        {/* AnnotationDB Compound Reference & Examples */}
                        <div className="flex flex-col p-4 bg-white border border-gray-200 rounded-xl gap-3 mt-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-lightYellow text-darkBlue text-headingXs font-bold px-2 py-0.5 rounded uppercase">
                                        AnnotationDB Reference
                                    </span>
                                    <span className="text-bodySm font-bold text-darkBlue">
                                        Automated Compound & Substance Lookup via BHKLab AnnotationDB
                                    </span>
                                </div>
                                <a
                                    href="https://annotationdb.bhklab.ca/docs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-bodySm font-semibold text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    <span>AnnotationDB Docs</span>
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </a>
                            </div>
                            <p className="text-bodySm text-gray-600">
                                Use <strong>AnnotationDB</strong> to resolve compound identifiers to standardized
                                PubChem CIDs, canonical SMILES, InChIKeys, ChEMBL Mechanisms of Action (MOA), FDA
                                approval statuses, and toxicity ratings (LTKB / DILIrank):
                            </p>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col bg-gray-900 rounded-lg overflow-hidden text-bodyXs font-mono">
                                    <div className="px-3 py-1.5 bg-gray-800 text-gray-300 font-semibold flex justify-between items-center">
                                        <span>Retrieve all indexed compounds, PubChem CIDs, SMILES, and InChIKeys</span>
                                        <span className="text-gray-400">GET</span>
                                    </div>
                                    <div className="p-3 text-gray-100 overflow-x-auto">
                                        <code>curl https://annotationdb.bhklab.ca/compound/all</code>
                                    </div>
                                </div>
                                <div className="flex flex-col bg-gray-900 rounded-lg overflow-hidden text-bodyXs font-mono">
                                    <div className="px-3 py-1.5 bg-gray-800 text-gray-300 font-semibold flex justify-between items-center">
                                        <span>
                                            Query compound metadata with ChEMBL Mechanism of Action (MOA) and Toxicity
                                        </span>
                                        <span className="text-gray-400">GET</span>
                                    </div>
                                    <div className="p-3 text-gray-100 overflow-x-auto">
                                        <code>
                                            curl
                                            "https://annotationdb.bhklab.ca/compound/many?compound=Acetaminophen&mechanism=true&toxicity=true&bioassay=true"
                                        </code>
                                    </div>
                                </div>
                                <div className="flex flex-col bg-gray-900 rounded-lg overflow-hidden text-bodyXs font-mono">
                                    <div className="px-3 py-1.5 bg-gray-800 text-gray-300 font-semibold flex justify-between items-center">
                                        <span>Query substances / biologics by name or PubChem SID</span>
                                        <span className="text-gray-400">GET</span>
                                    </div>
                                    <div className="p-3 text-gray-100 overflow-x-auto">
                                        <code>
                                            curl
                                            "https://annotationdb.bhklab.ca/substance/many?substance=Bevacizumab&mechanism=true&toxicity=true"
                                        </code>
                                    </div>
                                </div>
                                <div className="flex flex-col bg-gray-900 rounded-lg overflow-hidden text-bodyXs font-mono">
                                    <div className="px-3 py-1.5 bg-gray-800 text-gray-300 font-semibold flex justify-between items-center">
                                        <span>Query Antibody-Drug Conjugates (ADCs) by ADC ID or name</span>
                                        <span className="text-gray-400">GET</span>
                                    </div>
                                    <div className="p-3 text-gray-100 overflow-x-auto">
                                        <code>curl "https://annotationdb.bhklab.ca/adc/many?adc=DRG0AAJTS"</code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-headingLg font-bold text-darkBlue">
                                3. Raw Treatment Sensitivity Data (.csv)
                            </h4>
                            <span className="text-bodyXs font-mono bg-blue-100 text-lightBlue px-2.5 py-1 rounded">
                                example_raw_drug_dose.csv & viability.csv
                            </span>
                        </div>
                        <p className="text-bodyMd text-gray-700">
                            Split into two matching matrices linked by <code>unique.experiment.id</code> (formatted as{' '}
                            <code>unique.sampleid_unique.drugid</code>) representing the raw treatment response
                            experimental series:
                        </p>
                        <ul className="list-disc pl-6 text-bodyMd text-gray-700 flex flex-col gap-1.5">
                            <li>
                                <strong>Dose Matrix:</strong> Drug concentrations tested (in micromolar, µM) for each
                                experiment (e.g. <code>dose1</code> to <code>dose6</code>).
                            </li>
                            <li>
                                <strong>Viability Matrix:</strong> Percentage cell viability (% relative to control)
                                measured at each corresponding dose concentration.
                            </li>
                            <li>
                                <em>Replicate & Matrix Handling:</em> If an experiment was replicated, append{' '}
                                <code>_1</code>, <code>_2</code>, etc. (e.g., <code>380_XMD8-85_1</code>). For drug
                                combination grids, matrices represent multi-dose titration pairs.
                            </li>
                        </ul>

                        {/* PharmacoGx Reference Box */}
                        <div className="flex flex-col p-4 bg-white border border-gray-200 rounded-xl gap-3 mt-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-lightBlue text-white text-headingXs font-bold px-2 py-0.5 rounded uppercase">
                                        PharmacoGx Standard
                                    </span>
                                    <span className="text-bodySm font-bold text-darkBlue">
                                        CoreGx TreatmentResponseExperiment (@raw slot)
                                    </span>
                                </div>
                                <a
                                    href="https://github.com/bhklab/PharmacoGx"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-bodySm font-semibold text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    <span>PharmacoGx</span>
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </a>
                            </div>
                            <p className="text-bodySm text-gray-600">
                                In <strong>PharmacoGx</strong>, raw sensitivity data is stored inside the S4{' '}
                                <code>TreatmentResponseExperiment</code> object as a pair of aligned matrices in the{' '}
                                <code>@raw</code> slot:
                            </p>
                            <div className="flex flex-col bg-gray-900 rounded-lg overflow-hidden text-bodyXs font-mono">
                                <div className="px-3 py-1.5 bg-gray-800 text-gray-300 font-semibold flex justify-between items-center">
                                    <span>R / PharmacoGx TreatmentResponseExperiment Construction</span>
                                    <span className="text-gray-400">R</span>
                                </div>
                                <div className="p-3 text-gray-100 overflow-x-auto">
                                    <pre>
                                        <code>{`# Raw Dose & Viability matrices ingest into TreatmentResponseExperiment
tre <- CoreGx::TreatmentResponseExperiment(
    raw = list(
        dose = as.matrix(read.csv("raw_drug_dose.csv", row.names = 1)),
        viability = as.matrix(read.csv("raw_drug_viability.csv", row.names = 1))
    ),
    info = read.csv("sensitivity_info.csv", row.names = 1)
)`}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Item 4 */}
                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-headingLg font-bold text-darkBlue">
                                4. Sensitivity Summary Information (.csv)
                            </h4>
                            <span className="text-bodyXs font-mono bg-blue-100 text-lightBlue px-2.5 py-1 rounded">
                                example_sensitivity_info.csv
                            </span>
                        </div>
                        <p className="text-bodyMd text-gray-700">
                            Defines experimental parameters for each <code>unique.experiment.id</code>, linking paired{' '}
                            <code>unique.sample.id</code> and <code>unique.drug.id</code> along with testing boundaries
                            (<code>min.dose</code>, <code>max.dose</code>, <code>dose.unit</code>, and incubation
                            duration).
                        </p>

                        {/* PharmacoGx Computed Profiles Reference Box */}
                        <div className="flex flex-col p-4 bg-white border border-gray-200 rounded-xl gap-3 mt-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-lightBlue text-white text-headingXs font-bold px-2 py-0.5 rounded uppercase">
                                        PharmacoGx Pipeline
                                    </span>
                                    <span className="text-bodySm font-bold text-darkBlue">
                                        Automated Sensitivity Curve Fitting & Metrics (@profiles slot)
                                    </span>
                                </div>
                                <a
                                    href="https://github.com/bhklab/PharmacoGx"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-bodySm font-semibold text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    <span>PharmacoGx</span>
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </a>
                            </div>
                            <p className="text-bodySm text-gray-600">
                                During automated pipeline execution in ORCESTRA, <strong>PharmacoGx</strong> algorithms
                                fit log-logistic Hill / biphasic curves and populate the{' '}
                                <code>sensitivityProfiles(pset)</code> slot with standard pharmacological response
                                metrics:
                            </p>
                            <div className="flex flex-col bg-gray-900 rounded-lg overflow-hidden text-bodyXs font-mono">
                                <div className="px-3 py-1.5 bg-gray-800 text-gray-300 font-semibold flex justify-between items-center">
                                    <span>Automated Metric Computation in PharmacoGx</span>
                                    <span className="text-gray-400">R</span>
                                </div>
                                <div className="p-3 text-gray-100 overflow-x-auto">
                                    <pre>
                                        <code>{`# Standard sensitivity profile generation:
pset <- computeAUC(pset)  # Recomputed Area Above Curve (AAC / AUC)
pset <- computeIC50(pset) # Half-maximal inhibitory concentration (IC50 in µM)
pset <- computeDSS(pset)  # Drug Sensitivity Score (DSS)
pset <- computeSlope(pset) # Hill slope (HS) and inflection parameters

# Returns data.frame with aac_recomputed, ic50_recomputed, dss_recomputed:
head(sensitivityProfiles(pset))`}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Item 5 */}
                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-headingLg font-bold text-darkBlue">
                                5. Processed Molecular Profiles (.csv)
                            </h4>
                            <span className="text-bodyXs font-mono bg-blue-100 text-lightBlue px-2.5 py-1 rounded">
                                example_rnaseq.csv
                            </span>
                        </div>
                        <p className="text-bodyMd text-gray-700">
                            Accepts processed RNA-seq, microarrays, mutation calls, and copy number variations (CNVs).
                            Rows must be standard gene, transcript, or probe identifiers (e.g., Ensembl{' '}
                            <code>ENSG00000000003</code>, Hugo symbols), while columns must match sample IDs (
                            <code>unique.sample.id</code>).
                        </p>
                        <p className="text-bodySm text-gray-600">
                            Please document quantification tools and reference genomes used (e.g. Kallisto v0.43.1 with
                            Gencode v33 for RNA-seq; SureSelectHumanAllExonV5 BED for mutation calling).
                        </p>

                        {/* PharmacoGx Molecular Data Standards Box */}
                        <div className="flex flex-col p-4 bg-white border border-gray-200 rounded-xl gap-3 mt-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-lightBlue text-white text-headingXs font-bold px-2 py-0.5 rounded uppercase">
                                        PharmacoGx Standards
                                    </span>
                                    <span className="text-bodySm font-bold text-darkBlue">
                                        MultiAssayExperiment & SummarizedExperiment (@molecularProfiles slot)
                                    </span>
                                </div>
                                <a
                                    href="https://github.com/bhklab/PharmacoGx"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-bodySm font-semibold text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    <span>PharmacoGx</span>
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </a>
                            </div>
                            <p className="text-bodySm text-gray-600">
                                As defined in <strong>PharmacoGx Molecular Data Standards</strong>, each molecular
                                profile is encapsulated in a <code>SummarizedExperiment</code> with synchronized{' '}
                                <code>rowData</code> (Ensembl / HUGO gene metadata) and <code>colData</code> (sample
                                metadata), bundled into <code>PharmacoSet2</code>'s <code>MultiAssayExperiment</code>{' '}
                                container:
                            </p>
                            <div className="flex flex-col bg-gray-900 rounded-lg overflow-hidden text-bodyXs font-mono">
                                <div className="px-3 py-1.5 bg-gray-800 text-gray-300 font-semibold flex justify-between items-center">
                                    <span>SummarizedExperiment Molecular Profile Construction</span>
                                    <span className="text-gray-400">R</span>
                                </div>
                                <div className="p-3 text-gray-100 overflow-x-auto">
                                    <pre>
                                        <code>{`# Standardized SummarizedExperiment for RNA-seq in PharmacoSet2
rnaseq_se <- SummarizedExperiment::SummarizedExperiment(
    assays = list(exprs = as.matrix(read.csv("rnaseq.csv", row.names = 1))),
    rowData = S4Vectors::DataFrame(gene_annotations), # Ensembl IDs, Gene Symbols
    colData = S4Vectors::DataFrame(sample_annotations[colnames(rnaseq_matrix), , drop = FALSE])
)

# Assigned into the molecularProfiles slot of the PharmacoSet:
molecularProfiles(pset)$rnaseq <- rnaseq_se`}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* AnnotationDB Gene Annotation Reference & Examples */}
                        <div className="flex flex-col p-4 bg-white border border-gray-200 rounded-xl gap-3 mt-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-lightYellow text-darkBlue text-headingXs font-bold px-2 py-0.5 rounded uppercase">
                                        AnnotationDB Reference
                                    </span>
                                    <span className="text-bodySm font-bold text-darkBlue">
                                        Gene & Transcript Annotation Files via BHKLab AnnotationDB
                                    </span>
                                </div>
                                <a
                                    href="https://annotationdb.bhklab.ca/docs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-bodySm font-semibold text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    <span>AnnotationDB Docs</span>
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </a>
                            </div>
                            <p className="text-bodySm text-gray-600">
                                You can retrieve the standardized{' '}
                                <strong>Gencode and Ensembl gene annotation reference files</strong> used by our team
                                across all curated pipelines directly from the AnnotationDB API:
                            </p>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col bg-gray-900 rounded-lg overflow-hidden text-bodyXs font-mono">
                                    <div className="px-3 py-1.5 bg-gray-800 text-gray-300 font-semibold flex justify-between items-center">
                                        <span>
                                            Download standardized Gencode & Ensembl gene annotation reference files
                                        </span>
                                        <span className="text-gray-400">GET</span>
                                    </div>
                                    <div className="p-3 text-gray-100 overflow-x-auto">
                                        <code>curl https://annotationdb.bhklab.ca/gene/annotation-files</code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subsection 3: Downloadable Example Templates */}
            <div className="flex flex-col gap-6 pt-6 border-t border-gray-100">
                <div className="flex flex-col gap-2">
                    <h3 className="text-headingXl font-bold text-darkBlue scroll-mt-32" id="downloadable-templates">
                        Downloadable CSV Templates
                    </h3>
                    <p className="text-bodyLg text-gray-600">
                        Use these template files as blueprints when structuring your data submission:
                    </p>
                </div>

                <div className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <span className="font-bold text-bodyMd text-darkBlue">Template File</span>
                        <span className="font-bold text-bodyMd text-darkBlue">Actions</span>
                    </div>

                    <div className="divide-y divide-gray-200 bg-white">
                        {exampleTemplates.map(template => (
                            <div key={template.filename} className="p-6 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                            <span className="font-bold text-headingMd text-darkBlue">
                                                {template.title}
                                            </span>
                                        </div>
                                        <span className="text-bodySm font-mono text-gray-400 mt-0.5">
                                            {template.filename}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                setPreviewFile(
                                                    previewFile === template.filename ? null : template.filename
                                                )
                                            }
                                            className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-bodySm font-semibold text-gray-700 hover:bg-gray-50"
                                        >
                                            {previewFile === template.filename ? 'Hide Preview' : 'Preview'}
                                        </button>
                                        <button
                                            onClick={() => handleDownload(template)}
                                            className="px-4 py-1.5 rounded-lg bg-lightBlue text-white text-bodySm font-bold hover:bg-darkBlue flex items-center gap-1.5 shadow-sm"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                />
                                            </svg>
                                            <span>Download</span>
                                        </button>
                                    </div>
                                </div>

                                <p className="text-bodySm text-gray-600">{template.description}</p>

                                {previewFile === template.filename && (
                                    <div className="mt-2 p-4 bg-gray-900 text-gray-100 rounded-xl overflow-x-auto text-bodySm font-mono">
                                        <pre>{template.content}</pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Subsection 4: Pipelines & Environments */}
            <div className="flex flex-col gap-6 pt-6 border-t border-gray-100">
                <div className="flex flex-col gap-2">
                    <h3 className="text-headingXl font-bold text-darkBlue scroll-mt-32" id="pipeline-configs">
                        Pipelines & Computing Environments
                    </h3>
                    <p className="text-bodyLg text-gray-700 leading-relaxed">
                        If submitting a custom processing pipeline, provide a GitHub repository configured for automated
                        execution:
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
                    <div className="flex flex-col p-6 rounded-2xl bg-gray-50 border border-gray-200 gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-lightYellow bg-opacity-40 flex items-center justify-center text-darkBlue font-bold">
                                1
                            </span>
                            <h4 className="text-headingLg font-bold text-darkBlue">Snakemake Workflow</h4>
                        </div>
                        <p className="text-bodyMd text-gray-700">
                            Provide a root <code>Snakefile</code> defining clear input files, output targets, rule
                            dependencies, and script invocations. Ensure all rules are deterministic and parameterized.
                        </p>
                    </div>

                    <div className="flex flex-col p-6 rounded-2xl bg-gray-50 border border-gray-200 gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-lightYellow bg-opacity-40 flex items-center justify-center text-darkBlue font-bold">
                                2
                            </span>
                            <h4 className="text-headingLg font-bold text-darkBlue">Pixi / Conda Environments</h4>
                        </div>
                        <p className="text-bodyMd text-gray-700">
                            Include declarative dependency manifests: <code>pixi.toml</code> or{' '}
                            <code>environment.yml</code> with exact package versions (R packages, Bioconductor
                            libraries, Python dependencies, and command-line tools).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataContributionSection;
