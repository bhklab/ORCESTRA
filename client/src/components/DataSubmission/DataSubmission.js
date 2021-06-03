import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'primereact/button';
import CustomInputText from '../Shared/CustomInputText';
import CustomSelect from '../Shared/CustomSelect';
import MolecularDataForm from './MolecularDataForm';

const StyledDataSubmission = styled.div`
    width: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
    padding-bottom: 10px;
    font-size: 12px;
    .title {
        font-size: 20px;
        font-weight: bold;
    }
`;

const SubmissionPanel = styled.div`
    display: flex;
    .left {
        width: 300px;
        margin-right: 20px;
        .inputtext {
            margin-bottom: 10px;
        }
    }
`;

const DocSection = styled.div`
    margin-top: 10px;
    margin-bottom: 20px;
    .subtitle {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .form-container {
        display: flex;
        aling-items: center;
        flex-wrap: wrap;
        margin-left: 10px;
        margin-bottom: 10px;
        .filename {
            width: 300px;
            margin-right: 10px;
        }
        .repo-url {
            width: 500px;
        }
        .publication-input {
            width: 500px;
            margin-right: 10px;
        }
    }
    .description {
        margin-left: 10px;
    }
`;

const DataSubmission = () => {

    const [submission, setSubmission] = useState({
        name: '',
        datasetType: '',
        email: ''
    });
    const [sampleAnnotation, setSampleAnnotation] = useState({filename: '', repoURL: ''});
    const [drugAnnotation, setDrugAnnotation] = useState({filename: '', repoURL: ''});
    const [rawTreatmentData, setRawTreatmentData] = useState({filename: '', repoURL: '', publication: {citation: '', link: ''}});
    const [treatmentInfo, setTreatmentInfo] = useState({filename: '', repoURL: ''});
    const [molecularData, setMolecularData] = useState([{name: '', filename: '', repoURL: ''}]);

    const submit = async (e) => {
        e.preventDefault();
    }

    const handleMolecularDataInput = (e, index, field) => {
        let value = '';
        if(field === 'name'){
            value = e.value;
        }else{
            value = e.target.value;
        }
        const list = [...molecularData];
        list[index][field] = value;
        setMolecularData(list);
    }

    const handleMolecularDataAdd = (e) => {
        e.preventDefault();
        setMolecularData([...molecularData, {name: '', filename: '', repoURL: ''}]);
    }

    const handleMolecularDataRemove = (e, index) => {
        const list = [...molecularData];
        list.splice(index, 1);
        setMolecularData(list);
    }

    return(
        <div className='pageContent'>
            <StyledDataSubmission>
                <div className='title'>Data Submission Form (Coming soon)</div>
                <p>
                    Please fill out and submit the form below. 
                    For Each data, provide the filename, repository URL and publication information if applicable. <br />
                    We will process the data into a curated dataset, and notify you via email.<br />
                    Please refer to <a href='/app/documentation/datacontribution'>Contributing Your Data</a> for more details about the format of each data.
                </p>
                <SubmissionPanel>
                    <div className='left'>
                        <CustomInputText 
                            className='inputtext'
                            label='Dataset Name:'
                            value={submission.name} 
                            onChange={(e) => {setSubmission({...submission, name: e.target.value})}}
                        />
                    </div>
                    <div className='right'>
                        <CustomSelect 
                            label='Dataset Type:'
                            value={submission.datasetType} 
                            options={[]}
                            onChange={(e) => {setSubmission({...submission, datasetType: e.value})}}
                            selectOne={true}
                        />
                    </div>
                </SubmissionPanel>
                <DocSection>
                    <div className='subtitle'>1. Sample annotation</div>
                    <div className='description'>
                        <p>
                            File (.CSV) that includes each sample with respective unique ID's (unique.sample.id). For cell lines, please also provide Cellosaurus Accession IDs. If a cell line is not present in Cellosaurus, indicate with NA. In addition, please include tissue types (tissue.id) for each sample and any other sample metadata in the CSV that you would like to include in your data object.
                            <br />
                            Cellosaurus: <a href='https://web.expasy.org/cellosaurus/'>https://web.expasy.org/cellosaurus/</a>
                        </p> 
                    </div> 
                    <div className='form-container'>
                        <CustomInputText 
                            className='filename'
                            label='Filename:'
                            value={sampleAnnotation.filename} 
                            onChange={(e) => {setSampleAnnotation({...sampleAnnotation, filename: e.target.value})}}
                        />
                        <CustomInputText 
                            className='repo-url'
                            label='Repository URL:'
                            value={sampleAnnotation.repoURL} 
                            onChange={(e) => {setSampleAnnotation({...sampleAnnotation, repoURL: e.target.value})}}
                        />
                    </div>
                </DocSection> 
                <DocSection>
                    <div className='subtitle'>2. Drug annotation</div>
                    <div className='description'>
                        <p>
                            File (.CSV) that includes each drug compound with respective unique ID's (unique.drug.id). Please also provide PubChem CID for each drug compound. If a drug is not present in PubChem, indicate CID with NA. In addition, include any other drug metadata in the CSV that you would like to include in your data object.
                            <br />
                            PubChem: <a href='https://pubchem.ncbi.nlm.nih.gov'>https://pubchem.ncbi.nlm.nih.gov</a>
                        </p>
                    </div>  
                    <div className='form-container'>
                        <CustomInputText 
                            className='filename'
                            label='Filename:'
                            value={drugAnnotation.filename} 
                            onChange={(e) => {setDrugAnnotation({...drugAnnotation, filename: e.target.value})}}
                        />
                        <CustomInputText 
                            className='repo-url'
                            label='Repository URL:'
                            value={drugAnnotation.repoURL} 
                            onChange={(e) => {setDrugAnnotation({...drugAnnotation, repoURL: e.target.value})}}
                        />
                    </div>
                </DocSection>
                <DocSection>
                    <div className='subtitle'>3. Raw treatment sensitivity data</div>
                    <div className='description'>
                        One of:
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
                    <div className='form-container'>
                        <CustomInputText 
                            className='filename'
                            label='Filename:'
                            value={rawTreatmentData.filename} 
                            onChange={(e) => {setRawTreatmentData({...rawTreatmentData, filename: e.target.value})}}
                        />
                        <CustomInputText 
                            className='repo-url'
                            label='Repository URL:'
                            value={rawTreatmentData.repoURL} 
                            onChange={(e) => {setRawTreatmentData({...rawTreatmentData, repoURL: e.target.value})}}
                        />
                    </div>
                    <div className='form-container'>
                        <CustomInputText 
                            className='publication-input'
                            label='Pulication Citation:'
                            value={rawTreatmentData.publication.citation} 
                            onChange={(e) => {setRawTreatmentData({...rawTreatmentData, publication: {...rawTreatmentData.publication, citation: e.target.value}})}}
                        />
                        <CustomInputText 
                            className='publication-input'
                            label='Link:'
                            value={rawTreatmentData.publication.link} 
                            onChange={(e) => {setRawTreatmentData({...rawTreatmentData, publication: {...rawTreatmentData.publication, link: e.target.value}})}}
                        />
                    </div>
                    <div className='form-container'>
                        
                    </div>
                </DocSection>
                <DocSection>
                    <div className='subtitle'>4. Treatment sensitivity info</div>
                    <div className='description'>
                        <p>
                            File (.CSV) that contains the minimum and maximum drug dose (in micromolar) used for each unique experiment ID (unique.sampleid_unique.drugid), along with the respective unique.sample.id and unique.drug.id.
                        </p>
                    </div>
                    <div className='form-container'>
                        <CustomInputText 
                            className='filename'
                            label='Filename:'
                            value={treatmentInfo.filename} 
                            onChange={(e) => {setTreatmentInfo({...treatmentInfo, filename: e.target.value})}}
                        />
                        <CustomInputText 
                            className='repo-url'
                            label='Repository URL:'
                            value={treatmentInfo.repoURL} 
                            onChange={(e) => {setTreatmentInfo({...treatmentInfo, repoURL: e.target.value})}}
                        />
                    </div>
                </DocSection> 
                <DocSection>
                    <div className='subtitle'>5. Processed molecular profile data</div>
                    <div className='description'>
                        <p>
                            We accept processed RNA-seq, microarray, mutation, and CNV data. For each datatype, ensure rows are denoted as gene, transcript, or probe ID's, while columns are denoted as samples (unique.sample.id). Please also indicate which tools and their versions were used to process your molecular data (e.g. Kallisto v.0.43.1 for RNA-seq), including information about all accompanying files required to process your data (e.g. Gencode v33 transcriptome for RNA-seq; SureSelectHumanAllExonV5 BED file for mutation calling).
                        </p> 
                    </div>
                    {
                        molecularData.map((data, i) => (
                            <MolecularDataForm 
                                length={molecularData.length}
                                molecularData={data} 
                                index={i} 
                                handleInputChange={handleMolecularDataInput}
                                handleAddClick={handleMolecularDataAdd}
                                handleRemoveClick={handleMolecularDataRemove}
                            />
                        ))
                    }
                </DocSection>
                <DocSection>
                    <Button label='Submit Data' type='submit' disabled={false} onClick={submit} />
                </DocSection>
            </StyledDataSubmission>
        </div>
    )
}

export default DataSubmission;