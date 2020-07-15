import React from 'react';
import {PSetToolAccordion, RNARefAccordion} from '../PSetAccordion';
import AccompanyDataTabContent from './AccompanyDataTabContent';

const RNATabContent = props => {
    const rawSeqDataRNA = props.metadata.find(x => x.name === 'rawSeqDataRNA')
    const rnaRef = props.metadata.find(x => x.name === 'rnaRef')
    const rnaTool = props.metadata.find(x => x.name === 'rnaTool')
    const accRNA = props.metadata.find(x => x.name === 'accRNA')

    return(
        <React.Fragment>
            <h1 className='tabMainHeader'>RNA Data</h1>
            <div className='tabContent'>
                {
                    rawSeqDataRNA &&
                    <div className='tabContentSection'>
                        <h3>Raw Data Source: </h3>
                        <div className='subContent'>
                            <a href={rawSeqDataRNA.value}>{rawSeqDataRNA.value}</a>
                        </div>
                    </div>
                }
                {
                    rnaRef &&
                    <div className='tabContentSection'>
                        <h3>RNA Transcriptome</h3>
                        <RNARefAccordion items={rnaRef.value} />
                    </div>
                }
                {
                    rnaTool &&
                    <div className='tabContentSection'>
                        <h3>Tools and Commands Used</h3>
                        <PSetToolAccordion items={rnaTool.value} />
                    </div>
                }
                {
                    accRNA &&
                    <AccompanyDataTabContent data={accRNA.value} />
                }
            </div>
        </React.Fragment>
    );
}

export default RNATabContent;