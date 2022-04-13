import React, {useState, useEffect, useContext} from 'react';
import SearchReqContext from '../SearchReqContext';
import axios from 'axios';
import {Filter} from '../SearchReqStyle';
import FilterInputSwitch from '../../Shared/FilterInputSwitch';
import CustomSelect from '../../Shared/CustomSelect';
import {dataTypes} from '../../Shared/Enums';

const XevaSetFilter = () => {
    const context = useContext(SearchReqContext);

    const [datasetSelect, setDatasetSelect] = useState({selected: [], options: [], hidden: false});
    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        const initialize = async () => {
            const res = await axios.get('/api/view/data-object-filter', {params: {datasetType: dataTypes.xenographic}});
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
                <h2>XevaSet Parameters</h2>
                <FilterInputSwitch 
                    label='Request XevaSet:'
                    checked={context.isRequest}
                    tooltip='Currently unavailable'
                    onChange={(e) => {}}
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

export default XevaSetFilter;