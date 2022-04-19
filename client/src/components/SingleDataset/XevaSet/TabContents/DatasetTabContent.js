import React from 'react';
import { TabHeader, TabContent, TabContentSection} from '../../SingleDatasetStyle';

const DatasetTabContent = (props) => {
    const { metadata } = props;
    const dataListDrugResponse = (data) => (
        <div>     
            <li key={data} className='pubList'>
            <div className='subContent'>
                    Version: {data.version}
                </div>
                <div className='subContent'>
                    Source: <a href={data.source}>{data.source}</a>
                </div>
                <div className='subContent'>
                    Data: <a href={data.data}>{data.data}</a>
                </div>
            </li>
        </div> 
    );

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
            <TabHeader>Dataset: {metadata.dataset.name}</TabHeader>
            <TabContent>
                <TabContentSection>
                    <h3>Drug Response Data: </h3>
                    {
                        metadata.dataset.sensitivity ?
                        <ul>
                            {dataListDrugResponse(metadata.dataset.sensitivity)}
                        </ul> 
                        :
                        <div className="subContent">
                            Not available.
                        </div>
                    }
                    
                </TabContentSection>
                <TabContentSection>
                    <h3>Publication: </h3>
                    <ul>
                        {publication}
                    </ul> 
                </TabContentSection>
            </TabContent> 
        </React.Fragment>
    );
}

export default DatasetTabContent;