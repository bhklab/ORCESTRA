import React, {useState, useEffect, useContext, useRef} from 'react';
import FilterInputSwitch from '../../Shared/FilterInputSwitch';
import FilterDropdown from '../../Shared/FilterDropdown';
import PSetCheckbox from '../../Shared/PSetCheckbox';
import {SearchReqContext} from './PSetSearch';
import {dataTypes} from '../../Shared/Enums';

const PSetFilter = () => {
    
    const context = useContext(SearchReqContext);
    const formRef = useRef();
    const paramRef = useRef();

    const [datasetSelect, setDatasetSelect] = useState({selected: [], options: [], hidden: false});
    const [dataTypeSelect, setDataTypeSelect] = useState({selected: [], options: [], hidden: false, searchOptions: []});
    const [drugSensSelect, setDrugSensSelect] = useState({selected: [], options: [], hidden: false, disabled: true});
    const [genomeSelect, setGenomeSelect] = useState({selected: [], options: [], hidden: false});
    const [rnaToolSelect, setRNAToolSelect] = useState({selected: [], options: [], hidden: false});
    const [rnaRefSelect, setRNARefSelect] = useState({selected: [], options: [], hidden: false});
    const [checkBoxes, setCheckBoxes] = useState({canonicalOnly: false, filteredSensitivity: false});
    const [toolRefDisabled, setToolRefDisabled] = useState(false);
    const [dataTypeDisabled, setDataTypeDisabled] = useState(false);
    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        const initialize = async () => {
            const res = await fetch(`/api/${dataTypes.pharmacogenomics}/formData`);
            const form = await res.json();
            console.log(form);
            setDatasetSelect({...datasetSelect, options: form.dataset});
            setDataTypeSelect({...dataTypeSelect, options: form.dataType, searchOptions: form.dataType});
            setGenomeSelect({...genomeSelect, options: form.genome});
            setRNAToolSelect({...rnaToolSelect, options: form.rnaTool});
            setRNARefSelect({...rnaRefSelect, options: form.rnaRef});
            setReady(true);
        }
        initialize();
    }, []);

    useEffect(() => {
        // set drug sensitivity options based on dataset selection.
        if(context.isRequest){
            // disable the drug sensitivity options if no dataset is selected.
            let options = [];
            if(typeof datasetSelect.selected !== 'undefined'){
                options = options.concat(getDrugSensOptions(datasetSelect.selected));
                // onDatasetSelection()
            }
            setDrugSensSelect({
                selected: [],
                options: options,
                disabled: typeof datasetSelect.selected === 'undefined' ? true : false     
            });
        }else{
            // enable the drug sensitivity options only if at least one dataset is selected.
            let options = [];
            if(typeof datasetSelect.selected !== 'undefined'){
                datasetSelect.selected.forEach(item => {
                    options = options.concat(getDrugSensOptions(item));
                });
                setDrugSensSelect({
                    selected: [],
                    options: options,
                    disabled: datasetSelect.selected.length > 0 ? false : true     
                });
            }
        }
    }, [datasetSelect.selected]);

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

    // const onDatasetSelection = (dataset) => {
    //     // handle form options depending on a selected dataset
    //     switch(dataset.name){
    //         case 'CCLE':
    //             setParams({
    //                 ...params,
    //                 dataset: dataset,
    //                 defaultData: dataTypeSelect.searchOptions.filter(dt => {return dt.default}),
    //                 dataType: [],
    //                 drugSensitivity: [],
    //                 canonicalOnly: false,
    //             });
    //             setDataTypeSelect({...dataTypeSelect, options: dataset.accompanyData, disabled: false});
    //             setToolRefDisabled(false);
    //             setDataTypeDisabled(false);
    //             break;
    //         case 'CTRPv2':
    //             setParams({
    //                 ...params,
    //                 dataset: dataset,
    //                 defaultData: [],
    //                 dataType: [],
    //                 genome: [],
    //                 rnaTool: [],
    //                 rnaRef: [],
    //                 drugSensitivity: [],
    //                 canonicalOnly: false,
    //             });
    //             setDataTypeSelect({...dataTypeSelect, options: [], disabled: true});
    //             setToolRefDisabled(true);
    //             setDataTypeDisabled(true);
    //             break;
    //         case 'FIMM':
    //             setParams({
    //                 ...params,
    //                 dataset: dataset,
    //                 defaultData: [],
    //                 dataType: [],
    //                 genome: [],
    //                 rnaTool: [],
    //                 rnaRef: [],
    //                 drugSensitivity: [],
    //                 canonicalOnly: false,
    //             });
    //             setDataTypeSelect({...dataTypeSelect, options: [], disabled: true});
    //             setToolRefDisabled(true);
    //             setDataTypeDisabled(true);
    //             break;
    //         case 'gCSI':
    //             setParams({
    //                 ...params,
    //                 dataset: dataset,
    //                 defaultData: dataTypeSelect.searchOptions.filter(dt => {return dt.default}),
    //                 dataType: [],
    //                 drugSensitivity: [],
    //                 canonicalOnly: false,
    //             });
    //             setDataTypeSelect({...dataTypeSelect, options: dataset.accompanyData, disabled: false});
    //             setToolRefDisabled(false);
    //             setDataTypeDisabled(false);
    //             break;
    //         case 'GDSC':
    //             setParams({
    //                 ...params,
    //                 dataset: dataset,
    //                 defaultData: dataTypeSelect.searchOptions.filter(dt => {return dt.default}),
    //                 dataType: [],
    //                 drugSensitivity: [],
    //                 canonicalOnly: false,
    //             });
    //             setDataTypeSelect({...dataTypeSelect, options: dataset.accompanyData, disabled: false});
    //             setToolRefDisabled(false);
    //             setDataTypeDisabled(false);
    //             break;
    //         default:
    //             setParams({
    //                 ...params,
    //                 dataset: dataset,
    //                 defaultData: dataTypeSelect.searchOptions.filter(dt => {return dt.default}),
    //                 dataType: [],
    //                 drugSensitivity: [],
    //                 canonicalOnly: false,
    //             });    
    //             setDataTypeSelect({...dataTypeSelect, options: dataset.accompanyData, disabled: dataset.accompanyData.length === 0}); 
    //             setToolRefDisabled(false);
    //             setDataTypeDisabled(false);
    //             break;
    //     }
    // }

    const requestToggleOn = (request) => {
        // disable dataset option(s) that are not available to use for a PSet request.
        let datasetOptions = datasetSelect.options.map(item => ({...item, disabled: item.unavailable ? true : false}));
        setDatasetSelect({...datasetSelect, options: datasetOptions, selected: undefined});
        setDataTypeSelect({...dataTypeSelect, selected: [], disabled: true, options: []});
        setDataTypeDisabled(true);
        setToolRefDisabled(true);
        setGenomeSelect({selected: [], hidden: false, options: genomeSelect.options.map(option => ({...option, hidden: false}))});
        setRNAToolSelect({selected: [], hidden: false, options: rnaToolSelect.options.map(option => ({...option, hiddent: false}))});
        setRNARefSelect({selected: [], hidden: false, options: rnaRefSelect.options.map(option => ({...option, hidden: false}))});
        setCheckBoxes({canonicalOnly: false, filteredSensitivity: false});
        context.setIsRequest(request);
        context.setParameters({
            dataset: [],
            drugSensitivity: [],
            canonicalOnly: false,
            filteredSensitivity: false,
            genome: [],
            dataType: [],
            defaultData: [],
            rnaTool: [],
            rnaRef: [],
            name: '',
            email: '',
            search: true
        });
    }

    const requestToggleOff = (request) => {  
        context.setIsRequest(request);
        setDatasetSelect({selected: [], hidden: false, options: datasetSelect.options.map(option => ({...option, disabled: false}))});
        setDrugSensSelect({selected: [], hidden: false, options: [], disabled: true});
        setDataTypeSelect({...dataTypeSelect, selected: [], disabled: false, hidden: false, options: dataTypeSelect.searchOptions.map(option => ({...option, hidden: false}))});
        setGenomeSelect({selected: [], hidden: false, options: genomeSelect.options.map(option => ({...option, hidden: false}))});
        setRNAToolSelect({selected: [], hidden: false, options: rnaToolSelect.options.map(option => ({...option, hiddent: false}))});
        setRNARefSelect({selected: [], hidden: false, options: rnaRefSelect.options.map(option => ({...option, hidden: false}))});
        setCheckBoxes({canonicalOnly: false, filteredSensitivity: false});
        setDataTypeDisabled(false);
        setToolRefDisabled(false);
        context.setParameters({
            dataset: [],
            drugSensitivity: [],
            canonicalOnly: false,
            filteredSensitivity: false,
            genome: [],
            dataType: [],
            defaultData: [],
            rnaTool: [],
            rnaRef: [],
            name: '',
            email: '',
            search: true
        });
    }

    const setParameterOptions = (name) => {
        formRef.current[name].forEach(ref => {
            ref.hide = paramRef.current[name].find(p => {return ref.name === p.name}) ? false : true
        })
    }

    const getOptions = (param, options) => {
        return options.map(option => ({...option, hidden: param.find(p => p.name === option.name) ? false : true}));
    }

    const setDrugSensParamOptions = (dataset) => {
        dataset.versions.forEach(v => {
            if(!formRef.current.drugSensOptions.some(drug => drug.label === v.label)){
                formRef.current.drugSensOptions.push(v);
            }
        });
    }

    const getDrugSensOptions = (dataset) => {
        let options = [];
        dataset.versions.forEach(version => {
            if(!options.some(item => item.label === version.label)){
                options.push(version);
            }
        });
        return options;
    }
    
    return(
        <React.Fragment>
        {
            ready&&
            <div className='pSetFilterContainer'>
                <div className='pSetFilter'>
                    <h2>PSet Parameters</h2>
                    <FilterInputSwitch 
                        label='Request PSet:'
                        checked={context.isRequest}
                        tooltip="Turn this on to request a PSet."
                        onChange={(e) => {
                            if(e.value){ 
                                requestToggleOn(e.value); 
                            }else{ 
                                requestToggleOff(e.value); 
                            }
                        }}
                    />
                    {
                        !context.isRequest &&
                        <PSetCheckbox 
                            label='Canonical PSets only: '
                            onChange={(e) => {
                                setCheckBoxes({...checkBoxes, canonicalOnly: e.checked});
                                context.setParameters(prev => ({...prev, canonicalOnly: e.checked, search: true}));
                            }} 
                            checked={checkBoxes.canonicalOnly} 
                        />
                    }
                    <FilterDropdown 
                        id='dataset' 
                        hidden={false} 
                        label='Dataset:' 
                        selectOne={context.isRequest}  
                        options={datasetSelect.options.filter(item => !item.hidden)} 
                        selected={datasetSelect.selected} 
                        onChange={(e) => {
                            setDatasetSelect({...datasetSelect, selected: e.value}); 
                            context.setParameters(prev => ({...prev, dataset: e.value, search: true}));
                        }} 
                    />
                    {
                        (context.isRequest && !dataTypeDisabled) && 
                        <div>
                            Molecular Data: 
                            {
                                context.parameters.defaultData.length === 1 ?
                                <span style={{marginLeft: '10px', fontWeight: 'bold'}}>{context.parameters.defaultData[0].label}</span>
                                :
                                <ul>
                                {
                                    context.parameters.defaultData.map(data => {
                                        return(<li key={Math.random()}>{data.label}</li>);
                                    })
                                }
                                </ul>
                            } 
                        </div>
                    }
                    <FilterDropdown 
                        id='dataType' 
                        hidden={dataTypeSelect.hidden} 
                        label={ context.isRequest ? 'Optional Molecular Data:' : 'Molecular Data Type:'}
                        options={dataTypeSelect.options} 
                        disabled={dataTypeSelect.disabled}
                        selected={dataTypeSelect.selected} 
                        onChange={(e) => {
                            setDataTypeSelect({...dataTypeSelect, selected: e.value});
                            context.setParameters(prev => ({...prev, dataType: e.value, search: true}));
                        }} 
                    />

                    <FilterDropdown 
                        id='drugSensitivity' 
                        hidden={drugSensSelect.hidden} 
                        label='Drug Sensitivity:' 
                        selectOne={context.isRequest} 
                        disabled={drugSensSelect.disabled}
                        options={drugSensSelect.options} 
                        selected={drugSensSelect.selected} 
                        onChange={(e) => {
                            setDrugSensSelect({...drugSensSelect, selected: e.value});
                            context.setParameters(prev => ({...prev, drugSensitivity: e.value, search: true}));
                        }} 
                    />
                    
                    {
                        context.isRequest ?
                        !drugSensSelect.disabled &&
                        <PSetCheckbox 
                            label='Standardize drug dose range and filter noisy sensitivity curves?'
                            onChange={(e) => {
                                setCheckBoxes({...checkBoxes, filteredSensitivity: e.checked});
                                context.setParameters(prev => ({...prev, filteredSensitivity: e.checked}));
                            }} 
                            checked={checkBoxes.filteredSensitivity} 
                        />
                        :
                        <PSetCheckbox 
                            label='Filtered sensitivity data only: '
                            onChange={(e) => {
                                setCheckBoxes({...checkBoxes, filteredSensitivity: e.checked});
                                context.setParameters(prev => ({...prev, filteredSensitivity: e.checked, search: !context.isRequest}));
                            }} 
                            checked={checkBoxes.filteredSensitivity} 
                        />
                    }
                    
                    <FilterDropdown 
                        id='genome' 
                        disabled={toolRefDisabled} 
                        hidden={false} 
                        label='Genome:' 
                        selectOne={context.isRequest} 
                        options={genomeSelect.options.filter(item => !item.hidden)} 
                        selected={genomeSelect.selected} 
                        onChange={(e) => {
                            setGenomeSelect({...genomeSelect, selected: e.value});
                            // onGenomeSelection(e.value)
                            context.setParameters(prev => ({...prev, genome: e.value, search: true}));
                        }} 
                    />

                    <FilterDropdown 
                        id='rnaTool' 
                        disabled={toolRefDisabled} 
                        label='RNA Tool:' 
                        options={rnaToolSelect.options} 
                        selected={rnaToolSelect.selected} 
                        onChange={(e) => {
                            if(context.isRequest && e.value.length > 2){
                                while(e.value.length > 2){ e.value.shift() }
                            }
                            setRNAToolSelect({...rnaToolSelect, selected: e.value});
                            context.setParameters(prev => ({...prev, rnaTool: e.value, search: true}));
                        }} 
                    />

                    <FilterDropdown 
                        id='rnaRef' 
                        disabled={toolRefDisabled} 
                        label='RNA Ref:' 
                        selectOne={context.isRequest} 
                        options={rnaRefSelect.options.filter(item => !item.hidden)} 
                        selected={rnaRefSelect.selected} 
                        onChange={(e) => {
                            setRNARefSelect({...rnaRefSelect, selected: e.value});
                            context.setParameters(prev => ({...prev, rnaRef: e.value, search: true}));
                        }} 
                    />
                </div>
            </div>
        }   
        </React.Fragment>
    );
}

export default PSetFilter;