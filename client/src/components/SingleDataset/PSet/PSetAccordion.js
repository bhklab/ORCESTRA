import React from 'react';
import {Accordion,AccordionTab} from 'primereact/accordion';

const PSetToolAccordion = (props) => {
    const { item } = props;
    return(
        item ? 
            <Accordion multiple={true}>
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
            </Accordion>
            :
            <div className='subContent'>Not Available</div>
    );
}

const RNARefAccordion = (props) => {
    const { item } = props;
    return(
        item? 
            <Accordion multiple={true}>
                <AccordionTab key={item.name} header={item.name}>
                    <ul>
                        <li className='listItem-1'>
                            <div>{item.name.length ? item.name : 'Currently not available'}</div>
                            <div>{item.source.length ? <a href={item.source}>{item.source}</a> : 'Currently not available'}</div>
                        </li>                    
                    </ul> 
                </AccordionTab>
            </Accordion>
            :
            <div className='subContent'>Not Available</div>
    );
}

const DNARefAccordion = (props) => {
    const { item } = props;
    return(
        item ? 
            <Accordion multiple={true}>
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
            </Accordion>
            :
            <div className='subContent'>Not Available</div>
    );
}

export {
    PSetToolAccordion,
    RNARefAccordion,
    DNARefAccordion
}
