import React from 'react';
import {Dialog} from 'primereact/dialog';
import {TabView,TabPanel} from 'primereact/tabview';
import {Accordion,AccordionTab} from 'primereact/accordion';
import styled from 'styled-components';
import {PSetToolAccordion, RNARefAccordion, DNARefAccordion} from '../../PSet/PSetAccordion';

const TabContent = styled.div`
    max-width: 700px;
    max-height: 350px;
    word-wrap: break-word;
    overflow-y: scroll;
`

const DatasetDialog = (props) => {
    
    const datasetAccordionTabs = props.dataset.map((item) => 
        <TabPanel key={item.label} header={item.label}>
            <TabContent>
                <Accordion multiple={true}>
                    {item.versions.map((version) => 
                        <AccordionTab key={version.version} header={version.version}>
                            <div className='tabContentSection'>
                                <h3>Drug Sensitivity</h3>
                                <h4 className='subContent'>Version: {version.drugSensitivity.version}</h4>
                                <h4 className='subContent'>Source: {version.drugSensitivity.source ? <a href={version.drugSensitivity.source}>{version.drugSensitivity.source}</a> : 'Not available'}</h4>
                            </div>
                            <div className='tabContentSection'>
                                <h3>Publication: </h3>
                                <ul>
                                    <div>    
                                        {version.publication.length ? 
                                            version.publication.map((p) => 
                                                <li key={p.link} className='pubList'>
                                                    <div className='subContent'>{p.citation}</div>
                                                    <br />
                                                    <div className='subContent'><a href={p.link}>{p.link}</a></div>
                                                </li>
                                            )
                                            :
                                            <div className="subContent">
                                                Not available.
                                            </div>
                                        }  
                                    </div>
                                </ul> 
                            </div>
                        </AccordionTab>
                    )}     
                </Accordion>
            </TabContent> 
        </TabPanel>
    );
    
    return(
        <Dialog header="Dataset Overview" visible={props.visible} onHide={props.onHide} style={{minWidth: '50vw'}} >
            <TabView>
                {datasetAccordionTabs}
            </TabView>
        </Dialog>
    )
}

const RNADialog = (props) => {
    return(
        <Dialog header="RNA Pipeline Overview" visible={props.visible} onHide={props.onHide} style={{minWidth: '50vw'}} >
            <TabView renderActiveOnly={false}>
                <TabPanel key='rnaTools' header="RNA Tools">
                    <h3>Available RNA Pipeline Tools</h3>
                    <PSetToolAccordion items={props.rna.tool} />
                </TabPanel>
                <TabPanel key='rnaRef' header="RNA References">
                    <h3>Available RNA Transcriptome References</h3>
                    <RNARefAccordion items={props.rna.ref} />
                </TabPanel>
            </TabView>
        </Dialog>
    )
}

const DNADialog = (props) => {
    return(
        <Dialog header="DNA Sequence Alignment Overview" visible={props.visible} onHide={props.onHide} style={{minWidth: '50vw'}} >
            <TabView renderActiveOnly={false}>
                <TabPanel key='dnaTools' header="DNA Tools">
                    <h3>Available DNA Pipeline Tools</h3>
                    <PSetToolAccordion items={props.dna.tool} />
                </TabPanel>
                <TabPanel key='dnaRef' header="DNA References">
                    <h3>Available DNA Exome References</h3>
                    <DNARefAccordion items={props.dna.ref} />
                </TabPanel>
            </TabView>
        </Dialog>
    )
}

export {
    DatasetDialog,
    RNADialog,
    DNADialog
}