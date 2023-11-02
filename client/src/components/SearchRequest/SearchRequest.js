import React from 'react';
import { useParams } from 'react-router-dom';
import { dataTypes } from '../Shared/Enums';
import PSetSearch from './PSet/PSetSearch';
import ToxicoSetSearch from './ToxicoSet/ToxicoSetSearch';
import XevaSetSearch from './XevaSet/XevaSetSearch';

const SearchRequest = () => {
    const { datatype } = useParams(); // Using useParams to access route parameters

    return(
        <React.Fragment>
            {datatype === dataTypes.pharmacogenomics && <PSetSearch />}
            {datatype === dataTypes.toxicogenomics && <ToxicoSetSearch />}
            {datatype === dataTypes.xenographic && <XevaSetSearch />}
        </React.Fragment>
    );
}

export default SearchRequest;
