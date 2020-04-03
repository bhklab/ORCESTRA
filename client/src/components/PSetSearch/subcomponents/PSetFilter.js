import React, {useState, useEffect, useContext} from 'react';
import {InputSwitch} from 'primereact/inputswitch';
import PSetDropdown from '../../Shared/PSetDropdown/PSetDropdown';
import {SearchReqContext} from '../PSetSearch';
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import './PSetFilter.css';

let formDataInit = {};
let formData = {};
let drugSensitivityOptions = [];
let rnaRefOptions = [];
let dnaRefOptions = [];

async function fetchData(url) {
    const response = await fetch(url);
    const json = await response.json();
    return(json);
}

const PSetFilter = () => {
    
    const context = useContext(SearchReqContext);

    const [dataType, setDataType] = useState([]);
    const [dataset, setDataset] = useState([]);
    const [drugSensitivity, setDrugSensitivity] = useState([]);
    const [genome, setGenome] = useState([]);
    const [rnaTool, setRNATool] = useState([]);
    const [rnaRef, setRNARef] = useState([]);
    const [dnaTool, setDNATool] = useState([]);
    const [dnaRef, setDNARef] = useState([]);

    const [disableDSOptions, setdisableDSOptions] = useState(true);
    const [disableRNAToolRef, setdisableRNAToolRef] = useState(false);
    //const [disableDNAToolRef, setdisableDNAToolRef] = useState(false);
    const [datasetDialogVisible, setDatasetDialogVisible] = useState(false);

    const getParameters = () => {
        let parameters = {
            dataType, 
            dataset, 
            drugSensitivity, 
            genome, 
            rnaTool, 
            rnaRef, 
            dnaTool, 
            dnaRef
        };
        return parameters;
    }
    
    useEffect(() => {
        const initialize = async () => {
            const formDataset = await fetchData('/api/formData');
            formDataInit = formDataset[0];
            formData = formDataset[0];
            rnaRefOptions = formData.rnaRef;
            dnaRefOptions = formData.dnaRef;
            setDataType(formData.dataType[0])
        }
        initialize();
    }, []);

    useEffect(() => {
        if(genome.length === 0){
            //dnaRefOptions = formData.dnaRef;
            rnaRefOptions = formData.rnaRef;
        }else{
            //let dnaRefs = dnaRef;
            let rnaRefs = rnaRef;
            
            if(Array.isArray(genome)){
                let genomeName = genome.map((genome) => {return(genome.name)});
                //dnaRefs = dnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
                rnaRefs = rnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
                //dnaRefOptions = formData.dnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
                rnaRefOptions = formData.rnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
            }else{
                if(Array.isArray(rnaRefs)){
                    //dnaRefs = dnaRef.filter((ref) => {return(genome.name === ref.genome && ref)});
                    rnaRefs = rnaRef.filter((ref) => {return(genome.name === ref.genome && ref)});
                }
                //dnaRefOptions = formData.dnaRef.filter((ref) => {return(genome.name === ref.genome && ref)});
                rnaRefOptions = formData.rnaRef.filter((ref) => {return(genome.name === ref.genome && ref)});
            }
            
            //setDNARef(dnaRefs);
            setRNARef(rnaRefs);
        }  
        const parameters = getParameters();
        context.setParameters(parameters);
    }, [genome])

    useEffect(() => {
        if(context.isRequest){
            // disable the drug sensitivity options if no dataset is selected.
            if(typeof dataset === 'undefined'){
                drugSensitivityOptions = []
                setdisableDSOptions(true)
            }else{
                drugSensitivityOptions = dataset.versions
                let dsCopy = []
                for(let i = 0; i < drugSensitivity.length; i++){
                    if(drugSensitivityOptions.some(el => el.label === drugSensitivity[i].label)){
                        console.log('found')
                        dsCopy.push(drugSensitivity[i])
                    }
                }
                setDrugSensitivity(dsCopy[0])
                setdisableDSOptions(false)
            }

            // if CTRPv2 is selected, then pop up to ask the user if they want to include CCLE data
            if(dataset.name === 'CTRPv2'){
                setDatasetDialogVisible(true)
            }else if(dataset.name === 'FIMM'){
                setRNATool([])
                setRNARef([])
                setdisableRNAToolRef(true)
            }else{
                setdisableRNAToolRef(false)
            }

        }else{
            // enable the drug sensitivity options only if at least one dataset is selected.
            if(dataset.length){
                setdisableDSOptions(false)
            }else{
                setdisableDSOptions(true)
            }

            drugSensitivityOptions = []
            for(let i = 0; i < dataset.length; i++){
                for(let k = 0; k < dataset[i].versions.length; k++){
                    if(!drugSensitivityOptions.some(el => el.label === dataset[i].versions[k].label)){
                        drugSensitivityOptions.push(dataset[i].versions[k])
                    }
                }
            }
            
            if(Array.isArray(drugSensitivity)){
                let dsCopy = []
                for(let i = 0; i < drugSensitivity.length; i++){
                    if(drugSensitivityOptions.some(el => el.label === drugSensitivity[i].label)){
                        dsCopy.push(drugSensitivity[i])
                    }
                }
                setDrugSensitivity(dsCopy)
            }
        }
        
        const parameters = getParameters();
        context.setParameters(parameters);
    }, [dataset])

    useEffect(() => {
        const parameters = getParameters();
        context.setParameters(parameters);
    }, [dataType, drugSensitivity, rnaTool, rnaRef, dnaTool, dnaRef]);

    const setRequestView = (isRequest) => {
        let fData = JSON.parse(JSON.stringify(formData));
        if(isRequest){
            if(dataset.length){
                fData.dataset = dataset;
                setDataset(dataset[0]);
            }
            if(genome.length){
                fData.genome = genome;
                setGenome(genome[0]);
            }
            if(rnaTool.length){
                fData.rnaTool = JSON.parse(JSON.stringify(rnaTool));
                let tools = JSON.parse(JSON.stringify(rnaTool));
                while(tools.length > 2){
                    tools.shift()
                }
                setRNATool(tools)
            }
            if(rnaRef.length){
                fData.rnaRef = rnaRef;
                setRNARef(rnaRef[0]);
            }
        }else{
            if(fData.dataset.length < formDataInit.dataset.length){
                setDataset(fData.dataset);
            }else if(!Array.isArray(dataset)){
                let val  = dataset;
                setDataset([val]);
            }
            if(fData.genome.length < formDataInit.genome.length){
                setGenome(fData.genome);
            }else if(!Array.isArray(genome)){
                let val = genome;
                setGenome([val]);
            }
            if(fData.rnaRef.length < formDataInit.rnaRef.length){
                setRNARef(fData.rnaRef);
            }else if(!Array.isArray(rnaRef)){
                let val  = rnaRef;
                setRNARef([val]);
            }
            fData = formDataInit;
            setdisableRNAToolRef(false)
        }
        formData = fData;
        context.setIsRequest(isRequest);
    }

    const onDatasetDialogYes = (event) => {
        event.preventDefault()
        setDatasetDialogVisible(false)
    }

    const onDatasetDialogNo = (event) => {
        event.preventDefault()
        setdisableRNAToolRef(true)
        setRNATool([])
        setRNARef([])
        setDatasetDialogVisible(false)
    }

    const footer = (
        <div>
            <Button label='Yes' onClick={onDatasetDialogYes}/>
            <Button label='No' onClick={onDatasetDialogNo}/>
        </div> 
    )
    
    return(
        <React.Fragment>
            <Dialog header="CTRP Dataset Selected" footer={footer} visible={datasetDialogVisible} onHide={() => setDatasetDialogVisible(false)} style={{minWidth: '30vw', minHeight: '20vh'}} >
                <h3>CTRP Dataset was selected</h3>
                <div>
                    Would you like to include CCLE RNA sequence data?
                </div>    
            </Dialog>
            <div className='pSetFilterContainer'>
                <div className='pSetFilter'>
                    <h2>PSet Parameters</h2>
                    <div className='filterSet'>
                        <label className='bold'>Request PSet: </label> 
                        <InputSwitch checked={context.isRequest} tooltip="Turn this on to request a PSet." 
                            onChange={(e) => setRequestView(e.value)} />
                    </div>

                    <PSetDropdown id='dataType' isHidden={false} parameterName='Data Type:' selectOne={true}
                        parameterOptions={formData.dataType} selectedParameter={context.parameters.dataType} 
                        handleUpdateSelection={(e) => setDataType(e.value)} />

                    <PSetDropdown id='dataset' isHidden={false} parameterName='Dataset:' selectOne={context.isRequest} 
                        parameterOptions={formData.dataset} selectedParameter={context.parameters.dataset} 
                        handleUpdateSelection={(e) => setDataset(e.value)}/>
                    
                    <PSetDropdown id='drugSensitivity' isHidden={false} parameterName='Drug Sensitivity:' selectOne={context.isRequest} 
                        disabled={disableDSOptions}
                        parameterOptions={drugSensitivityOptions} selectedParameter={context.parameters.drugSensitivity} handleUpdateSelection={(e) => setDrugSensitivity(e.value)} />
                    
                    <PSetDropdown id='genome' isHidden={false} parameterName='Genome:' selectOne={context.isRequest} 
                        parameterOptions={formData.genome} selectedParameter={context.parameters.genome} 
                        handleUpdateSelection={(e) => setGenome(e.value)} />
                    
                    <PSetDropdown id='rnaTool' disabled={disableRNAToolRef} parameterName='RNA Tool:' 
                        parameterOptions={formData.rnaTool} selectedParameter={context.parameters.rnaTool} 
                        handleUpdateSelection={(e) => {
                            if(context.isRequest && e.value.length > 2){
                                while(e.value.length > 2){
                                    e.value.shift()
                                }
                            }
                            setRNATool(e.value)
                        }} />

                    <PSetDropdown id='rnaRef' disabled={disableRNAToolRef} parameterName='RNA Ref:' selectOne={context.isRequest} 
                        parameterOptions={rnaRefOptions} selectedParameter={context.parameters.rnaRef} 
                        handleUpdateSelection={(e) => setRNARef(e.value)} />
                    
                    <PSetDropdown id='dnaTool' disabled={true} parameterName='DNA Tool:' 
                        parameterOptions={formData.dnaTool} selectedParameter={context.parameters.dnaTool} 
                        handleUpdateSelection={(e) => setDNATool(e.value)} />
                    
                    <PSetDropdown id='dnaRef' disabled={true} parameterName='DNA Ref:' 
                        parameterOptions={dnaRefOptions} selectedParameter={context.parameters.dnaRef} 
                        handleUpdateSelection={(e) => setDNARef(e.value)} />
                </div>
            </div>
        </React.Fragment>
    );
}

export default PSetFilter;