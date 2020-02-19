import React from 'react';
import {Dialog} from 'primereact/dialog';
import {Accordion,AccordionTab} from 'primereact/accordion';
import {TabView,TabPanel} from 'primereact/tabview';
import {PSetToolAccordion, RNARefAccordion, DNARefAccordion} from '../PSet/PSetAccordion';

const DatasetDialog = (props) => {
    
    const datasetAccordionTabs = props.dataset.map((item) => 
        <AccordionTab key={item.label} header={item.label}>
            <div className='tabContent'>
                <div className='tabContentSection'>
                    <h3>Publication: </h3>
                    <ul>
                        <div>    
                            {item.publication.length ? 
                                item.publication.map((p) => 
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
                <div className='tabContentSection'>
                    <h3>Drug Sensitivity</h3>
                    <h4 className='subContent'>Source: {item.drugSensitivity.source ? <a href={item.drugSensitivity.source}>{item.drugSensitivity.source}</a> : 'Not available'}</h4>
                    <h4 className='subContent'>Version: {item.drugSensitivity.version}</h4>
                </div>
            </div> 
        </AccordionTab>
    );
    
    return(
        <Dialog header="Dataset Overview" visible={props.visible} onHide={props.onHide} style={{minWidth: '50vw', minHeight: '30vh'}} >
            <Accordion multiple={true}>
                {datasetAccordionTabs}
            </Accordion>
        </Dialog>
    )
}

const RNADialog = (props) => {
    return(
        <Dialog header="RNA Pipeline Overview" visible={props.visible} onHide={props.onHide} style={{minWidth: '50vw', minHeight: '30vh'}} >
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
        <Dialog header="DNA Sequence Alignment Overview" visible={props.visible} onHide={props.onHide} style={{minWidth: '50vw', minHeight: '30vh'}} >
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