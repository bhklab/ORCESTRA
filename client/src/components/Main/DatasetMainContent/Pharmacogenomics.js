import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DatasetDialog, RNADialog } from '../MainDialog/PharmacogenomicsDialog';
import * as MainStyle from '../MainStyle';
import CanonicalBox from '../MainBoxes/CanonicalBox';
import RequestStatusBox from '../MainBoxes/RequestStatusBox';
import PopularDatasetBox from '../MainBoxes/PopularDatasetBox';
import YourOwnDataBox from '../MainBoxes/YourOwnDataBox';
import { dataTypes } from '../../Shared/Enums';
import { Message } from 'primereact/message';

const Pharmacogenomics = () => {
    const [statsData, setStatsData] = useState([]);
    const [searchData, setSearchData] = useState({
        dataset: [],
        rnaTool: [],
        dnaTool: [],
        rnaRef: [],
        dnaRef: []
    });
    const [reqStatus, setReqStatus] = useState({
        pending: 0,
        inProcess: 0
    });
    const [datasetVisible, setDatasetVisible] = useState(false);
    const [rnaVisible, setRNAVisible] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const res = await axios.get('/api/view/landing', { params: { datasetType: dataTypes.pharmacogenomics } });
            console.log(res.data);
            setStatsData(res.data.downloadRanking);
            setSearchData(res.data.searchData);
            setReqStatus(res.data.reqStatus);
        };
        getData();
    }, []);

    const showDialog = type => {
        switch (type) {
            case 'dataset':
                setDatasetVisible(true);
                break;
            case 'rna':
                setRNAVisible(true);
                break;
            default:
                break;
        }
    };

    const hideDialog = type => {
        switch (type) {
            case 'dataset':
                setDatasetVisible(false);
                break;
            case 'rna':
                setRNAVisible(false);
                break;
            default:
                break;
        }
    };

    return (
        <MainStyle.Wrapper>
            <MainStyle.DatasetHeaderGroup>
                <h1>ORCESTRA for Pharmacogenomics</h1>
                <h2>Explore and request multimodal Pharmacogenomic Datasets (PSets)</h2>
                <div className="warning-wrapper">
                    <Message
                        severity="warn"
                        text="We have recently discovered minor differences between the results of some dataset curation runs in regards to
						recomputed fits produced by PharmacoGx in some of our Pharmacogenomic datasets. We have deduced this is caused
						by the way in which operating systems resolve floating point-noise. Differences in floating-point
						calculations can alter the PharmacoGx's optimizer's path, stopping point, or selected minimum, particularly
						for weakly responsive or poorly identified curves. This may affect several of our Pharmacogenomics datasets including
						but not limited to CCLE_2019 and CTRPv2.1_2016."
                    />
                </div>
            </MainStyle.DatasetHeaderGroup>
            <MainStyle.Row>
                <MainStyle.Column>
                    <MainStyle.Item>
                        <h3 className="header">Search and Request PSets</h3>
                        <div className="content">
                            <div>Design your own PSet using:</div>
                            <div className="line">
                                <MainStyle.Number>
                                    <button
                                        onClick={() => {
                                            showDialog('dataset');
                                        }}
                                    >
                                        {searchData.numDataVersions}
                                    </button>
                                </MainStyle.Number>
                                <span>Dataset/Drug sensitivity combinations</span>
                            </div>
                            <div className="line">
                                <MainStyle.Number>
                                    <button
                                        onClick={() => {
                                            showDialog('rna');
                                        }}
                                    >
                                        {searchData.rnaTool.length}
                                    </button>
                                </MainStyle.Number>
                                <span>RNA pipelines.</span>
                            </div>
                            <div className="link">
                                <MainStyle.Button href={`/${dataTypes.pharmacogenomics}/search`}>
                                    Search and Request
                                </MainStyle.Button>
                            </div>
                        </div>
                    </MainStyle.Item>
                    {/* <RequestStatusBox
                        datasetName="PSet"
                        datasetType={dataTypes.pharmacogenomics}
                        reqStatus={reqStatus}
                    /> */}
                    <MainStyle.Item>
                        <h3 className="header">TCL Cell line Table</h3>
                        <div className="content">
                            <div className="line">
                                <MainStyle.Number>39</MainStyle.Number>
                                <span> total cell lines</span>
                            </div>

                            <div className="link">
                                <MainStyle.Button href={`/tcl/table`}>View All</MainStyle.Button>
                            </div>
                        </div>
                    </MainStyle.Item>
                </MainStyle.Column>
                <MainStyle.Column>
                    <PopularDatasetBox
                        datasetName="PSet"
                        datasetType={dataTypes.pharmacogenomics}
                        statsData={statsData}
                    />
                    <CanonicalBox datasetName="PSet" datasetType={dataTypes.pharmacogenomics} />
                    <YourOwnDataBox datasetName="PSet" datasetType={dataTypes.pharmacogenomics} />
                </MainStyle.Column>
            </MainStyle.Row>
            <DatasetDialog
                visible={datasetVisible}
                onHide={() => {
                    hideDialog('dataset');
                }}
                dataset={searchData.dataset}
            />
            <RNADialog
                visible={rnaVisible}
                onHide={() => {
                    hideDialog('rna');
                }}
                rna={{ tool: searchData.rnaTool, ref: searchData.rnaRef }}
            />
        </MainStyle.Wrapper>
    );
};

export default Pharmacogenomics;
