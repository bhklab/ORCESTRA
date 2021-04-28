import React, {useState, useEffect, useContext} from 'react';
import SearchReqContext from '../SearchReqContext';

import {Filter} from '../SearchReqStyle';
import FilterInputSwitch from '../../Shared/FilterInputSwitch';
import FilterDropdown from '../../Shared/FilterDropdown';
import {dataTypes} from '../../Shared/Enums';

const RadioSetFilter = () => {
    const context = useContext(SearchReqContext);
    
    const [datasetSelect, setDatasetSelect] = useState({selected: [], options: [], hidden: false});
    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        const initialize = async () => {
            const res = await fetch(`/api/${dataTypes.radiogenomics}/formData`);
            const form = await res.json();
            setDatasetSelect({...datasetSelect, options: form.dataset});
            setReady(true);
        }
        initialize();
    }, []);
    
    return(
        <React.Fragment>
        {
            ready&&
            <Filter>
                <h2>RadioSet Parameters</h2>
                <FilterInputSwitch 
                    label='Request RadioSet:'
                    checked={context.isRequest}
                    tooltip='Currently unavailable'
                    disabled={true}
                />
                <FilterDropdown 
                    id='dataset' 
                    hidden={false} 
                    label='Dataset:' 
                    selectOne={context.isRequest}  
                    options={datasetSelect.options} 
                    selected={datasetSelect.selected} 
                    onChange={(e) => {
                        setDatasetSelect({...datasetSelect, selected: e.value}); 
                        context.setParameters(prev => ({...prev, dataset: e.value, search: true}));
                    }} 
                />
            </Filter>
        }   
        </React.Fragment>
    );
}

export default RadioSetFilter;