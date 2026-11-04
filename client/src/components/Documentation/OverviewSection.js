import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleCheckBig, Link, CodeXml, FlaskConical, CircleCheck, BookOpen, Download } from 'lucide-react';

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
            'Persistent Zenodo Digital Object Identifiers (DOIs) assigned to every dataset object release',
            'All datasets include structured metadata, raw data sources, and processing pipelines with flexible environments'
        ]
    },
    {
        letter: 'A',
        name: 'Accessible',
        tagline: 'Open access for researchers and machines',
        color: 'from-amber-500 to-orange-600',
        textColor: 'text-amber-600',
        bgSoft: 'bg-amber-50',
        borderColor: 'border-amber-100',
        features: [
            '<b>Web app access</b> of datasets, their metadata, and downloadable objects',
            '<b>API access</b> of datasets, their metadata, and downloadable objects'
        ]
    },
    {
        letter: 'I',
        name: 'Interoperable',
        tagline: 'Standardized schemas & harmonized data',
        color: 'from-emerald-500 to-teal-700',
        textColor: 'text-emerald-600',
        bgSoft: 'bg-emerald-50',
        borderColor: 'border-emerald-100',
        features: [
            'Standardized identifier mapping to community ontologies (PubChem CIDs, Cellosaurus, Ensembl)',
            'Harmonized multimodal data structures aligning molecular profiles',
            'Cross-dataset harmonization with the utilization of Gx packages (e.g. PharmacoGx, ToxicoGx, Xeva, RadioGx)'
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
            'Clear licensing, citation guidelines, and academic usage terms'
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
                    Motivation
                </h3>
                <div className="flex flex-col gap-4 text-bodyLg text-gray-700 leading-relaxed">
                    <p>
                        ORCESTRA was founded on the idea that scientific progress builds upon the work and discoveries
                        of those who came before us. However, too often, research lacks transparency and reproducibility
                        in how researchers relay their work to the broader scientific community. This leads to redundant
                        work and an inability for others to build upon previous findings. Bothered by this realization{' '}
                        <a
                            href="https://bhklab.ca"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 font-bold hover:underline"
                        >
                            The Benjamin Haibe-Kains lab
                        </a>{' '}
                        set out on a mission to overcome the hurdles in accessibility, reproducibility, and transparency
                        of published works in cancer research by developing a centralized platform for providing full
                        dataset provenance.
                    </p>
                    <p>
                        Benjamin has been a passionate advocate for open science throughout his academic career, even
                        being quoted{' '}
                        <span className="italic font-semibold">
                            &quot;Science builds upon the work of others,&quot;
                        </span>{' '}
                        he says{' '}
                        <span className="italic font-semibold">
                            &quot;If you don't share the code and the data, then I would say more than half of the
                            impact that you could have is gone.&quot;
                        </span>{' '}
                        [
                        <a
                            className="font-bold text-blue-600 hover:underline"
                            href="https://www.uhn.ca/corporate/News/Pages/New_cloud_based_tool_ORCESTRA_brings_symphony_of_collaboration_to_cancer_research.aspx"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            1
                        </a>
                        ,{' '}
                        <a
                            className="font-bold text-blue-600 hover:underline"
                            href="https://thepmcf.ca/getmedia/c88b7153-ef48-4b4b-a512-1422d2638f07/PMCF_2022-Annual-Report_Sept-30.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            2
                        </a>
                        ]. The team aims to remain true to this sentiment for all datasets on the platform and ensure
                        future researchers can build upon previous discoveries. To ensure ORCESTRA stays true to this
                        mission, the platform has been built on the{' '}
                        <a
                            href="https://www.nature.com/articles/sdata201618"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-blue-600 hover:underline"
                        >
                            FAIR principles
                        </a>{' '}
                        which allows for a structured framework for making research data <strong>findable</strong>,{' '}
                        <strong>accessible</strong>, <strong>interoperable</strong>, and <strong>reusable</strong>{' '}
                        before they reach scientists.
                    </p>
                </div>
            </div>

            {/* Subsection 2: FAIR Data Principles */}
            <div className="flex flex-col gap-4 pt-6 border-t border-gray-100">
                <div className="flex flex-col gap-2">
                    <h3 className="text-headingXl font-bold text-darkBlue scroll-mt-32" id="fair-principles">
                        The FAIR Principles in ORCESTRA
                    </h3>
                    <p className="text-bodyLg text-gray-600">
                        <strong>FAIR Principles</strong> (Findable, Accessible, Interoperable, Reusable) are the
                        foundational data guidelines of ORCESTRA to maximize scientific utility, reproducibility, and
                        cross-study analyses.
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
                                    <li key={idx} className="flex items-center gap-2.5 text-bodyMd text-gray-700">
                                        <CircleCheckBig
                                            className={`w-5 shrink-0 ${principle.textColor}`}
                                            strokeWidth={2.75}
                                        />
                                        <span dangerouslySetInnerHTML={{ __html: feature }} />
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
                        Inspired by the{' '}
                        <a
                            href="https://datanutrition.org/"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="font-bold text-blue-600 hover:underline"
                        >
                            Data Nutrition Project
                        </a>{' '}
                        ORCESTRA integrates it's own <strong>Data Nutrition Label (DNL)</strong> for every processed
                        dataset. This gives researchers an easy way to customize an exhaustive and verifiable provenance
                        summary for produced datasets.
                    </p>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
                    <div className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 gap-2">
                        <div className="flex flex-row items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-lightYellow bg-opacity-50 flex items-center justify-center text-darkBlue font-bold">
                                <Link className="h-4 w-4" strokeWidth={2.5} />
                            </div>
                            <h5 className="text-headingMd font-bold text-darkBlue">Raw & Preprocessed Data</h5>
                        </div>
                        <p className="text-bodySm text-gray-600">
                            Direct links and origins for raw data including genomic, imaging, drug response, and
                            clinical data.
                        </p>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 gap-2">
                        <div className="flex flex-row items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-lightYellow bg-opacity-50 flex items-center justify-center text-darkBlue font-bold">
                                <CodeXml className="h-4 w-4" strokeWidth={2.5} />
                            </div>
                            <h5 className="text-headingMd font-bold text-darkBlue">Pipelines & Version Tracking</h5>
                        </div>
                        <p className="text-bodySm text-gray-600">
                            Explicit GitHub repository URLs and exact git commit hashes step.
                        </p>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 gap-2">
                        <div className="flex flex-row items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-lightYellow bg-opacity-50 flex items-center justify-center text-darkBlue font-bold">
                                <FlaskConical className="h-4 w-4" strokeWidth={2.5} />
                            </div>
                            <h5 className="text-headingMd font-bold text-darkBlue">Tools & Environments</h5>
                        </div>
                        <p className="text-bodySm text-gray-600">
                            Specific bioinformatics package versions (e.g. PharmacoGx, Kallisto, Salmon, Gencode
                            transcriptome).
                        </p>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 gap-2">
                        <div className="flex flex-row items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-lightYellow bg-opacity-50 flex items-center justify-center text-darkBlue font-bold">
                                <CircleCheck className="h-4 w-4" strokeWidth={2.5} />
                            </div>
                            <h5 className="text-headingMd font-bold text-darkBlue">Quality Control (QC)</h5>
                        </div>
                        <p className="text-bodySm text-gray-600">
                            Embedded MultiQC reports and interactive QC viewers checking data consistency and alignment
                            quality.
                        </p>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 gap-2">
                        <div className="flex flex-row items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-lightYellow bg-opacity-50 flex items-center justify-center text-darkBlue font-bold">
                                <BookOpen className="h-4 w-4" strokeWidth={2.5} />
                            </div>
                            <h5 className="text-headingMd font-bold text-darkBlue">Citations & Disclaimers</h5>
                        </div>
                        <p className="text-bodySm text-gray-600">
                            Literature citations, academic usage policy, and standard license terms.
                        </p>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 gap-2">
                        <div className="flex flex-row items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-lightYellow bg-opacity-50 flex items-center justify-center text-darkBlue font-bold">
                                <Download className="h-4 w-4" strokeWidth={2.5} />
                            </div>
                            <h5 className="text-headingMd font-bold text-darkBlue">Multi-Format Downloads</h5>
                        </div>
                        <p className="text-bodySm text-gray-600">
                            Download RDS data objects, CSVs, or access via Zenodo archive.
                        </p>
                    </div>
                </div>

                {/* Example DNL Card Callout */}
                <div className="flex flex-row md:flex-col items-center justify-between p-6 bg-lightBlue rounded-xl text-white gap-6">
                    <div className="flex flex-col gap-1.5">
                        {/* <div className="flex items-center gap-2">
                            <span className="bg-darkYellow text-darkBlue px-2.5 py-0.5 rounded text-headingXs font-bold uppercase">
                                Example Data Nutrition Page
                            </span>
                        </div> */}
                        <h4 className="text-headingLg font-bold">View a Dataset's Data Nutrition Label</h4>
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
            {/* <div className="flex flex-col gap-6 pt-6 border-t border-gray-100">
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
                            Step 1
                        </span>
                        <h5 className="text-headingMd font-bold text-darkBlue">Environment Definition</h5>
                        <p className="text-bodySm text-gray-600">
                            Pipelines are version-controlled in Git repositories with declarative Conda (
                            <code>environment.yml</code>) or Pixi (<code>pixi.toml</code>) environments. Snakemake
                            defines rule dependencies, inputs, and outputs.
                        </p>
                    </div>

                    <div className="flex flex-col p-5 rounded-xl bg-gray-50 border-1 border-gray-200 gap-3 relative">
                        <span className="text-headingSm font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-full w-fit">
                            Step 2
                        </span>
                        <h5 className="text-headingMd font-bold text-darkBlue">Automated Execution</h5>
                        <p className="text-bodySm text-gray-600">
                            Jenkins schedules and executes the Snakemake pipelines in isolated Pixi/Conda sandboxes,
                            managing compute allocation, rule execution, logging, and dataset generation.
                        </p>
                    </div>

                    <div className="flex flex-col p-5 rounded-xl bg-gray-50 border border-gray-200 gap-3">
                        <span className="text-headingSm font-bold px-3 py-1 bg-green-100 text-green-800 rounded-full w-fit">
                            Step 3
                        </span>
                        <h5 className="text-headingMd font-bold text-darkBlue">DNL Entry Generation & Zenodo DOI</h5>
                        <p className="text-bodySm text-gray-600">
                            Automated workflows extract execution manifests, upload/update Data Nutrition Label entries
                            in MongoDB, and archive finalized dataset artifacts to Zenodo to mint permanent DOIs.
                        </p>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default OverviewSection;
