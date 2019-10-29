import React from 'react';
import './PSetRequest.css';
import Navigation from '../Navigation/Navigation';

class PSetRequest extends React.Component{
    render(){
        return(
            <React.Fragment>
                <Navigation />
                <div className='pageContent'>
                    <h1>PSetRequest Page</h1>
                </div>
            </React.Fragment>
        );
    }
}

export default PSetRequest;