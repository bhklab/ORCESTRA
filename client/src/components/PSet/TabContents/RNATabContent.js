import React from 'react';
import PSetAccordion from '../PSetAccordion';

class RNATabContent extends React.Component{
    
    render(){   
        const dataset = this.props.dataset;
        const rna = this.props.metadata;
        const pset = this.props.pset;
        console.log(dataset);
        const genomeRawData = (   
            <div>
                { dataset.rawSeqDataRNA ? <a href={dataset.rawSeqDataRNA}>{dataset.rawSeqDataRNA}</a> : 'Not Available' }
            </div>
        );

        const refList = [];
        const ref = rna.genome;
        for(let i = 0; i < ref.length; i++){
            if(pset.rnaRef.includes(ref[i].transcriptomeName)){
                refList.push({name: ref[i].transcriptomeName, link: ref[i].transcriptomeLink});
            }
        }

        const transcriptome = (
            refList.map((ref) => 
                <div key={ref.name}>
                    <div className='subContent'>{ref.name}</div>
                    <div className='subContent'><a href={ref.link}>{ref.link}</a></div>
                    <br />
                </div>
            )
        );

        return(
            <React.Fragment>
                <h1 className='tabMainHeader'>Analysis Details - RNA Data</h1>
                <div className='tabContent'>
                    <div className='tabContentSection'>
                        <h3>Raw Data Source: </h3>
                        <div className='subContent'>
                            {genomeRawData}
                        </div>
                    </div>
                    <div className='tabContentSection'>
                        <h3>RNA Transcriptome</h3>
                        {transcriptome}   
                    </div>
                    <div className='tabContentSection'>
                        <h3>Tools and Commands Used</h3>
                        <div className='subContent'>
                            <PSetAccordion items={pset.rnaTool} />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default RNATabContent;