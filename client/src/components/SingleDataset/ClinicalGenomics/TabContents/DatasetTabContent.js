import React from 'react';
import { TabHeader, TabContent, TabContentSection} from '../../SingleDatasetStyle';

const DatasetTabContent = (props) => {
    const { metadata } = props;
    const dataList = (data) => (
        <div>    
        {data && data.length ? 
            <li key={data} className='pubList'>
                <div className='subContent'>
                    <a href={data}>{data}</a>
                </div>
            </li>
            :
            <div className="subContent">
                Not available.
            </div>
        }  
        </div> 
    );

    const drugResponse = (data) => (
        <div>    
        {data ? 
            <li key={data} className='pubList'>
                <div className='subContent'>
                    Version: {data.version}
                </div>
                <div className='subContent'>
                    Source: <a href={data.source}>{data.source}</a>
                </div>
            </li>
            :
            <div className="subContent">
                No drug response data in this dataset.
            </div>
            }  
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
            <TabHeader>Dataset: {metadata.dataset.label}</TabHeader>
            <TabContent>
                {
                    metadata.dataset.rawMicroarrayData &&
                    <TabContentSection>
                        <h3>Microarray Data:</h3>
                        <ul>
                            {dataList(metadata.dataset.rawMicroarrayData)}
                        </ul> 
                    </TabContentSection>
                }
                {
                    metadata.dataset.sensitivity &&
                    <TabContentSection>
                        <h3>Drug Response Data:</h3>
                        <ul>
                            {drugResponse(metadata.dataset.sensitivity)}
                        </ul> 
                    </TabContentSection>
                }
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