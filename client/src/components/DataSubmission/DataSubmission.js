import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import CustomInputText from '../Shared/CustomInputText';
import CustomSelect from '../Shared/CustomSelect';
import CustomMessages from '../Shared/CustomMessages';
import MolecularDataForm from './MolecularDataForm';
import { dataTypes } from '../Shared/Enums'; 

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
    align-items: center;
    .left {
        width: 300px;
        margin-right: 20px;
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
        width: 100%;
        margin-left: 10px;
        margin-bottom: 10px;
        .version {
            margin-right: 20px;
        }
        .filename {
            width: 250px;
            margin-right: 20px;
        }
        .repo-url {
            width: 400px;
        }
        .publication-citation {
            width: 500px;
        }
        .publication-link {
            width: 250px;
        }
    }
    .description {
        margin-left: 10px;
    }
`;

const datasetTypeOptions = [
    { label: 'Pharmacogenomics', value: dataTypes.pharmacogenomics},
    { label: 'Toxicogenomics', value: dataTypes.toxicogenomics },
    { label: 'Xenographic Pharmacogenomics', value: dataTypes.xenographic},
    { label: 'Cinical Genomics', value: dataTypes.clinicalgenomics},
    { label: 'Radiogenomics', value: dataTypes.radiogenomics},
];

const dataSubmissionSuccessMessage = {
    severity: 'success', 
    summary: 'Data Submitted', 
    detail: 'Your data has been submitted for curation. You will be notified via email once your dataset is processed.', 
    sticky: true 
}

const dataSubmissionErrorMessage = {
    severity: 'error', 
    summary: 'Error Occurred', 
    detail: 'There was an error in the server. Please try again, or contact support@orcestra.ca', 
    sticky: true 
}

const DataSubmission = () => {

    const [info, setInfo] = useState({ name: '', datasetType: '',  private: false });
    const [sampleAnnotation, setSampleAnnotation] = useState({filename: '', repoURL: ''});
    const [drugAnnotation, setDrugAnnotation] = useState({filename: '', repoURL: ''});
    const [rawTreatmentData, setRawTreatmentData] = useState({
        version: '', 
        filename: '', 
        repoURL: '', 
        publication: {citation: '', link: ''}
    });
    const [treatmentInfo, setTreatmentInfo] = useState({filename: '', repoURL: ''});
    const [molecularData, setMolecularData] = useState([
        {
            name: '', 
            filename: '', 
            repoURL: '',
            toolname: '', toolversion: '',
            refname: '', refURL: ''
        }
    ]);
    const [showMsg, setShowMsg] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({});
    const [dataVersionOptions, setDataVersionOptions] = useState([]);

    useEffect(() => {
        let yearOptions = [];
        let currentYear = new Date().getFullYear();
        let minYear = currentYear - 4;
        for(let current = currentYear; current >= minYear; current--){
            yearOptions.push({label: current, value: current});
        }
        setDataVersionOptions(yearOptions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        const submission = {
            info: info,
            sampleAnnotation: sampleAnnotation,
            drugAnnotation: drugAnnotation,
            rawTreatmentData: {...rawTreatmentData, version: rawTreatmentData.version.value},
            treatmentInfo: treatmentInfo,
            molecularData: molecularData
        };
        console.log(submission);
        const res = await axios.post('/api/user/dataset/submit', submission);
        if(res.status === 200){
            setSubmitMessage(dataSubmissionSuccessMessage);
        }else{
            setSubmitMessage(dataSubmissionErrorMessage);
        }
        setShowMsg(Math.random());
        setInfo({ name: '', datasetType: '' });
        setSampleAnnotation({filename: '', repoURL: ''});
        setDrugAnnotation({filename: '', repoURL: ''});
        setRawTreatmentData({version: '', filename: '', repoURL: '', publication: {citation: '', link: ''}});
        setTreatmentInfo({filename: '', repoURL: ''});
        setMolecularData([{name: '', filename: '', repoURL: ''}]);
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

    const handleMolecularDataReset = (e, index) => {
        const list = [...molecularData];
        list[index] = {
            name: '', 
            filename: '', 
            repoURL: '',
            toolname: '', toolversion: '',
            refname: '', refURL: ''
        };
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

    const isSubmitDisabled = () => {
        if(info.name.length === 0 || info.datasetType.length === 0){
            return true;
        }
        if(sampleAnnotation.filename.length === 0 || sampleAnnotation.repoURL.length === 0){
            return true;
        }
        if(drugAnnotation.filename.length === 0 || drugAnnotation.repoURL.length === 0){
            return true;
        }
        if(rawTreatmentData.version.length === 0 || rawTreatmentData.filename.length === 0 || rawTreatmentData.repoURL.length === 0){
            return true;
        }
        if(treatmentInfo.filename.length === 0 || treatmentInfo.repoURL.length === 0){
            return true;
        }
        for(const item of molecularData){
            if(item.name.length === 0 || item.filename.length === 0 || item.repoURL.length === 0){
                return true;
            }
        }
        return false;
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
                            value={info.name} 
                            onChange={(e) => {setInfo({...info, name: e.target.value})}}
                        />
                    </div>
                    <div className='left'>
                        <CustomSelect 
                            label='Dataset Type:'
                            selected={info.datasetType} 
                            options={datasetTypeOptions}
                            onChange={(e) => {setInfo({...info, datasetType: e.value})}}
                            selectOne={true}
                        />
                    </div>
                    <div className='right'>
                        <Checkbox inputId='private' onChange={e => setInfo({...info, private: e.checked})} checked={info.private}></Checkbox>
                        <label htmlFor='private' className='p-checkbox-label'>Keep this dataset private</label>
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
                        <CustomSelect 
                            className='version'
                            label='Version:'
                            selected={rawTreatmentData.version} 
                            options={dataVersionOptions}
                            onChange={(e) => {setRawTreatmentData({...rawTreatmentData, version: e.value})}}
                            selectOne={true}
                        />
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
                            className='publication-citation'
                            label='Pulication Citation:'
                            value={rawTreatmentData.publication.citation} 
                            onChange={(e) => {setRawTreatmentData({...rawTreatmentData, publication: {...rawTreatmentData.publication, citation: e.target.value}})}}
                        />
                    </div>
                    <div className='form-container'>
                        <CustomInputText 
                            className='publication-link'
                            label='Link:'
                            value={rawTreatmentData.publication.link} 
                            onChange={(e) => {setRawTreatmentData({...rawTreatmentData, publication: {...rawTreatmentData.publication, link: e.target.value}})}}
                        />
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
                                key={i}
                                length={molecularData.length}
                                molecularData={data} 
                                index={i} 
                                handleInputChange={handleMolecularDataInput}
                                handleReset={handleMolecularDataReset}
                                handleAddClick={handleMolecularDataAdd}
                                handleRemoveClick={handleMolecularDataRemove}
                            />
                        ))
                    }
                </DocSection>
                <CustomMessages trigger={showMsg} message={submitMessage} />
                <DocSection>
                    <Button 
                        label='Submit Data' 
                        type='submit' 
                        disabled={isSubmitDisabled()} 
                        onClick={submit} 
                    />
                </DocSection>
            </StyledDataSubmission>
        </div>
    )
}

export default DataSubmission;