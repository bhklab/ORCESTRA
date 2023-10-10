import React from 'react';
import { TabHeader, TabContent, TabContentSection} from '../../SingleDatasetStyle';

const DatasetTabContent = (props) => {
    const { metadata } = props;
    const publication = (
        <div>    
        {metadata.dataset.publications.length ? 
            metadata.dataset.publications.map((item) => 
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
            <TabHeader>Dataset: {metadata.dataset.label}</TabHeader>
            <TabContent>
                <TabContentSection>
                    <h3>Imaging Data</h3>
                    <h4 className='subContent'>{'Source: '}
                    {
                        metadata.dataset.sensitivity ? 
                        <a href={metadata.dataset.sensitivity.source}>{metadata.dataset.sensitivity.source}</a> 
                        : 'Not available'
                    }
                    </h4>
                    <h4 className='subContent'>Version: {metadata.dataset.sensitivity.version}</h4>
                </TabContentSection>
                
                <TabContentSection>
                    <h3>Publication: </h3>
                    <ul>
                        {publication}
                    </ul> 
                </TabContentSection>
                
                <TabContentSection>

                </TabContentSection>
            </TabContent> 
        </React.Fragment>
    );
}

export default DatasetTabContent;