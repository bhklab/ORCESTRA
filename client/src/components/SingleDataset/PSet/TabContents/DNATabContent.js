import React from 'react';
import {PSetToolAccordion, DNARefAccordion} from '../PSetAccordion';
import AccompanyDataTabContent from './AccompanyDataTabContent';
import { TabHeader, TabContent, TabContentSection} from '../../SingleDatasetStyle';

const DNATabContent = props => {
    const rawSeqDataDNA = props.metadata.rawSeqDataDNA;
    const dnaRef = props.metadata.dnaRef
    const dnaTool = props.metadata.dnaTool
    const accDNA = props.metadata.accDNA

    return(
        <React.Fragment>
            <TabHeader>DNA Data</TabHeader>
            <TabContent>
                {
                    rawSeqDataDNA &&
                    <TabContentSection>
                        <h3>Raw Data Source: </h3>
                        <div className='subContent'>
                            <a href={rawSeqDataDNA.soruce}>{rawSeqDataDNA.source}</a>
                        </div>
                    </TabContentSection>
                }
                {
                    dnaRef &&
                    <TabContentSection>
                        <h3>Exome Reference</h3>
                        <DNARefAccordion items={dnaRef} />
                    </TabContentSection>
                }
                {
                    dnaTool &&
                    <TabContentSection>
                        <h3>Tools and Commands Used</h3>
                        <PSetToolAccordion items={dnaTool} />
                    </TabContentSection>
                }
                {
                    accDNA &&
                    <AccompanyDataTabContent data={accDNA} />
                }
            </TabContent>
        </React.Fragment>
    );
}

export default DNATabContent;