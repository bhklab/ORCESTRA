import React from 'react';
import { TabContentSection } from '../../SingleDatasetStyle';

const AccompanyDataTabContent = (props) => {
    return(
        <React.Fragment>
            {
                props.data.map(d => {
                    return(
                        <div key={Math.random()}>
                        {
                            Array.isArray(d.source) ?
                            d.source.map(s => {
                                return(
                                    <TabContentSection key={Math.random()}>
                                        <h3>{s.label}</h3>
                                        <h4 className='subContent'>Source: {s.source.length > 0 ? <a href={s.source}>{s.source}</a> : 'Not available'}</h4>
                                    </TabContentSection>
                                )
                            })
                            :
                            <TabContentSection key={Math.random()}>
                                <h3>{d.label}</h3>
                                <h4 className='subContent'>Source: {d.source.length > 0 ? <a href={d.source}>{d.source}</a> : 'Not available'}</h4>
                            </TabContentSection>
                        }
                        </div>
                    )
                })
            }
        </React.Fragment>    
    )
}

export default AccompanyDataTabContent