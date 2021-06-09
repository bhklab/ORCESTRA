import React from 'react';
import { TabContent, TabContentSection} from '../../SingleDatasetStyle';

const DisclaimerTabContent = (props) => {
    const { notes } = props;
    return(
        <TabContent>
            <TabContentSection>
                <h3>Disclaimer</h3>
                {
                    <div dangerouslySetInnerHTML={{__html: notes.disclaimer}}></div>
                }
            </TabContentSection>
            <TabContentSection>
                <h3>Data Usage Policy</h3>
                {
                    <div dangerouslySetInnerHTML={{__html: notes.usagePolicy}}></div>
                }
            </TabContentSection>
            <TabContentSection>
                <h3>Please cite the following when using these data</h3>
                {
                    notes.citations.map((item, i) => (
                        <div className='pubList' key={i} dangerouslySetInnerHTML={{__html: item}}></div>
                    ))
                }
            </TabContentSection>
        </TabContent> 
    );
}

export default DisclaimerTabContent;