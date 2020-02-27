import React, {useState, useEffect, useContext} from 'react';
import {InputSwitch} from 'primereact/inputswitch';
import PSetDropdown from '../../Shared/PSetDropdown/PSetDropdown';
import {SearchReqContext} from '../PSetSearch';
import './PSetFilter.css';

let formDataInit = {};
let formData = {};
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

    const [drugSensitivityOptions, setDrugSensitivityOptions] = useState([]);
    const [hideRNAToolRef, setHideRNAToolRef] = useState(false);
    const [hideDNAToolRef, setHideDNAToolRef] = useState(false);

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
        }
        initialize();
    }, []);
    
    useEffect(() => {
        if(dataType.length === 1){
            if(dataType[0].name === 'RNA'){             
                setHideDNAToolRef(true);
                setDNATool([]);
                setDNARef([]);
            }else{
                setHideRNAToolRef(true);
                setRNATool([]);
                setRNARef([]);
            }
        }else{
            setHideRNAToolRef(false);
            setHideDNAToolRef(false);
        }
        const parameters = getParameters();
        context.setParameters(parameters);
    }, [dataType]);

    useEffect(() => {
        if(genome.length === 0){
            dnaRefOptions = formData.dnaRef;
            rnaRefOptions = formData.rnaRef;
        }else{
            let dnaRefs = dnaRef;
            let rnaRefs = rnaRef;
            
            if(Array.isArray(genome)){
                let genomeName = genome.map((genome) => {return(genome.name)});
                dnaRefs = dnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
                rnaRefs = rnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
                dnaRefOptions = formData.dnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
                rnaRefOptions = formData.rnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
            }else{
                dnaRefs = dnaRef.filter((ref) => {return(genome.name === ref.genome && ref)});
                rnaRefs = rnaRef.filter((ref) => {return(genome.name === ref.genome && ref)});
                dnaRefOptions = formData.dnaRef.filter((ref) => {return(genome.name === ref.genome && ref)});
                rnaRefOptions = formData.rnaRef.filter((ref) => {return(genome.name === ref.genome && ref)});
            }
            
            setDNARef(dnaRefs);
            setRNARef(rnaRefs);
        }  
        const parameters = getParameters();
        context.setParameters(parameters);
    }, [genome])

    useEffect(() => {
        const parameters = getParameters();
        context.setParameters(parameters);
    }, [dataset, rnaTool, rnaRef, dnaTool, dnaRef]);

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
            fData = formDataInit;
        }
        formData = fData;
        context.setParameters(getParameters());
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
                            onChange={(e) => setRequestView(e.value)} />
                    </div>
                    <PSetDropdown id='dataType' isHidden={false} parameterName='Data Type:' 
                        parameterOptions={formData.dataType} selectedParameter={context.parameters.dataType} 
                        handleUpdateSelection={(e) => setDataType(e.value)} />

                    <PSetDropdown id='dataset' isHidden={false} parameterName='Dataset:' selectOne={context.isRequest} 
                        parameterOptions={formData.dataset} selectedParameter={context.parameters.dataset} 
                        handleUpdateSelection={(e) => setDataset(e.value)} />
                    
                    {/* <PSetDropdown id='drugSensitivity' className={this.props.dropdownClassName} isHidden={false} parameterName='Drug Sensitivity:' selectOne={true} disabled={true} 
                        parameterOptions={this.state.drugSensitivityOptions} selectedParameter={this.props.parameters.drugSensitivity} handleUpdateSelection={this.handleFilterChange} /> */}
                    
                    <PSetDropdown id='genome' isHidden={false} parameterName='Genome:' selectOne={context.isRequest} 
                        parameterOptions={formData.genome} selectedParameter={context.parameters.genome} 
                        handleUpdateSelection={(e) => setGenome(e.value)} />
                    
                    <PSetDropdown id='rnaTool' isHidden={hideRNAToolRef} parameterName='RNA Tool:' 
                        parameterOptions={formData.rnaTool} selectedParameter={context.parameters.rnaTool} 
                        handleUpdateSelection={(e) => setRNATool(e.value)} />

                    <PSetDropdown id='rnaRef' isHidden={hideRNAToolRef} parameterName='RNA Ref:' 
                        parameterOptions={rnaRefOptions} selectedParameter={context.parameters.rnaRef} 
                        handleUpdateSelection={(e) => setRNARef(e.value)} />
                    
                    <PSetDropdown id='dnaTool' isHidden={hideDNAToolRef} parameterName='DNA Tool:' 
                        parameterOptions={formData.dnaTool} selectedParameter={context.parameters.dnaTool} 
                        handleUpdateSelection={(e) => setDNATool(e.value)} />
                    
                    <PSetDropdown id='dnaRef' isHidden={hideDNAToolRef} parameterName='DNA Ref:' 
                        parameterOptions={dnaRefOptions} selectedParameter={context.parameters.dnaRef} 
                        handleUpdateSelection={(e) => setDNARef(e.value)} />
                </div>
            </div>
        </React.Fragment>
    );
}

export default PSetFilter;