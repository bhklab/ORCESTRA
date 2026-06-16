import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';

const InfoTooltip = ({ text }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="size-4 text-gray-500 custom-tooltip"
        data-pr-tooltip={text}
        data-pr-position="right"
        style={{ cursor: 'pointer' }}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
        />
    </svg>
);

const ZenodoUpload = () => {
    const [runPipelines, setRunPipelines] = useState([]);
    const [selectedRunPipleine, setSelectedRunPipeline] = useState({});

    const toast = useRef(null);

    useEffect(() => {
        const getRunPipelines = async () => {
            const res = await axios.get('/api/user/run-pipelines');
            setRunPipelines(res.data);
        };
        getRunPipelines();
    }, []);

    const submitZenodoUpload = async () => {};

    return (
        <div className="flex flex-col gap-2">
            <Toast ref={toast} />
            <Tooltip target=".custom-tooltip" />
            <div>
                <DataTable
                    value={runPipelines}
                    sortOrder={-1}
                    size="small"
                    showGridlines={true}
                    stripedRows
                    selectionMode="single"
                    selection={selectedRunPipleine}
                    onSelectionChange={e => setSelectedRunPipeline(e.value)}
                >
                    <Column field="pipeline_name" header="Run Pipeline Name"></Column>
                    <Column field="version" header="Version"></Column>
                    <Column field="status" header="Run Status"></Column>
                    <Column field="current_stage" header="Run Step"></Column>
                    <Column field="branch" header="Repository Branch"></Column>
                    <Column field="commit_id" header="Github Commit ID"></Column>
                    <Column
                        field="jenkins_build_url"
                        header="Jenkins Build URL"
                        body={rowData => (
                            <div className="line-clamp-2" title={rowData.jenkins_build_url}>
                                <a
                                    className="text-blue-600 underline"
                                    href={rowData.jenkins_build_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {rowData.jenkins_build_url}
                                </a>
                            </div>
                        )}
                    ></Column>
                    <Column
                        field="repo_url"
                        header="Github Repository URL"
                        body={rowData => (
                            <div className="line-clamp-2" title={rowData.repo_url}>
                                <a
                                    className="text-blue-600 underline"
                                    href={rowData.repo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {rowData.repo_url}
                                </a>
                            </div>
                        )}
                    ></Column>
                    <Column
                        field="message"
                        header="Run pipeline message"
                        body={rowData => (
                            <div className="line-clamp-2" title={rowData.message}>
                                {rowData.message}
                            </div>
                        )}
                    ></Column>
                </DataTable>
            </div>
            <div className="flex flex-col gap-4">
                <button
                    className="bg-darkBlue text-white px-2 py-2 rounded-md text-bodyMd font-semibold max-w-24"
                    onClick={submitZenodoUpload}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default ZenodoUpload;
