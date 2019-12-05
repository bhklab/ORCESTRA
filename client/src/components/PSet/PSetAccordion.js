import React from 'react';
import {Accordion,AccordionTab} from 'primereact/accordion';

class PSetAccordion extends React.Component {

    render(){
        const accordionTabs = this.props.items.map((item) => 
            <AccordionTab key={item} header={item}>
                {item}
            </AccordionTab>
        );
        
        return(
            <Accordion multiple={true}>
                {accordionTabs}
            </Accordion>
        );
    }

}

export default PSetAccordion;
