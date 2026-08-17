import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const dataLayers = [
    {
        name: 'Pharmacogenomics',
        code: 'pset',
        pkg: 'PharmacoGx',
        img: 'pharmacogenomics.png',
        description:
            'Datasets focused on how genomic and molecular variations in cancer cell lines dictate response to therapeutic compounds. Standardized using the PharmacoGx R package to harmonize high-throughput drug screening viability profiles with multi-omic characterization.',
        dataTypes: ['Dose-Response', 'RNA-seq', 'Microarray', 'Mutation', 'CNV'],
        output: 'PharmacoSet (RDS, CSV)',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
        name: 'Toxicogenomics',
        code: 'toxicoset',
        pkg: 'ToxicoGx',
        img: 'toxicogenomics.png',
        description:
            'Datasets focused on toxicological pharmacology that leverage multi-omics (transcriptomics, proteomics, and metabolomics) across cell and tissue models to model chemical toxicity. Standardized using the ToxicoGx R package.',
        dataTypes: ['Toxicity Assays', 'Time-Series Expression', 'Compound Profiles'],
        output: 'ToxicoSet (RDS, CSV)',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
        name: 'Xenographic Pharmacogenomics',
        code: 'xevaset',
        pkg: 'Xeva',
        img: 'xenographicpharmacogenomics.png',
        description:
            'Datasets capturing in vivo drug response and tumor volume dynamics across Patient-Derived Xenograft (PDX) mouse models paired with genomic profiles. Standardized using the Xeva R package.',
        dataTypes: ['Tumor Growth Dynamics', 'In Vivo Efficacy', 'PDX Multi-Omics'],
        output: 'XevaSet (RDS, CSV)',
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
        name: 'Radiogenomics',
        code: 'radioset',
        pkg: 'RadioGx',
        img: 'radiogenomics.png',
        description:
            'Datasets focused on cellular and molecular responses to ionizing radiation therapy paired with comprehensive genomic and transcriptomic profiling. Standardized using the RadioGx R package to facilitate radio-sensitivity modeling.',
        dataTypes: ['Clonogenic Assays', 'Radiation Dose-Survival', 'Transcriptomics'],
        output: 'RadioSet (RDS, CSV)',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
        name: 'Clinical Genomics',
        code: 'clinicalgenomics',
        pkg: 'Clinical Cohorts',
        img: 'clinicalgenomics.png',
        description:
            'Datasets integrating patient clinical trial cohorts, genomic sequencing (e.g., WES, RNA-seq, targeted gene panels), and therapeutic treatment outcomes to identify biomarkers of drug efficacy and patient survival.',
        dataTypes: ['Patient Outcomes', 'Survival Metrics', 'Targeted Panels', 'WES'],
        output: 'ClinicalGenomicsSet (RDS, CSV)',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
        name: 'Immune Checkpoint Blockade',
        code: 'clinical_icb',
        pkg: 'Immunotherapy',
        img: 'clinical_icb.png',
        description:
            'Harmonized clinical and multi-omic datasets from cancer patients undergoing immunotherapy (e.g., anti-PD-1, anti-PD-L1, anti-CTLA-4) to investigate immune-tumor interactions and predictive biomarkers of response.',
        dataTypes: ['ICB Response', 'TMB', 'Immune Infiltration', 'RNA-seq'],
        output: 'ICB Dataset (RDS, CSV)',
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
        name: 'Radiomics',
        code: 'radiomicset',
        pkg: 'Imaging & Clinical',
        img: 'radiomics.png',
        description:
            'Datasets capturing high-throughput quantitative radiographic imaging features (extracted from CT, MRI, and PET scans) integrated with clinical annotations and genomic data for imaging biomarker discovery.',
        dataTypes: ['CT/MRI/PET Features', 'Texture Analysis', 'Imaging Biomarkers'],
        output: 'RadiomicSet (RDS, CSV)',
        badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200'
    },
    {
        name: 'Annotations',
        code: 'annotations',
        pkg: 'Ontology Curation',
        img: 'annotations.png',
        description:
            'Standardized curation matrices and ontology mappings for cell lines, chemical compounds, genes, and tissue types across all ORCESTRA datasets, ensuring cross-study semantic harmonization and interoperability.',
        dataTypes: ['Cellosaurus Mapping', 'PubChem CIDs', 'Gene Ontologies', 'Tissue Crosswalks'],
        output: 'AnnotationSet (RDS, CSV)',
        badgeColor: 'bg-teal-50 text-teal-700 border-teal-200'
    }
];

