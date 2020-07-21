import React, {useState, useEffect, useContext, useRef} from 'react';
import {InputSwitch} from 'primereact/inputswitch';
import PSetDropdown from '../../Shared/PSetDropdown/PSetDropdown';
import {SearchReqContext} from '../PSetSearch';
import './PSetFilter.css';

const PSetFilter = () => {
    
    const context = useContext(SearchReqContext);
    const formRef = useRef();
    const paramRef = useRef();

    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        const initialize = async () => {
            const res = await fetch('/api/formData');
            const json = await res.json();
            console.log(json)
            formRef.current = json;
            formRef.current.drugSensOptions = [];
            formRef.current.disableDrugSensOptions = true;
            formRef.current.disableToolRefOptions = false;
            formRef.current.hideDataTypeOptions = false;
            paramRef.current = { dataset: [], drugSensitivity: [], genome: [], dataType: [], rnaTool: [], rnaRef: [], defaultData: [] }
            setReady(true)
        }
        initialize();
    }, []);


    //function to show rnaRef options that belong to a selected genome(s), and hide others.
    const onGenomeSelection = (genome) => {
        console.log(genome)
        // if genomes are not selected, show all rnaRef options
        if(genome.length === 0){
            formRef.current.rnaRef.forEach(ref => {ref.hide = false})
        // if one or more genome is selected, show rnaRef options that belong to the selected genome(s)
        }else{
            if(Array.isArray(genome)){
                formRef.current.rnaRef.forEach(ref => {
                    ref.hide = (genome.find(g => {return ref.genome === g.name})) ? false : true;
                })
            }else{
                formRef.current.rnaRef.forEach(ref => {
                    ref.hide = (ref.genome === genome.name) ? false : true;
                })
            }
        }
    }

    const onDatasetSelectionRequest = (dataset) => {
        console.log('onDatasetSelectionRequest')
        formRef.current.drugSensOptions = [];
        //disable the drug sensitivity options if no dataset is selected.
        if(typeof dataset === 'undefined'){
            formRef.current.disableDrugSensOptions = true;
        }else{
            // set drug sensitivity and optional data type options
            setDrugSensParamOptions(dataset);
            formRef.current.disableDrugSensOptions = false;
        }
        setOptionsOnDatasetSelection(dataset);
    }

    //show drug sensitivity options available for selected dataset(s)
    const onDatasetSelectionSearch = (dataset) => {
        // empty current options
        formRef.current.drugSensOptions = [];
        // enable the drug sensitivity options only if at least one dataset is selected.
        if(dataset.length){
            formRef.current.disableDrugSensOptions = false;
        }else{
            formRef.current.disableDrugSensOptions = true;
        }
        // set drug sensitivity options
        dataset.forEach(ds => {
            setDrugSensParamOptions(ds);
        })
    }

    const setOptionsOnDatasetSelection = (dataset) => {
        // handle form options depending on a selected dataset
        switch(dataset.name){
            case 'CCLE':
                paramRef.current.defaultData = formRef.current.dataType.filter(dt => {return dt.default});
                paramRef.current.dataType = [];
                setDataTypeOptions(dataset);
                formRef.current.disableToolRefOptions = false;
                formRef.current.hideDataTypeOptions = false;
                break;
            case 'CTRPv2':
                paramRef.current.defaultData = [];
                paramRef.current.dataType = [];
                paramRef.current.genome = [];
                paramRef.current.rnaTool = [];
                paramRef.current.rnaRef = [];
                formRef.current.disableToolRefOptions = true;
                formRef.current.hideDataTypeOptions = true;
                break;
            case 'FIMM':
                paramRef.current.defaultData = [];
                paramRef.current.dataType = [];  
                paramRef.current.genome = [];  
                paramRef.current.rnaTool = [];
                paramRef.current.rnaRef = [];
                formRef.current.disableToolRefOptions = true;
                formRef.current.hideDataTypeOptions = true;
                break;
            case 'gCSI':
                paramRef.current.defaultData = formRef.current.dataType.filter(dt => {return dt.default});
                paramRef.current.dataType = []; 
                setDataTypeOptions(dataset);   
                formRef.current.disableToolRefOptions = false;
                formRef.current.hideDataTypeOptions = false;
                break;
            case 'GDSC':
                paramRef.current.defaultData = formRef.current.dataType.filter(dt => {return dt.default});
                paramRef.current.dataType = []; 
                setDataTypeOptions(dataset);   
                formRef.current.disableToolRefOptions = false;
                formRef.current.hideDataTypeOptions = false;
                break;
            default:
                paramRef.current.defaultData = formRef.current.dataType.filter(dt => {return dt.default});
                paramRef.current.dataType = [];     
                formRef.current.disableToolRefOptions = false;
                formRef.current.hideDataTypeOptions = true;
                break;
        }
    }

    const setDataTypeOptions = (dataset) => {
        const accRNA = formRef.current.accompanyRNA.filter(acc => {return acc.dataset === dataset.name});
        const accDNA = formRef.current.accompanyDNA.filter(acc => {return acc.dataset === dataset.name});
        const options = accRNA.concat(accDNA);
        formRef.current.dataType.forEach(dt => {
            dt.hide = (options.find(option => {return option.name === dt.name})) ? false : true;
        })   
    }

    const requestToggleOn = (request) => {
        // hide dataset option(s) that are not available to use for a PSet request.
        formRef.current.dataset.forEach(ds => {ds.hide = ds.unavailable ? true : false})
        formRef.current.dataType.forEach(dt => {dt.hide = (dt.name === 'rnaseq') ? true : false})
        formRef.current.disableToolRefOptions = true;
        formRef.current.hideDataTypeOptions = true;

        paramRef.current.dataType = []
        if(paramRef.current.dataset.length){
            setParameterOptions('dataset');
            paramRef.current.dataset = paramRef.current.dataset[0];
            paramRef.current.drugSensitivity = [];
            setOptionsOnDatasetSelection(paramRef.current.dataset)
            // set drug sensitivity options
            formRef.current.drugSensOptions = [];
            setDrugSensParamOptions(paramRef.current.dataset);
        }
        if(paramRef.current.genome.length){
            setParameterOptions('genome');
            paramRef.current.genome = paramRef.current.genome[0];
        }
        if(paramRef.current.rnaTool.length){
            setParameterOptions('rnaTool');
            // limit selection of RNA tools to two
            let tools = JSON.parse(JSON.stringify(paramRef.current.rnaTool));
            while(tools.length > 2){
                tools.shift()
            }
            paramRef.current.rnaTool = tools;
        }
        if(paramRef.current.rnaRef.length){
            setParameterOptions('rnaRef');
            paramRef.current.rnaRef = paramRef.current.rnaRef[0];
        }
        context.setIsRequest(request);
        context.setParameters({...paramRef.current, search: true});
    }

    const requestToggleOff = (request) => {   
        formRef.current.dataset.forEach(ds => {ds.hide = false});
        restoreParameters('dataset');
        paramRef.current.drugSensitivity = [];
        paramRef.current.dataType = [];
        restoreParameters('genome');
        restoreParameters('rnaRef');
        formRef.current.hideDataTypeOptions = false;
        formRef.current.dataType.forEach(dt => {dt.hide = false});
        formRef.current.dataset.forEach(ds => {ds.hide = false});
        formRef.current.genome.forEach(g => {g.hide = false});
        formRef.current.rnaRef.forEach(ref => {ref.hide = false});
        context.setIsRequest(request);
        context.setParameters({...paramRef.current, search: true});
    }

    const setParameterOptions = (name) => {
        formRef.current[name].forEach(ref => {
            ref.hide = paramRef.current[name].find(p => {return ref.name === p.name}) ? false : true
        })
    }

    const restoreParameters = (name) => {
        const visibleOptions = formRef.current[name].filter(option => {return !option.hide});
        if(visibleOptions.length < formRef.current[name].length){
            paramRef.current[name] = visibleOptions;
            if(name === 'dataset'){
                // restore drug sensitivity options
                formRef.current.drugSensOptions = [];
                visibleOptions.forEach(option => {
                    setDrugSensParamOptions(option)
                })
            }
        }else if(!Array.isArray(paramRef.current[name])){
            paramRef.current[name] = [paramRef.current[name]];
            if(name === 'dataset'){
                // restore drug sensitivity options
                formRef.current.drugSensOptions = [];
                setDrugSensParamOptions(paramRef.current[name][0])
            }
        }
    }

    const setDrugSensParamOptions = (dataset) => {
        dataset.versions.forEach(v => {
            if(!formRef.current.drugSensOptions.some(drug => drug.label === v.label)){
                formRef.current.drugSensOptions.push(v);
            }
        })
    }
    
    return(
        <React.Fragment>
        {
            ready&&
            <div className='pSetFilterContainer'>
                <div className='pSetFilter'>
                    <h2>PSet Parameters</h2>
                    <div className='filterSet'>
                        <label className='bold'>Request PSet: </label> 
                        <InputSwitch checked={context.isRequest} tooltip="Turn this on to request a PSet." 
                            onChange={(e) => {
                                if(e.value){ 
                                    requestToggleOn(e.value); 
                                }else{ 
                                    requestToggleOff(e.value); 
                                }
                            }} 
                        />
                    </div>

                    <PSetDropdown id='dataset' isHidden={false} parameterName='Dataset:' selectOne={context.isRequest}  
                        parameterOptions={formRef.current.dataset.filter(ds => {return(!ds.hide)})} selectedParameter={paramRef.current.dataset} 
                        handleUpdateSelection={(e) => {
                            if(context.isRequest){
                                onDatasetSelectionRequest(e.value)
                            }else{
                                onDatasetSelectionSearch(e.value)
                            }
                            paramRef.current.dataset = e.value;
                            context.setParameters({...paramRef.current, search: true});
                        }} />
                    
                    {
                        (context.isRequest && !formRef.current.disableToolRefOptions) && 
                        <div>
                            Molecular Data: 
                            {
                                paramRef.current.defaultData.length === 1 ?
                                <span style={{marginLeft: '10px', fontWeight: 'bold'}}>{paramRef.current.defaultData[0].label}</span>
                                :
                                <ul>
                                {
                                    paramRef.current.defaultData.map(data => {
                                        return(<li key={Math.random()}>{data.label}</li>);
                                    })
                                }
                                </ul>
                            } 
                        </div>
                    }
                    <PSetDropdown id='dataType' isHidden={formRef.current.hideDataTypeOptions} parameterName={ context.isRequest ? 'Optional Molecular Data:' : 'Molecular Data Type:'}
                        parameterOptions={formRef.current.dataType.filter(dt => {return(!dt.hide)})} selectedParameter={paramRef.current.dataType} 
                        handleUpdateSelection={(e) => {
                            paramRef.current.dataType = e.value;
                            context.setParameters({...paramRef.current, dataType: e.value, search: true});
                        }} />

                    <PSetDropdown id='drugSensitivity' isHidden={false} parameterName='Drug Sensitivity:' selectOne={context.isRequest} 
                        disabled={formRef.current.disableDrugSensOptions}
                        parameterOptions={formRef.current.drugSensOptions} selectedParameter={paramRef.current.drugSensitivity} 
                        handleUpdateSelection={(e) => {
                            paramRef.current.drugSensitivity = e.value;
                            context.setParameters({...paramRef.current, drugSensitivity: e.value, search: true});
                        }} />
                    
                    <PSetDropdown id='genome' disabled={formRef.current.disableToolRefOptions} isHidden={false} parameterName='Genome:' selectOne={context.isRequest} 
                        parameterOptions={formRef.current.genome.filter(g => {return(!g.hide)})} selectedParameter={paramRef.current.genome} 
                        handleUpdateSelection={(e) => {
                            onGenomeSelection(e.value)
                            paramRef.current.genome = e.value;
                            context.setParameters({...paramRef.current, genome: e.value, search: true});
                        }} />

                    <PSetDropdown id='rnaTool' disabled={formRef.current.disableToolRefOptions} parameterName='RNA Tool:' 
                        parameterOptions={formRef.current.rnaTool} selectedParameter={paramRef.current.rnaTool} 
                        handleUpdateSelection={(e) => {
                            if(context.isRequest && e.value.length > 2){
                                while(e.value.length > 2){ e.value.shift() }
                            }
                            paramRef.current.rnaTool = e.value;
                            context.setParameters({...paramRef.current, rnaTool: e.value, search: true});
                        }} />

                    <PSetDropdown id='rnaRef' disabled={formRef.current.disableToolRefOptions} parameterName='RNA Ref:' selectOne={context.isRequest} 
                        parameterOptions={formRef.current.rnaRef.filter(ref => {return(!ref.hide)})} selectedParameter={paramRef.current.rnaRef} 
                        handleUpdateSelection={(e) => {
                            paramRef.current.rnaRef = e.value;
                            context.setParameters({...paramRef.current, rnaRef: e.value, search: true});
                        }} />
                </div>
            </div>
        }   
        </React.Fragment>
    );
}

export default PSetFilter;