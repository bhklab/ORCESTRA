import React from 'react';
import styled from 'styled-components';

export const StyledDataDisplay = styled.div`
    box-sizing: border-box;
    max-width: 100%;
    border-radius: 10px;
    padding-top: 20px;
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 30px;
    color: #3D405A;
    background-color: rgba(255, 255, 255, 0.8);
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: pre-wrap;
    @media only screen and (max-width: 1000px) {
        display: flex;
        flex-direction: column;
        max-width: 100%;
        font-size: 12px;
        align-items: center;
    }
`;

const StyledText = styled.p`
    max-width: 600px;
    overflow-wrap: break-word;
`;


const DataDisplay = ({ data }) => {
    return (
        <StyledDataDisplay>
            <h3><strong>Pipeline Status :</strong></h3>
            <StyledText><strong>Clone Status:</strong> {data.clone_status}</StyledText>
            <StyledText><strong>Configuration Checks:</strong> {data.configuration_checks}</StyledText>
            <StyledText><strong>Dry Run Status:</strong> {data.dry_run_status}</StyledText>
            <StyledText><strong>Pipeline Directory:</strong> {data.pipeline_directory}</StyledText>
            <h3><strong>Pipeline Database Entry :</strong></h3>
            <StyledText><strong>Git URL:</strong> {data.pipeline_database_entry.git_url}</StyledText>
            <StyledText><strong>Pipeline Name:</strong> {data.pipeline_database_entry.pipeline_name}</StyledText>
            <StyledText><strong>Output Files:</strong> {data.pipeline_database_entry.output_files.join(', ')}</StyledText>
            <StyledText><strong>Snakefile Path:</strong> {data.pipeline_database_entry.snakefile_path}</StyledText>
            <StyledText><strong>Config File Path:</strong> {data.pipeline_database_entry.config_file_path}</StyledText>
            <StyledText><strong>Conda Env File Path:</strong> {data.pipeline_database_entry.conda_env_file_path}</StyledText>
            <StyledText><strong>Created At:</strong> {data.pipeline_database_entry.created_at}</StyledText>
            <StyledText><strong>Last Updated At:</strong> {data.pipeline_database_entry.last_updated_at}</StyledText>
        </StyledDataDisplay>
    );
};

export default DataDisplay;
