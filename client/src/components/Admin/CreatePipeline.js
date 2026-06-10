import React, { useState } from 'react';
import axios from 'axios';

const CreatePipeline = () => {
    const [pipeline, setPipeline] = useState({
        pipeline_name: '',
        git_url: ''
    });

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label className="text-bodyMd font-semibold text-gray-600">Pipeline Name</label>
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
                    // onClick={e => ()}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default CreatePipeline;
