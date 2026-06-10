import React, { useState } from 'react';
import CreatePipeline from './CreatePipeline';
import RunPipeline from './RunPipeline';

const Admin = () => {
    const [selectedMenu, setSelectedMenu] = useState('create-pipeline');

    return (
        <div className="flex flex-col gap-4 px-10 py-10">
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-1">
                    <div className="text-headingLg text-darkBlue">Admin Menu</div>
                    <div className="flex flex-row items-center gap-2">
                        <span
                            className={`hover:text-darkBlue hover:cursor-pointer ${
                                selectedMenu === 'create-pipeline' ? 'text-darkBlue' : 'text-gray-400'
                            }`}
                            onClick={e => setSelectedMenu('create-pipeline')}
                        >
                            Create a Pipeline
                        </span>
                        <div className="w-[1px] bg-gray-300 h-4" />
                        <span
                            className={`hover:text-darkBlue hover:cursor-pointer ${
                                selectedMenu === 'run-pipeline' ? 'text-darkBlue' : 'text-gray-400'
                            }`}
                            onClick={e => {
                                setSelectedMenu('run-pipeline');
                            }}
                        >
                            Run a Pipeline
                        </span>
                    </div>
                </div>
                {selectedMenu === 'create-pipeline' && <CreatePipeline />}
                {selectedMenu === 'run-pipeline' && <RunPipeline />}
            </div>
        </div>
    );
};

export default Admin;
