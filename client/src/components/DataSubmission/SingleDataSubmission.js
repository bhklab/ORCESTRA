import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import StyledPage from '../../styles/StyledPage';

const StyledDataSubmission = styled.div`
    width: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
    padding-bottom: 30px;
    font-size: 12px;
    .title {
        font-size: 20px;
        font-weight: bold;
    }
    .sub-title {
        font-size: 14px;
        font-weight: bold;
        margin-top: 30px;
        margin-bottom: 10px;
    }
`;

const StyledTableGroup = styled.div`
    display: flex;
    .left {
        margin-right: 10px;
    }
`;

const StyledTable = styled.table`
    font-size: 12px;
    td {
        padding: 5px;
    }
    .label {
        font-weight: bold;
    }
    .value {
        text-align: left;
        padding-right: 20px;
    }
`;

const SingleDateSubmission = (props) => {
    const [submission, setSubmission] = useState();
    const [ready, setReady] = useState(false);
    useEffect(() => {
        console.log(props.match.params.id);
        const getData = async () => {
            const res = await axios.get(`/api/user/dataset/submitted/${props.match.params.id}`);
            console.log(res.data);
            setSubmission(res.data);
            setReady(true);
        }
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(
        <StyledPage>
            {
                ready &&
                <StyledDataSubmission>
                    <div className='title'>Submitted Data</div>
                    <div className='sub-title'>Submission Info</div>
                    <StyledTable className='left'>
                        <tbody>
                            <tr>
                                <td className='label'>Name</td>
                                <td className='value'>{submission.info.name}</td>
                                <td className='label'>Submitted by</td>
                                <td className='value'>{submission.info.email}</td>
                            </tr>
                            <tr>
                                <td className='label'>Status</td>
                                <td className='value'>{submission.info.status}</td>
                                <td className='label'>Private</td>
                                <td className='value'>{submission.info.private ? 'Yes': 'No'}</td>
                            </tr>
                            <tr>
                                <td className='label'>Dataset Type</td>
                                <td className='value'>{submission.info.datasetType.label}</td>
                            </tr>
                        </tbody>
                    </StyledTable>
                    <div className='sub-title'>Sample Annotation</div>
                    <StyledTable className='left'>
                        <tbody>
                            <tr>
                                <td className='label'>Filename</td>
                                <td className='value'>{submission.sampleAnnotation.filename}</td>
                                <td className='label'>Repository</td>
                                <td className='value'>
                                    <a href={submission.sampleAnnotation.repoURL}>{submission.sampleAnnotation.repoURL}</a>
                                </td>
                            </tr>
                        </tbody>
                    </StyledTable>
                    <div className='sub-title'>Drug Annotation</div>
                    <StyledTable className='left'>
                        <tbody>
                            <tr>
                                <td className='label'>Filename</td>
                                <td className='value'>{submission.drugAnnotation.filename}</td>
                                <td className='label'>Repository</td>
                                <td className='value'>
                                    <a href={submission.drugAnnotation.repoURL}>{submission.drugAnnotation.repoURL}</a>
                                </td>
                            </tr>
                        </tbody>
                    </StyledTable>
                    <div className='sub-title'>Raw Treatment Sensitivity Data</div>
                    <StyledTable className='left'>
                        <tbody>
                            <tr>
                                <td className='label'>Version</td>
                                <td className='value'>{submission.rawTreatmentData.version}</td>
                                <td className='label'>Filename</td>
                                <td className='value'>{submission.rawTreatmentData.filename}</td>
                                <td className='label'>Repository</td>
                                <td className='value'>
                                    <a href={submission.rawTreatmentData.repoURL}>{submission.rawTreatmentData.repoURL}</a>
                                </td>
                            </tr>
                        </tbody>
                    </StyledTable>
                    <StyledTableGroup>
                        <StyledTable className='left'>
                            <tbody>
                                <tr>
                                    <td className='label'>Publication</td>
                                    <td className='value'>{submission.rawTreatmentData.publication.citation}</td>
                                </tr>
                            </tbody>
                        </StyledTable>
                    </StyledTableGroup>
                    <StyledTableGroup>
                        <StyledTable className='left'>
                            <tbody>
                                <tr>
                                    <td className='label'>Publication Link</td>
                                    <td className='value'>
                                        <a href={submission.rawTreatmentData.publication.link}>{submission.rawTreatmentData.publication.link}</a>
                                    </td>
                                </tr>
                            </tbody>
                        </StyledTable>
                    </StyledTableGroup>
                    <div className='sub-title'>Treatment Sensitivity Info</div>
                    <StyledTable className='left'>
                        <tbody>
                            <tr>
                                <td className='label'>Filename</td>
                                <td className='value'>{submission.treatmentInfo.filename}</td>
                                <td className='label'>Repository</td>
                                <td className='value'>
                                    <a href={submission.treatmentInfo.repoURL}>{submission.treatmentInfo.repoURL}</a>
                                </td>
                            </tr>
                        </tbody>
                    </StyledTable>
                    <div className='sub-title'>Processed Molecular Profile Data</div>
                    {
                        submission.molecularData.map(molecularData => (
                            <StyledTableGroup>
                                <StyledTable className='left'>
                                    <tbody>
                                        <tr>
                                            <td className='label'>Data type</td>
                                            <td className='value'>{molecularData.name.label}</td>
                                        </tr>
                                    </tbody>
                                </StyledTable>
                                <StyledTable>
                                    <tbody>
                                        <tr>
                                            <td className='label'>Filename</td>
                                            <td className='value'>{molecularData.filename}</td>
                                            <td className='label'>Repository</td>
                                            <td className='value'>
                                                <a href={molecularData.repoURL}>{molecularData.repoURL}</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='label'>Tool Name</td>
                                            <td className='value'>{molecularData.toolname}</td>
                                            <td className='label'>Tool Version</td>
                                            <td className='value'>{molecularData.toolversion}</td>
                                        </tr>
                                        <tr>
                                            <td className='label'>Reference Name</td>
                                            <td className='value'>{molecularData.refname}</td>
                                            <td className='label'>Reference URL</td>
                                            <td className='value'>
                                                <a href={molecularData.refURL}>{molecularData.refURL}</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </StyledTable>
                            </StyledTableGroup>
                        ))
                    }
                </StyledDataSubmission>
            }
        </StyledPage>
    );
}

export default SingleDateSubmission;