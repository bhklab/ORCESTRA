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

const RunPipeline = () => {
    const [createdPipelines, setCreatedPipelines] = useState([]);
    const [selectedCreatePipeline, setSelectedCreatePipeline] = useState({});
    const [runPipelineFields, setRunPipelineFields] = useState({
        commit_id: '',
        branch: '',
        email: '',
        output_directories: [],
        snakefile_path: '',
        config_file_path: '',
        conda_env_file_path: '',
        pixi_use: true,
        larger_machine_use: false,
        pipeline_run_command: '',
        qc_command: '',
        new_release: false
    });

    const toast = useRef(null);

    useEffect(() => {
        const getCreatedPipelines = async () => {
            const res = await axios.get('/api/user/created-pipelines');
            setCreatedPipelines(res.data);
        };
        getCreatedPipelines();
    }, []);

    useEffect(() => {
        console.log(runPipelineFields);
    }, [runPipelineFields]);

    const submitRunPipeline = async () => {
        setRunPipelineFields({ ...runPipelineFields, pipeline_name: selectedCreatePipeline.pipeline_name });
        try {
            const res = await axios.post('/api/user/run-pipeline', runPipelineFields);
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: `Successful pipeline submission: ${res.data}`,
                life: 3000
            });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to submit pipeline: ${error}`,
                life: 3000
            });
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Toast ref={toast} />
            <Tooltip target=".custom-tooltip" />
            <div>
                <DataTable
                    value={createdPipelines}
                    sortOrder={-1}
                    size="small"
                    showGridlines={true}
                    stripedRows
                    selectionMode="single"
                    selection={selectedCreatePipeline}
                    onSelectionChange={e => setSelectedCreatePipeline(e.value)}
                >
                    <Column field="pipeline_name" header="Create Pipeline Name"></Column>
                    <Column field="git_url" header="Github URL"></Column>
                </DataTable>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label className="text-bodyMd font-semibold text-gray-600">Pipeline Name</label>
                    <input
                        type="text"
                        name="pipeline_name"
                        disabled={true}
                        value={selectedCreatePipeline.pipeline_name}
                        className="px-2 py-1 rounded-md text-bodyLg max-w-96 focus:outline-none bg-gray-200"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-bodyMd font-semibold text-gray-600">Github URL</label>
                    <input
                        type="text"
                        name="git_url"
                        disabled={true}
                        value={selectedCreatePipeline.git_url}
                        className="px-2 py-1 rounded-md text-bodyLg max-w-96 focus:outline-none bg-gray-200"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-center gap-1">
                        <label className="text-bodyMd font-semibold text-gray-600">Branch</label>
                        <InfoTooltip text="Optional (defaults to 'main' branch)" />
                    </div>
                    <input
                        type="text"
                        name="branch"
                        value={runPipelineFields.branch}
                        onChange={e => setRunPipelineFields({ ...runPipelineFields, branch: e.target.value })}
                        placeholder="main"
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-center gap-1">
                        <label className="text-bodyMd font-semibold text-gray-600">Commit ID (SHA)</label>
                        <InfoTooltip text="Optional (defaults to most recent commit id)" />
                    </div>
                    <input
                        type="text"
                        name="commit_id"
                        value={runPipelineFields.commit_id}
                        onChange={e => setRunPipelineFields({ ...runPipelineFields, commit_id: e.target.value })}
                        placeholder="99c1cda60e5c7837ccde33c623482fc806a5115b"
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col">
                        <label className="text-bodyMd font-semibold text-gray-600">Email</label>
                        <label className="text-bodyXs italic text-red-500">Required</label>
                    </div>
                    <input
                        type="email"
                        name="email"
                        value={runPipelineFields.email}
                        onChange={e => setRunPipelineFields({ ...runPipelineFields, email: e.target.value })}
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col">
                        <label className="text-bodyMd font-semibold text-gray-600">Snakefile Path</label>
                        <label className="text-bodyXs italic text-red-500">
                            Required: Snakefile location relative to top level of repository
                        </label>
                    </div>
                    <input
                        type="text"
                        name="snakefile_path"
                        value={runPipelineFields.snakefile_path}
                        onChange={e => setRunPipelineFields({ ...runPipelineFields, snakefile_path: e.target.value })}
                        placeholder="workflow/Snakefile"
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col">
                        <label className="text-bodyMd font-semibold text-gray-600">Configuration File Path</label>
                        <label className="text-bodyXs italic text-red-500">
                            Required: configuration file location relative to top level of repository
                        </label>
                    </div>
                    <input
                        type="text"
                        name="config_file_path"
                        value={runPipelineFields.config_file_path}
                        onChange={e => setRunPipelineFields({ ...runPipelineFields, config_file_path: e.target.value })}
                        placeholder="config/pipeline.yaml"
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                </div>
                <div className="flex flex-row items-center gap-2">
                    <label className="text-bodyMd font-semibold text-gray-600">Pixi Use</label>
                    <input
                        type="checkbox"
                        name="pixi_use"
                        checked={runPipelineFields.pixi_use}
                        onChange={e => setRunPipelineFields({ ...runPipelineFields, pixi_use: e.target.checked })}
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                    <InfoTooltip text="unchecked: conda will configs will be available" />
                </div>
                {!runPipelineFields.pixi_use && (
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-col">
                            <label className="text-bodyMd font-semibold text-gray-600">
                                Conda Environment File Path
                            </label>
                            <label className="text-bodyXs italic text-red-500">
                                Required: needed if a conda environment is utilized
                            </label>
                        </div>
                        <input
                            type="text"
                            name="conda_env_file_path"
                            value={runPipelineFields.conda_env_file_path}
                            onChange={e =>
                                setRunPipelineFields({ ...runPipelineFields, conda_env_file_path: e.target.value })
                            }
                            className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                        />
                    </div>
                )}

                <div className="flex flex-row items-center gap-2">
                    <label className="text-bodyMd font-semibold text-gray-600">Larger Machine Use</label>
                    <input
                        type="checkbox"
                        name="larger_machine_use"
                        checked={runPipelineFields.larger_machine_use}
                        onChange={e =>
                            setRunPipelineFields({ ...runPipelineFields, larger_machine_use: e.target.checked })
                        }
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                    <InfoTooltip text="checked: max 24 GB RAM and 7 vCPUs will be available to the pipeline; unchecked: max 12 GB RAM and 3 vCPUs will be available to the pipeline" />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col">
                        <label className="text-bodyMd font-semibold text-gray-600">Pipeline Run Command</label>
                        <label className="text-bodyXs italic text-red-500">
                            Required: command used to commence pipeline execution from the top level of the repository
                        </label>
                    </div>
                    <input
                        type="text"
                        name="pipeline_run_command"
                        value={runPipelineFields.pipeline_run_command}
                        onChange={e =>
                            setRunPipelineFields({ ...runPipelineFields, pipeline_run_command: e.target.value })
                        }
                        placeholder="pixi run snakemake --cores 4"
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-center gap-1">
                        <label className="text-bodyMd font-semibold text-gray-600">QC Command</label>
                        <InfoTooltip text="command used to commence quality control from the top level of the repository" />
                    </div>
                    <input
                        type="text"
                        name="qc_command"
                        value={runPipelineFields.qc_command}
                        onChange={e => setRunPipelineFields({ ...runPipelineFields, qc_command: e.target.value })}
                        placeholder="pixi run qc"
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                </div>
                <div className="flex flex-row items-center gap-2">
                    <label className="text-bodyMd font-semibold text-gray-600">New Release</label>
                    <input
                        type="checkbox"
                        name="new_release"
                        checked={runPipelineFields.new_release}
                        onChange={e => setRunPipelineFields({ ...runPipelineFields, new_release: e.target.checked })}
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                    <InfoTooltip text="check: new commit id being run within pipeline; unchecked: rerunning a previous commit id" />
                </div>
                <button
                    className="bg-darkBlue text-white px-2 py-2 rounded-md text-bodyMd font-semibold max-w-24"
                    onClick={submitRunPipeline}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default RunPipeline;
