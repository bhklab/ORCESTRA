import React from 'react';

class DatasetTabContent extends React.Component{

    render(){          
        const publication = (
            <div>    
            {this.props.metadata.publication ? 
                <div>
                    <div className='subContent'>{this.props.metadata.publication.citation}</div>
                    <br />
                    <div className='subContent'><a href={this.props.metadata.publicationLink}>{this.props.metadata.publicationLink}</a></div>
                </div>
                :
                <div className="subContent">
                    Not available.
                </div>
                }  
            </div> 
        );
        
        return(
            <React.Fragment>
                <h1 className='tabMainHeader'>Dataset: {this.props.pset.datasetName} - {this.props.pset.datasetVersion}</h1>
                <div className='tabContent'>
                    <div className='tabContentSection'>
                        <h3>Publication: </h3>
                        {publication}
                    </div>
                    <div className='tabContentSection'>
                        <h3>Drug Sensitivity</h3>
                        <h4 className='subContent'>Source: {this.props.metadata.drugSensitivity ? <a href={this.props.metadata.drugSensitivity}>{this.props.metadata.drugSensitivity}</a> : 'Not available'}</h4>
                        <h4 className='subContent'>Version: {this.props.pset.drugSensitivity}</h4>
                    </div>
                    <div className='tabContentSection'>
                        <h3>Genome Version</h3>
                        <div className='subContent'>{this.props.pset.genome}</div>
                    </div>
                </div> 
            </React.Fragment>
        );
    }
}

export default DatasetTabContent;