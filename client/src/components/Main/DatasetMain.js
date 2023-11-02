import React from 'react';
import { useParams } from 'react-router-dom';
import { dataTypes } from '../Shared/Enums';
import Pharmacogenomics from './DatasetMainContent/Pharmacogenomics';
// import Toxicogenomics from './DatasetMainContent/Toxicogenomics';
// import Xenographic from './DatasetMainContent/Xenographic';
import ToxicoSetSearch from '../SearchRequest/ToxicoSet/ToxicoSetSearch';
import XevaSetSearch from '../SearchRequest/XevaSet/XevaSetSearch';
import ClinGenSearch from '../SearchRequest/ClinicalGenomics/ClinGenSetSearch';
import RadioSetSearch from '../SearchRequest/RadioSet/RadioSetSearch';
import RadiomicSetSearch from '../SearchRequest/RadiomicSet/RadiomicSetSearch';

const DatasetMain = () => {
    const { datatype } = useParams(); // Using useParams to access route parameters

    return(
        <React.Fragment>
            {datatype === dataTypes.pharmacogenomics && <Pharmacogenomics />}
            {datatype === dataTypes.toxicogenomics && <ToxicoSetSearch />}
            {datatype === dataTypes.xenographic && <XevaSetSearch />}
            {datatype === dataTypes.clinicalgenomics && <ClinGenSearch datasetType={dataTypes.clinicalgenomics} />}
            {datatype === dataTypes.radiogenomics && <RadioSetSearch />}
            {datatype === dataTypes.icb && <ClinGenSearch datasetType={dataTypes.icb} />}
            {datatype === dataTypes.radiomics && <RadiomicSetSearch datasetType={dataTypes.radiomics} />}
        </React.Fragment>
    );
}

export default DatasetMain;
