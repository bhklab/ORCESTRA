import React, {useState, useEffect} from 'react';
import PSetDropdown from '../Shared/PSetDropdown/PSetDropdown';

const PSetParameterOptions = (props) =>{

    const [drugSensitivityOptions, setDrugSensitivityOptions] = useState([]);
    const [rnaRefOptions, setRNARefOptions] = useState([]);
    const [dnaRefOptions, setDNARefOptions] = useState([]);
    const [hideRNAToolRef, setHideRNAToolRef] = useState(false);
    const [hideDNAToolRef, setHideDNAToolRef] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setRNARefOptions(props.formData.rnaRef);
        setDNARefOptions(props.formData.dnaRef);
        setIsReady(true);
    }, []);

    const handleFilterChange = async (event) => {
        event.preventDefault();
        await props.setParentState([{name: event.target.id, value: event.value}]);
        if(event.target.id === 'dataType'){
            setToolState(event);
            
        }else if(event.target.id === 'genome'){
            setRefState(event)
        }else if(event.target.id === 'dataset'){
            console.log(event.value);
            setDrugSensitivityOptions([event.value.drugSensitivity]);
            await props.setParentState([{name: 'drugSensitivity', value: event.value.drugSensitivity}]);
        }
        props.requestUpdate(); 
    }

    const setToolState = async (event) => {
        if(event.value.length === 1){
            if(props.parameters.dataType[0].name === 'RNA'){             
                setHideDNAToolRef(true);
                await props.setParentState([
                    {name: "dnaTool", value: []},
                    {name: "dnaRef", value: []}
                ]);
            }else{
                setHideRNAToolRef(true);
                await props.setParentState([
                    {name: "rnaTool", value: []},
                    {name: "rnaRef", value: []}
                ]);
            }
        }else{
            setHideRNAToolRef(false);
            setHideDNAToolRef(false);
        }
    }

    const setRefState = async (event) => {
        if(event.value.length === 0){
            setDNARefOptions(props.formData.dnaRef);
            setRNARefOptions(props.formData.rnaRef);
        }else{
            let dnaRef = props.parameters.dnaRef;
            let rnaRef = props.parameters.rnaRef;
            
            if(Array.isArray(props.parameters.genome)){
                let genomeName = props.parameters.genome.map((genome) => {return(genome.name)});
                dnaRef = dnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
                rnaRef = rnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
                setDNARefOptions(props.formData.dnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)}));
                setRNARefOptions(props.formData.rnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)}));
            }else{
                dnaRef = dnaRef.filter((ref) => {return(props.parameters.genome.name === ref.genome && ref)});
                rnaRef = rnaRef.filter((ref) => {return(props.parameters.genome.name === ref.genome && ref)});
                setDNARefOptions(props.formData.dnaRef.filter((ref) => {return(props.parameters.genome.name === ref.genome && ref)}));
                setRNARefOptions(props.formData.rnaRef.filter((ref) => {return(props.parameters.genome.name === ref.genome && ref)}));
            }
            
            await props.setParentState([
                {name: 'dnaRef', value: dnaRef},
                {name: 'rnaRef', value: rnaRef}
            ]);
        }  
    }
    
    return(
        isReady ? 
            <React.Fragment>
                    <PSetDropdown id='dataType' className={props.dropdownClassName} isHidden={false} parameterName='Data Type:' 
                        parameterOptions={props.formData.dataType} selectedParameter={props.parameters.dataType} handleUpdateSelection={handleFilterChange} />

                    <PSetDropdown id='dataset' className={props.dropdownClassName} isHidden={false} parameterName='Dataset:' selectOne={props.selectOne} 
                        parameterOptions={props.formData.dataset} selectedParameter={props.parameters.dataset} handleUpdateSelection={handleFilterChange} />
                    
                    {/* <PSetDropdown id='drugSensitivity' className={this.props.dropdownClassName} isHidden={false} parameterName='Drug Sensitivity:' selectOne={true} disabled={true} 
                        parameterOptions={this.state.drugSensitivityOptions} selectedParameter={this.props.parameters.drugSensitivity} handleUpdateSelection={this.handleFilterChange} /> */}
                    
                    <PSetDropdown id='genome' className={props.dropdownClassName} isHidden={false} parameterName='Genome:' selectOne={props.selectOne} 
                        parameterOptions={props.formData.genome} selectedParameter={props.parameters.genome} handleUpdateSelection={handleFilterChange} />
                    
                    <PSetDropdown id='rnaTool' className={props.dropdownClassName} isHidden={hideRNAToolRef} parameterName='RNA Tool:' 
                        parameterOptions={props.formData.rnaTool} selectedParameter={props.parameters.rnaTool} handleUpdateSelection={handleFilterChange} />

                    <PSetDropdown id='rnaRef' className={props.dropdownClassName} isHidden={hideRNAToolRef} parameterName='RNA Ref:' 
                        parameterOptions={rnaRefOptions} selectedParameter={props.parameters.rnaRef} handleUpdateSelection={handleFilterChange} />
                    
                    <PSetDropdown id='dnaTool' className={props.dropdownClassName} isHidden={hideDNAToolRef} parameterName='DNA Tool:' 
                        parameterOptions={props.formData.dnaTool} selectedParameter={props.parameters.dnaTool} handleUpdateSelection={handleFilterChange} />
                    
                    <PSetDropdown id='dnaRef' className={props.dropdownClassName} isHidden={hideDNAToolRef} parameterName='DNA Ref:' 
                        parameterOptions={dnaRefOptions} selectedParameter={props.parameters.dnaRef} handleUpdateSelection={handleFilterChange} />
            </React.Fragment>
        :
            <div></div>
    );
}
export default PSetParameterOptions;