import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathContext } from '../../hooks/Context';

const DataTypes = () => {
    const path = useContext(PathContext);

    const data = [
        {
            name: 'Pharmacogenomics',
            fieldTotals: ['Datasets: 33', 'Canonical: 16', 'TCL Cell Lines: 39'],
            contains: ['rnaseq', 'cnv', 'mutation', 'methylation'],
            description:
                "Data focused with how an individual's genetic attributes affect the likely response to therapeutic drugs.",
            img: 'pharmacogenomics.png'
        },
        {
            name: 'Toxicogenomics',
            fieldTotals: ['Datasets: 4', 'Canonical: 4'],
            contains: ['microarray', 'drug response'],
            description:
                "Data focused with how the genome is involved in the body's response to environmental stressors and toxicants.",
            img: 'toxicogenomics.png'
        },
        {
            name: 'Clinical Genomics',
            fieldTotals: ['Datasets: 23', 'Canonical: 23'],
            contains: ['rnaseq', 'microarray'],
            description:
                "Data focused with how an individual's genetic attributes affect the likely response to therapeutic drugs.",
            img: 'pharmacogenomics.png'
        },
        {
            name: 'Radiomics',
            fieldTotals: ['Datasets: 3', 'Canonical: 3'],
            contains: ['CT imaging'],
            description:
                "Data focused on how the genome is involved in the body's response to environmental stressors and toxicants.",
            img: 'toxicogenomics.png'
        },
        {
            name: 'Xenographic Pharmacogenomics',
            fieldTotals: ['Datasets: 33', 'Canonical: 16', 'TCL Cell Lines: 39'],
            contains: ['rnaseq', 'cnv', 'mutation', 'methylation'],
            description:
                "Data focused with how an individual's genetic attributes affect the likely response to therapeutic drugs.",
            img: 'pharmacogenomics.png'
        },
        {
            name: 'Radiogenomics',
            fieldTotals: ['Datasets: 4', 'Canonical: 4'],
            contains: ['microarray', 'drug response'],
            description:
                "Data focused on how the genome is involved in the body's response to environmental stressors and toxicants.",
            img: 'toxicogenomics.png'
        },
        {
            name: 'Immune Checkpoint Blockade',
            fieldTotals: ['Datasets: 23', 'Canonical: 23'],
            contains: ['rnaseq', 'microarray'],
            description:
                "Data focused with how an individual's genetic attributes affect the likely response to therapeutic drugs.",
            img: 'pharmacogenomics.png'
        }
    ];

    useEffect(() => {
        path.setDatatype('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center gap-10 mb-10 mt-16 px-60 lg:px-20 smd:px-4 bg-gray-50">
            <div className="flex flex-row flex-wrap gap-4 justify-center">
                {data.map(type => (
                    // Or this one<div className="group w-[300px] hover:h-[400px] flex flex-col rounded-3xl drop-shadow-md bg-white transition-all duration-700 overflow-hidden">
                    <div className="group w-[300px] h-[320px] flex flex-col rounded-3xl drop-shadow-md bg-white transition-all duration-700 overflow-hidden hover:cursor-pointer">
                        <div className="w-full h-[150px] rounded-t-3xl flex flex-col justify-center items-center overflow-hidden">
                            <img src={`/images/new-icons/${type.img}`} />
                        </div>
                        <div className="flex flex-col p-3">
                            <div className="flex flex-col min-h-[170px] gap-2">
                                <h2 className="text-headingXl font-semibold text-lightBlue">{type.name}</h2>

                                <div className="flex flex-row flex-wrap gap-2">
                                    {type.contains.map(field => (
                                        <div key={field} className="flex flex-row bg-lightBlue px-2 py-1 rounded-lg">
                                            <span className="text-bodySm font-bold text-white">{field}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-row flex-wrap gap-2">
                                    {type.fieldTotals.map(field => (
                                        <div
                                            key={field}
                                            className="flex flex-row bg-lightYellow bg-opacity-60 px-2 py-1 rounded-lg"
                                        >
                                            <span className="text-bodySm text-darkBlue font-bold">{field}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <p className="text-bodySm text-gray-700 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-32 transition-all duration-700 overflow-hidden">
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
