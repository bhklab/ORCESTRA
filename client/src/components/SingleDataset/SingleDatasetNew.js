import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { dataTypes } from '../SearchRequest/All/dictionaries/dataTypes';

const SingleDatasetNew = () => {
    const location = useLocation();
    const { datatype, dataset_id } = useParams();
    const [datasetData, setDatasetData] = useState(null);

    useEffect(() => {
        const getDataset = async () => {
            const res = await axios.get(`/api/view/single-data-object/${datatype}/${dataset_id}`);
            setDatasetData(res.data);
        };
        getDataset();
    }, []);

    const colour = ['red', 'blue', 'green', 'purple', 'orange', 'cyan'];

    return (
        <div className="flex flex-col m-auto min-h-screen">
            {datasetData && (
                <div className="flex py-4 px-24 flex-col bg-lightBlue gap-4">
                    <div className="flex flex-row gap-8 items-center">
                        <h1 className="font-bold text-heading4Xl text-darkYellow">{datasetData.name}</h1>
                        <div>
                            <a
                                href={datasetData.repositories.downloadLink[0]}
                                target="_blank"
                                className="flex flex-row items-center gap-2 border-1 px-3 py-1.5 rounded-md font-bold bg-white text-darkBlue hover:-translate-y-1 hover:space-y-1 duration-300 ease-in-out"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 26 26"
                                    stroke-width="2.5"
                                    stroke="currentColor"
                                    class="size-5"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                                    />
                                </svg>
                                Download Dataset
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2">
                        {datasetData?.dataSources &&
                            Object.keys(datasetData?.dataSources).map((categoryName, ind) => (
                                <div
                                    className={`flex px-3 py-2 bg-opacity-65 rounded-full bg-${colour[ind % 6]}-600 hover:-translate-y-1 hover:cursor-pointer duration-300 ease-in-out transition`}
                                    key={ind}
                                >
                                    <h4 className="text-white text-headingSm">{categoryName}</h4>
                                </div>
                            ))}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row items-center gap-1 text-white">
                            <h2 className="text-headingMd text-lightYellow">Author:</h2>
                            <span className="text-headingSm">{datasetData.info.createdBy}</span>
                        </div>
                        <div className="flex flex-row items-center gap-1 text-white">
                            <h2 className="text-headingMd text-lightYellow">Curation Date:</h2>{' '}
                            <span className="text-headingSm">{datasetData.info.dateCreated.slice(0, 10)}</span>
                        </div>
                        <div className="flex flex-row items-center gap-1 text-white">
                            <h2 className="text-headingMd text-lightYellow">Total Downloads:</h2>{' '}
                            <span className="text-headingSm">{datasetData.info.numDownload}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SingleDatasetNew;
