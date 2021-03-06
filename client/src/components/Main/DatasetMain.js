import React from 'react';
import {dataTypes} from '../Shared/Enums';
import Pharmacogenomics from './DatasetMainContent/Pharmacogenomics';
// import Toxicogenomics from './DatasetMainContent/Toxicogenomics';
// import Xenographic from './DatasetMainContent/Xenographic';
import ToxicoSetSearch from '../SearchRequest/ToxicoSet/ToxicoSetSearch';
import XevaSetSearch from '../SearchRequest/XevaSet/XevaSetSearch';
import ClinGenSearch from '../SearchRequest/ClinicalGenomics/ClinGenSetSearch';
import RadioSetSearch from '../SearchRequest/RadioSet/RadioSetSearch';

const DatasetMain = (props) => {
    return(
        <React.Fragment>
            {props.match.params.datatype === dataTypes.pharmacogenomics && <Pharmacogenomics />}
            {props.match.params.datatype === dataTypes.toxicogenomics && <ToxicoSetSearch />}
            {props.match.params.datatype === dataTypes.xenographic && <XevaSetSearch />}
            {props.match.params.datatype === dataTypes.clinicalgenomics && <ClinGenSearch />}
            {props.match.params.datatype === dataTypes.radiogenomics && <RadioSetSearch />}
        </React.Fragment>
    );
}

export default DatasetMain;
