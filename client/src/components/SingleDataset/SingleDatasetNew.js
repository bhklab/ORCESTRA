import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import DatasetObjectDisplay from '../DatasetObjectDisplay/DatasetObjectDisplay';

const SingleDatasetNew = () => {
    const { datatype, dataset_id } = useParams();
    const [dataset, setDataset] = useState();

    // Share link state
    const [searchParams] = useSearchParams();
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const getDataset = async () => {
            try {
                const shared = searchParams.get('shared');
                const res = await axios.get(`/api/view/single-data-object/${datatype}/${dataset_id}`, {
                    params: shared ? { shared } : {}
                });
                setDataset(res.data);
            } catch (err) {
                setErrorMessage(
                    err?.response?.data?.message ||
                        'Unable to load dataset. It may be private or the share link has expired.'
                );
            }
        };
        getDataset();
    }, [datatype, dataset_id, searchParams]);

    return (
        <div className="flex flex-col m-auto min-h-screen bg-gray-100 py-24">
            {errorMessage && (
                <div className="flex flex-col items-center justify-center py-20 gap-2">
                    <h1 className="text-headingXl font-bold text-lightBlue">Access Restricted</h1>
                    <p className="text-bodyMd text-gray-600">{errorMessage}</p>
                </div>
            )}
            {dataset && <DatasetObjectDisplay dataset={dataset} />}
        </div>
    );
};

export default SingleDatasetNew;
