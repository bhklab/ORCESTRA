import React, {useState, useEffect, useContext, useRef} from 'react';
import FilterInputSwitch from '../../Shared/FilterInputSwitch';
import FilterDropdown from '../../Shared/FilterDropdown';
import {SearchReqContext} from './XevaSetSearch';
import {dataTypes} from '../../Shared/Enums';

const XevaSetFilter = () => {
    
    const context = useContext(SearchReqContext);
    const formRef = useRef();
    const paramRef = useRef();

    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        const initialize = async () => {
            const res = await fetch(`/api/${dataTypes.xenographic}/formData`);
            const json = await res.json();
            console.log(json);
            formRef.current = json;
            paramRef.current = { dataset: [] };
            setReady(true);
        }
        initialize();
    }, []);
    
    return(
        <React.Fragment>
        {
            ready&&
            <div className='pSetFilterContainer'>
                <div className='pSetFilter'>
                    <h2>XevaSet Parameters</h2>
                    <FilterInputSwitch 
                        label='Request XevaSet:'
                        checked={context.isRequest}
                        tooltip='Currently unavailable'
                        onChange={(e) => {}}
                        disabled={true}
                    />
                    <FilterDropdown 
                        id='dataset' 
                        hidden={false} 
                        label='Dataset:' 
                        selectOne={context.isRequest}  
                        options={formRef.current.dataset.filter(ds => {return(!ds.hide)})} 
                        selected={paramRef.current.dataset} 
                        onChange={(e) => { 
                            paramRef.current.dataset = e.value;
                            context.setParameters({...paramRef.current, search: true});
                        }} 
                    />
                </div>
            </div>
        }   
        </React.Fragment>
    );
}

export default XevaSetFilter;