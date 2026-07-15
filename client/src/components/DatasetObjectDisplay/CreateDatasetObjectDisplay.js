import React, { useEffect, useState, useRef } from 'react';
import { Editor } from 'primereact/editor';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import DatasetObjectDisplay from './DatasetObjectDisplay';
import axios from 'axios';
import datasetNote from '../../../../db/models/dataset-note';

const SectionNameInput = ({ initialName, onNameChange, placeholder }) => {
    const [name, setName] = useState(initialName);
    const [datasetNotes, setDatasetNotes] = useState([]);

    useEffect(() => {
        setName(initialName);
    }, [initialName]);

    useEffect(() => {
        const getDatasetNotes = async () => {
            try {
                const res = await axios.get('/api/view/dataset-notes');
                setDatasetNotes(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getDatasetNotes();
    }, []);

    const selectDatasetNote = datasetNote => {
        console.log(datasetNote);
    };

    return (
        <input
            className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd w-full"
            placeholder={placeholder}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={() => {
                if (name !== initialName) {
                    onNameChange(initialName, name);
                }
            }}
        />
    );
};
const CreateDatasetObjectDisplay = () => {
    const dataSourceSectionIds = useRef(new Map());
    const getDataSourceSectionId = name => {
        if (!dataSourceSectionIds.current.has(name)) {
            dataSourceSectionIds.current.set(name, Math.random().toString());
        }
        return dataSourceSectionIds.current.get(name);
    };

    const releaseNoteSectionIds = useRef(new Map());
    const getReleaseNoteSectionId = name => {
        if (!releaseNoteSectionIds.current.has(name)) {
            releaseNoteSectionIds.current.set(name, Math.random().toString());
        }
        return releaseNoteSectionIds.current.get(name);
    };

    const [datasetTypeOptions, setDatasetTypeOptions] = useState([]);

    useEffect(() => {
        const getDatatypes = async () => {
            try {
                const res = await axios.get('/api/view/statistics');
                const options = res.data
                    .sort((a, b) => a.priority - b.priority)
                    .map(type => ({
                        label: type.name,
                        value: type.path
                    }));
                setDatasetTypeOptions(options);
            } catch (error) {
                console.log('Failed to fetch datatypes:', error);
            }
        };
        getDatatypes();
    }, []);

    const [dataset, setDataset] = useState({
        name: '',
        datasetType: '',
        description: '',
        version: '',
        license: '',
        info: {
            createdBy: '',
            dateCreated: '',
            numDownload: 0,
            other: {
                pipeline: {
                    url: '',
                    commit_id: ''
                },
                additionalRepo: [],
                citations: []
            }
        },
        repositories: {
            version: '',
            doi: '',
            downloadLink: [],
            csvLinks: []
        },
        downloadInfo: {
            doi: '',
            downloadlink: [],
            csvLinks: []
        },
        datasetNote: {
            name: '',
            citations: [],
            disclaimer: 'The annotation data were accessed from ....',
            usagePolicy:
                "The data is provided under <a href='https://creativecommons.org/licenses/by/4.0/' target='_blank'>Creative Commons Attribution 4.0 International License</a>."
        },
        dataSources: {},
        releaseNotes: {}
    });

    const renderPolicyHeader = () => {
        return (
            <div>
                <span className="ql-formats">
                    <button className="ql-bold" aria-label="Bold" />
                    <button className="ql-italic" aria-label="Italic" />
                    <button className="ql-underline" aria-label="Underline" />
                    <button className="ql-link" aria-label="Links" />
                </span>
            </div>
        );
    };

    const updateAdditionalRepo = (index, field, value) => {
        setDataset(prev => ({
            ...prev,
            info: {
                ...prev.info,
                other: {
                    ...prev.info.other,
                    additionalRepo: prev.info.other.additionalRepo.map((repo, i) =>
                        i === index ? { ...repo, [field]: value } : repo
                    )
                }
            }
        }));
    };

    const addAdditionalRepo = () => {
        setDataset(prev => ({
            ...prev,
            info: {
                ...prev.info,
                other: {
                    ...prev.info.other,
                    additionalRepo: [
                        ...prev.info.other.additionalRepo,
                        {
                            git_url: '',
                            commit_id: '',
                            repo_type: ''
                        }
                    ]
                }
            }
        }));
    };

    const removeAdditionalRepo = indexToRemove => {
        setDataset({
            ...dataset,
            info: {
                ...dataset.info,
                other: {
                    ...dataset.info.other,
                    additionalRepo: dataset.info.other.additionalRepo.filter((_, index) => index !== indexToRemove)
                }
            }
        });
    };

    const addDataSourceSection = () => {
        setDataset(prev => {
            let sectionNumber = Object.keys(prev.dataSources).length + 1;
            let sectionName = `RNA, DNA, Methylation, Mutation, CNV, Proteomics, etc.`;
            while (prev.dataSources[sectionName]) {
                sectionNumber++;
                sectionName = `RNA, DNA, Methylation, Mutation, CNV, Proteomics, etc.`;
            }

            return {
                ...prev,
                dataSources: {
                    ...prev.dataSources,
                    [sectionName]: []
                }
            };
        });
    };

    const updateDataSourceSectionName = (oldSectionName, newSectionName) => {
        if (!newSectionName || oldSectionName === newSectionName) {
            return;
        }
        const id = dataSourceSectionIds.current.get(oldSectionName);
        if (id) {
            dataSourceSectionIds.current.delete(oldSectionName);
            dataSourceSectionIds.current.set(newSectionName, id);
        }
        setDataset(prev => {
            if (prev.dataSources[newSectionName]) {
                return prev;
            }

            const updatedDataSources = {};
            for (const key of Object.keys(prev.dataSources)) {
                if (key === oldSectionName) {
                    updatedDataSources[newSectionName] = prev.dataSources[oldSectionName];
                } else {
                    updatedDataSources[key] = prev.dataSources[key];
                }
            }

            return {
                ...prev,
                dataSources: updatedDataSources
            };
        });
    };

    const removeDataSourceSection = sectionName => {
        dataSourceSectionIds.current.delete(sectionName);
        setDataset(prev => {
            const updatedDataSources = { ...prev.dataSources };
            delete updatedDataSources[sectionName];

            return {
                ...prev,
                dataSources: updatedDataSources
            };
        });
    };

    const addDataSourceLink = sectionName => {
        setDataset(prev => {
            if (!prev.dataSources[sectionName]) return prev;
            return {
                ...prev,
                dataSources: {
                    ...prev.dataSources,
                    [sectionName]: [
                        ...prev.dataSources[sectionName],
                        {
                            name: '',
                            description: '',
                            url: '',
                            current: ''
                        }
                    ]
                }
            };
        });
    };

    const updateDataSourceLink = (sectionName, index, field, value) => {
        setDataset(prev => {
            if (!prev.dataSources[sectionName]) return prev;
            return {
                ...prev,
                dataSources: {
                    ...prev.dataSources,
                    [sectionName]: prev.dataSources[sectionName].map((source, i) =>
                        i === index
                            ? {
                                  ...source,
                                  [field]: field === 'current' ? Number(value) || '' : value
                              }
                            : source
                    )
                }
            };
        });
    };

    const removeDataSourceLink = (sectionName, indexToRemove) => {
        setDataset(prev => {
            if (!prev.dataSources[sectionName]) return prev;
            return {
                ...prev,
                dataSources: {
                    ...prev.dataSources,
                    [sectionName]: prev.dataSources[sectionName].filter((_, index) => index !== indexToRemove)
                }
            };
        });
    };

    const addReleaseNoteSection = () => {
        setDataset(prev => {
            let sectionNumber = Object.keys(prev.releaseNotes).length + 1;
            let sectionName = `New Release Note Section ${sectionNumber}`;
            while (prev.releaseNotes[sectionName]) {
                sectionNumber++;
                sectionName = `New Release Note Section ${sectionNumber}`;
            }

            return {
                ...prev,
                releaseNotes: {
                    ...prev.releaseNotes,
                    [sectionName]: []
                }
            };
        });
    };

    const updateReleaseNoteSectionName = (oldSectionName, newSectionName) => {
        if (!newSectionName || oldSectionName === newSectionName) {
            return;
        }
        const id = releaseNoteSectionIds.current.get(oldSectionName);
        if (id) {
            releaseNoteSectionIds.current.delete(oldSectionName);
            releaseNoteSectionIds.current.set(newSectionName, id);
        }
        setDataset(prev => {
            if (prev.releaseNotes[newSectionName]) {
                return prev;
            }

            const updatedReleaseNotes = {};
            for (const key of Object.keys(prev.releaseNotes)) {
                if (key === oldSectionName) {
                    updatedReleaseNotes[newSectionName] = prev.releaseNotes[oldSectionName];
                } else {
                    updatedReleaseNotes[key] = prev.releaseNotes[key];
                }
            }

            return {
                ...prev,
                releaseNotes: updatedReleaseNotes
            };
        });
    };

    const removeReleaseNoteSection = sectionName => {
        releaseNoteSectionIds.current.delete(sectionName);
        setDataset(prev => {
            const updatedReleaseNotes = { ...prev.releaseNotes };
            delete updatedReleaseNotes[sectionName];

            return {
                ...prev,
                releaseNotes: updatedReleaseNotes
            };
        });
    };

    const addReleaseNote = sectionName => {
        setDataset(prev => {
            if (!prev.releaseNotes[sectionName]) return prev;
            return {
                ...prev,
                releaseNotes: {
                    ...prev.releaseNotes,
                    [sectionName]: [
                        ...prev.releaseNotes[sectionName],
                        {
                            current: '',
                            name: ''
                        }
                    ]
                }
            };
        });
    };

    const updateReleaseNote = (sectionName, index, field, value) => {
        setDataset(prev => {
            if (!prev.releaseNotes[sectionName]) return prev;
            return {
                ...prev,
                releaseNotes: {
                    ...prev.releaseNotes,
                    [sectionName]: prev.releaseNotes[sectionName].map((note, i) =>
                        i === index
                            ? {
                                  ...note,
                                  [field]: field === 'current' ? Number(value) || '' : value
                              }
                            : note
                    )
                }
            };
        });
    };

    const removeReleaseNote = (sectionName, indexToRemove) => {
        setDataset(prev => {
            if (!prev.releaseNotes[sectionName]) return prev;
            return {
                ...prev,
                releaseNotes: {
                    ...prev.releaseNotes,
                    [sectionName]: prev.releaseNotes[sectionName].filter((_, index) => index !== indexToRemove)
                }
            };
        });
    };

    const uploadDataset = async () => {
        try {
            const payload = JSON.parse(JSON.stringify(dataset));

            const sanitizeKeys = obj => {
                if (!obj) return {};
                const sanitized = {};
                for (const key of Object.keys(obj)) {
                    // Replace dots to avoid MongoDB "key must not contain '.'" errors
                    const cleanKey = key.replace(/\./g, '_').replace(/^\$/, '_');
                    sanitized[cleanKey] = obj[key];
                }
                return sanitized;
            };

            payload.dataSources = sanitizeKeys(payload.dataSources);
            payload.releaseNotes = sanitizeKeys(payload.releaseNotes);

            await axios.post('/api/dataset-object/submit', payload);
            alert('Dataset successfully uploaded!');
        } catch (error) {
            console.error('Failed to upload dataset:', error);
            alert('Failed to upload dataset. Check the console for details.');
        }
    };

    return (
        <div className="flex flex-col m-auto pt-32">
            <div className="flex flex-col justify-center items-start gap-2 px-24">
                <h1 className="text-heading2Xl text-darkBlue">Dataset Object Creation</h1>
                <div className="flex flex-col gap-2 p-3 rounded-lg shadow-sm border-1 bg-white">
                    <h2 className="text-headingMd text-lightBlue">Header Labels</h2>
                    <div className="flex flex-row justify-center gap-2 w-full">
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-bodyMd text-gray-700">Dataset Object Name</h3>
                            <input
                                className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd"
                                placeholder="Ex. CCLE_2019"
                                type="text"
                                value={dataset.name}
                                onChange={e => setDataset({ ...dataset, name: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-bodyMd text-gray-700">Zenodo Entry DOI</h3>
                            <input
                                className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd"
                                placeholder="Ex. 10.5281/zenodo.18759113"
                                type="text"
                                value={dataset.repositories.doi}
                                onChange={e =>
                                    setDataset({
                                        ...dataset,
                                        repositories: { ...dataset.repositories, doi: e.target.value }
                                    })
                                }
                            />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-bodyMd text-gray-700">Object Download</h3>
                            <input
                                className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd"
                                placeholder="Ex. https://zenodo.org/records/18759113/files/CCLE_PharmacoSet.RDS?download=1"
                                type="text"
                                value={dataset.repositories.downloadLink[0]}
                                onChange={e =>
                                    setDataset({
                                        ...dataset,
                                        repositories: { ...dataset.repositories, downloadLink: [e.target.value] }
                                    })
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-row items-center gap-1">
                                <h3 className="font-semibold text-bodyMd text-gray-700">Csv Downloads</h3>
                                <button
                                    type="button"
                                    className="text-black"
                                    onClick={() =>
                                        setDataset({
                                            ...dataset,
                                            repositories: {
                                                ...dataset.repositories,
                                                csvLinks: [...dataset.repositories.csvLinks, '']
                                            }
                                        })
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        className="size-5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex flex-col gap-2">
                                {dataset.repositories.csvLinks.map((link, index) => (
                                    <div key={index} className="flex flex-row gap-2">
                                        <input
                                            className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd w-full"
                                            placeholder="Ex. https://zenodo.org/records/20019577/files/colData.tsv?download=1"
                                            type="text"
                                            value={link}
                                            onChange={e =>
                                                setDataset({
                                                    ...dataset,
                                                    repositories: {
                                                        ...dataset.repositories,
                                                        csvLinks: dataset.repositories.csvLinks.map((link, ind) =>
                                                            ind === index ? e.target.value : link
                                                        )
                                                    }
                                                })
                                            }
                                        />
                                        <button
                                            type="button"
                                            className="text-black"
                                            onClick={() =>
                                                setDataset({
                                                    ...dataset,
                                                    repositories: {
                                                        ...dataset.repositories,
                                                        csvLinks: dataset.repositories.csvLinks.filter(
                                                            (_, i) => i !== index
                                                        )
                                                    }
                                                })
                                            }
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                className="size-5"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-2 w-full py-10">
                    <div className="flex flex-col gap-2 p-3 rounded-lg shadow-sm border-1 bg-white max-w-[400px] self-start">
                        <h2 className="text-headingMd text-lightBlue">Technical Information</h2>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-bodyMd text-gray-700">Dataset Note</h3>
                            <input
                                className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd"
                                placeholder="Ex. CCLE"
                                type="text"
                                value={dataset.datasetNote.name}
                                onChange={e =>
                                    setDataset({
                                        ...dataset,
                                        datasetNote: { ...dataset.datasetNote, name: e.target.value }
                                    })
                                }
                            />
                            {datasetNote && (
                                <Dropdown
                                    value={dataset.datasetNote}
                                    onChange={e => setDataset({ ...dataset, datasetNote: e.value })}
                                    options={datasetNotes}
                                    optionLabel="name"
                                    editable
                                    placeholder="Select a note"
                                    className="w-full md:w-14rem"
                                />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-bodyMd text-gray-700">Dataset Type</h3>
                            <Dropdown
                                value={dataset.datasetType}
                                options={datasetTypeOptions}
                                onChange={e => setDataset({ ...dataset, datasetType: e.value })}
                                placeholder="Select a Type"
                                className="border-1 border-gray-300 rounded-[4px] h-[36px] text-bodyMd"
                                pt={{
                                    input: { className: 'px-2 py-[0.4rem]' },
                                    trigger: { className: 'w-8' }
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-bodyMd text-gray-700">Description</h3>
                            <Editor
                                pt={{
                                    root: {
                                        className: 'bg-white'
                                    },
                                    toolbar: {
                                        className: 'rounded-t-md'
                                    },
                                    content: {
                                        className: 'rounded-b-md'
                                    }
                                }}
                                headerTemplate={renderPolicyHeader()}
                                value={dataset.description}
                                onTextChange={e =>
                                    setDataset({
                                        ...dataset,
                                        description: e.htmlValue
                                    })
                                }
                            />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-bodyMd text-gray-700">Version</h3>
                            <input
                                className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd"
                                placeholder="Ex. 1.0, 2.0, 2020, v2020, etc"
                                type="text"
                                value={dataset.version}
                                onChange={e => setDataset({ ...dataset, version: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-bodyMd text-gray-700">License</h3>
                            <input
                                className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd"
                                placeholder="Ex. CC BY 4.0"
                                type="text"
                                value={dataset.license}
                                onChange={e => setDataset({ ...dataset, license: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-bodyMd text-gray-700">Author</h3>
                            <input
                                className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd"
                                placeholder="Ex. Benjamin Haibe-Kains Lab"
                                type="text"
                                value={dataset.info.createdBy}
                                onChange={e =>
                                    setDataset({ ...dataset, info: { ...dataset.info, createdBy: e.target.value } })
                                }
                            />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-bodyMd text-gray-700">Date Uploaded</h3>
                            <div className="flex flex-row">
                                <input
                                    className="border-1 border-gray-300 rounded-l-[4px] h-[36px] px-2 text-bodyMd w-full hover:cursor-not-allowed"
                                    type="text"
                                    value={dataset.info.dateCreated}
                                    disabled={true}
                                />
                                <Calendar
                                    icon={
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="size-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                                            />
                                        </svg>
                                    }
                                    inputClassName="hidden"
                                    showIcon
                                    className="h-[36px]"
                                    dateFormat="yyyy-mm-dd"
                                    onChange={e =>
                                        setDataset({
                                            ...dataset,
                                            info: {
                                                ...dataset.info,
                                                dateCreated: `${e.value.getFullYear()}-${String(
                                                    e.value.getMonth() + 1
                                                ).padStart(2, '0')}-${String(e.value.getDate()).padStart(2, '0')}`
                                            }
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-bodyMd text-gray-700">Github Repository URL</h3>
                            <input
                                className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd"
                                placeholder="Ex. https://github.com/bhklab/hdd-data-pipeline"
                                type="text"
                                value={dataset.info.other.pipeline.url}
                                onChange={e =>
                                    setDataset({
                                        ...dataset,
                                        info: {
                                            ...dataset.info,
                                            other: {
                                                ...dataset.info.other,
                                                pipeline: { ...dataset.info.other.pipeline, url: e.target.value }
                                            }
                                        }
                                    })
                                }
                            />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-bodyMd text-gray-700">Github Repository Commit Id</h3>
                            <input
                                className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd"
                                placeholder="Ex. 30fb2499926e2b475715f8415bb1123be75360b9"
                                type="text"
                                value={dataset.info.other.pipeline.commit_id}
                                onChange={e =>
                                    setDataset({
                                        ...dataset,
                                        info: {
                                            ...dataset.info,
                                            other: {
                                                ...dataset.info.other,
                                                pipeline: {
                                                    ...dataset.info.other.pipeline,
                                                    commit_id: e.target.value
                                                }
                                            }
                                        }
                                    })
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <h3 className="font-semibold text-bodyMd text-gray-700">
                                Additional Repositories (Optional)
                            </h3>
                            {dataset.info.other.additionalRepo.map((repo, index) => (
                                <div key={index} className="flex flex-col gap-2">
                                    <div className="flex flex-col w-full">
                                        <h4 className="text-headingSm text-gray-600">Repository URL</h4>
                                        <div className="flex flex-row gap-2">
                                            <input
                                                className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd w-full"
                                                placeholder="Ex. https://github.com/bhklab/hdd-data-pipeline"
                                                type="text"
                                                value={repo.git_url}
                                                onChange={e => updateAdditionalRepo(index, 'git_url', e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="text-lightBlue"
                                                onClick={() => removeAdditionalRepo(index)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="size-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <h4 className="text-headingSm text-gray-600">Repository Commit Id</h4>
                                        <input
                                            className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd"
                                            placeholder="Ex. 30fb2499926e2b475715f8415bb1123be75360b9"
                                            type="text"
                                            value={repo.commit_id}
                                            onChange={e => updateAdditionalRepo(index, 'commit_id', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <h4 className="text-headingSm text-gray-600">Repository Type</h4>
                                        <input
                                            className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd"
                                            placeholder="Ex. Annotations, Pre processing, etc"
                                            type="text"
                                            value={repo.repo_type}
                                            onChange={e => updateAdditionalRepo(index, 'repo_type', e.target.value)}
                                        />
                                    </div>
                                    {index !== dataset.info.other.additionalRepo.length - 1 && (
                                        <div className="flex justify-center mt-4">
                                            <div className="h-[1px] w-1/2 bg-lightBlue opacity-30" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            <button className="text-lightBlue" onClick={addAdditionalRepo}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    className="size-6"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col rounded-b-lg">
                            <h3 className="font-semibold text-bodyMd text-gray-700">Usage Policy</h3>
                            <Editor
                                pt={{
                                    root: {
                                        className: 'bg-white'
                                    },
                                    toolbar: {
                                        className: 'rounded-t-md'
                                    },
                                    content: {
                                        className: 'rounded-b-md'
                                    }
                                }}
                                headerTemplate={renderPolicyHeader()}
                                value={dataset.datasetNote.usagePolicy}
                                onTextChange={e =>
                                    setDataset({
                                        ...dataset,
                                        datasetNote: { ...dataset.datasetNote, usagePolicy: e.htmlValue }
                                    })
                                }
                            />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-bodyMd text-gray-700">Disclaimer</h3>
                            <Editor
                                pt={{
                                    root: {
                                        className: 'bg-white'
                                    },
                                    toolbar: {
                                        className: 'rounded-t-md'
                                    },
                                    content: {
                                        className: 'rounded-b-md'
                                    }
                                }}
                                headerTemplate={renderPolicyHeader()}
                                value={dataset.datasetNote.disclaimer}
                                onTextChange={e =>
                                    setDataset({
                                        ...dataset,
                                        datasetNote: { ...dataset.datasetNote, disclaimer: e.htmlValue }
                                    })
                                }
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center gap-1">
                                <h3 className="font-semibold text-bodyMd text-gray-700">Citations</h3>

                                <button
                                    type="button"
                                    className="text-black"
                                    onClick={() =>
                                        setDataset({
                                            ...dataset,
                                            datasetNote: {
                                                ...dataset.datasetNote,
                                                citations: [...dataset.datasetNote.citations, '']
                                            }
                                        })
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        className="size-5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {dataset.datasetNote.citations.map((citation, ind) => (
                                    <div key={ind} className="flex flex-col gap-4">
                                        <div className="flex flex-row gap-2">
                                            <input
                                                className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd w-full"
                                                placeholder="Ex. Citation text"
                                                type="text"
                                                value={citation}
                                                onChange={e =>
                                                    setDataset({
                                                        ...dataset,
                                                        datasetNote: {
                                                            ...dataset.datasetNote,
                                                            citations: dataset.datasetNote.citations.map((cite, idx) =>
                                                                idx === ind ? e.target.value : cite
                                                            )
                                                        }
                                                    })
                                                }
                                            />

                                            <button
                                                type="button"
                                                className="text-lightBlue"
                                                onClick={() =>
                                                    setDataset({
                                                        ...dataset,
                                                        datasetNote: {
                                                            ...dataset.datasetNote,
                                                            citations: dataset.datasetNote.citations.filter(
                                                                (_, idx) => idx !== ind
                                                            )
                                                        }
                                                    })
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="size-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 p-3 rounded-lg w-full">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-row items-center gap-2">
                                <h2 className="text-headingMd text-lightBlue">Data</h2>
                                <button className="text-lightBlue" onClick={addDataSourceSection}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        className="size-6"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {Object.entries(dataset.dataSources).map(([sectionName, sources]) => (
                                <div key={getDataSourceSectionId(sectionName)} className="flex flex-col gap-2">
                                    <div className="flex flex-row gap-2">
                                        <SectionNameInput
                                            initialName={sectionName}
                                            onNameChange={updateDataSourceSectionName}
                                            placeholder="Ex. RNA, DNA, etc"
                                        />
                                        <button
                                            type="button"
                                            className="text-lightBlue"
                                            onClick={() => removeDataSourceSection(sectionName)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="size-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    {sources.map((source, index) => (
                                        <div key={index} className="flex flex-col gap-2 p-4 bg-white border rounded">
                                            <p className="font-headingS text-darkYellow">
                                                {sectionName} Link {index + 1}
                                            </p>
                                            <div className="flex flex-row gap-2">
                                                <input
                                                    className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd w-full"
                                                    placeholder="Link Name (Ex. rnaseq)"
                                                    type="text"
                                                    value={source.name}
                                                    onChange={e =>
                                                        updateDataSourceLink(sectionName, index, 'name', e.target.value)
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="text-lightBlue"
                                                    onClick={() => removeDataSourceLink(sectionName, index)}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                            <input
                                                className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd"
                                                placeholder="Description of link contents"
                                                type="text"
                                                value={source.description}
                                                onChange={e =>
                                                    updateDataSourceLink(
                                                        sectionName,
                                                        index,
                                                        'description',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <input
                                                className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd"
                                                placeholder="Raw data source link (Ex. https://lincsportal.ccs.miami.edu/signatures/datasets/LDG-1188)"
                                                type="text"
                                                value={source.url}
                                                onChange={e =>
                                                    updateDataSourceLink(sectionName, index, 'url', e.target.value)
                                                }
                                            />
                                            {/* <input
                                                className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd"
                                                placeholder="Ex. 462"
                                                value={source.current}
                                                onChange={e =>
                                                    updateDataSourceLink(sectionName, index, 'current', e.target.value)
                                                }
                                            /> */}
                                        </div>
                                    ))}

                                    <button className="text-lightBlue" onClick={() => addDataSourceLink(sectionName)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            className="size-6"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex flex-row items-center gap-2">
                                <h2 className="text-headingMd text-lightBlue">Release Notes</h2>
                                <button className="text-lightBlue" onClick={addReleaseNoteSection}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        className="size-6"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {Object.entries(dataset.releaseNotes).map(([sectionName, notes]) => (
                                <div key={getReleaseNoteSectionId(sectionName)} className="flex flex-col gap-2">
                                    <div className="flex flex-row gap-2">
                                        <SectionNameInput
                                            initialName={sectionName}
                                            onNameChange={updateReleaseNoteSectionName}
                                            placeholder="Ex. Molecular Data, Drugs, etc"
                                        />
                                        <button
                                            type="button"
                                            className="text-lightBlue"
                                            onClick={() => removeReleaseNoteSection(sectionName)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="size-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    {notes.map((note, index) => (
                                        <div key={index} className="flex flex-col gap-2 p-4 bg-white border rounded">
                                            <p className="font-headingS text-darkYellow">
                                                {sectionName} Link {index + 1}
                                            </p>
                                            <div className="flex flex-row gap-2">
                                                <input
                                                    className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd w-full"
                                                    placeholder="Ex. RNA-seq"
                                                    type="text"
                                                    value={note.name}
                                                    onChange={e =>
                                                        updateReleaseNote(sectionName, index, 'name', e.target.value)
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="text-lightBlue"
                                                    onClick={() => removeReleaseNote(sectionName, index)}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                            <input
                                                className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd"
                                                placeholder="Ex. 462"
                                                value={note.current}
                                                onChange={e =>
                                                    updateReleaseNote(sectionName, index, 'current', e.target.value)
                                                }
                                            />
                                        </div>
                                    ))}

                                    <button className="text-lightBlue" onClick={() => addReleaseNote(sectionName)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            className="size-6"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* <div className="flex flex-col gap-2 p-3 rounded-lg shadow-sm border-1 bg-white w-full mt-4">
                    <h2 className="text-headingMd text-lightBlue">Raw JSON</h2>
                    <p className="text-sm text-gray-500">You can copy and paste JSON here. Click outside the text area to apply your changes.</p>
                    <textarea
                        className="w-full h-96 p-2 border border-gray-300 rounded font-mono text-sm bg-gray-50"
                        defaultValue={JSON.stringify(dataset, null, 2)}
                        key={JSON.stringify(dataset)}
                        onBlur={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                setDataset(parsed);
                            } catch (err) {
                                alert("Invalid JSON format. Please check your syntax.");
                            }
                        }}
                    />
                </div> */}
            </div>

            <div className="flex flex-col m-auto min-h-screen bg-gray-100 w-full">
                <DatasetObjectDisplay dataset={dataset} />
            </div>
        </div>
    );
};
export default CreateDatasetObjectDisplay;
