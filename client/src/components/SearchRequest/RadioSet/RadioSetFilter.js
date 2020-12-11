import React, {useState, useEffect, useContext, useRef} from 'react';
import {InputSwitch} from 'primereact/inputswitch';
import PSetDropdown from '../../Shared/PSetDropdown';
import {SearchReqContext} from './RadioSetSearch';
import {dataTypes} from '../../Shared/Enums';
import '../PSet/subcomponents/PSetFilter.css';

const RadioSetFilter = () => {
    
    const context = useContext(SearchReqContext);
    const formRef = useRef();
    const paramRef = useRef();

    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        const initialize = async () => {
            const res = await fetch(`/api/${dataTypes.radiogenomics}/formData`);
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
                    <h2>RadioSet Parameters</h2>
                    <div className='filterSet'>
                        <label className='bold'>Request RadioSet: </label> 
                        <InputSwitch checked={context.isRequest} tooltip="Currently unavailable" onChange={(e) => {}} disabled={true} />
                    </div>
                    <PSetDropdown id='dataset' isHidden={false} parameterName='Dataset:' selectOne={context.isRequest}  
                        parameterOptions={formRef.current.dataset.filter(ds => {return(!ds.hide)})} selectedParameter={paramRef.current.dataset} 
                        handleUpdateSelection={(e) => { 
                            paramRef.current.dataset = e.value;
                            context.setParameters({...paramRef.current, search: true});
                        }} />
                </div>
            </div>
        }   
        </React.Fragment>
    );
}

export default RadioSetFilter;