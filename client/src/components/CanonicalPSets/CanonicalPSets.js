import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {dataTypes} from '../Shared/Enums';
import StyledPage from '../../styles/StyledPage';

const StyledContainer = styled.div`
    margin-bottom: 20px;
    border-radius: 10px;
    padding-top: 5px;
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 30px;
    background-color: rgba(255, 255, 255, 0.8);
`

const StyledTable = styled.table`   
    margin-left: 30px;
    margin-bottom: 10px;
    .psetName {
        font-size: 16px;
    }
    .rnaRefColumn {
        width: 30%;
    }
    td {
        width: 20%;
        margin: 0;
        padding-right: 50px;
        padding-bottom: 10px;
        font-size: 14px;
        font-family: arial, san-serif;
    }
    td .bold {
        font-weight: bold;
    }
`

const NonCanonDiv = styled.div`
    margin-left: 30px;
    width: 60%;
`

const NonCannonTable = styled.table`
    td {
        margin: 0;
        padding-right: 30px;
        padding-bottom: 10px;
    }
`

const PSetContainer = styled.div`
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid #999999;
`

const CanonicalPSets = () => {
    
    const [canonPSets, setCanonPSets] = useState([]);
    
    useEffect(() => {
        const getData = async () => {
            const res = await axios.get('/api/view/canonical-data-objects', {params: {datasetType: 'pset'}});
            console.log(res.data);
            setCanonPSets(res.data);
        }
        getData();
    }, []);

    const toolsRefTemplate = (value) => {
        let output ='Not Available';
        if(value.length){
            output = <div>{value}</div>;
        }
        return(
            <div>{output}</div>
        );
    }

    const nameColumnTemplate = (data) => {
        let route = `/${dataTypes.pharmacogenomics}/${data.doi}`;
        return(
            <Link to={route} target="_blank">{data.name}</Link>
        );
    }

    const canonTable = (psets) => (
        <StyledTable>
            <tbody>
            {psets.map(pset => {
                return(
                    <tr key={pset.name}>
                        <td className='psetName'>{nameColumnTemplate(pset)}</td>
                        <td><div>Drug Sensitivity Data:</div> <span className='bold'>{pset.dataset.version}</span></td>
                        <td>RNA Tools: <span className='bold'>{toolsRefTemplate(pset.tools.rna)}</span></td>
                        <td className='rnaRefColumn'>RNA Ref: <span className='bold'>{toolsRefTemplate(pset.references.rna)}</span></td>
                    </tr>
                )
            })}
            </tbody>
        </StyledTable>    
    )

    const nonCanonTable = (psets) => (
        <NonCannonTable>
            <tbody>
            {psets.map(pset => {
                return(
                    <tr key={pset.name}>
                        <td className='psetName'>{nameColumnTemplate(pset)}</td>
                        <td><div>Drug Sensitivity Data:</div> {pset.dataset.version}</td>
                        <td>RNA Tools: {toolsRefTemplate(pset.tools.rna)}</td>
                        <td className='rnaRefColumn'>RNA Ref: {toolsRefTemplate(pset.references.rna)}</td>
                    </tr>
                )
            })}
            </tbody>
        </NonCannonTable> 
    )

    return(
        <StyledPage>
            <h2>List of Canonical PSets (The Latest Version of PSets Created by BHK Lab)</h2>
            <StyledContainer>
            {
                canonPSets.map(dataset => (
                    <PSetContainer key={dataset.dataset}>
                        <h4>{dataset.dataset}</h4>
                        {canonTable(dataset.canonicals)}  
                        {
                            dataset.nonCanonicals.length ?
                            <NonCanonDiv>
                                <Accordion>
                                    <AccordionTab header='Other Versions'>
                                        {nonCanonTable(dataset.nonCanonicals)}
                                    </AccordionTab>
                                </Accordion>
                            </NonCanonDiv>
                            :
                            ''
                        }
                    </PSetContainer>    
                ))
            }
            </StyledContainer>
        </StyledPage>
    )
}

export default CanonicalPSets