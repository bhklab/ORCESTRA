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
        name: '',
        git_url: '',
        path_snakefile: '',
        path_output: '',
        path_config: '',
        path_conda: '',
        output_paths: ['']
        // additional_parameters: ['']
    });

    const addOutputPath = () => {
        setPipeline(prevState => ({
            ...prevState,
            output_paths: [...prevState.output_paths, '']
        }));
    };

    const removeOutputPath = index => {
        setPipeline(prevState => {
            const newOutputPaths = prevState.output_paths.filter((_, i) => i !== index);
            return {
                ...prevState,
                output_paths: newOutputPaths
            };
        });
    };

    const handleOutputPathChange = (index, value) => {
        setPipeline(prevState => {
            const newOutputPaths = [...prevState.output_paths];
            newOutputPaths[index] = value;
            return {
                ...prevState,
                output_paths: newOutputPaths
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
                value={pipeline.name}
                onChange={e => {
                    setPipeline({ ...pipeline, name: e.target.value });
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
                value={pipeline.path_snakefile}
                icon="/images/icons/info-icon.svg"
                onChange={e => {
                    setPipeline({ ...pipeline, path_snakefile: e.target.value });
                }}
            />
            <CustomInputText
                className="textfield"
                placeholder="Ex. ./config/config.yaml"
                label="Path to config:"
                tooltip="Path to configuration from project root"
                value={pipeline.path_config}
                icon="/images/icons/info-icon.svg"
                onChange={e => {
                    setPipeline({ ...pipeline, path_config: e.target.value });
                }}
            />
            <CustomInputText
                className="textfield"
                placeholder="Ex. ./pipeline.yaml"
                label="Path to conda env:"
                tooltip="Path to conda environment from project root"
                value={pipeline.path_conda}
                icon="/images/icons/info-icon.svg"
                onChange={e => {
                    setPipeline({ ...pipeline, path_conda: e.target.value });
                }}
            />
            {pipeline.output_paths.map((outputPath, index) => (
                <div className="multiple-file-field" key={index}>
                    <CustomInputText
                        className="multiple-file-textfield"
                        placeholder={`Ex. ./output/objects`}
                        label={`Output file path ${index + 1}:`}
                        icon="/images/icons/info-icon.svg"
                        tooltip="Path to output from project root"
                        value={outputPath}
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
                        pipeline.path_snakefile === '' ||
                        pipeline.path_conda === '' ||
                        pipeline.output_paths[0] === ''
                    }
                >
                    Create Pipeline
                </Button>
            </div>
        </StyledCreatePipeline>
    );
};

export default CreatePipeline;
