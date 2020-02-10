import React from 'react';
import PSetDropdown from '../Shared/PSetDropdown/PSetDropdown';

class PSetParameterOptions extends React.Component{

    constructor(){
        super();
        this.state = {
            drugSensitivityOptions: [],
            rnaRefOptions: [],
            dnaRefOptions: [],
            hideRNAToolRef: false,
            hideDNAToolRef: false,
            isReady: false
        }
        this.handleFilterChange= this.handleFilterChange.bind(this);
        this.setToolState = this.setToolState.bind(this);
        this.setRefState = this.setRefState.bind(this);
    }

    componentDidMount(){
        this.setState({
            rnaRefOptions: this.props.formData.rnaRef,
            dnaRefOptions: this.props.formData.dnaRef,
            isReady: true
        });
    }

    async handleFilterChange(event){
        event.preventDefault();
        await this.props.setParentState([{name: event.target.id, value: event.value}]);
        if(event.target.id === 'dataType'){
            this.setToolState(event);
            
        }else if(event.target.id === 'genome'){
            this.setRefState(event)
        }else if(event.target.id === 'dataset'){
            console.log(event.value);
            this.setState({
                drugSensitivityOptions: [event.value.drugSensitivity]
            });
            await this.props.setParentState([{name: 'drugSensitivity', value: event.value.drugSensitivity}]);
        }
        if(this.props.autoUpdate){
            this.props.requestUpdate(); 
        } 
    }

    async setToolState(event){
        if(event.value.length === 1){
            if(this.props.parameters.dataType[0].name === 'RNA'){             
                this.setState({
                    hideDNAToolRef: true
                });
                await this.props.setParentState([
                    {name: "dnaTool", value: []},
                    {name: "dnaRef", value: []}
                ]);
            }else{
                this.setState({
                    hideRNAToolRef: true
                });
                await this.props.setParentState([
                    {name: "rnaTool", value: []},
                    {name: "rnaRef", value: []}
                ]);
            }
        }else{
            this.setState({
                hideDNAToolRef: false,
                hideRNAToolRef: false
            });
        }
    }

    async setRefState(event){
        if(event.value.length === 0){
            this.setState({
                dnaRefOptions: this.props.formData.dnaRef,
                rnaRefOptions: this.props.formData.rnaRef
            });
        }else{
            let dnaRef = this.props.parameters.dnaRef;
            let rnaRef = this.props.parameters.rnaRef;
            
            if(Array.isArray(this.props.parameters.genome)){
                let genomeName = this.props.parameters.genome.map((genome) => {return(genome.name)});
                dnaRef = dnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
                rnaRef = rnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
                this.setState({
                    dnaRefOptions: this.props.formData.dnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)}),
                    rnaRefOptions: this.props.formData.rnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)})
                });
            }else{
                dnaRef = dnaRef.filter((ref) => {return(this.props.parameters.genome.name === ref.genome && ref)});
                rnaRef = rnaRef.filter((ref) => {return(this.props.parameters.genome.name === ref.genome && ref)});
                this.setState({
                    dnaRefOptions: this.props.formData.dnaRef.filter((ref) => {return(this.props.parameters.genome.name === ref.genome && ref)}),
                    rnaRefOptions: this.props.formData.rnaRef.filter((ref) => {return(this.props.parameters.genome.name === ref.genome && ref)})
                });
            }
            
            await this.props.setParentState([
                {name: 'dnaRef', value: dnaRef},
                {name: 'rnaRef', value: rnaRef}
            ]);
        }  
    }
    
    render(){
        return(
            this.state.isReady ? 
                <React.Fragment>
                        <PSetDropdown id='dataType' className={this.props.dropdownClassName} isHidden={false} parameterName='Data Type:' 
                            parameterOptions={this.props.formData.dataType} selectedParameter={this.props.parameters.dataType} handleUpdateSelection={this.handleFilterChange} />

                        <PSetDropdown id='dataset' className={this.props.dropdownClassName} isHidden={false} parameterName='Dataset:' selectOne={this.props.selectOne} 
                            parameterOptions={this.props.formData.dataset} selectedParameter={this.props.parameters.dataset} handleUpdateSelection={this.handleFilterChange} />
                        
                        {/* <PSetDropdown id='drugSensitivity' className={this.props.dropdownClassName} isHidden={false} parameterName='Drug Sensitivity:' selectOne={true} disabled={true} 
                            parameterOptions={this.state.drugSensitivityOptions} selectedParameter={this.props.parameters.drugSensitivity} handleUpdateSelection={this.handleFilterChange} /> */}
                        
                        <PSetDropdown id='genome' className={this.props.dropdownClassName} isHidden={false} parameterName='Genome:' selectOne={this.props.selectOne} 
                            parameterOptions={this.props.formData.genome} selectedParameter={this.props.parameters.genome} handleUpdateSelection={this.handleFilterChange} />
                        
                        <PSetDropdown id='rnaTool' className={this.props.dropdownClassName} isHidden={this.state.hideRNAToolRef} parameterName='RNA Tool:' 
                            parameterOptions={this.props.formData.rnaTool} selectedParameter={this.props.parameters.rnaTool} handleUpdateSelection={this.handleFilterChange} />

                        <PSetDropdown id='rnaRef' className={this.props.dropdownClassName} isHidden={this.state.hideRNAToolRef} parameterName='RNA Ref:' 
                            parameterOptions={this.state.rnaRefOptions} selectedParameter={this.props.parameters.rnaRef} handleUpdateSelection={this.handleFilterChange} />
                        
                        <PSetDropdown id='dnaTool' className={this.props.dropdownClassName} isHidden={this.state.hideDNAToolRef} parameterName='DNA Tool:' 
                            parameterOptions={this.props.formData.dnaTool} selectedParameter={this.props.parameters.dnaTool} handleUpdateSelection={this.handleFilterChange} />
                        
                        <PSetDropdown id='dnaRef' className={this.props.dropdownClassName} isHidden={this.state.hideDNAToolRef} parameterName='DNA Ref:' 
                            parameterOptions={this.state.dnaRefOptions} selectedParameter={this.props.parameters.dnaRef} handleUpdateSelection={this.handleFilterChange} />
                </React.Fragment>
                :
                <div></div>
        );
    }

}
export default PSetParameterOptions;