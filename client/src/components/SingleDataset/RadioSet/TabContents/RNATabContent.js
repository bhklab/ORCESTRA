import React from 'react';
import {PSetToolAccordion, RNARefAccordion} from '../PSetAccordion';
import AccompanyDataTabContent from './AccompanyDataTabContent';
import { TabHeader, TabContent, TabContentSection} from '../../SingleDatasetStyle';

const RNATabContent = props => {
    const rawSeqDataRNA = props.metadata.find(x => x.name === 'rawSeqDataRNA')
    const rnaRef = props.metadata.find(x => x.name === 'rnaRef')
    const rnaTool = props.metadata.find(x => x.name === 'rnaTool')
    const accRNA = props.metadata.find(x => x.name === 'accRNA')

    return(
        <React.Fragment>
            <TabHeader>RNA Data</TabHeader>
            <TabContent>
                {
                    rawSeqDataRNA &&
                    <TabContentSection>
                        <h3>Raw Data Source: </h3>
                        <div className='subContent'>
                            <a href={rawSeqDataRNA.value}>{rawSeqDataRNA.value}</a>
                        </div>
                    </TabContentSection>
                }
                {
                    rnaRef &&
                    <TabContentSection>
                        <h3>RNA Transcriptome</h3>
                        <RNARefAccordion items={rnaRef.value} />
                    </TabContentSection>
                }
                {
                    rnaTool &&
                    <TabContentSection>
                        <h3>Tools and Commands Used</h3>
                        <PSetToolAccordion items={rnaTool.value} />
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
                    accRNA &&
                    <AccompanyDataTabContent data={accRNA.value} />
                }
            </TabContent>
        </React.Fragment>
    );
}

export default RNATabContent;