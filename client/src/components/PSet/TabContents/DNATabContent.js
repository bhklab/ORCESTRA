import React from 'react';
import {PSetToolAccordion, DNARefAccordion} from '../PSetAccordion';

class DNATabContent extends React.Component{
    
    render(){  
        const dataset = this.props.dataset;
        const dna = this.props.metadata;
        const pset = this.props.pset;

        const dbSNP = [];
        const genome = dna.genome
        for(let i = 0; i < genome.length; i++){
            if(pset.exomeRef.includes(genome[i].dbSNP)){
                dbSNP.push(genome[i]);
            }
        }

        const genomeRawData = (
            <div>
                { dataset.rawSeqDataDNA ? <a href={dataset.rawSeqDataDNA}>{dataset.rawSeqDataDNA}</a> : 'Not Available' }
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
                        <DNARefAccordion items={dbSNP} />
                    </div>
                    <div className='tabContentSection'>
                        <h3>Tools and Commands Used</h3>
                        <PSetToolAccordion items={this.props.pset.exomeTool} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default DNATabContent;