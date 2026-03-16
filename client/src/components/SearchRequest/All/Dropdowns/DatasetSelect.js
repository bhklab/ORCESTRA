import React, { useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';

export const DatasetSelect = ({ datasets }) => {
    const [selectedCities, setSelectedCities] = useState(null);
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
    return (
        <div className="flex justify-start items-start w-1/4 smd:w-full">
            <MultiSelect
                value={selectedCities}
                onChange={e => setSelectedCities(e.value)}
                options={cities}
                optionLabel="name"
                filterDelay={400}
                placeholder="Select Dataset(s)"
                className="w-full md:w-20rem"
                maxSelectedLabels={5}
                filter
            />
        </div>
    );
};
