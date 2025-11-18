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
import {
    LayoutContainer,
    StyledContainerOuter,
    StyledContainerInner
} from '../SearchRequest/RadiomicSet/Styles/StyledRadiomicSetSearch';
import * as MainStyle from '../Main/MainStyle';

const SingleDatasetNew = () => {
    const location = useLocation();
    const { datatype, id } = useParams();

    const { getDataset, getHeader, getGeneralInfoAccordion, datasetMessage, publishDialog, dataset } = useSingleDataset(
        datatype,
        `${id}`
    );

    useEffect(() => {
        const getData = async () => {
            await getDataset(location.search);
        };
        getData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //If the dataset is not a legacy dataset, use the new DNL
    if (dataset.data.legacy === false) {
        const datasetTab = dataset.data.tabData.find(tab => tab.header === 'Dataset');
        // console.log(datasetTab.data);
        const disclaimerTab = dataset.data.tabData.find(tab => tab.header === 'Disclaimer');
        // console.log(disclaimerTab.data);
        const releaseTab = dataset.data.tabData.find(tab => tab.header === 'Release Notes');
        // console.log(releaseTab.data);
        console.log(releaseTab.data.releaseNotes);

        // console.log(datasetTab.data);
        return (
            <StyledPage>
                {dataset.ready && (
                    <>
                        {datasetMessage}
                        {getHeader()}
                        {publishDialog()}
                        {getGeneralInfoAccordion(dataset.data)}
                        <LayoutContainer>
                            <div className="content-row">
                                <StyledContainerOuter>
                                    <div className="card-container">
                                        <div className="card-title ">About The Dataset</div>
                                        <div className="hr-container">
                                            <hr className="hr-style" />
                                        </div>
                                        <ul className="list-style-card-main">
                                            <li>
                                                <span>Curated By:</span> BHK lab
                                            </li>
                                            <li>
                                                <span>Curated On: </span>
                                                {dataset.data?.info?.date?.created ? (
                                                    new String(dataset.data?.info?.date.created).substring(0, 10)
                                                ) : (
                                                    <>Coming Soon!</>
                                                )}
                                            </li>

                                            <li>
                                                <span>DOI: </span>
                                                {dataset.data?.doi ? (
                                                    <a
                                                        href={`https://doi.org/${dataset.data?.doi}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {dataset.data?.doi}
                                                    </a>
                                                ) : (
                                                    <>Coming Soon!</>
                                                )}
                                            </li>
                                            {/* <li>
                                                <span>Format:</span> Coming soon!
                                            </li> */}
                                            <li>
                                                <span>Version:</span> {datasetTab.data.dataset.version}
                                            </li>
                                            <li>
                                                <span>Data Disclaimer: </span>
                                                {disclaimerTab.data.disclaimer}
                                            </li>
                                            <li>
                                                <span>Data Usage Policy: </span>
                                                {disclaimerTab.data.usagePolicy}
                                            </li>
                                            {disclaimerTab.data.citations.length > 0 && (
                                                <li>
                                                    <span>Please Cite the Following: </span>
                                                    {disclaimerTab.data.citations.map((item, i) => (
                                                        <div key={item}>
                                                            <span className="font-semibold">{i + 1}: </span>
                                                            {item}
                                                        </div>
                                                    ))}
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </StyledContainerOuter>

                                <StyledContainerInner>
                                    {datasetTab.data.rna.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">RNA</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.rna.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.rna.map((rna, i) => (
                                                                <li key={i}>
                                                                    <a
                                                                        href={`${rna.url}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                    >
                                                                        <span>{rna.name}: </span>
                                                                    </a>
                                                                    {`${rna.description}`}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}

                                    {datasetTab.data.dna.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">DNA</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.dna.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.dna.map((dna, i) => (
                                                                <li key={i}>
                                                                    <a
                                                                        href={`${dna.url}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                    >
                                                                        <span>{dna.name}: </span>
                                                                    </a>
                                                                    {`${dna.description}`}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}

                                    {datasetTab.data.proteomics.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Proteomics</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.proteomics.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.proteomics.map((proteomic, i) => (
                                                                <li key={i}>
                                                                    <a
                                                                        href={`${proteomic.url}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                    >
                                                                        <span>{proteomic.name}: </span>
                                                                    </a>
                                                                    {`${proteomic.description}`}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}

                                    {datasetTab.data.drugResponse.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Drug Response</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            <ul className="list-style-card-main">
                                                <li>
                                                    <span>Response:</span>
                                                    <ul className="list-style-card-sub">
                                                        {datasetTab.data.drugResponse.map((drugResponse, i) => (
                                                            <li key={i}>
                                                                <a
                                                                    href={`${drugResponse.url}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    <span>{drugResponse.name}: </span>
                                                                </a>
                                                                {`${drugResponse.description}`}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    )}

                                    {datasetTab.data.imagingFeatures.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Imaging Features</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.imagingFeatures.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.imagingFeatures.map((img, i) => (
                                                                <li key={i}>
                                                                    <a
                                                                        href={`${img.url}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                    >
                                                                        <span>{img.name}: </span>
                                                                    </a>
                                                                    {`${img.description}`}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}

                                    {datasetTab.data.imaging.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Imaging</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.imaging.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.imaging.map((img, i) => (
                                                                <li key={i}>
                                                                    <a
                                                                        href={`${img.url}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                    >
                                                                        <span>{img.name}: </span>
                                                                    </a>
                                                                    {`${img.description}`}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </StyledContainerInner>

                                <StyledContainerOuter>
                                    <div className="card-container">
                                        <div className="card-title ">Description</div>
                                        <div className="hr-container">
                                            <hr className="hr-style" />
                                        </div>
                                        {datasetTab.data.description}
                                    </div>
                                    <div className="card-container">
                                        <div className="card-title ">Pipeline Details</div>

                                        <div className="hr-container">
                                            <hr className="hr-style" />
                                        </div>

                                        {dataset.data.info.other.pipeline.url !== '' ||
                                        dataset.data.tools.length > 0 ? (
                                            <div>
                                                {dataset.data.info.other.pipeline.url !== '' && (
                                                    <>
                                                        <a
                                                            href={dataset.data.pipeline.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            <span className="pipeline">Pipeline: </span>
                                                        </a>
                                                        <span>{dataset.data.pipeline.commit_id}</span>
                                                    </>
                                                )}

                                                {dataset.data.tools.length > 0 && (
                                                    <ul className="list-style-card-main">
                                                        <li>
                                                            <span>Tools:</span>
                                                            <ul className="list-style-card-sub">
                                                                {dataset.data.tools.map((tool, i) => (
                                                                    <li key={i}>
                                                                        <a
                                                                            href={tool.url}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                        >
                                                                            <span>{tool.name}: </span>
                                                                        </a>
                                                                        {tool.description}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: '600',
                                                    textAlign: 'center',
                                                    width: '100%',
                                                    marginTop: '16px'
                                                }}
                                            >
                                                Pipeline Details Coming Soon!
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-container">
                                        <div className="card-title ">Release Notes</div>
                                        <hr className="hr-style" />
                                        <div className="release-notes">
                                            {releaseTab.data.releaseNotes.cellLines && (
                                                <div style={{ marginBottom: '10px' }}>
                                                    <h4
                                                        style={{
                                                            fontSize: '16px',
                                                            fontWeight: 'Bold',
                                                            margin: '0 0 3px 0'
                                                        }}
                                                    >
                                                        Cell Lines
                                                    </h4>
                                                    <ul className="list-style-card-sub">
                                                        {releaseTab.data.releaseNotes.cellLines &&
                                                            releaseTab.data.releaseNotes.cellLines.map((note, i) => (
                                                                <li key={i}>
                                                                    <span>{note.current} </span>
                                                                    {note.name.toLowerCase()}
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {releaseTab.data.releaseNotes.samples && (
                                                <div style={{ marginBottom: '10px' }}>
                                                    <h4
                                                        style={{
                                                            fontSize: '16px',
                                                            fontWeight: 'Bold',
                                                            margin: '0 0 3px 0'
                                                        }}
                                                    >
                                                        Samples
                                                    </h4>
                                                    <ul className="list-style-card-sub">
                                                        {releaseTab.data.releaseNotes.samples &&
                                                            releaseTab.data.releaseNotes.samples.map((note, i) => (
                                                                <li key={i}>
                                                                    <span>{note.current} </span>
                                                                    {note.name.toLowerCase()}
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {releaseTab.data.releaseNotes.drugs && (
                                                <div style={{ marginBottom: '10px' }}>
                                                    <h4
                                                        style={{
                                                            fontSize: '16px',
                                                            fontWeight: 'Bold',
                                                            margin: '0 0 3px 0'
                                                        }}
                                                    >
                                                        Drugs
                                                    </h4>
                                                    <ul className="list-style-card-sub">
                                                        {releaseTab.data.releaseNotes.drugs &&
                                                            releaseTab.data.releaseNotes.drugs.map((note, i) => (
                                                                <li key={i}>
                                                                    <span>{note.current} </span>
                                                                    {note.name.toLowerCase()}
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {releaseTab.data.releaseNotes.drugExperiments && (
                                                <div style={{ marginBottom: '10px' }}>
                                                    <h4
                                                        style={{
                                                            fontSize: '16px',
                                                            fontWeight: 'Bold',
                                                            margin: '0 0 3px 0'
                                                        }}
                                                    >
                                                        Drug Experiments
                                                    </h4>
                                                    <ul className="list-style-card-sub">
                                                        {releaseTab.data.releaseNotes.drugExperiments &&
                                                            releaseTab.data.releaseNotes.drugExperiments.map(
                                                                (note, i) => (
                                                                    <li key={i}>
                                                                        <span>{note.current} </span>
                                                                        {note.name.toLowerCase()}
                                                                    </li>
                                                                )
                                                            )}
                                                    </ul>
                                                </div>
                                            )}
                                            {releaseTab.data.releaseNotes.molecularData && (
                                                <div style={{ marginBottom: '10px' }}>
                                                    <h4
                                                        style={{
                                                            fontSize: '16px',
                                                            fontWeight: 'Bold',
                                                            margin: '0 0 3px 0'
                                                        }}
                                                    >
                                                        Molecular Data
                                                    </h4>
                                                    <ul className="list-style-card-sub">
                                                        {releaseTab.data.releaseNotes.molecularData &&
                                                            releaseTab.data.releaseNotes.molecularData.map(
                                                                (note, i) => (
                                                                    <li key={i}>
                                                                        <span>{note.current} </span>
                                                                        {note.name.toLowerCase()}
                                                                    </li>
                                                                )
                                                            )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </StyledContainerOuter>
                            </div>
                        </LayoutContainer>
                    </>
                )}
                {!dataset.data && <h3>Dataset with the specified DOI could not be found</h3>}
            </StyledPage>
        );
    }
    // if the dataset is legacy, use the old format
    else {
        return (
            <StyledPage>
                {dataset.ready && (
                    <>
                        {datasetMessage}
                        {getHeader()}
                        {publishDialog()}
                        {getGeneralInfoAccordion(dataset.data)}
                        <>
                            {datatype === dataTypes.pharmacogenomics && <PSet dataset={dataset.data} />}
                            {datatype === dataTypes.toxicogenomics && <ToxicoSet dataset={dataset.data} />}
                            {datatype === dataTypes.xenographic && <XevaSet dataset={dataset.data} />}
                            {datatype === dataTypes.clinicalgenomics && <ClinicalGenomics dataset={dataset.data} />}
                            {datatype === dataTypes.radiogenomics && <RadioSet dataset={dataset.data} />}
                            {datatype === dataTypes.icb && <ClinicalGenomics dataset={dataset.data} />}
                            {datatype === dataTypes.radiomics && <RadiomicSet dataset={dataset.data} />}
                        </>
                    </>
                )}
                {!dataset.data && <h3>Dataset with the specified DOI could not be found</h3>}
            </StyledPage>
        );
    }
};

export default SingleDatasetNew;
