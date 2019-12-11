import React from 'react';
import PSetAccordion from '../PSetAccordion';

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

        const dataList = (list) => {
            return(list.map((item) => 
                <div key={item.dbSNP} className='exomeRef'>
                    <div className='subContent'>{item.dbSNP.length ? item.dbSNP: 'Currently not available'}</div>
                    <div className='subContent'>{item.link.length ? <a href={item.link}>{item.link}</a> : 'Currently not available'}</div>
                    <div className='indented-1'>
                        <div className='subContent'>
                            {item.cosmic.name} - <a href={item.cosmic.link}>{item.cosmic.link}</a> 
                        </div>
                        <div className='subContent'>
                            {item.exonTarget.name} - <a href={item.exonTarget.link}>{item.exonTarget.link}</a> 
                        </div>
                    </div>    
                </div>
            ));
        }

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
                        {dataList(dbSNP)}
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