import React from 'react';
import {PSetToolAccordion, DNARefAccordion} from '../PSetAccordion';
import AccompanyDataTabContent from './AccompanyDataTabContent';
import { TabHeader, TabContent, TabContentSection} from '../PSetStyle';

const DNATabContent = props => {
    const rawSeqDataDNA = props.metadata.find(x => x.name === 'rawSeqDataDNA')
    const dnaRef = props.metadata.find(x => x.name === 'dnaRef')
    const dnaTool = props.metadata.find(x => x.name === 'dnaTool')
    const accDNA = props.metadata.find(x => x.name === 'accDNA')

    return(
        <React.Fragment>
            <TabHeader>DNA Data</TabHeader>
            <TabContent>
                {
                    rawSeqDataDNA &&
                    <TabContentSection>
                        <h3>Raw Data Source: </h3>
                        <div className='subContent'>
                            <a href={rawSeqDataDNA.value}>{rawSeqDataDNA.value}</a>
                        </div>
                    </TabContentSection>
                }
                {
                    dnaRef &&
                    <TabContentSection>
                        <h3>Exome Reference</h3>
                        <DNARefAccordion items={dnaRef.value} />
                    </TabContentSection>
                }
                {
                    dnaTool &&
                    <TabContentSection>
                        <h3>Tools and Commands Used</h3>
                        <PSetToolAccordion items={dnaTool.value} />
                    </TabContentSection>
                }
                {
                    accDNA &&
                    <AccompanyDataTabContent data={accDNA.value} />
                }
            </TabContent>
        </React.Fragment>
    );
}

export default DNATabContent;