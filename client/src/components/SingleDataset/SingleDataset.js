import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useSingleDataset from '../../hooks/useSingleDataset';
import { dataTypes } from '../Shared/Enums';
import PSet from './PSet/PSet';
import ToxicoSet from './ToxicoSet/ToxicoSet';
import XevaSet from './XevaSet/XevaSet';
import ClinicalGenomics from './ClinicalGenomics/ClinicalGenomics';
import RadioSet from './RadioSet/RadioSet';
import StyledPage from '../../styles/StyledPage';
import RadiomicSet from './RadiomicSet/RadiomicSet';

const SingleDataset = () => {
    const location = useLocation();
    const { datatype, id1, id2 } = useParams();

    const { 
        getDataset, 
        getHeader,
        getGeneralInfoAccordion,
        datasetMessage, 
        publishDialog,
        dataset 
    } = useSingleDataset(datatype, `${id1}/${id2}`);

    useEffect(() => {
        const getData = async () => {
            await getDataset(location.search);
        }
        getData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <StyledPage>
            {
                dataset.ready &&
                <React.Fragment>
                    {datasetMessage}
                    {getHeader()}
                    {publishDialog()}
                    {getGeneralInfoAccordion(dataset.data)}
                    <React.Fragment>
                        {datatype === dataTypes.pharmacogenomics && <PSet dataset={dataset.data} />}
                        {datatype === dataTypes.toxicogenomics && <ToxicoSet dataset={dataset.data} />}
                        {datatype === dataTypes.xenographic && <XevaSet dataset={dataset.data} />}
                        {datatype === dataTypes.clinicalgenomics && <ClinicalGenomics dataset={dataset.data} />}
                        {datatype === dataTypes.radiogenomics && <RadioSet dataset={dataset.data} />}
                        {datatype === dataTypes.icb && <ClinicalGenomics dataset={dataset.data} />}
                        {datatype === dataTypes.radiomics && <RadiomicSet dataset={dataset.data} />}
                    </React.Fragment>
                </React.Fragment>
            } 
            {!dataset.data && <h3>Dataset with the specified DOI could not be found</h3>}
        </StyledPage>
    );
}

export default SingleDataset;
