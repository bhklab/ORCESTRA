import React from 'react';
import './PSetRequest.css';

// props: isHidden, parameterName, parameter[]

class PSetRequestParameterSelection extends React.Component{

    constructor(){
        super();
        this.displaySelectedParameter = this.displaySelectedParameter.bind(this);
    }

    displaySelectedParameter(parameters){
        var str = '';
        if(Array.isArray(parameters)){
            for(let i = 0; i < parameters.length; i++){
                str += parameters[i].name;
                if(i !== parameters.length -1 ){
                    str += ', ';
                }
            }
        }else if(this.props.parameterName === 'Dataset' && typeof parameters.name != 'undefined'){
            str = parameters.name + ' - ' + parameters.version;
        }else{
            str = parameters.name;
        }
        if(str){
            return(str);
        }
        return(
            <span className='noneSelectedMsg'>None selected</span>
        );
    }

    render(){
        if(this.props.isHidden){
            return(null);
        }
        return(
            <div className='parameterSelectionSet'>
                <div className='parameterName'>
                    {this.props.parameterName}:
                </div>
                <div className='parameterSelection'>
                    {this.displaySelectedParameter(this.props.parameter)}
                </div>
            </div>
        );
    }

}

export default PSetRequestParameterSelection;