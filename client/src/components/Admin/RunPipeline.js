import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';

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
        pixi_use: false,
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
                <div className="flex flex-col">
                    <label className="text-bodyMd font-semibold text-gray-600">Commit SHA</label>
                    <input
                        type="text"
                        name="commit_id"
                        value={runPipelineFields.commit_id}
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-bodyMd font-semibold text-gray-600">Branch</label>
                    <input
                        type="text"
                        name="branch"
                        value={runPipelineFields.branch}
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-bodyMd font-semibold text-gray-600">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={runPipelineFields.email}
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-bodyMd font-semibold text-gray-600">Snakefile Path</label>
                    <input
                        type="text"
                        name="snakefile_path"
                        value={runPipelineFields.snakefile_path}
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-bodyMd font-semibold text-gray-600">Configuration File Path</label>
                    <input
                        type="text"
                        name="config_file_path"
                        value={runPipelineFields.config_file_path}
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-bodyMd font-semibold text-gray-600">Conda Environment File Path</label>
                    <input
                        type="text"
                        name="conda_env_file_path"
                        value={runPipelineFields.conda_env_file_path}
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
                </div>
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
                </div>
                <div className="flex flex-col">
                    <label className="text-bodyMd font-semibold text-gray-600">Pipeline Run Command</label>
                    <input
                        type="text"
                        name="pipeline_run_command"
                        value={runPipelineFields.pipeline_run_command}
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-bodyMd font-semibold text-gray-600">QC Command</label>
                    <input
                        type="text"
                        name="qc_command"
                        value={runPipelineFields.qc_command}
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
