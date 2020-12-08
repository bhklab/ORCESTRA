import React from 'react';
import {dataTypes} from '../Shared/Enums';
import Pharmacogenomics from './DatasetMainContent/Pharmacogenomics';
// import Toxicogenomics from './DatasetMainContent/Toxicogenomics';
// import Xenographic from './DatasetMainContent/Xenographic';
import ToxicoSetSearch from '../SearchRequest/ToxicoSet/ToxicoSetSearch';
import XevaSetSearch from '../SearchRequest/XevaSet/XevaSetSearch';

const DatasetMain = (props) => {
    return(
        <React.Fragment>
            {props.match.params.datatype === dataTypes.pharmacogenomics && <Pharmacogenomics />}
            {props.match.params.datatype === dataTypes.toxicogenomics && <ToxicoSetSearch />}
            {props.match.params.datatype === dataTypes.xenographic && <XevaSetSearch />}
        </React.Fragment>
    );
}

export default DatasetMain;
