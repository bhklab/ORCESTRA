import React from 'react';
import { TabContentSection} from '../PSetStyle';

const getType = function(type){
    switch(type){
        case 'rna':
            return 'Microarray'
        case 'cnv':
            return 'Copy Number Variation'
        case 'mut':
            return 'Mutation'
        case 'fusion':
            return 'Fusion'
        default:
            return ''
    }
}

const AccompanyDataTabContent = props => {
    
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
                                        <h4 className='subContent'>Source: {<a href={s.source}>{s.source}</a>}</h4>
                                    </TabContentSection>
                                )
                            })
                            :
                            <TabContentSection key={Math.random()}>
                                <h3>{getType(d.type)}</h3>
                                <h4 className='subContent'>Source: {<a href={d.source}>{d.source}</a>}</h4>
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