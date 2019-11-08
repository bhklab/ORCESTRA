import React from 'react';
import './PSetRequest.css';

class PSetRequestParameterSelection extends React.Component{

    constructor(){
        super();
        this.displaySelectedParameter = this.displaySelectedParameter.bind(this);
        this.displayNoneSelectedMsg = this.displayNoneSelectedMsg.bind(this);
    }

    displaySelectedParameter(parameters){
        var str = '';
        for(let i = 0; i < parameters.length; i++){
            str += parameters[i].name;
            if(i != parameters.length -1 ){
                str += ', ';
            }
        }
        return(str);
    }

    displayNoneSelectedMsg(){
        return(
            <span className='noneSelectedMsg'>None selected</span>
        );
    }

    render(){
        return(
            <div className='parameterSelectionSet'>
                <div className='parameterName'>
                    {this.props.parameterName}:
                </div>
                <div className='parameterSelection'>
                    {this.props.parameter.length ? this.displaySelectedParameter(this.props.parameter) : this.displayNoneSelectedMsg()}
                </div>
            </div>
        );
    }

}

export default PSetRequestParameterSelection;