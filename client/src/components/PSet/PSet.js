import React from 'react';
import './PSet.css';
import Navigation from '../Navigation/Navigation';
import {TabView,TabPanel} from 'primereact/tabview';
import {Accordion,AccordionTab} from 'primereact/accordion';
import * as APICalls from '../Shared/APICalls';

class PSet extends React.Component{
    constructor(){
        super();
        this.state = {
            pset: {}
        }
    }

    componentDidMount(){
        let apiStr = '/pset/one/' + this.props.match.params.id;
        console.log(apiStr);
        APICalls.queryPSet(apiStr, (resData) => {
            this.setState({pset: resData});
        });
    }

    render(){
        return(
            <React.Fragment>
                <Navigation routing={this.props} />
                <div className='pageContent'>
                    <h1>Explore PSet - {this.state.pset.name}</h1>
                    <div className='tabContainer'>
                        <TabView renderActiveOnly={false}>
                            <TabPanel header="Dataset">
                                <h1 className='tabMainHeader'>Dataset: {this.state.pset.datasetName} - {this.state.pset.datasetVersion}</h1>
                                <div className='tabContent'>
                                    <div className='tabContentSection'>
                                        <h3>Publications: </h3>
                                        <div className='subContent'>link to publication</div>
                                    </div>
                                    <div className='tabContentSection'>
                                        <h3>Drug Sensitivity</h3>
                                        <h4 className='subContent'>Source: link to raw data source...</h4>
                                        <h4 className='subContent'>Version: {this.state.pset.drugSensitivity}</h4>
                                    </div>
                                </div>    
                            </TabPanel>
                            <TabPanel header="RNA">
                                <h1 className='tabMainHeader'>Analysis Details - RNA Data</h1>
                                <div className='tabContent'>
                                    <div className='tabContentSection'>
                                        <h3>Raw Data Source: </h3>
                                        <div className='subContent'>Dataset Name - Release date</div>
                                    </div>
                                    <div className='tabContentSection'>
                                        <h3>Genome Version</h3>
                                        <div className='subContent'>GRCh38</div>
                                    </div>
                                    <div className='tabContentSection'>
                                        <h3>RNA Transcriptome</h3>
                                        <div className='subContent'>Transcriptome name</div>
                                        <div className='subContent'>Source: link to source</div>
                                    </div>
                                    <div className='tabContentSection'>
                                        <h3>Tools and Commands Used</h3>
                                        <div className='subContent'>
                                            <Accordion>
                                                <AccordionTab header="Header I">
                                                    Tool 1
                                                </AccordionTab>
                                                <AccordionTab header="Header II">
                                                    Tool 2
                                                </AccordionTab>
                                                <AccordionTab header="Header III">
                                                    Tool 3
                                                </AccordionTab>
                                            </Accordion>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel header="DNA">
                                {this.state.pset.genome} <br />
                                {this.state.pset.exomeTool} <br />
                                {this.state.pset.exomeRef} <br />
                            </TabPanel>
                        </TabView>
                    </div>
                </div> 
            </React.Fragment>
        );
    }
}

export default PSet;