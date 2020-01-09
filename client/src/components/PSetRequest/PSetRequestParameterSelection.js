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
                str += parameters[i].label;
                if(i !== parameters.length -1 ){
                    str += ', ';
                }
            }
        }else{
            str = parameters.label;
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