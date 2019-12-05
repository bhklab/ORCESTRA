import React from 'react';

class DatasetTabContent extends React.Component{
    
    constructor(){
        super();
        this.getPublication = this.getPublication.bind(this);
    }

    componentDidMount(){
        this.datasetName = this.props.pset.datasetName;
        this.datasetVersion = this.props.pset.datasetVersion;
        this.dataset = this.props.metadata;
        this.publication = '';
        this.publicationLink = '';
        this.drugSesitivity = '';
    }

    getPublication(){
        for(let i = 0; i < this.dataset.length; i++){
            if(this.dataset[i].name === this.datasetName && this.dataset[i].version === this.datasetVersion){
                this.publication = this.dataset[i].publication.citation;
                this.publicationLink = this.dataset[i].publication.link
                break;
            }
        }
    }

    render(){        
        
        return(
            <React.Fragment>
                <h1 className='tabMainHeader'>Dataset: {this.props.pset.datasetName} - {this.props.pset.datasetVersion}</h1>
                <div className='tabContent'>
                    <div className='tabContentSection'>
                        <h3>Publication: </h3>
                        <div className='subContent'>link to publication</div>
                        <div className='subContent'>link to publication</div>
                    </div>
                    <div className='tabContentSection'>
                        <h3>Drug Sensitivity</h3>
                        <h4 className='subContent'>Source: link to raw data source...</h4>
                        <h4 className='subContent'>Version: {this.props.pset.drugSensitivity}</h4>
                    </div>
                </div> 
            </React.Fragment>
        );
    }
}

export default DatasetTabContent;