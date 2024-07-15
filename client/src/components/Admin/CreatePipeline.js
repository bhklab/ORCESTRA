import React, { useState } from 'react';
import axios from 'axios';
import CustomInputText from '../Shared/CustomInputText';
import { Button } from 'primereact/button';
import styled from 'styled-components';
import 'primeicons/primeicons.css';

const StyledCreatePipeline = styled.div`
    max-width: 1000px;
    .textfield {
        max-width: 600px;
        margin-bottom: 10px;
    }
    .radio-buttons {
        display: flex;
        margin-bottom: 20px;
        font-size: 12px;
        .radio-button-field {
            margin-right: 20px;
            .radio-button-label {
                margin-left: 5px;
            }
        }
    }
    .multiple-file-field {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        max-width: 600px;
        .multiple-file-textfield {
            margin-right: 10px;
        }
    }

    .submit-button {
        margin-top: 30px;
        margin-bottom: 30px;
    }
`;

const CreatePipeline = () => {
    const [pipeline, setPipeline] = useState({
        pipeline_name: '',
        git_url: '',
        output_file: '',
        output_files: [''],
        snakefile_path: '',
        config_file_path: '',
        conda_env_file_path: '',
        // additional_parameters: ['']
    });

    const addOutputPath = () => {
        setPipeline(prevState => ({
            ...prevState,
            output_files: [...prevState.output_files, '']
        }));
    };

    const removeOutputPath = index => {
        setPipeline(prevState => {
            const newOutputPaths = prevState.output_files.filter((_, i) => i !== index);
            return {
                ...prevState,
                output_files: newOutputPaths
            };
        });
    };

    const handleOutputPathChange = (index, value) => {
        setPipeline(prevState => {
            const newOutputPaths = [...prevState.output_files];
            newOutputPaths[index] = value;
            return {
                ...prevState,
                output_files: newOutputPaths
            };
        });
    };

    const submit = async e => {
        e.preventDefault();
        console.log(pipeline);
        try {
            axios.post('/api/admin/data-processing/create-pipeline', { pipeline });
        } catch (error) {}
    };

    return (
        <StyledCreatePipeline>
            <h3>Create a Pipeline</h3>
            <CustomInputText
                className="textfield"
                placeholder="Ex. PSet_GRAY2013 or PSet_UHNBreast"
                label="Pipeline Name:"
                value={pipeline.pipeline_name}
                onChange={e => {
                    setPipeline({ ...pipeline, pipeline_name: e.target.value });
                }}
            />
            <CustomInputText
                className="textfield"
                placeholder="Ex. https://github.com/BHKLAB-DataProcessing/RADCURE.git"
                label="Pipeline Github Repository (URL):"
                value={pipeline.git_url}
                onChange={e => {
                    setPipeline({ ...pipeline, git_url: e.target.value });
                }}
            />
            <CustomInputText
                className="textfield"
                placeholder="Ex. ./snake"
                tooltip="Path to Snakefile from project root"
                label="Path to snakefile:"
                value={pipeline.snakefile_path}
                icon="/images/icons/info-icon.svg"
                onChange={e => {
                    setPipeline({ ...pipeline, snakefile_path: e.target.value });
                }}
            />
            <CustomInputText
                className="textfield"
                placeholder="Ex. ./config/config.yaml"
                label="Path to config:"
                tooltip="Path to configuration from project root"
                value={pipeline.config_file_path}
                icon="/images/icons/info-icon.svg"
                onChange={e => {
                    setPipeline({ ...pipeline, config_file_path: e.target.value });
                }}
            />
            <CustomInputText
                className="textfield"
                placeholder="Ex. ./pipeline.yaml"
                label="Path to conda env:"
                tooltip="Path to conda environment from project root"
                value={pipeline.conda_env_file_path}
                icon="/images/icons/info-icon.svg"
                onChange={e => {
                    setPipeline({ ...pipeline, conda_env_file_path: e.target.value });
                }}
            />
            {pipeline.output_files.map((output_file, index) => (
                <div className="multiple-file-field" key={index}>
                    <CustomInputText
                        className="multiple-file-textfield"
                        placeholder={`Ex. ./output/objects`}
                        label={`Output file path ${index + 1}:`}
                        icon="/images/icons/info-icon.svg"
                        tooltip="Path to output from project root"
                        value={output_file}
                        onChange={e => handleOutputPathChange(index, e.target.value)}
                    />
                    <Button
                        className="delete-btn"
                        icon="pi pi-trash"
                        onClick={() => removeOutputPath(index)}
                        tooltip="Remove this output path"
                    />
                </div>
            ))}
            <Button icon="pi pi-plus" onClick={addOutputPath} label="Add Output Path" />
            <div className="submit-button">
                <Button
                    onClick={submit}
                    disabled={
                        pipeline.name === '' ||
                        pipeline.git_url === '' ||
                        pipeline.snakefile_path === '' ||
                        pipeline.conda_env_file_path === '' ||
                        pipeline.output_files[0] === ''
                    }
                >
                    Create Pipeline
                </Button>
            </div>
        </StyledCreatePipeline>
    );
};

export default CreatePipeline;
