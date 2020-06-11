import React from 'react';
import {PSetToolAccordion, RNARefAccordion} from '../PSetAccordion';

class RNATabContent extends React.Component{
    
    render(){   
        const genomeRawData = (   
            <div>
                { this.props.metadata.rawSeqDataRNA ? <a href={this.props.metadata.rawSeqDataRNA}>{this.props.metadata.rawSeqDataRNA}</a> : 'Not Available' }
            </div>
        );

        return(
            <React.Fragment>
                <h1 className='tabMainHeader'>Analysis Details - RNA Sequence Data</h1>
                <div className='tabContent'>
                    <div className='tabContentSection'>
                        <h3>Raw Data Source: </h3>
                        <div className='subContent'>
                            {genomeRawData}
                        </div>
                    </div>
                    <div className='tabContentSection'>
                        <h3>RNA Transcriptome</h3>
                        <RNARefAccordion items={this.props.metadata.rnaRef} />
                    </div>
                    <div className='tabContentSection'>
                        <h3>Tools and Commands Used</h3>
                        <PSetToolAccordion items={this.props.metadata.rnaTool} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default RNATabContent;