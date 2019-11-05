import React from 'react';
import './PSetRequest.css';
import Navigation from '../Navigation/Navigation';

class PSetRequest extends React.Component{
    
    constructor(){
        super();
        this.state = {
            datasets: []
        }
    }
    
    componentDidMount(){
		fetch('/pset')  
            .then(res => res.json())
            .then(datasets=> this.setState({datasets}));
    }
    
    render(){
        return(
            <React.Fragment>
                <Navigation />
                <div className='pageContent'>
                    <h1>Request Pipeline Analysis</h1>
                    {<ul>
                        {this.state.datasets.map((data) => 
                            <li>
                                {data.id}
                            </li>
                        )}
                    </ul>}
                </div>
            </React.Fragment>
        );
    }
}

export default PSetRequest;