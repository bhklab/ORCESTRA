import React, {useState, useEffect, useContext, useRef} from 'react';
import {InputSwitch} from 'primereact/inputswitch';
import PSetDropdown from '../../../Shared/PSetDropdown';
import PSetCheckbox from '../../../Shared/PSetCheckbox';
import {SearchReqContext} from '../PSetSearch';
import {dataTypes} from '../../../Shared/Enums';
import './PSetFilter.css';

const PSetFilter = () => {
    
    const context = useContext(SearchReqContext);
    const formRef = useRef();
    const paramRef = useRef();

    const [params, setParams] = useState({ 
        dataset: [], 
        drugSensitivity: [], 
        filteredSensitivity: false, 
        canonicalOnly: false, 
        genome: [], 
        dataType: [], 
        rnaTool: [], 
        rnaRef: [], 
        defaultData: [] 
    });

    const [datasetSelect, setDatasetSelect] = useState({options: [], hidden: false});
    const [dataTypeSelect, setDataTypeSelect] = useState({options: [], hidden: false});
    const [drugSensSelect, setDrugSensSelect] = useState({options: [], hidden: false, disabled: true});
    const [genomeSelect, setGenomeSelect] = useState({options: [], hidden: false});
    const [rnaToolSelect, setRNAToolSelect] = useState({options: [], hidden: false});
    const [rnaRefSelect, setRNARefSelect] = useState({options: [], hidden: false});
    
    const [toolRefDisabled, setToolRefDisabled] = useState(false);
    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        const initialize = async () => {
            const res = await fetch(`/api/${dataTypes.pharmacogenomics}/formData`);
            const form = await res.json();
            console.log(form);
            setDatasetSelect({...datasetSelect, options: form.dataset});
            setDataTypeSelect({...dataTypeSelect, options: form.dataType});
            setGenomeSelect({...genomeSelect, options: form.genome});
            setRNAToolSelect({...rnaToolSelect, options: form.rnaTool});
            setRNARefSelect({...rnaRefSelect, options: form.rnaRef});
            setReady(true);
        }
        initialize();
    }, []);

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
        // formRef.current.drugSensOptions = [];
        // enable the drug sensitivity options only if at least one dataset is selected.
        if(dataset.length){
            formRef.current.disableDrugSensOptions = false;
        }else{
            formRef.current.disableDrugSensOptions = true;
        }
        // set drug sensitivity options
        dataset.forEach(ds => {
            // setDrugSensParamOptions(ds);
        })
    }

    //function to show rnaRef options that belong to a selected genome(s), and hide others.
    const onGenomeSelection = (genome) => {
        console.log(genome);
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

        paramRef.current.canonicalOnly = false;
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
        });
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
                    {
                        !context.isRequest &&
                        <PSetCheckbox 
                            label='Canonical PSets only: '
                            onChange={(e) => {
                                setParams({...params, canonicalOnly: e.checked});
                                context.setParameters({...params, canonicalOnly: e.checked, search: true});
                            }} 
                            checked={params.canonicalOnly} 
                        />
                    }
                    <PSetDropdown 
                        id='dataset' 
                        isHidden={false} 
                        parameterName='Dataset:' 
                        selectOne={context.isRequest}  
                        parameterOptions={datasetSelect.options.filter(item => !item.unavailable)} 
                        selectedParameter={params.dataset} 
                        handleUpdateSelection={(e) => {
                            setParams({...params, dataset: e.value});
                            // if(context.isRequest){
                            //     onDatasetSelectionRequest(e.value)
                            // }else{
                            //     onDatasetSelectionSearch(e.value)
                            // }
                            // context.setParameters({...paramRef.current, search: true});
                        }} 
                    />
                    {
                        (context.isRequest && !toolRefDisabled) && 
                        <div>
                            Molecular Data: 
                            {
                                params.defaultData.length === 1 ?
                                <span style={{marginLeft: '10px', fontWeight: 'bold'}}>{params.defaultData[0].label}</span>
                                :
                                <ul>
                                {
                                    params.defaultData.map(data => {
                                        return(<li key={Math.random()}>{data.label}</li>);
                                    })
                                }
                                </ul>
                            } 
                        </div>
                    }
                    <PSetDropdown 
                        id='dataType' 
                        isHidden={dataTypeSelect.hidden} 
                        parameterName={ context.isRequest ? 'Optional Molecular Data:' : 'Molecular Data Type:'}
                        parameterOptions={dataTypeSelect.options.filter(item => !item.hidden)} 
                        selectedParameter={params.dataType} 
                        handleUpdateSelection={(e) => {
                            setParams({...params, dataType: e.value});
                            // context.setParameters({...paramRef.current, dataType: e.value, search: true});
                        }} 
                    />

                    <PSetDropdown 
                        id='drugSensitivity' 
                        isHidden={drugSensSelect.hidden} 
                        parameterName='Drug Sensitivity:' 
                        selectOne={context.isRequest} 
                        disabled={drugSensSelect.disabled}
                        parameterOptions={drugSensSelect.options} 
                        selectedParameter={params.drugSensitivity} 
                        handleUpdateSelection={(e) => {
                            setParams({...params, drugSensitivity: e.value});
                            // context.setParameters({...paramRef.current, drugSensitivity: e.value, search: true});
                        }} 
                    />
                    
                    {
                        context.isRequest ?
                        !drugSensSelect.disabled &&
                        <PSetCheckbox 
                            label='Standardize drug dose range and filter noisy sensitivity curves?'
                            onChange={(e) => {
                                setParams({...params, filteredSensitivity: e.checked});
                                context.setParameters({...paramRef.current, filteredSensitivity: e.checked});
                            }} 
                            checked={params.filteredSensitivity} 
                        />
                        :
                        <PSetCheckbox 
                            label='Filtered sensitivity data only: '
                            onChange={(e) => {
                                setParams({...params, filteredSensitivity: e.checked});
                                // context.setParameters({...paramRef.current, filteredSensitivity: e.checked, search: !context.isRequest});
                            }} 
                            checked={params.filteredSensitivity} 
                        />
                    }
                    
                    <PSetDropdown 
                        id='genome' 
                        disabled={toolRefDisabled} 
                        isHidden={false} 
                        parameterName='Genome:' 
                        selectOne={context.isRequest} 
                        parameterOptions={genomeSelect.options.filter(item => !item.hidden)} 
                        selectedParameter={params.genome} 
                        handleUpdateSelection={(e) => {
                            setParams({...params, genome: e.value});
                            // onGenomeSelection(e.value)
                            // context.setParameters({...paramRef.current, genome: e.value, search: true});
                        }} 
                    />

                    <PSetDropdown 
                        id='rnaTool' 
                        disabled={toolRefDisabled} 
                        parameterName='RNA Tool:' 
                        parameterOptions={rnaToolSelect.options} 
                        selectedParameter={params.rnaTool} 
                        handleUpdateSelection={(e) => {
                            if(context.isRequest && e.value.length > 2){
                                while(e.value.length > 2){ e.value.shift() }
                            }
                            setParams({...params, rnaTool: e.value});
                            // context.setParameters({...paramRef.current, rnaTool: e.value, search: true});
                        }} 
                    />

                    <PSetDropdown 
                        id='rnaRef' 
                        disabled={toolRefDisabled} 
                        parameterName='RNA Ref:' 
                        selectOne={context.isRequest} 
                        parameterOptions={rnaRefSelect.options.filter(item => !item.hidden)} 
                        selectedParameter={params.rnaRef} 
                        handleUpdateSelection={(e) => {
                            setParams({...params, rnaRef: e.value});
                            // context.setParameters({...paramRef.current, rnaRef: e.value, search: true});
                        }} 
                    />
                </div>
            </div>
        }   
        </React.Fragment>
    );
}

export default PSetFilter;