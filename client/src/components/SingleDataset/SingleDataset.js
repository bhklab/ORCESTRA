import React from 'react';
import {dataTypes} from '../Shared/Enums';
import PSet from './PSet/PSet';
import ToxicoSet from './ToxicoSet/ToxicoSet';
import XevaSet from './XevaSet/XevaSet';
import ClinicalGenomics from './ClinicalGenomics/ClinicalGenomics';

const SingleDataset = (props) => {
    return(
        <React.Fragment>
            {props.match.params.datatype === dataTypes.pharmacogenomics && <PSet params={props.match.params} />}
            {props.match.params.datatype === dataTypes.toxicogenomics && <ToxicoSet params={props.match.params} />}
            {props.match.params.datatype === dataTypes.xenographic && <XevaSet params={props.match.params} />}
            {props.match.params.datatype === dataTypes.clinicalgenomics && <ClinicalGenomics params={props.match.params} />}
        </React.Fragment>
    );
}

export default SingleDataset;