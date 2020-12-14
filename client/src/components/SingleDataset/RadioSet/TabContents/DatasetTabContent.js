import React from 'react';
import { TabHeader, TabContent, TabContentSection} from '../../SingleDatasetStyle';

const DatasetTabContent = (props) => {
         
    const publication = (
        <div>    
        {props.metadata.dataset.versionInfo.publication.length ? 
            props.metadata.dataset.versionInfo.publication.map((item) => 
                <li key={item.link} className='pubList'>
                    <div className='subContent'>{item.citation}</div>
                    <br />
                    <div className='subContent'><a href={item.link}>{item.link}</a></div>
                </li>
            )
            :
            <div className="subContent">
                Not available.
            </div>
            }  
        </div> 
    );
        
    return(
        <React.Fragment>
            <TabHeader>Dataset: {props.metadata.dataset.label}</TabHeader>
            <TabContent>
                <TabContentSection>
                    <h3>Radiation Sensitivity</h3>
                    <h4 className='subContent'>Source: 
                    {
                        props.metadata.dataset.versionInfo.radiationSensitivity ? 
                        <a href={props.metadata.dataset.versionInfo.radiationSensitivity.source}>{props.metadata.dataset.versionInfo.radiationSensitivity.source}</a> 
                        : 'Not available'
                    }
                    </h4>
                    <h4 className='subContent'>Version: {props.metadata.dataset.versionInfo.radiationSensitivity.version}</h4>
                </TabContentSection>
                
                <TabContentSection>
                    <h3>Publication: </h3>
                    <ul>
                        {publication}
                    </ul> 
                </TabContentSection>
                
                <TabContentSection>
                    <h3>Genome Version</h3>
                    <div className='subContent'>{props.metadata.genome.name ? props.metadata.genome.name : "Not Available"}</div>
                </TabContentSection>
            </TabContent> 
        </React.Fragment>
    );
}

export default DatasetTabContent;