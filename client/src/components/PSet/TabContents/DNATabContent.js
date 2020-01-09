import React from 'react';
import {PSetToolAccordion, DNARefAccordion} from '../PSetAccordion';

class DNATabContent extends React.Component{
    
    render(){  
        const genomeRawData = (
            <div>
                { this.props.metadata.rawSeqDataDNA ? <a href={this.props.metadata.rawSeqDataDNA}>{this.props.metadata.rawSeqDataDNA}</a> : 'Not Available' }
            </div>
        );

        return(
            <React.Fragment>
                <h1 className='tabMainHeader'>Analysis Details - DNA(Exome) Data</h1>
                <div className='tabContent'>
                    <div className='tabContentSection'>
                        <h3>Raw Data Source: </h3>
                        <div className='subContent'>
                            {genomeRawData}
                        </div>
                    </div>
                    <div className='tabContentSection'>
                        <h3>Exome Reference</h3>
                        <DNARefAccordion items={this.props.metadata.dnaRef} />
                    </div>
                    <div className='tabContentSection'>
                        <h3>Tools and Commands Used</h3>
                        <PSetToolAccordion items={this.props.metadata.dnaTool} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default DNATabContent;