const fairPrinciples = [
    {
        letter: 'F',
        name: 'Findable',
        tagline: 'Discoverable and uniquely indexed',
        color: 'from-blue-600 to-indigo-700',
        textColor: 'text-blue-600',
        bgSoft: 'bg-blue-50',
        borderColor: 'border-blue-100',
        features: [
            'Persistent Zenodo Digital Object Identifiers (DOIs) assigned to every dataset build and release',
            'Granular, structured metadata indexed across all dataset types, cell lines, drugs, and assay types',
            'Searchable multi-attribute query catalog spanning compounds, tissues, genomic layers, and versions'
        ]
    },
    {
        letter: 'A',
        name: 'Accessible',
        tagline: 'Open access without barriers',
        color: 'from-amber-500 to-orange-600',
        textColor: 'text-amber-600',
        bgSoft: 'bg-amber-50',
        borderColor: 'border-amber-100',
        features: [
            'Open RESTful API endpoints for programmatic catalog discovery and dataset metadata retrieval',
            'Direct HTTPS downloads for both binary R data objects (RDS) and standardized CSV tabular files',
            'Seamless automated package integration via Bioconductor R libraries (PharmacoGx, ToxicoGx, Xeva, RadioGx)'
        ]
    },
    {
        letter: 'I',
        name: 'Interoperable',
        tagline: 'Standardized schemas & ontologies',
        color: 'from-emerald-500 to-teal-700',
        textColor: 'text-emerald-600',
        bgSoft: 'bg-emerald-50',
        borderColor: 'border-emerald-100',
        features: [
            'Standardized identifier mapping to community ontologies (PubChem CIDs, Cellosaurus, Ensembl, HUGO)',
            'Harmonized multimodal data structures aligning molecular profiles with dose-response curves',
            'Cross-dataset harmonization allowing comparative meta-analyses across diverse preclinical and clinical studies'
        ]
    },
    {
        letter: 'R',
        name: 'Reusable',
        tagline: 'Reproducible provenance & clear licensing',
        color: 'from-purple-600 to-violet-800',
        textColor: 'text-purple-600',
        bgSoft: 'bg-purple-50',
        borderColor: 'border-purple-100',
        features: [
            'Transparent Data Nutrition Labels documenting raw sources, tool versions, scripts, and commit IDs',
            'Automated workflow execution using reproducible Snakemake pipelines and Pixi/Conda environments',
            'Clear Creative Commons (CC BY 4.0) licensing, citation guidelines, and academic usage terms'
        ]
    }
];

