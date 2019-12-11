import React from 'react';
import {Accordion,AccordionTab} from 'primereact/accordion';
import { resetWarningCache } from 'prop-types';

class PSetToolAccordion extends React.Component {

    render(){
        const toolAccordionTabs = this.props.items.map((item) => 
            <AccordionTab key={item} header={item}>
                {item}
            </AccordionTab>
        );
        
        return(
            <Accordion multiple={true}>
                {toolAccordionTabs}
            </Accordion>
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
                        <div>{item.link.length ? <a href={item.link}>{item.link}</a> : 'Currently not available'}</div>
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
            <AccordionTab key={item.dbSNP} header={item.dbSNP}>
                <ul>
                    <li className='listItem-1'>
                        <div>{item.dbSNP.length ? item.dbSNP: 'Currently not available'}</div>
                        <div>{item.link.length ? <a href={item.link}>{item.link}</a> : 'Currently not available'}</div>
                    </li>
                    <li className='listItem-1'>
                        <div>{item.cosmic.name}</div>
                        <div><a href={item.cosmic.link}>{item.cosmic.link}</a> </div>
                    </li>
                    <li className='listItem-1'>
                        <div>{item.exonTarget.name}</div>
                        <div><a href={item.exonTarget.link}>{item.exonTarget.link}</a></div>
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

export {
    PSetToolAccordion,
    RNARefAccordion,
    DNARefAccordion
}
