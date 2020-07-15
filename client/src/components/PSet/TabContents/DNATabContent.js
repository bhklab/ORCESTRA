import React from 'react';
import {PSetToolAccordion, DNARefAccordion} from '../PSetAccordion';
import AccompanyDataTabContent from './AccompanyDataTabContent';

const DNATabContent = props => {
    const rawSeqDataDNA = props.metadata.find(x => x.name === 'rawSeqDataDNA')
    const dnaRef = props.metadata.find(x => x.name === 'dnaRef')
    const dnaTool = props.metadata.find(x => x.name === 'dnaTool')
    const accDNA = props.metadata.find(x => x.name === 'accDNA')

    return(
        <React.Fragment>
            <h1 className='tabMainHeader'>DNA Data</h1>
            <div className='tabContent'>
                {
                    rawSeqDataDNA &&
                    <div className='tabContentSection'>
                        <h3>Raw Data Source: </h3>
                        <div className='subContent'>
                            <a href={rawSeqDataDNA.value}>{rawSeqDataDNA.value}</a>
                        </div>
                    </div>
                }
                {
                    dnaRef &&
                    <div className='tabContentSection'>
                        <h3>Exome Reference</h3>
                        <DNARefAccordion items={dnaRef.value} />
                    </div>
                }
                {
                    dnaTool &&
                    <div className='tabContentSection'>
                        <h3>Tools and Commands Used</h3>
                        <PSetToolAccordion items={dnaTool.value} />
                    </div>
                }
                {
                    accDNA &&
                    <AccompanyDataTabContent data={accDNA.value} />
                }
            </div>
        </React.Fragment>
    );
}

export default DNATabContent;