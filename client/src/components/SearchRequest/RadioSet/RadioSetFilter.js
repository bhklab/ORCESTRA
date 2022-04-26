import React, {useState, useEffect, useContext} from 'react';
import SearchReqContext from '../SearchReqContext';
import axios from 'axios';
import {Filter} from '../SearchReqStyle';
import FilterInputSwitch from '../../Shared/FilterInputSwitch';
import CustomSelect from '../../Shared/CustomSelect';
import {dataTypes} from '../../Shared/Enums';

const RadioSetFilter = () => {
    const context = useContext(SearchReqContext);
    
    const [datasetSelect, setDatasetSelect] = useState({selected: [], options: [], hidden: false});
    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        const initialize = async () => {
            const res = await axios.get('/api/view/data-object-filter', {params: {datasetType: dataTypes.radiogenomics}});
            setDatasetSelect({...datasetSelect, options: res.data.dataset});
            setReady(true);
        }
        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <CustomSelect 
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