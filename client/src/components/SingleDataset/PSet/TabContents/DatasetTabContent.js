import React from 'react';
import { TabHeader, TabContent, TabContentSection} from '../../SingleDatasetStyle';

class DatasetTabContent extends React.Component{

    render(){          
        const publication = (
            <div>    
            {this.props.metadata.dataset.versionInfo.publication.length ? 
                this.props.metadata.dataset.versionInfo.publication.map((item) => 
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
                <TabHeader>Dataset: {this.props.metadata.dataset.label}</TabHeader>
                <TabContent>
                    <TabContentSection>
                        <h3>Drug Sensitivity</h3>
                        <h4 className='subContent'>Source: {
                            this.props.metadata.dataset.versionInfo.drugSensitivity.source ? 
                            <a href={this.props.metadata.dataset.versionInfo.drugSensitivity.source}>{this.props.metadata.dataset.versionInfo.drugSensitivity.source}</a> 
                            : 'Not available'
                            }
                        </h4>
                        <h4 className='subContent'>Version: {this.props.metadata.dataset.versionInfo.drugSensitivity.version}</h4>
                        <h4 className='subContent'>Filtered Sensitivity Data: {this.props.metadata.dataset.filteredSensitivity ? 'YES' : 'NO'}</h4>
                    </TabContentSection>
                    
                    <TabContentSection>
                        <h3>Publication: </h3>
                        <ul>
                            {publication}
                        </ul> 
                    </TabContentSection>
                    {
                        this.props.metadata.dataset.acknowledgement &&
                        <TabContentSection>
                            <h3>Acknowledgement</h3>
                            <div className='subContent'>{ this.props.metadata.dataset.acknowledgement }</div>
                        </TabContentSection>
                    }
                    <TabContentSection>
                        <h3>Genome Version</h3>
                        <div className='subContent'>{this.props.metadata.genome.name ? this.props.metadata.genome.name : "Not Available"}</div>
                    </TabContentSection>
                </TabContent> 
            </React.Fragment>
        );
    }
}

export default DatasetTabContent;