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
    const [selectedRunPipeline, setSelectedRunPipeline] = useState({
        pipeline_name: '',
        repo_url: ''
    });
    const [zenodoObject, setZenodoObject] = useState({
        description: '',
        resource_type: '',
        creators: [{ name: '', type: 'DataCurator', affiliations: [''] }],
        subjects: [''],
        references: ['']
    });

    const toast = useRef(null);

    useEffect(() => {
        const getRunPipelines = async () => {
            const res = await axios.get('/api/user/run-pipelines');
            setRunPipelines(res.data);
        };
        getRunPipelines();
    }, []);

    const submitZenodoUpload = async () => {
        setZenodoObject({ ...zenodoObject, run_pipeline_id: selectedRunPipeline._id });
    };

    return (
        <div className="flex flex-col gap-2">
            <Toast ref={toast} />
            <Tooltip target=".custom-tooltip" />
            {runPipelines.length > 0 && (
                <div>
                    <DataTable
                        value={runPipelines}
                        sortOrder={-1}
                        size="small"
                        showGridlines={true}
                        stripedRows
                        selectionMode="single"
                        selection={selectedRunPipeline}
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
            )}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label className="text-bodyMd font-semibold text-gray-600">Pipeline Name</label>
                    <input
                        type="text"
                        name="pipeline_name"
                        disabled={true}
                        value={selectedRunPipeline.pipeline_name}
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none bg-gray-200"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-bodyMd font-semibold text-gray-600">Github URL</label>
                    <input
                        type="text"
                        name="git_url"
                        disabled={true}
                        value={selectedRunPipeline.repo_url}
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none bg-gray-200"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-center gap-1">
                        <label className="text-bodyMd font-semibold text-gray-600">Description</label>
                        <label className="text-bodyXs italic text-red-500">Required</label>
                    </div>
                    <textarea
                        name="description"
                        rows={5}
                        value={zenodoObject.description}
                        onChange={e => setZenodoObject({ ...zenodoObject, description: e.target.value })}
                        placeholder="Harmonized Drug Dataset (abbreviated as HDD) integrates comprehensive metadata for small‑molecule compounds..."
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg max-w-96 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-center gap-1">
                        <label className="text-bodyMd font-semibold text-gray-600">Resource Type</label>
                        <InfoTooltip text="The type of work being uploaded to Zenodo" />
                    </div>
                    <select
                        className="px-2 py-1.5 rounded-md border-1 border-darkYellow text-bodyLg w-full max-w-96 focus:outline-none bg-white"
                        value={zenodoObject.resource_type}
                        onChange={e => setZenodoObject({ ...zenodoObject, resource_type: e.target.value })}
                    >
                        <option value="dataset">Dataset</option>
                        <option value="model">Model</option>
                        <option value="software">Software</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-center gap-2">
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center gap-1">
                                <label className="text-bodyMd font-semibold text-gray-600">Creators</label>
                                <button
                                    onClick={() => {
                                        setZenodoObject({
                                            ...zenodoObject,
                                            creators: [
                                                ...zenodoObject.creators,
                                                { name: '', type: 'DataCurator', affiliations: [''] }
                                            ]
                                        });
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-5 text-darkBlue cursor-pointer"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                                <label className="text-bodyXs italic text-red-500">
                                    Required (Benjamin Haibe-Kains will be added to the creators as a ContactPerson by
                                    default)
                                </label>
                            </div>
                        </div>
                    </div>
                    {zenodoObject.creators.map((person, index) => (
                        <div key={index} className="flex flex-row items-center gap-2 w-full">
                            <div className="flex flex-row flex-wrap gap-2 flex-1">
                                <div className="flex flex-col">
                                    <label className="text-bodySm font-semibold text-gray-500">Name</label>
                                    <input
                                        type="text"
                                        value={person.name}
                                        onChange={e => {
                                            const creators = [...zenodoObject.creators];
                                            creators[index] = { ...creators[index], name: e.target.value };
                                            setZenodoObject({ ...zenodoObject, creators });
                                        }}
                                        placeholder="Matthew Boccalon"
                                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg w-full max-w-96 focus:outline-none"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-bodySm font-semibold text-gray-500">Type</label>
                                    <select
                                        className="px-2 py-1.5 rounded-md border-1 border-darkYellow text-bodyLg w-full max-w-96 focus:outline-none bg-white"
                                        value={person.type}
                                        onChange={e => {
                                            const creators = [...zenodoObject.creators];
                                            creators[index] = { ...creators[index], type: e.target.value };
                                            setZenodoObject({ ...zenodoObject, creators });
                                        }}
                                    >
                                        <option value="ContactPerson">ContactPerson</option>
                                        <option value="DataCollector">DataCollector</option>
                                        <option value="DataCurator">DataCurator</option>
                                        <option value="DataManager">DataManager</option>
                                        <option value="Distributor">Distributor</option>
                                        <option value="Editor">Editor</option>
                                        <option value="HostingInstitution">HostingInstitution</option>
                                        <option value="Other">Other</option>
                                        <option value="Producer">Producer</option>
                                        <option value="ProjectLeader">ProjectLeader</option>
                                        <option value="ProjectManager">ProjectManager</option>
                                        <option value="ProjectMember">ProjectMember</option>
                                        <option value="RegistrationAgency">RegistrationAgency</option>
                                        <option value="RegistrationAuthority">RegistrationAuthority</option>
                                        <option value="RelatedPerson">RelatedPerson</option>
                                        <option value="Researcher">Researcher</option>
                                        <option value="ResearchGroup">ResearchGroup</option>
                                        <option value="RightsHolder">RightsHolder</option>
                                        <option value="Sponsor">Sponsor</option>
                                        <option value="Supervisor">Supervisor</option>
                                        <option value="WorkPackageLeader">WorkPackageLeader</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-row items-center gap-1">
                                        <label className="text-bodySm font-semibold text-gray-500">Affiliations</label>
                                        <button
                                            onClick={() => {
                                                const creators = [...zenodoObject.creators];
                                                creators[index].affiliations = [
                                                    ...(creators[index].affiliations || []),
                                                    ''
                                                ];
                                                setZenodoObject({ ...zenodoObject, creators });
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="size-4 text-darkBlue cursor-pointer"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 4.5v15m7.5-7.5h-15"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {(person.affiliations || ['']).map((aff, affIndex) => (
                                            <div key={affIndex} className="flex flex-row items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={aff}
                                                    onChange={e => {
                                                        const creators = [...zenodoObject.creators];
                                                        const newAffs = [...creators[index].affiliations];
                                                        newAffs[affIndex] = e.target.value;
                                                        creators[index].affiliations = newAffs;
                                                        setZenodoObject({ ...zenodoObject, creators });
                                                    }}
                                                    placeholder="University Health Network"
                                                    className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg w-full max-w-96 focus:outline-none"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const creators = [...zenodoObject.creators];
                                                        creators[index].affiliations = creators[
                                                            index
                                                        ].affiliations.filter((_, i) => i !== affIndex);
                                                        setZenodoObject({ ...zenodoObject, creators });
                                                    }}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="2"
                                                        stroke="currentColor"
                                                        className="size-4 text-red-500 cursor-pointer hover:text-red-700"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        const creators = zenodoObject.creators.filter((_, i) => i !== index);
                                        setZenodoObject({ ...zenodoObject, creators });
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-5 text-red-500 cursor-pointer hover:text-red-700"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-center gap-2">
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center gap-1">
                                <label className="text-bodyMd font-semibold text-gray-600">Subjects</label>
                                <button
                                    onClick={() => {
                                        setZenodoObject({
                                            ...zenodoObject,
                                            subjects: [...zenodoObject.subjects, '']
                                        });
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-5 text-darkBlue cursor-pointer"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {zenodoObject.subjects.map((subject, index) => (
                        <div key={index} className="flex flex-row items-center gap-2">
                            <input
                                value={subject}
                                onChange={e => {
                                    const subjects = [...zenodoObject.subjects];
                                    subjects[index] = e.target.value;
                                    setZenodoObject({ ...zenodoObject, subjects });
                                }}
                                placeholder="Snakemake, ORCESTRA, Pharmacogenomics"
                                className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg w-full max-w-96 focus:outline-none"
                            />
                            <button
                                onClick={() => {
                                    const subjects = zenodoObject.subjects.filter((_, i) => i !== index);
                                    setZenodoObject({ ...zenodoObject, subjects });
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-5 text-red-500 cursor-pointer hover:text-red-700"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-center gap-2">
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center gap-1">
                                <label className="text-bodyMd font-semibold text-gray-600">References</label>
                                <button
                                    onClick={() => {
                                        setZenodoObject({
                                            ...zenodoObject,
                                            references: [...zenodoObject.references, '']
                                        });
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-5 text-darkBlue cursor-pointer"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {zenodoObject.references.map((ref, index) => (
                        <div key={index} className="flex flex-row items-center gap-2">
                            <textarea
                                value={ref}
                                rows={5}
                                onChange={e => {
                                    const references = [...zenodoObject.references];
                                    references[index] = e.target.value;
                                    setZenodoObject({ ...zenodoObject, references });
                                }}
                                placeholder="BindingDB in 2024: a FAIR knowledgebase of protein-small molecule binding data Nucleic Acids Research 53:D1633-D1644 (2025)"
                                className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg w-full max-w-96 focus:outline-none"
                            />
                            <button
                                onClick={() => {
                                    const references = zenodoObject.references.filter((_, i) => i !== index);
                                    setZenodoObject({ ...zenodoObject, references });
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-5 text-red-500 cursor-pointer hover:text-red-700"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
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