export const OverviewSection = ({ scrollTarget }) => {
    const navigate = useNavigate();

    useEffect(() => {
        async function scrollTo() {
            await new Promise(resolve => setTimeout(resolve, 75));
            if (!scrollTarget) return;
            const el = document.getElementById(scrollTarget);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        scrollTo();
    }, [scrollTarget]);

    return (
        <div className="flex flex-col gap-12 text-darkBlue">
            {/* Header / Hero */}
            <div className="flex flex-col gap-3 pb-6 border-b border-gray-100">
                <h1 className="text-heading3Xl md:text-heading2Xl font-bold text-darkBlue">Platform Overview</h1>
                <p className="text-bodyLg text-gray-600 leading-relaxed">
                    ORCESTRA is an open-access platform designed for sharing, processing, and transparently tracking
                    standardized multimodal biomedical datasets following the FAIR data principles.
                </p>
            </div>

            {/* Subsection 1: Platform Overview */}
            <div className="flex flex-col gap-4">
                <h3 className="text-headingXl font-bold text-darkBlue scroll-mt-32" id="orcestra-overview">
                    What is ORCESTRA?
                </h3>
                <div className="flex flex-col gap-4 text-bodyLg text-gray-700 leading-relaxed">
                    <p>
                        In computational oncology and translational pharmacology, integrating preclinical screening data
                        (e.g., cell line pharmacogenomics, patient-derived xenografts, radiation assays) with
                        high-throughput molecular profiles (RNA-seq, microarrays, mutation panels) is critical for
                        biomarker discovery and drug repurposing. However, data in these domains is frequently
                        fragmented across disparate repositories, lacks standardized compound and cell identifiers, and
                        is processed using divergent computational workflows.
                    </p>
                    <p>
                        <strong>ORCESTRA</strong> overcomes these reproducibility and harmonization bottlenecks. It
                        provides an automated infrastructure to generate, version-control, and publicly distribute
                        standardized data objects accompanied by comprehensive provenance records.
                    </p>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-1 gap-4 pt-2">
                    <div className="flex flex-col p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-headingXl font-bold text-lightBlue">8+</span>
                        <span className="text-bodyMd font-semibold text-darkBlue">Data Layers</span>
                        <span className="text-bodySm text-gray-600 mt-1">
                            Spanning pharmacogenomics, toxicogenomics, xenografts, radiomics, clinical genomics, and
                            annotations.
                        </span>
                    </div>
                    <div className="flex flex-col p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-headingXl font-bold text-lightBlue">100% FAIR</span>
                        <span className="text-bodyMd font-semibold text-darkBlue">Data Principles</span>
                        <span className="text-bodySm text-gray-600 mt-1">
                            Permanent Zenodo DOIs, standardized ontologies, open RESTful APIs, and direct RDS/CSV
                            downloads.
                        </span>
                    </div>
                    <div className="flex flex-col p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-headingXl font-bold text-lightBlue">End-to-End</span>
                        <span className="text-bodyMd font-semibold text-darkBlue">Workflow Provenance</span>
                        <span className="text-bodySm text-gray-600 mt-1">
                            Automated Snakemake pipelines, Pixi/Conda environments, and granular Data Nutrition Labels.
                        </span>
                    </div>
                </div>
            </div>

            {/* Subsection 2: FAIR Data Principles */}
            <div className="flex flex-col gap-4 pt-6 border-t border-gray-100">
                <div className="flex flex-col gap-2">
                    <h3 className="text-headingXl font-bold text-darkBlue scroll-mt-32" id="fair-principles">
                        The FAIR Data Principles in ORCESTRA
                    </h3>
                    <p className="text-bodyLg text-gray-600">
                        ORCESTRA implements the international <strong>FAIR</strong> (Findable, Accessible,
                        Interoperable, Reusable) data stewardship principles to maximize scientific utility,
                        reproducibility, and cross-study meta-analyses.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-1 gap-5 pt-2">
                    {fairPrinciples.map(principle => (
                        <div
                            key={principle.name}
                            className="flex flex-col p-6 rounded-2xl bg-white border border-gray-200 shadow-sm gap-4"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-headingXl text-white bg-gradient-to-br ${principle.color} shadow-sm`}
                                >
                                    {principle.letter}
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-headingLg font-bold text-darkBlue">{principle.name}</h4>
                                    <span className="text-bodySm text-gray-500">{principle.tagline}</span>
                                </div>
                            </div>

                            <ul className="flex flex-col gap-2.5 pt-2 border-t border-gray-100">
                                {principle.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 text-bodyMd text-gray-700">
                                        <svg
                                            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${principle.textColor}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subsection 3: Data Nutrition Label */}
            <div className="flex flex-col gap-6 pt-6 border-t border-gray-100">
                <div className="flex flex-col gap-2">
                    <h3 className="text-headingXl font-bold text-darkBlue scroll-mt-32" id="data-nutrition-label">
                        The "Data Nutrition Label" (DNL)
                    </h3>
                    <p className="text-bodyLg text-gray-700 leading-relaxed">
                        Inspired by nutritional labels on consumer goods that list ingredients, origins, and nutritional
                        values, ORCESTRA automatically generates an interactive{' '}
                        <strong>Data Nutrition Label (DNL)</strong> for every processed dataset. This gives researchers
                        an exhaustive, verifiable provenance summary.
                    </p>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
                    <div className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 gap-2">
                        <div className="w-8 h-8 rounded-lg bg-lightYellow bg-opacity-50 flex items-center justify-center text-darkBlue font-bold">
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
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                />
                            </svg>
                        </div>
                        <h5 className="text-headingMd font-bold text-darkBlue">Raw & Preprocessed Data</h5>
                        <p className="text-bodySm text-gray-600">
                            Direct links and origins for raw screening tables, microarrays, sequencing reads, and sample
                            identifiers.
                        </p>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 gap-2">
                        <div className="w-8 h-8 rounded-lg bg-lightYellow bg-opacity-50 flex items-center justify-center text-darkBlue font-bold">
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
                                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                />
                            </svg>
                        </div>
                        <h5 className="text-headingMd font-bold text-darkBlue">Pipeline Scripts & Commits</h5>
                        <p className="text-bodySm text-gray-600">
                            Explicit GitHub repository URLs and exact git commit hashes executing each transformation
                            step.
                        </p>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 gap-2">
                        <div className="w-8 h-8 rounded-lg bg-lightYellow bg-opacity-50 flex items-center justify-center text-darkBlue font-bold">
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
                                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                />
                            </svg>
                        </div>
                        <h5 className="text-headingMd font-bold text-darkBlue">Tools & Environments</h5>
                        <p className="text-bodySm text-gray-600">
                            Specific bioinformatics package versions (e.g. PharmacoGx, Kallisto, Salmon, Gencode
                            transcriptome).
                        </p>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 gap-2">
                        <div className="w-8 h-8 rounded-lg bg-lightYellow bg-opacity-50 flex items-center justify-center text-darkBlue font-bold">
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
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h5 className="text-headingMd font-bold text-darkBlue">Quality Control (QC)</h5>
                        <p className="text-bodySm text-gray-600">
                            Embedded MultiQC reports and interactive QC viewers checking data consistency and alignment
                            quality.
                        </p>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 gap-2">
                        <div className="w-8 h-8 rounded-lg bg-lightYellow bg-opacity-50 flex items-center justify-center text-darkBlue font-bold">
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
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </div>
                        <h5 className="text-headingMd font-bold text-darkBlue">Citations & Disclaimers</h5>
                        <p className="text-bodySm text-gray-600">
                            Literature citations with 1-click clipboard copy, academic usage policy, and standard
                            license terms.
                        </p>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 gap-2">
                        <div className="w-8 h-8 rounded-lg bg-lightYellow bg-opacity-50 flex items-center justify-center text-darkBlue font-bold">
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
                        </div>
                        <h5 className="text-headingMd font-bold text-darkBlue">Multi-Format Downloads</h5>
                        <p className="text-bodySm text-gray-600">
                            Download direct RDS data objects, individual CSV files, or access the persistent Zenodo DOI
                            archive.
                        </p>
                    </div>
                </div>

                {/* Example DNL Card Callout */}
                <div className="flex flex-row md:flex-col items-center justify-between p-6 bg-lightBlue rounded-xl text-white gap-6">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <span className="bg-darkYellow text-darkBlue px-2.5 py-0.5 rounded text-headingXs font-bold uppercase">
                                Example Data Nutrition Page
                            </span>
                        </div>
                        <h4 className="text-headingLg font-bold">View an Example Annotation Dataset</h4>
                        <p className="text-bodyMd text-blue-100">
                            Inspect how raw data sources, tools, release notes, and Zenodo DOI links are organized on an
                            actual dataset page.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/annotations/694953faa3591a7b70fce109')}
                        className="flex-shrink-0 bg-darkYellow text-darkBlue font-bold px-6 py-3 rounded-xl hover:scale-105 duration-200 ease-in-out flex items-center gap-2 shadow-sm"
                    >
                        <span>View Nutrition Page</span>
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
                </div>
            </div>

            {/* Subsection 4: Data Processing Architecture & API */}
            <div className="flex flex-col gap-6 pt-6 border-t border-gray-100">
                <div className="flex flex-col gap-2">
                    <h3 className="text-headingXl font-bold text-darkBlue scroll-mt-32" id="pipeline-architecture">
                        Data Processing API & Pipeline Architecture
                    </h3>
                    <p className="text-bodyLg text-gray-700 leading-relaxed">
                        Under the hood, ORCESTRA utilizes an automated data processing API built on{' '}
                        <strong>Jenkins</strong> and <strong>Pixi</strong>. The platform is designed to accept{' '}
                        <strong>Conda/Pixi environment based pipelines</strong>, orchestrated by{' '}
                        <strong>Snakemake</strong>, with a <strong>Nextflow</strong> integration roadmap for future
                        workflow scalability.
                    </p>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-1 gap-5">
                    <div className="flex flex-col p-5 rounded-xl bg-gray-50 border border-gray-200 gap-3">
                        <span className="text-headingSm font-bold px-3 py-1 bg-blue-100 text-lightBlue rounded-full w-fit">
                            Step 1: Pipeline Submission
                        </span>
                        <h5 className="text-headingMd font-bold text-darkBlue">Environment & Recipe Definition</h5>
                        <p className="text-bodySm text-gray-600">
                            Pipelines are version-controlled in Git repositories with declarative Conda (
                            <code>environment.yml</code>) or Pixi (<code>pixi.toml</code>) environments. Snakemake
                            defines rule dependencies, inputs, and outputs.
                        </p>
                    </div>

                    <div className="flex flex-col p-5 rounded-xl bg-gray-50 border-1 border-gray-200 gap-3 relative">
                        <span className="text-headingSm font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-full w-fit">
                            Step 2: Automated Execution
                        </span>
                        <h5 className="text-headingMd font-bold text-darkBlue">Jenkins & Pixi Orchestration</h5>
                        <p className="text-bodySm text-gray-600">
                            Jenkins schedules and executes the Snakemake pipelines in isolated Pixi/Conda sandboxes,
                            managing compute allocation, rule execution, logging, and artifact generation.
                        </p>
                    </div>

                    <div className="flex flex-col p-5 rounded-xl bg-gray-50 border border-gray-200 gap-3">
                        <span className="text-headingSm font-bold px-3 py-1 bg-green-100 text-green-800 rounded-full w-fit">
                            Step 3: DNL Workflow & Archival
                        </span>
                        <h5 className="text-headingMd font-bold text-darkBlue">DNL Entry Generation & Zenodo DOI</h5>
                        <p className="text-bodySm text-gray-600">
                            New automated workflows extract execution manifests, upload/update Data Nutrition Label
                            entries in MongoDB, and archive finalized dataset artifacts to Zenodo to mint permanent
                            DOIs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewSection;
