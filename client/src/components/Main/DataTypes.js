import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathContext } from '../../hooks/Context';
import axios from 'axios';

const DataTypes = () => {
    const path = useContext(PathContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const getStats = async () => {
            const res = await axios.get('/api/view/statistics');
            setStats([...res.data].sort((a, b) => a.priority - b.priority));
            console.log(res.data);
        };
        getStats();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center gap-10 mx-auto max-w-[1300px] bg-gray-50 py-40">
            <div className="flex flex-row flex-wrap gap-4 justify-center">
                {stats &&
                    stats.map(type => (
                        <div
                            onClick={() => navigate(`/datatypes/${type.path}`)}
                            className="group w-[380px] h-[300px] flex flex-col rounded-3xl drop-shadow-md bg-white transition-all duration-700 overflow-hidden hover:cursor-pointer"
                        >
                            <div className="w-full h-[175px] rounded-t-3xl flex flex-col justify-center items-center overflow-hidden">
                                <img src={`/images/datatype-icons/${type.img}`} />
                            </div>
                            <div className="flex flex-col p-3 gap-2 h-full">
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-headingXl font-semibold text-lightBlue">{type.name}</h2>
                                    <div className="flex flex-row flex-wrap gap-2">
                                        {type.dataSources.map(field => (
                                            <div
                                                key={field}
                                                className="flex flex-row bg-lightBlue px-2 py-1 rounded-lg"
                                            >
                                                <span className="text-bodySm font-bold text-white">{field}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {type.datasetCount && type.canonicalCount && (
                                        <div className="flex flex-row flex-wrap gap-2">
                                            <div className="flex flex-row bg-lightYellow bg-opacity-60 px-2 py-1 rounded-lg">
                                                <span className="text-bodySm text-darkBlue font-bold">
                                                    Datasets: {type.datasetCount}
                                                </span>
                                            </div>
                                            <div className="flex flex-row bg-lightYellow bg-opacity-60 px-2 py-1 rounded-lg">
                                                <span className="text-bodySm text-darkBlue font-bold">
                                                    Canonical Datasets: {type.canonicalCount}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <p className="text-bodyMd text-gray-600 italic opacity-0 h-0 group-hover:opacity-100 group-hover:h-20 transition-all duration-700 overflow-y-auto custom-scrollbar expandable-text">
                                    {type.description}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default DataTypes;
