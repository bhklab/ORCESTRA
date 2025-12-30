import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../hooks/Context';
import SaveDatasetButton from '../../Shared/Buttons/SaveDatasetButton';
// import { dataTypes } from '../../Shared/Enums';
import { dataTypes } from './dictionaries/dataTypes';
import { DatasetSelect } from './Dropdowns/DatasetSelect';

// PrimeReact Imports
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const SetSearch = () => {
    const auth = useContext(AuthContext);
    const { datatype } = useParams();

    const [datasets, setDatasets] = useState([]);
    const [selectedDatasets, setSelectedDatasets] = useState([]);

    const products = [
        {
            id: '1000',
            code: 'f230fh0g3',
            name: 'Bamboo Watch',
            description: 'Product Description',
            image: 'bamboo-watch.jpg',
            price: 65,
            category: 'Accessories',
            quantity: 24,
            inventoryStatus: 'INSTOCK',
            rating: 5
        },
        {
            id: '1001',
            code: 'nvklal433',
            name: 'Black Watch',
            description: 'Product Description',
            image: 'black-watch.jpg',
            price: 72,
            category: 'Accessories',
            quantity: 61,
            inventoryStatus: 'INSTOCK',
            rating: 4
        },
        {
            id: '1002',
            code: 'zz21cz3c1',
            name: 'Blue Band',
            description: 'Product Description',
            image: 'blue-band.jpg',
            price: 79,
            category: 'Fitness',
            quantity: 2,
            inventoryStatus: 'LOWSTOCK',
            rating: 3
        },
        {
            id: '1003',
            code: '244wgerg2',
            name: 'Blue T-Shirt',
            description: 'Product Description',
            image: 'blue-t-shirt.jpg',
            price: 29,
            category: 'Clothing',
            quantity: 25,
            inventoryStatus: 'INSTOCK',
            rating: 5
        },
        {
            id: '1004',
            code: 'h456wer53',
            name: 'Bracelet',
            description: 'Product Description',
            image: 'bracelet.jpg',
            price: 15,
            category: 'Accessories',
            quantity: 73,
            inventoryStatus: 'INSTOCK',
            rating: 4
        }
    ];

    useEffect(() => {
        const initialize = async () => {
            const res = await axios.get(`/api/view/data-object-filter/${datatype}`);
        };
        initialize();
    }, []);

    return (
        <div className="flex flex-col p-10 z-10 items-center min-h-screen">
            <div className="flex flex-col gap-8 bg-white border-1 drop-shadow-sm rounded-lg p-10">
                <div>
                    <h2 className="text-headingXl font-bold text-lightBlue">
                        Explore multimodal {dataTypes[datatype].heading}
                    </h2>
                    <div className="flex flex-col">
                        {auth.user ? (
                            <SaveDatasetButton
                                selectedDatasets={selectedDatasets}
                                disabled={selectedDatasets.length > 0 ? false : true}
                                // onSaveComplete={showMessage}
                            />
                        ) : (
                            <p className="text-bodyXs text-red-600">
                                Login or register to save existing {datatype} to your profile.
                            </p>
                        )}
                    </div>
                </div>
                <DatasetSelect />
                <DataTable
                    value={products}
                    tableStyle={{ minWidth: '50rem' }}
                    size="small"
                    showGridlines={true}
                    stripedRows
                >
                    <Column field="code" header="Code"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="category" header="Category"></Column>
                    <Column field="quantity" header="Quantity"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default SetSearch;
