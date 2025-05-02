import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathContext } from '../../hooks/Context';

const DataTypes = () => {
    const path = useContext(PathContext);

    const data = [
        {
            name: 'Pharmacogenomics',
            fieldTotals: ['Datasets: 33', 'Canonical: 16', 'TCL Cell Lines: 39'],
            contains: ['rna-seq', 'cnv', 'mutation', 'methylation'],
            description:
                "Data focused with how an individual's genetic attributes affect the likely response to therapeutic drugs.",
            img: 'pharmacogenomics.png'
        },
        {
            name: 'Toxicogenomics',
            fieldTotals: ['Datasets: 4', 'Canonical: 4'],
            contains: ['microarray', 'drug response'],
            description:
                "Data focused with how the genome is involved in the body's response to environmental stressors and toxicant",
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
                "Data focused on how the genome is involved in the body's response to environmental stressors and toxicant",
            img: 'toxicogenomics.png'
        },
        {
            name: 'Pharmacogenomics',
            fieldTotals: ['Datasets: 33', 'Canonical: 16', 'TCL Cell Lines: 39'],
            contains: ['rna-seq', 'cnv', 'mutation', 'methylation'],
            description:
                "Data focused with how an individual's genetic attributes affect the likely response to therapeutic drugs.",
            img: 'pharmacogenomics.png'
        },
        {
            name: 'Toxicogenomics',
            fieldTotals: ['Datasets: 4', 'Canonical: 4'],
            contains: ['microarray', 'drug response'],
            description:
                "Data focused on how the genome is involved in the body's response to environmental stressors and toxicant",
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
                "Data focused on how the genome is involved in the body's response to environmental stressors and toxicant",
            img: 'toxicogenomics.png'
        }
    ];

    useEffect(() => {
        path.setDatatype('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className="min-h-screen flex flex-col margin-auto justify-center items-center gap-10 px-60 lg:px-36 smd:px-4 bg-gray-50"
            id="landing"
        >
            <div className="flex flex-row flex-wrap gap-4 justify-center">
                {data.map(type => (
                    <div className="w-[300px] h-[300px] flex flex-col rounded-3xl drop-shadow-md bg-white">
                        <div className="w-full h-[100px] rounded-t-3xl flex flex-col justify-center items-center overflow-hidden">
                            <img src={`/images/new-icons/${type.img}`} />
                        </div>
                        <div className="flex flex-col gap-2 p-3">
                            <h2 className="text-headingXl font-semibold text-lightBlue">{type.name}</h2>
                            <div className="flex flex-row flex-wrap gap-2">
                                {type.fieldTotals.map(field => (
                                    <div className="flex flex-row bg-lightYellow bg-opacity-60 px-2 py-1 rounded-lg">
                                        <span className="text-bodyMd text-darkBlue">{field}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-row flex-wrap gap-2">
                                {type.contains.map(field => (
                                    <div className="flex flex-row bg-lightBlue px-2 py-1 rounded-lg">
                                        <span className="text-bodyMd text-white">{field}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DataTypes;
