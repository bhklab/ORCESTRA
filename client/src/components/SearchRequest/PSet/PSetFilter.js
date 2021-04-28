import React, {useState, useEffect, useContext} from 'react';
import SearchReqContext from '../SearchReqContext';

import {Filter} from '../SearchReqStyle';
import FilterInputSwitch from '../../Shared/FilterInputSwitch';
import FilterDropdown from '../../Shared/FilterDropdown';
import PSetCheckbox from '../../Shared/PSetCheckbox';
import {dataTypes} from '../../Shared/Enums';

const PSetFilter = () => {
    
    const context = useContext(SearchReqContext);

    const [datasetSelect, setDatasetSelect] = useState({selected: [], options: [], hidden: false});
    const [dataTypeSelect, setDataTypeSelect] = useState({selected: [], options: [], hidden: false, searchOptions: []});
    const [miArraySelect, setMiArraySelect] = useState({selected: [], options: [], hidden: true});
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
                onDatasetSelection(datasetSelect.selected);
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

    useEffect(() => {
        if(context.isRequest){
            // disable dataset option(s) that are not available to use for a PSet request.
            let datasetOptions = datasetSelect.options.map(item => ({...item, disabled: item.unavailable ? true : false}));
            setDatasetSelect({...datasetSelect, options: datasetOptions, selected: undefined});
            setDataTypeSelect({...dataTypeSelect, selected: [], disabled: true, options: []});
            setDataTypeDisabled(true);
            setToolRefDisabled(true);
            
        }else{
            setDatasetSelect({selected: [], hidden: false, options: datasetSelect.options.map(option => ({...option, disabled: false}))});
            setDataTypeSelect({...dataTypeSelect, selected: [], disabled: false, hidden: false, options: dataTypeSelect.searchOptions.map(option => ({...option, hidden: false}))});
            setDataTypeDisabled(false);
            setToolRefDisabled(false);
        }
        setGenomeSelect({selected: [], hidden: false, options: genomeSelect.options});
        setRNAToolSelect({selected: [], hidden: false, options: rnaToolSelect.options});
        setRNARefSelect({selected: [], hidden: false, options: rnaRefSelect.options.map(option => ({...option, hidden: false}))});
        setCheckBoxes({canonicalOnly: false, filteredSensitivity: false});
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
    }, [context.isRequest]);

    useEffect(() => {
        // Show rnaRef options that belong to a selected genome(s), and hide others.
        let rnaRefOptions = [...rnaRefSelect.options];
        // if genomes are not selected, show all rnaRef options
        if(genomeSelect.selected.length === 0 || typeof genomeSelect.selected === 'undefined'){
            rnaRefOptions = rnaRefOptions.map(item => ({...item, hidden: false}));
        // if one or more genome is selected, show rnaRef options that belong to the selected genome(s)
        }else{
            if(Array.isArray(genomeSelect.selected)){
                rnaRefOptions = rnaRefOptions.map(
                    item => ({...item, hidden: (genomeSelect.selected.find(genome => (item.genome === genome.name)) ? false : true)})
                );
            }else{
                rnaRefOptions = rnaRefOptions.map(item => ({...item, hidden: (item.genome === genomeSelect.selected.name) ? false : true}));
            }
        }
        setRNARefSelect({...rnaRefSelect, options: rnaRefOptions});
    }, [genomeSelect.selected]);

    useEffect(() => {
        if(context.isRequest && typeof datasetSelect.selected !== 'undefined' && datasetSelect.selected.name === 'GDSC'){
            let found = dataTypeSelect.selected.find(item => (item.name === 'microarray'));
            if(miArraySelect.hidden && found){
                setMiArraySelect({...miArraySelect, options: found.options, hidden: false});
            }else if(!found){
                setMiArraySelect({...miArraySelect, selected: undefined, options: [], hidden: true});
                
            }
        }else{
            setMiArraySelect({...miArraySelect, selected: undefined, options: [], hidden: true});
        }
    }, [dataTypeSelect.selected]);

    const onDatasetSelection = (dataset) => {
        // Handle form options depending on a selected dataset.
        // Empty downstream selections everytime a different dataset it selected.
        let defaultMolData = [];
        switch(dataset.name){
            case 'CCLE':
                defaultMolData = dataTypeSelect.searchOptions.filter(item => (item.default));
                setDataTypeSelect({...dataTypeSelect, selected: [], options: dataset.accompanyData, disabled: false});
                setToolRefDisabled(false);
                setDataTypeDisabled(false);
                break;
            case 'CTRPv2':
                setDataTypeSelect({...dataTypeSelect, selected: [], options: [], disabled: true});
                setToolRefDisabled(true);
                setDataTypeDisabled(true);
                break;
            case 'FIMM':
                setDataTypeSelect({...dataTypeSelect, selected: [], options: [], disabled: true});
                setToolRefDisabled(true);
                setDataTypeDisabled(true);
                break;
            case 'gCSI':
                defaultMolData = dataTypeSelect.searchOptions.filter(item => (item.default));
                setDataTypeSelect({...dataTypeSelect, selected: [], options: dataset.accompanyData, disabled: false});
                setToolRefDisabled(false);
                setDataTypeDisabled(false);
                break;
            case 'GDSC':
                defaultMolData = dataTypeSelect.searchOptions.filter(item => (item.default));
                setDataTypeSelect({...dataTypeSelect, selected: [], options: dataset.accompanyData, disabled: false});
                setToolRefDisabled(false);
                setDataTypeDisabled(false);
                break;
            default:
                defaultMolData = dataTypeSelect.searchOptions.filter(item => (item.default));   
                setDataTypeSelect({...dataTypeSelect, selected: [], options: dataset.accompanyData, disabled: dataset.accompanyData.length === 0}); 
                setToolRefDisabled(false);
                setDataTypeDisabled(false);
                break;
        }
        setGenomeSelect({...genomeSelect, selected: []});
        setRNAToolSelect({...rnaToolSelect, selected: []});
        setRNARefSelect(prev => ({...prev, selected: [], options: prev.options.map(item => ({...item, hidden: false}))}));
        context.setParameters({
            dataset: dataset,
            drugSensitivity: [],
            canonicalOnly: false,
            filteredSensitivity: false,
            genome: [],
            dataType: [],
            defaultData: defaultMolData,
            rnaTool: [],
            rnaRef: [],
            name: '',
            email: '',
            search: true
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
            <Filter>
                <h2>PSet Parameters</h2>
                <FilterInputSwitch 
                    label='Request PSet:'
                    checked={context.isRequest}
                    tooltip="Turn this on to request a PSet."
                    onChange={(e) => {context.setIsRequest(e.value)}}
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
                    options={datasetSelect.options} 
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
                    id='microarrayOptions' 
                    hidden={miArraySelect.hidden} 
                    label='Microarray Type:'
                    selectOne={true}
                    options={miArraySelect.options} 
                    disabled={miArraySelect.disabled}
                    selected={miArraySelect.selected} 
                    onChange={(e) => {
                        setMiArraySelect({...miArraySelect, selected: e.value});
                        let dataType = JSON.parse(JSON.stringify(context.parameters.dataType));
                        dataType.find(item => (item.name === 'microarray')).type = e.value
                        context.setParameters(prev => ({...prev, dataType: dataType, search: false}));
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
                    options={genomeSelect.options} 
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
            </Filter>
        }   
        </React.Fragment>
    );
}

export default PSetFilter;