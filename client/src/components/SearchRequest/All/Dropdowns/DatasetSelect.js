import React, { useEffect, useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';

export const DatasetSelect = ({ datasetNotes, filteredNotes, setFilteredNotes }) => {
    return (
        <div className="flex justify-start items-start w-1/4 smd:w-full">
            <MultiSelect
                value={filteredNotes}
                options={datasetNotes}
                onChange={e => setFilteredNotes(e.value)}
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
