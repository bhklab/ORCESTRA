import React from 'react';
import styled from 'styled-components';
import download from 'downloadjs';

const StyledTable = styled.table`
    text-align: left;
    font-size: 14px;
    .download {
        border: none;
        background: none;
        font-size: 16px;
        cursor: pointer;
        color: #3D405A;
    }
`;

const DocHeader = styled.div`
    margin-top: 20px;
    .title {
        display: inline-block;
        font-size: 20px;
        font-weight: bold;
        border-bottom: 3px solid rgb(241, 144, 33);
    }
`;

const DocSection = styled.div`
    margin-top: 10px;
    margin-bottom: 30px;
    .docContent {
        margin-left: 20px;
    }
`;

const DataContribution = () => {

    const exampleFilesTable = (files) => (
        <StyledTable>
            <thead>
                <tr>
                    <th>Download Example File(s):</th>
                </tr> 
            </thead>
            <tbody>
            {
                files.map(file => (
                    <tr key={file}>
                        <td>{file}</td>
                        <td>
                            <button className='download' title='Download' onClick={(e) => {
                                e.preventDefault();
                                downloadFile(file);
                            }}>
                                <i className="pi pi-fw pi-download"></i>
                            </button>
                        </td>
                    </tr>
                ))
            } 
            </tbody>  
        </StyledTable>
    );

    const downloadFile = async (file) => {
        const res = await fetch('/api/example-download/' + file);
        const blob = await res.blob();
        download(blob, file);
    }

    return(
        <div className='documentation'>
            <DocHeader>
                <div className='title'>Contributing Your Data</div>
                <p>
                    You can submit your data to ORCESTRA to be processed into a version-controlled multi-modal datasets via <a href='/app/data_submission'>Data Submission page</a>.<br />
                    Please ensure your data submission includes the following files, in the format of the example CSV files provided below:
                </p>
            </DocHeader>
            <div>
                <DocSection>
                    <h3>1. Sample annotation</h3>
                    <div className='docContent'>
                        {exampleFilesTable(['example_sample_annotation.csv'])}
                        <p>
                            File (.CSV) that includes each sample with respective unique ID's (unique.sample.id). For cell lines, please also provide Cellosaurus Accession IDs. If a cell line is not present in Cellosaurus, indicate with NA. In addition, please include tissue types (tissue.id) for each sample and any other sample metadata in the CSV that you would like to include in your data object.
                            <br />
                            Cellosaurus: <a href='https://web.expasy.org/cellosaurus/'>https://web.expasy.org/cellosaurus/</a>
                        </p> 
                    </div> 
                </DocSection> 
                <DocSection>
                    <h3>2. Drug annotation</h3>
                    <div className='docContent'>
                        {exampleFilesTable(['example_drug_annotation.csv'])}
                        <p>
                            File (.CSV) that includes each drug compound with respective unique ID's (unique.drug.id). Please also provide PubChem CID for each drug compound. If a drug is not present in PubChem, indicate CID with NA. In addition, include any other drug metadata in the CSV that you would like to include in your data object.
                            <br />
                            PubChem: <a href='https://pubchem.ncbi.nlm.nih.gov'>https://pubchem.ncbi.nlm.nih.gov</a>
                        </p>
                    </div>  
                </DocSection>
                <DocSection>
                    <h3>3. Raw treatment sensitivity data</h3>
                    <div className='docContent'>
                        {exampleFilesTable(['example_drug_annotation.csv', 'example_raw_drug_viability.csv'])}
                        <ol>
                            <li>
                                File (.CSV) that contains the doses (in micromolar) utilized each drug compound and sample pair. A unique experiment ID must be used for each drug compound and sample pair, which follows the following format (unique.sampleid_unique.drugid) - refer to example_raw_drug_dose.csv
                            </li>
                            <li>
                                File (.CSV) that contains the viability (in percentage %) for each dose of the respective unique experiment ID (unique.sampleid_unique.drugid) - refer to example_raw_drug_viability.csv
                            </li>
                        </ol>
                        <p>
                            *NOTE: If an experiment was performed more than once for a given drug compound and sample pair (unique.sampleid_unique.drugid), ensure that the unique unique experiment ID reflects this by appending "_number" to the end of the unique experiment ID (e.g. 380_XMD8-85_1; 380_XMD8-85_2; 380_XMD8-85_3) 
                        </p>
                    </div>
                </DocSection>
                <DocSection>
                    <h3>4. Treatment sensitivity info</h3>
                    <div className='docContent'>
                        {exampleFilesTable(['example_sensitivity_info.csv'])}
                        <p>
                            File (.CSV) that contains the minimum and maximum drug dose (in micromolar) used for each unique experiment ID (unique.sampleid_unique.drugid), along with the respective unique.sample.id and unique.drug.id.
                        </p>
                    </div>
                </DocSection> 
                <DocSection>
                    <h3>5. Processed molecular profile data</h3>
                    <div className='docContent'>
                        {exampleFilesTable(['example_rnaseq.csv '])}
                        <p>
                            We accept processed RNA-seq, microarray, mutation, and CNV data. For each datatype, ensure rows are denoted as gene, transcript, or probe ID's, while columns are denoted as samples (unique.sample.id). Please also indicate which tools and their versions were used to process your molecular data (e.g. Kallisto v.0.43.1 for RNA-seq), including information about all accompanying files required to process your data (e.g. Gencode v33 transcriptome for RNA-seq; SureSelectHumanAllExonV5 BED file for mutation calling).
                        </p> 
                    </div>
                </DocSection>
                <DocSection>
                    <h3>6. Other metadata to include in ORCESTRA</h3>
                    <div className='docContent'>
                        <p>
                            If your data is associated with specific publications, please provide us with respective publication links for each data source (drug sensivitity data, molecular profiles).
                        </p>
                    </div> 
                </DocSection>
            </div>
        </div>    
    );
}

export default DataContribution