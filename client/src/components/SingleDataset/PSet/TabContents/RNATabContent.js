import React from 'react';
import {PSetToolAccordion, RNARefAccordion} from '../PSetAccordion';
import AccompanyDataTabContent from './AccompanyDataTabContent';
import { TabHeader, TabContent, TabContentSection} from '../../SingleDatasetStyle';

const RNATabContent = props => {
    const rawSeqDataRNA = props.metadata.rawSeqDataRNA;
    const processedDataSource = props.metadataprocessedDataSource;
    let rnaRef, rnaTool, accRNA = undefined;
    if(props.dataset.name !== 'NCI60'){
        rnaRef = props.metadata.rnaRef;
        rnaTool = props.metadata.rnaTool;
        accRNA = props.metadata.accRNA;
    }
    
    return(
        <React.Fragment>
            <TabHeader>RNA Data</TabHeader>
            <TabContent>
                {
                    rawSeqDataRNA &&
                    <TabContentSection>
                        <h3>Raw Data Source: </h3>
                        <div className='subContent'>
                        {
                            rawSeqDataRNA ? 
                            <a href={rawSeqDataRNA.source}>{rawSeqDataRNA.source}</a>
                            :
                            'Not Available'
                        }
                        </div>
                    </TabContentSection>
                }
                {
                    processedDataSource &&
                    <TabContentSection>
                        <h3>Processed Data Source: </h3>
                        <div className='subContent'>
                        {
                            processedDataSource ? 
                            <div>
                                <a href={processedDataSource.source}>{processedDataSource.source}</a>
                                <div>Processed data included in the dataset</div>
                            </div>
                            :
                            'Not Available'
                        }
                        </div>
                    </TabContentSection>
                }
                {
                    rnaRef &&
                    <TabContentSection>
                        <h3>RNA Transcriptome</h3>
                        <RNARefAccordion item={rnaRef} />
                    </TabContentSection>
                }
                {
                    rnaTool &&
                    <TabContentSection>
                        <h3>Tools and Commands Used</h3>
                        <PSetToolAccordion item={rnaTool} />
                    </TabContentSection>
                }
                {
                    rnaTool &&
                    <TabContentSection>
                        <h3>Data Transformations Applied</h3>
                        <div className='subContent'>
                            <table>
                                <tbody>
                                    <tr className='subContentSection'>
                                        <td><span className='subContentHeader'>Gene TPM Values:</span></td>
                                        <td>After estimation by the tool detailed above, gene TPM values are transformed by <span className='code'>log2(x + 0.001)</span>.</td>
                                    </tr>
                                    <tr className='subContentSection'>
                                        <td><span className='subContentHeader'>Gene Count Values:</span></td>
                                        <td>After estimation by the tool detailed above, gene count values are transformed by <span className='code'>log2(x + 1)</span>.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </TabContentSection>
                }
                {
                    accRNA && (props.dataset.name !== 'NCI60' && props.dataset.name !== 'PRISM') &&
                    <AccompanyDataTabContent data={accRNA} />
                }
            </TabContent>
        </React.Fragment>
    );
}

export default RNATabContent;