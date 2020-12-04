import React from 'react';
import {dataTypes} from '../Shared/Enums';
import Pharmacogenomics from './DatasetMainContent/Pharmacogenomics';
import Toxicogenomics from './DatasetMainContent/Toxicogenomics';
import Xenographic from './DatasetMainContent/Xenographic';

const DatasetMain = (props) => {
    return(
        <React.Fragment>
            {props.match.params.datatype === dataTypes.pharmacogenomics && <Pharmacogenomics />}
            {props.match.params.datatype === dataTypes.toxicogenomics && <Toxicogenomics />}
            {props.match.params.datatype === dataTypes.xenographic && <Xenographic />}
        </React.Fragment>
    );
}

export default DatasetMain;
