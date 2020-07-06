import React, {useState, useEffect, useContext} from 'react';
import {InputSwitch} from 'primereact/inputswitch';
import PSetDropdown from '../../Shared/PSetDropdown/PSetDropdown';
import {SearchReqContext} from '../PSetSearch';
import './PSetFilter.css';

let formDataInit = {};
let formData = {};
let drugSensitivityOptions = [];
let rnaRefOptions = [];
let accRNAOptions = [];
let accDNAOptions = [];

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
    const [accRNA, setAccRNA] = useState([]);
    const [accDNA, setAccDNA] = useState([]);

    const [disableDSOptions, setdisableDSOptions] = useState(true);
    const [disableRNAToolRef, setdisableRNAToolRef] = useState(false);
    const [disableAccRNA, setDisableAccRNA] = useState(true);
    const [disableAccDNA, setDisableAccDNA] = useState(true);

    const getParameters = () => {
        let parameters = {
            dataType, 
            dataset, 
            drugSensitivity, 
            genome, 
            rnaTool, 
            rnaRef,
            accRNA,
            accDNA
        };
        return parameters;
    }
    
    useEffect(() => {
        const initialize = async () => {
            const formDataset = await fetchData('/api/formData');
            console.log(formDataset)
            formDataInit = formDataset;
            formData = formDataset;
            rnaRefOptions = formData.rnaRef;
            setDataType(formData.dataType[0])
        }
        initialize();
    }, []);

    useEffect(() => {
        if(genome.length === 0){
            rnaRefOptions = formData.rnaRef;
            context.setParameters(getParameters());
        }else{
            let rnaRefs = rnaRef;
            
            if(Array.isArray(genome)){
                let genomeName = genome.map((genome) => {return(genome.name)});
                rnaRefs = rnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
                rnaRefOptions = formData.rnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
            }else{
                if(Array.isArray(rnaRefs)){
                    rnaRefs = rnaRef.filter((ref) => {return(genome.name === ref.genome && ref)});
                }
                rnaRefOptions = formData.rnaRef.filter((ref) => {return(genome.name === ref.genome && ref)});
            }
            setRNARef(rnaRefs);
        }  
    }, [genome])

    useEffect(() => {
        if(context.isRequest){
            // disable the drug sensitivity options if no dataset is selected.
            if(typeof dataset === 'undefined'){
                drugSensitivityOptions = []
                setdisableDSOptions(true)
            }else{
                drugSensitivityOptions = dataset.versions
                if(drugSensitivity.length){
                    let dsCopy = []
                    for(let i = 0; i < drugSensitivity.length; i++){
                        if(drugSensitivityOptions.some(el => el.label === drugSensitivity[i].label)){
                            console.log('found')
                            dsCopy.push(drugSensitivity[i])
                        }
                    }
                    setDrugSensitivity(dsCopy[0])
                }
                setdisableDSOptions(false)
            }

            // handle events when each dataset is selected
            switch(dataset.name){
                case 'CCLE':
                    setAccRNA([])
                    setAccDNA([])    
                    accRNAOptions = formData.accompanyRNA.filter(rna => {return rna.dataset === 'CCLE'})
                    accDNAOptions = formData.accompanyDNA.filter(dna => {return dna.dataset === 'CCLE'})
                    setdisableRNAToolRef(false)
                    setDisableAccRNA(false)
                    setDisableAccDNA(false)
                    break;
                case 'CTRPv2':
                    setRNATool([])
                    setRNARef([])
                    setAccRNA([])
                    setAccDNA([])
                    setdisableRNAToolRef(true)
                    setDisableAccRNA(true)
                    setDisableAccDNA(true)
                    break;
                case 'FIMM':
                    setRNATool([])
                    setRNARef([])
                    setAccRNA([])
                    setAccDNA([])
                    setdisableRNAToolRef(true)
                    setDisableAccRNA(true)
                    setDisableAccDNA(true)
                    break;
                case 'gCSI':
                    setAccRNA([])
                    setAccDNA([])
                    accDNAOptions = formData.accompanyDNA.filter(dna => {return dna.dataset === 'gCSI'})
                    setdisableRNAToolRef(false)
                    setDisableAccRNA(true)
                    setDisableAccDNA(false)
                    break;
                case 'GDSC':
                    setAccRNA([])
                    setAccDNA([])
                    accRNAOptions = formData.accompanyRNA.filter(rna => {return rna.dataset === 'GDSC'})
                    accDNAOptions = formData.accompanyDNA.filter(dna => {return dna.dataset === 'GDSC'})
                    setdisableRNAToolRef(false)
                    setDisableAccRNA(false)
                    setDisableAccDNA(false)
                    break;
                case 'UHNBreast':
                    setAccRNA([])
                    setAccDNA([])
                    setdisableRNAToolRef(false)
                    setDisableAccRNA(true)
                    setDisableAccDNA(true)
                    break;
                default:
                    setAccRNA([])
                    setAccDNA([])
                    setdisableRNAToolRef(false)
                    setDisableAccRNA(true)
                    setDisableAccDNA(true)
                    break;
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
    }, [dataset])

    useEffect(() => {
        context.setParameters(getParameters());
    }, [dataType, drugSensitivity, rnaTool, rnaRef, accRNA, accDNA]);

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
            setAccRNA([])
            setAccDNA([])
        }
        formData = fData;
        context.setIsRequest(isRequest);
    }
    
    return(
        <React.Fragment>
            <div className='pSetFilterContainer'>
                <div className='pSetFilter'>
                    <h2>PSet Parameters</h2>
                    <div className='filterSet'>
                        <label className='bold'>Request PSet: </label> 
                        <InputSwitch checked={context.isRequest} tooltip="Turn this on to request a PSet." 
                            onChange={(e) => {
                                context.setSearch(false)
                                setRequestView(e.value)
                            }
                        } />
                    </div>

                    <PSetDropdown id='dataType' isHidden={false} parameterName='Data Type:' selectOne={true}
                        parameterOptions={formData.dataType} selectedParameter={context.parameters.dataType} 
                        handleUpdateSelection={(e) => {
                            context.setSearch(true)
                            setDataType(e.value)
                        }} />

                    <PSetDropdown id='dataset' isHidden={false} parameterName='Dataset:' selectOne={context.isRequest} 
                        parameterOptions={formData.dataset} selectedParameter={context.parameters.dataset} 
                        handleUpdateSelection={(e) => {
                            context.setSearch(true)
                            setDataset(e.value)
                        }} />
                    
                    <PSetDropdown id='drugSensitivity' isHidden={false} parameterName='Drug Sensitivity:' selectOne={context.isRequest} 
                        disabled={disableDSOptions}
                        parameterOptions={drugSensitivityOptions} selectedParameter={context.parameters.drugSensitivity} 
                        handleUpdateSelection={(e) => {
                            context.setSearch(true)
                            setDrugSensitivity(e.value)
                        }} />
                    
                    <PSetDropdown id='genome' isHidden={false} parameterName='Genome:' selectOne={context.isRequest} 
                        parameterOptions={formData.genome} selectedParameter={context.parameters.genome} 
                        handleUpdateSelection={(e) => {
                            context.setSearch(true)
                            setGenome(e.value)
                        }} />
                    
                    <PSetDropdown id='rnaTool' disabled={disableRNAToolRef} parameterName='RNA Tool:' 
                        parameterOptions={formData.rnaTool} selectedParameter={context.parameters.rnaTool} 
                        handleUpdateSelection={(e) => {
                            if(context.isRequest && e.value.length > 2){
                                while(e.value.length > 2){
                                    e.value.shift()
                                }
                            }
                            context.setSearch(true)
                            setRNATool(e.value)
                        }} />

                    <PSetDropdown id='rnaRef' disabled={disableRNAToolRef} parameterName='RNA Ref:' selectOne={context.isRequest} 
                        parameterOptions={rnaRefOptions} selectedParameter={context.parameters.rnaRef} 
                        handleUpdateSelection={(e) => {
                            context.setSearch(true)
                            setRNARef(e.value)
                        }} />
                    {
                        context.isRequest &&
                        <PSetDropdown id='accRNA' disabled={disableAccRNA} parameterName='Accompanying RNA:' 
                            parameterOptions={accRNAOptions} selectedParameter={context.parameters.accRNA} 
                            handleUpdateSelection={(e) => {
                                context.setSearch(true)
                                setAccRNA(e.value)
                            }} />
                    }
                    {
                        context.isRequest &&
                        <PSetDropdown id='accDNA' disabled={disableAccDNA} parameterName='Accompanying DNA:' 
                            parameterOptions={accDNAOptions} selectedParameter={context.parameters.accDNA} 
                            handleUpdateSelection={(e) => {
                                context.setSearch(true)
                                setAccDNA(e.value)
                            }} />
                    }
                </div>
            </div>
        </React.Fragment>
    );
}

export default PSetFilter;