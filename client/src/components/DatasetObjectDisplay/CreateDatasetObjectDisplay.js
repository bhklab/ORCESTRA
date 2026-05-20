import React, { useEffect, useState } from 'react';
import { Editor } from 'primereact/editor';
import { Calendar } from 'primereact/calendar';
import DatasetObjectDisplay from './DatasetObjectDisplay';

const CreateDatasetObjectDisplay = () => {
    const [dataset, setDataset] = useState({
        name: '',
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
            citation: [],
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

    // useEffect(() => {
    //     console.log(dataset);
    // }, [dataset]);

    return (
        <div className="flex flex-col m-auto pt-32">
            <div className="flex flex-col justify-center items-center gap-2 px-4">
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
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-bodyMd text-gray-700">Csv Downloads</h3>
                            <input
                                className="border-1 border-gray-300 rounded-[4px] h-[36px] px-2 text-bodyMd"
                                placeholder="Ex. https://zenodo.org/records/20019577/files/colData.tsv?download=1"
                                type="text"
                                value={dataset.repositories.csvLinks[0]}
                                onChange={e =>
                                    setDataset({
                                        ...dataset,
                                        repositories: { ...dataset.repositories, csvLinks: [e.target.value] }
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-col justify-center gap-2 p-3 rounded-lg shadow-sm border-1 bg-white max-w-[400px]">
                        <h2 className="text-headingMd text-lightBlue">Technical Information</h2>
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
                                onChange={e =>
                                    setDataset({ ...dataset, info: { ...dataset.info, createdBy: e.target.value } })
                                }
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
                                                dateCreated: `${e.value.getFullYear()}-${String(e.value.getMonth() + 1).padStart(2, '0')}-${String(e.value.getDate()).padStart(2, '0')}`
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
                            <button
                                className="text-lightBlue"
                                onClick={() =>
                                    setDataset({
                                        ...dataset,
                                        info: {
                                            ...dataset.info,
                                            other: {
                                                ...dataset.info.other,
                                                additionalRepo: [
                                                    ...dataset.info.other.additionalRepo,
                                                    { git_url: '', commit_id: '', repo_type: '' }
                                                ]
                                            }
                                        }
                                    })
                                }
                            >
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
                    </div>
                    <div className="flex flex-col justify-center gap-2 p-3 rounded-lg shadow-sm border-1 bg-white">
                        <h2 className="text-headingMd text-lightBlue">Data</h2>
                        <div className="flex flex-col"></div>

                        <h2 className="text-headingMd text-lightBlue">Release Notes</h2>
                    </div>
                </div>
            </div>

            <div className="flex flex-col m-auto min-h-screen bg-gray-100 w-full">
                <DatasetObjectDisplay dataset={dataset} />
            </div>
        </div>
    );
};
export default CreateDatasetObjectDisplay;
