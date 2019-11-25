import React from 'react';
import './Stats.css';
import Navigation from '../Navigation/Navigation';

class Stats extends React.Component{
    render(){
        return(
            <React.Fragment>
                <Navigation routing={this.props} />
                <div className='pageContent'>
                    <h1>Stats Page</h1>
                </div>
            </React.Fragment>
        );
    }
}

export default Stats;