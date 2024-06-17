import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomInputText from '../Shared/CustomInputText';
import CustomMessages from '../Shared/CustomMessages';
import CustomSelect from '../Shared/CustomSelect';
import CustomCheckbox from '../Shared/CustomCheckbox';
import { Button } from 'primereact/button';
import styled from 'styled-components';
import { ThreeDots } from 'react-loader-spinner';

const StyledRunPipeline = styled.div`
    max-width: 800px;
    .content {
        display: flex;
        margin-top: 30px;
        margin-bottom: 20px;
        .left {
            width: 400px;
            margin-right: 30px;
        }
        .right {
            width: 400px;
            background-color: #ffffff;
            border-radius: 5px;
            padding: 0 15px 0 15px;
        }
        .sub-header {
            display: flex;
            align-items: center;
            h4 {
                margin-right: 20px;
            }
        }
        .field {
            display: flex;
            align-items: center;
            width: 200px;
            margin-bottom: 10px;
            .delete-btn {
                margin-right: 10px;
            }
            .textfield {
                margin-right: 10px;
            }
        }
        .paramfield {
            margin-bottom: 10px;
        }
    }
`;

const RunPipeline = () => {
    const [pipelines, setPipelines] = useState([]);
    const [selected, setSelected] = useState(null);
    const [selectedPipeline, setSelectedPipeline] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showMsg, setShowMsg] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({});

    return (
        <StyledRunPipeline>
            <CustomMessages trigger={showMsg} message={submitMessage} />
            <h3>Run Pipeline</h3>
            {
                // pipelines.length > 0 &&
                <div>
                    <CustomSelect
                        selectOne
                        selected={selected}
                        options={pipelines.map(pipeline => ({ label: pipeline.name, value: pipeline.name }))}
                        label="Select pipeline: "
                    />
                    {
                        // selectedPipeline &&
                        <>
                            <div className="content">
                                <CustomCheckbox label="Run all:" />
                            </div>

                            {loading ? (
                                <ThreeDots color="#3D405A" height={100} width={100} />
                            ) : (
                                <Button className="p-button-primary" label="Run Pipeline" />
                            )}
                        </>
                    }
                </div>
            }
        </StyledRunPipeline>
    );
};

export default RunPipeline;
