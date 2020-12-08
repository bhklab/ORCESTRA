import React from 'react';
import { TabHeader, TabContent, TabContentSection} from '../../SingleDatasetStyle';

const DatasetTabContent = (props) => {

    const dataListDrugResponse = (data) => (
        <div>     
            <li key={data} className='pubList'>
                <div className='subContent'>
                    Source: <a href={data.source}>{data.source}</a>
                </div>
                <div className='subContent'>
                    Data: <a href={data.data}>{data.data}</a>
                </div>
            </li>
        </div> 
    );

    const dataList = (data) => (
        <div>    
            {
                data.length ? 
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
                    <h3>Drug Response Data: </h3>
                    <ul>
                        {dataListDrugResponse(props.metadata.dataset.versionInfo.data.drugResponseData)}
                    </ul> 
                </TabContentSection>
                <TabContentSection>
                    <h3>CNV: </h3>
                    <ul>
                        {dataList(props.metadata.dataset.versionInfo.data.cnv)}
                    </ul> 
                </TabContentSection>
                <TabContentSection>
                    <h3>Mutation: </h3>
                    <ul>
                        {dataList(props.metadata.dataset.versionInfo.data.mutation)}
                    </ul> 
                </TabContentSection>
                <TabContentSection>
                    <h3>RNA Sequence: </h3>
                    <ul>
                        {dataList(props.metadata.dataset.versionInfo.data.rnaseq)}
                    </ul> 
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