import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { AuthContext } from '../../../hooks/Context';

import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';

const SetSearch = () => {
    const auth = useContext(AuthContext);

    const [datasets, setDatasets] = useState([]);
    const [selectedDatasets, setSelectedDatasets] = useState([]);

    const { datatype } = useParams();

    useEffect(() => {
        const initialize = async () => {
            const res = await axios.get(`/api/view/search/${datatype}`);
            console.log(res.data);
            setDatasets(res.data);
        };
        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen px-32 py-10">
            <MultiSelect />
            <DataTable value={datasets} tableStyle={{ minWidth: '50rem' }}>
                <Column field="name" header="Name"></Column>
                <Column field="description" header="Description"></Column>
            </DataTable>
        </div>
    );
};

export default SetSearch;
