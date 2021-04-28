import React, {useState, useEffect, useContext, useRef} from 'react';
import FilterInputSwitch from '../../Shared/FilterInputSwitch';
import FilterDropdown from '../../Shared/FilterDropdown';
import {SearchReqContext} from './ClinGenSetSearch';
import {dataTypes} from '../../Shared/Enums';

const ClinGenSetFilter = () => {
    
    const context = useContext(SearchReqContext);
    const formRef = useRef();
    const paramRef = useRef();

    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        const initialize = async () => {
            const res = await fetch(`/api/${dataTypes.clinicalgenomics}/formData`);
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
                    <h2>Clinical Genomics Dataset Parameters</h2>
                    <FilterInputSwitch 
                        label='Request Clinical Genomics Dataset:'
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

export default ClinGenSetFilter;