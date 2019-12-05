import React from 'react';
import PSetAccordion from '../PSetAccordion';

class RNATabContent extends React.Component{
    
    render(){   
        const transcriptome = (
            this.props.pset.rnaRef.map((ref) => 
                <div key={ref}>
                    <div className='subContent'>Transcriptome: {ref}</div>
                    <div className='subContent'>Source: link to source</div>
                </div>
            )
        );
        
        return(
            <React.Fragment>
                <h1 className='tabMainHeader'>Analysis Details - RNA Data</h1>
                <div className='tabContent'>
                    <div className='tabContentSection'>
                        <h3>Raw Data Source: </h3>
                        <div className='subContent'>link to source</div>
                    </div>
                    <div className='tabContentSection'>
                        <h3>Genome Version</h3>
                        <div className='subContent'>{this.props.pset.genome}</div>
                    </div>
                    <div className='tabContentSection'>
                        <h3>RNA Transcriptome</h3>
                        {transcriptome}   
                    </div>
                    <div className='tabContentSection'>
                        <h3>Tools and Commands Used</h3>
                        <div className='subContent'>
                            <PSetAccordion items={this.props.pset.rnaTool} />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default RNATabContent;