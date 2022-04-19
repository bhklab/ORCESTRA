import React from 'react';
import {PSetToolAccordion, RNARefAccordion} from '../../PSet/PSetAccordion';
import AccompanyDataTabContent from '../../PSet/TabContents/AccompanyDataTabContent';
import { TabHeader, TabContent, TabContentSection} from '../../SingleDatasetStyle';

const RNATabContent = props => {
    const { rawSeqDataRNA,  rnaRef, rnaTool, accRNA} = props.metadata;

    return(
        <React.Fragment>
            <TabHeader>RNA Data</TabHeader>
            <TabContent>
                {
                    rawSeqDataRNA &&
                    <TabContentSection>
                        <h3>Raw Data Source: </h3>
                        <div className='subContent'>
                            <a href={rawSeqDataRNA.source}>{rawSeqDataRNA.source}</a>
                        </div>
                    </TabContentSection>
                }
                {
                    rnaRef &&
                    <TabContentSection>
                        <h3>RNA Transcriptome</h3>
                        <RNARefAccordion items={rnaRef} />
                    </TabContentSection>
                }
                {
                    rnaTool &&
                    <TabContentSection>
                        <h3>Tools and Commands Used</h3>
                        <PSetToolAccordion items={rnaTool} />
                    </TabContentSection>
                }
                {
                    accRNA &&
                    <AccompanyDataTabContent data={accRNA} />
                }
            </TabContent>
        </React.Fragment>
    );
}

export default RNATabContent;