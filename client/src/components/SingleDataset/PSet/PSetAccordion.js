import React from 'react';
import {Accordion,AccordionTab} from 'primereact/accordion';
import {StyledAccordion} from './PSetStyle';

class PSetToolAccordion extends React.Component {

    render(){
        const toolAccordionTabs = this.props.items.map((item) => 
            <AccordionTab key={item.name} header={item.name}>
                {item.commands.length ? 
                    <ul>
                        {item.commands.map((command) => 
                            <li key={command}>
                                {command}
                            </li>    
                        )}
                    </ul>
                    :
                    "Not Available"
                }
                   
            </AccordionTab>
        );
        
        return(
            this.props.items.length ? 
                <Accordion multiple={true}>
                    {toolAccordionTabs}
                </Accordion>
                :
                <div className='subContent'>Not Available</div>
        );
    }

}

class RNARefAccordion extends React.Component {
    
    render(){
        const rnaRefAccordionTabs = this.props.items.map((item) => 
            <AccordionTab key={item.name} header={item.name}>
                <ul>
                    <li className='listItem-1'>
                        <div>{item.name.length ? item.name : 'Currently not available'}</div>
                        <div>{item.source.length ? <a href={item.source}>{item.source}</a> : 'Currently not available'}</div>
                    </li>                    
                </ul> 
            </AccordionTab>
        );
    
        return(
            this.props.items.length ? 
                <Accordion multiple={true}>
                    {rnaRefAccordionTabs}
                </Accordion>
                :
                <div className='subContent'>Not Available</div>
        );
    }
    
}

class DNARefAccordion extends React.Component {

    render(){
        const exomeRefAccordionTabs = this.props.items.map((item) => 
            <AccordionTab key={item.name} header={item.name}>
                <ul>
                    <li className='listItem-1'>
                        <div>{item.name.length ? item.name: 'Currently not available'}</div>
                        <div>{item.source.length ? <a href={item.source}>{item.source}</a> : 'Currently not available'}</div>
                    </li>
                    <li className='listItem-1'>
                        <div>{item.cosmic.name}</div>
                        <div><a href={item.cosmic.source}>{item.cosmic.source}</a> </div>
                    </li>
                    <li className='listItem-1'>
                        <div>{item.exonTarget.name}</div>
                        <div><a href={item.exonTarget.source}>{item.exonTarget.source}</a></div>
                    </li>                       
                </ul> 
            </AccordionTab>
        );
    
        return(
            this.props.items.length ? 
                <Accordion multiple={true}>
                    {exomeRefAccordionTabs}
                </Accordion>
                :
                <div className='subContent'>Not Available</div>
        );
    }

}

class GeneralInfoAccordion extends React.Component {
    render(){   
        const doi = 'http://doi.org/' + this.props.data.doi
        return(
            <StyledAccordion className='generalInfoAccordion'>
                <AccordionTab header="General Information">
                    <h4>PSet Name: {this.props.data.name}</h4>
                    <h4>DOI:  <a href={doi} target="_blank">{this.props.data.doi}</a></h4>
                    <h4>Date Created: {this.props.data.dateCreated.split('T')[0]}</h4>
                    {this.props.data.createdBy && <h4>Created By {this.props.data.createdBy}</h4>}
                </AccordionTab>    
            </StyledAccordion>    
        );
    }
}

export {
    PSetToolAccordion,
    RNARefAccordion,
    DNARefAccordion,
    GeneralInfoAccordion
}
