import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';

const CreatePipeline = () => {
    const [pipeline, setPipeline] = useState({
        pipeline_name: '',
        git_url: ''
    });

    const toast = useRef(null);

    const submitPipeline = async () => {
        try {
            const res = await axios.post('/api/user/create-pipeline', pipeline);
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: `Successful create pipeline submission: ${res.data?.configuration_checks}`,
                life: 20000
            });
        } catch (error) {
            console.log(error.response.data);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to submit pipeline: ${error.response?.data?.error?.detail || error}`,
                life: 20000
            });
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Toast ref={toast} />
            <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label className="text-bodyMd font-semibold text-gray-600">Resource Name</label>
                    <input
                        type="text"
                        name="pipeline_name"
                        value={pipeline.pipeline_name}
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                        onChange={e => setPipeline({ ...pipeline, pipeline_name: e.target.value })}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-bodyMd font-semibold text-gray-600">Github URL</label>
                    <input
                        type="text"
                        name="git_url"
                        value={pipeline.git_url}
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                        onChange={e => setPipeline({ ...pipeline, git_url: e.target.value })}
                    />
                </div>
                <button
                    className="bg-darkBlue text-white px-2 py-2 rounded-md text-bodyMd font-semibold max-w-24"
                    onClick={submitPipeline}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default CreatePipeline;
