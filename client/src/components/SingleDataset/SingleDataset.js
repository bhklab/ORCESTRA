import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useSingleDataset from '../../hooks/useSingleDataset';
import {dataTypes} from '../Shared/Enums';
import PSet from './PSet/PSet';
import ToxicoSet from './ToxicoSet/ToxicoSet';
import XevaSet from './XevaSet/XevaSet';
import ClinicalGenomics from './ClinicalGenomics/ClinicalGenomics';
import RadioSet from './RadioSet/RadioSet';
import StyledPage from '../../styles/StyledPage';
import RadiomicSet from './RadiomicSet/RadiomicSet';

const SingleDataset = (props) => {
    const location = useLocation();
    const { 
        getDataset, 
        getHeader,
        getGeneralInfoAccordion,
        datasetMessage, 
        publishDialog,
        dataset 
    } = useSingleDataset(props.match.params.datatype, `${props.match.params.id1}/${props.match.params.id2}`);

    useEffect(() => {
        const getData = async () => {
            await getDataset(location.search);
        }
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(
        <StyledPage>
            {
                dataset.ready &&
                <React.Fragment>
                    { 
                        datasetMessage 
                    }
                    { 
                        getHeader() 
                    }
                    { 
                        publishDialog() 
                    }
                    { 
                        getGeneralInfoAccordion(dataset.data) 
                    }
                    <React.Fragment>
                        { 
                            props.match.params.datatype === dataTypes.pharmacogenomics && <PSet dataset={dataset.data} /> 
                        }
                        { 
                            props.match.params.datatype === dataTypes.toxicogenomics && <ToxicoSet dataset={dataset.data} /> 
                        }
                        { 
                            props.match.params.datatype === dataTypes.xenographic && <XevaSet dataset={dataset.data} /> 
                        }
                        { 
                            props.match.params.datatype === dataTypes.clinicalgenomics && <ClinicalGenomics dataset={dataset.data} /> 
                        }
                        { 
                            props.match.params.datatype === dataTypes.radiogenomics && <RadioSet dataset={dataset.data} /> 
                        }
                        { 
                            props.match.params.datatype === dataTypes.icb && <ClinicalGenomics dataset={dataset.data} /> 
                        }
						                        { 
                            props.match.params.datatype === dataTypes.radiomics && <RadiomicSet dataset={dataset.data} /> 
                        }
                    </React.Fragment>
                </React.Fragment>
            } 
            { !dataset.data && <h3>Dataset with the specified DOI could not be found</h3> }
        </StyledPage>
    );
}

export default SingleDataset;