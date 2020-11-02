import React from 'react';
import Pharmacogenomics from './DatasetMainContent/Pharmacogenomics';

const DatasetMain = (props) => {
    return(
        <>
            {!props.match.datatype && <Pharmacogenomics />}
            {props.match.datatype === 'pharmacogenomics' && <Pharmacogenomics />}
        </>
    );
}

export default DatasetMain;
