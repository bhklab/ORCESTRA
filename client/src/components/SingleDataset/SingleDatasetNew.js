import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatasetObjectDisplay from '../DatasetObjectDisplay/DatasetObjectDisplay';

const SingleDatasetNew = () => {
    const { datatype, dataset_id } = useParams();
    const [dataset, setDataset] = useState();

    useEffect(() => {
        const getDataset = async () => {
            const res = await axios.get(`/api/view/single-data-object/${datatype}/${dataset_id}`);
            setDataset(res.data);
        };
        getDataset();
    }, []);

    return (
        <div className="flex flex-col m-auto min-h-screen bg-gray-100">
            {dataset && <DatasetObjectDisplay dataset={dataset} />}
        </div>
    );
};

export default SingleDatasetNew;
