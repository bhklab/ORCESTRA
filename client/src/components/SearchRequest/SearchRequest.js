import React from 'react';
import {dataTypes} from '../Shared/Enums';
import PSetSearch from './PSet/PSetSearch';
import ToxicoSetSearch from './ToxicoSet/ToxicoSetSearch';
import XevaSetSearch from './XevaSet/XevaSetSearch';

const SearchRequst = (props) => {
    return(
        <React.Fragment>
            {props.match.params.datatype === dataTypes.pharmacogenomics && <PSetSearch />}
            {props.match.params.datatype === dataTypes.toxicogenomics && <ToxicoSetSearch />}
            {props.match.params.datatype === dataTypes.xenographic && <XevaSetSearch />}
        </React.Fragment>
    );
}

export default SearchRequst;