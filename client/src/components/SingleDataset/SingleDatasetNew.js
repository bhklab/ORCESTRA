import React, { useEffect, useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
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
    StyledContainerInner,
    StyledQualityControl
} from '../SearchRequest/RadiomicSet/Styles/StyledRadiomicSetSearch';

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
        // console.log(releaseTab.data.releaseNotes);

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
                                    {datasetTab.data.qualityControl.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Validation</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            <StyledQualityControl>
                                                {datasetTab.data.qualityControl.map((qc, i) => (
                                                    <a
                                                        className="qc-button"
                                                        href={`${(process.env.REACT_APP_API_BASE || '').replace(
                                                            /\/$/,
                                                            ''
                                                        )}/api/view/single-data-object/qc?url=${encodeURIComponent(
                                                            qc.url
                                                        )}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        key={i}
                                                    >
                                                        <span style={{ fontSize: '13px' }}>
                                                            {qc.name} quality control
                                                        </span>
                                                    </a>
                                                ))}
                                            </StyledQualityControl>
                                        </div>
                                    )}

                                    {dataset.data.plots && dataset.data.plots.length > 0 && (
                                        <div
                                            style={{
                                                overflowX: 'auto',
                                                overflowY: 'hidden',
                                                maxWidth: '100%',
                                                background: 'white'
                                            }}
                                            className="card-container"
                                        >
                                            <div className="card-title ">Plots</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {dataset.data.plots.map(plot => (
                                                <>
                                                    {console.log(plot)}
                                                    <img
                                                        src={`/images/plots/${plot}`}
                                                        alt="Plot"
                                                        style={{
                                                            display: 'block',
                                                            height: 'auto',
                                                            width: 'auto',
                                                            maxHeight: '500px',
                                                            maxWidth: 'none',
                                                            border: '1px solid black'
                                                        }}
                                                    />
                                                </>
                                            ))}
                                        </div>
                                    )}
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
                                                            {datasetTab.data.rna.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        <a
                                                                            href={`${item.url}`}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                        >
                                                                            <span>{item.name}</span>
                                                                        </a>
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                    {datasetTab.data.microRna.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Micro Rna</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.microRna.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.microRna.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                    {datasetTab.data.microArray && datasetTab.data.microArray.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Micro Array</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.microArray.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.microArray.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
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
                                                            {datasetTab.data.dna.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}

                                    {datasetTab.data.mutation.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Mutation</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.mutation.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.mutation.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}

                                    {datasetTab.data.cnv.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">CNV</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.cnv.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.cnv.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}

                                    {datasetTab.data.metabolomics.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Metabolomics</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.metabolomics.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.metabolomics.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}

                                    {datasetTab.data.methylation.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Methylation</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.methylation.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.methylation.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}

                                    {datasetTab.data.fusion.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Fusion</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.fusion.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.fusion.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}

                                    {datasetTab.data.chromatin.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Chromatin</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.chromatin.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.chromatin.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                    {datasetTab.data.exon.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Exon</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            <ul className="list-style-card-main">
                                                <li>
                                                    <ul className="list-style-card-sub">
                                                        {datasetTab.data.exon.map((item, i) => {
                                                            const paragraphs = (item.description ?? '')
                                                                .split(/\n/)
                                                                .map(s => s.trim())
                                                                .filter(Boolean);

                                                            return (
                                                                <li key={i}>
                                                                    {item.url ? (
                                                                        <a
                                                                            href={item.url}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                        >
                                                                            <span>{item.name}</span>
                                                                        </a>
                                                                    ) : (
                                                                        <span>{item.name}</span>
                                                                    )}
                                                                    {paragraphs.map((text, i) => (
                                                                        <p index={i} style={{ margin: '5px 0 5px 0' }}>
                                                                            {text}
                                                                        </p>
                                                                    ))}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </li>
                                            </ul>
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
                                                            {datasetTab.data.proteomics.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
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
                                                    <ul className="list-style-card-sub">
                                                        {datasetTab.data.drugResponse.map((item, i) => {
                                                            const paragraphs = (item.description ?? '')
                                                                .split(/\n/)
                                                                .map(s => s.trim())
                                                                .filter(Boolean);

                                                            return (
                                                                <li key={i}>
                                                                    {item.url ? (
                                                                        <a
                                                                            href={item.url}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                        >
                                                                            <span>{item.name}</span>
                                                                        </a>
                                                                    ) : (
                                                                        <span>{item.name}</span>
                                                                    )}
                                                                    {paragraphs.map((text, i) => (
                                                                        <p index={i} style={{ margin: '5px 0 5px 0' }}>
                                                                            {text}
                                                                        </p>
                                                                    ))}
                                                                </li>
                                                            );
                                                        })}
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
                                                            {datasetTab.data.imagingFeatures.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
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
                                                            {datasetTab.data.imaging.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                    {datasetTab.data.compoundMetadata?.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Compound Metadata</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.compoundMetadata.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.compoundMetadata.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                    {datasetTab.data.expAssays?.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Experiments or Assays</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.expAssays.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.expAssays.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);
                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                    {datasetTab.data.compoundOverview.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Compound Overview</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.compoundOverview.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.compoundOverview.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                    {datasetTab.data.hepatotoxicity?.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Hepatotoxicity</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.hepatotoxicity.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.hepatotoxicity.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                    {datasetTab.data.drugStatus?.length > 0 && (
                                        <div className="card-container">
                                            <div className="card-title ">Drug Status</div>
                                            <div className="hr-container">
                                                <hr className="hr-style" />
                                            </div>
                                            {datasetTab.data.drugStatus.length > 0 && (
                                                <ul className="list-style-card-main">
                                                    <li>
                                                        <ul className="list-style-card-sub">
                                                            {datasetTab.data.drugStatus.map((item, i) => {
                                                                const paragraphs = (item.description ?? '')
                                                                    .split(/\n/)
                                                                    .map(s => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <li key={i}>
                                                                        {item.url ? (
                                                                            <a
                                                                                href={item.url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{item.name}</span>
                                                                        )}
                                                                        {paragraphs.map((text, i) => (
                                                                            <p
                                                                                index={i}
                                                                                style={{ margin: '5px 0 5px 0' }}
                                                                            >
                                                                                {text}
                                                                            </p>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </StyledContainerInner>

                                <StyledContainerOuter>
                                    <div className="card-container">
                                        <div className="card-title">Description</div>

                                        <div className="hr-container">
                                            <hr className="hr-style" />
                                        </div>
                                        {datasetTab.data.description && <p>{datasetTab.data.description}</p>}
                                        {/* {datasetTab.data?.descriptionExpanded?.length > 0 && (
                                            <Accordion multiple activeIndex={[0]}>
                                                {datasetTab.data.descriptionExpanded.map((entry, entryIndex) => (
                                                    <AccordionTab key={entryIndex} header={entry.title}>
                                                        {entry.content.map((item, itemIndex) => {
                                                            const paragraphs = (item.body ?? '')
                                                                .split(/\r?\n/)
                                                                .map(s => s.trim())
                                                                .filter(Boolean);

                                                            return (
                                                                <div key={itemIndex} style={{ marginBottom: '1rem' }}>
                                                                    <h3 style={{ marginBottom: '0.5rem' }}>
                                                                        {item.header}
                                                                    </h3>
                                                                    {paragraphs.map((text, i) => (
                                                                        <p key={i} className="text-bodyMd mb-2">
                                                                            {text}
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            );
                                                        })}
                                                    </AccordionTab>
                                                ))}
                                            </Accordion>
                                        )} */}
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
                                                            className="pipeline-hover"
                                                        >
                                                            <span className="pipeline">Pipeline: </span>
                                                            <span className="commitId">
                                                                {dataset.data.pipeline.commit_id}
                                                            </span>
                                                        </a>
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
                                            {releaseTab.data.releaseNotes.cellLines &&
                                                releaseTab.data.releaseNotes?.cellLines.length > 0 && (
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
                                                                releaseTab.data.releaseNotes.cellLines.map(
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
                                            {releaseTab.data.releaseNotes.samples &&
                                                releaseTab.data.releaseNotes?.samples.length > 0 && (
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
                                            {releaseTab.data.releaseNotes.drugs &&
                                                releaseTab.data.releaseNotes?.drugs.length > 0 && (
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
                                            {releaseTab.data.releaseNotes.compounds &&
                                                releaseTab.data.releaseNotes?.compounds.length > 0 && (
                                                    <div style={{ marginBottom: '10px' }}>
                                                        <h4
                                                            style={{
                                                                fontSize: '16px',
                                                                fontWeight: 'Bold',
                                                                margin: '0 0 3px 0'
                                                            }}
                                                        >
                                                            Compounds
                                                        </h4>
                                                        <ul className="list-style-card-sub">
                                                            {releaseTab.data.releaseNotes.compounds &&
                                                                releaseTab.data.releaseNotes.compounds.map(
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
                                            {releaseTab.data.releaseNotes.drugExperiments &&
                                                releaseTab.data.releaseNotes?.drugExperiments.length > 0 && (
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
                                            {releaseTab.data.releaseNotes.molecularData &&
                                                releaseTab.data.releaseNotes?.molecularData?.length > 0 && (
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
                                            {releaseTab.data.releaseNotes.toxicology &&
                                                releaseTab.data.releaseNotes?.toxicology?.length > 0 && (
                                                    <div style={{ marginBottom: '10px' }}>
                                                        <h4
                                                            style={{
                                                                fontSize: '16px',
                                                                fontWeight: 'Bold',
                                                                margin: '0 0 3px 0'
                                                            }}
                                                        >
                                                            Toxicology
                                                        </h4>
                                                        <ul className="list-style-card-sub">
                                                            {releaseTab.data.releaseNotes.toxicology &&
                                                                releaseTab.data.releaseNotes.toxicology.map(
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
                                            {releaseTab.data.releaseNotes.experiment &&
                                                releaseTab.data.releaseNotes?.experiment?.length > 0 && (
                                                    <div style={{ marginBottom: '10px' }}>
                                                        <h4
                                                            style={{
                                                                fontSize: '16px',
                                                                fontWeight: 'Bold',
                                                                margin: '0 0 3px 0'
                                                            }}
                                                        >
                                                            Experiments
                                                        </h4>
                                                        <ul className="list-style-card-sub">
                                                            {releaseTab.data.releaseNotes.experiment &&
                                                                releaseTab.data.releaseNotes.experiment.map(
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
