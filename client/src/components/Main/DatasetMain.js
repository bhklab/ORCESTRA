import React from 'react';
import {dataTypes} from '../Shared/Enums';
import Pharmacogenomics from './DatasetMainContent/Pharmacogenomics';
// import Toxicogenomics from './DatasetMainContent/Toxicogenomics';
// import Xenographic from './DatasetMainContent/Xenographic';
import ToxicoSetSearch from '../SearchRequest/ToxicoSet/ToxicoSetSearch';
import XevaSetSearch from '../SearchRequest/XevaSet/XevaSetSearch';
import ClinGenSearch from '../SearchRequest/ClinicalGenomics/ClinGenSetSearch';
import RadioSetSearch from '../SearchRequest/RadioSet/RadioSetSearch';
import RadiomicSetSearch from '../SearchRequest/RadiomicSet/RadiomicSetSearch';

const DatasetMain = (props) => {
    return(
        <React.Fragment>
            {props.match.params.datatype === dataTypes.pharmacogenomics && <Pharmacogenomics />}
            {props.match.params.datatype === dataTypes.toxicogenomics && <ToxicoSetSearch />}
            {props.match.params.datatype === dataTypes.xenographic && <XevaSetSearch />}
            {props.match.params.datatype === dataTypes.clinicalgenomics && <ClinGenSearch datasetType={dataTypes.clinicalgenomics} />}
            {props.match.params.datatype === dataTypes.radiogenomics && <RadioSetSearch />}
            {props.match.params.datatype === dataTypes.icb && <ClinGenSearch datasetType={dataTypes.icb} />}
			{props.match.params.datatype === dataTypes.radiomics && <RadiomicSetSearch datasetType={dataTypes.radiomics} />}
        </React.Fragment>
    );
}

export default DatasetMain;
