import React from 'react';
import PSetAccordion from '../PSetAccordion';

class DNATabContent extends React.Component{
    
    render(){  
        
        return(
            <React.Fragment>
                <h1 className='tabMainHeader'>Analysis Details - DNA(Exome) Data</h1>
                <div className='tabContent'>
                    <div className='tabContentSection'>
                        <h3>Raw Data Source: </h3>
                        <div className='subContent'>Dataset Name - Release date</div>
                    </div>
                    <div className='tabContentSection'>
                        <h3>Genome Version</h3>
                        <div className='subContent'>{this.props.pset.genome}</div>
                    </div>
                    <div className='tabContentSection'>
                        <h3>Exome dbSNP</h3>
                        <div className='subContent'>dbSNP</div>
                    </div>
                    <div className='tabContentSection'>
                        <h3>Exome COSMIC</h3>
                        <div className='subContent'>cosmic</div>
                    </div>
                    <div className='tabContentSection'>
                        <h3>Exon Target Region</h3>
                        <div className='subContent'>exon target</div>
                    </div>
                    <div className='tabContentSection'>
                        <h3>Tools and Commands Used</h3>
                        <div className='subContent'>
                            <PSetAccordion items={this.props.pset.exomeTool} />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default DNATabContent;