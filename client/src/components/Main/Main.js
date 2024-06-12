import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathContext } from '../../hooks/Context';
import {
    Wrapper,
    HeaderGroup,
    Row,
} from './MainStyle';
import styled from 'styled-components';
import { dataTypes } from '../Shared/Enums';

const StyledBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(255, 255, 255, 0.3);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    transition: all 0.3s ease-in-out;
    cursor: pointer;
	width: 300px;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }

    .header {
        font-size: 22px;
        font-weight: 900;
        text-align: center;
    }

    .image-container {
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
		width: 200px;
    }

    img {
        width: 200px;
        max-width: 100%;
        align-self: center;
    }
`;


const Main = () => {
    const path = useContext(PathContext);
    const navigate = useNavigate();

    useEffect(() => {
        path.setDatatype('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const DatatypeBox = ({ title, datatype }) => (
        <StyledBox onClick={() => navigate(`/${datatype}`)}>
            <div className='header'>{title}</div>
            <div className='image-container'>
                <img src={`/images/icons/${datatype}.png`} alt={title} />
            </div>
        </StyledBox>
    );
    
    
    return (
        <Wrapper>
            <HeaderGroup>
                <h1>ORCESTRA</h1>   
                <h2>Orchestration platform for reproducing multimodal data</h2>
            </HeaderGroup>
            <Row>
                <DatatypeBox title='Pharmacogenomics Data' datatype={dataTypes.pharmacogenomics} />
                <DatatypeBox title='Toxicogenomics Data' datatype={dataTypes.toxicogenomics} />
                <DatatypeBox title='Xenographic Pharmacogenomics Data' datatype={dataTypes.xenographic} />
                <DatatypeBox title='Radiogenomics Data' datatype={dataTypes.radiogenomics} />
                <DatatypeBox title='Clinical Genomics Data' datatype={dataTypes.clinicalgenomics} />
                <DatatypeBox title='Immune Checkpoint Blockade Data' datatype={dataTypes.icb} />
                <DatatypeBox title='Radiomics Data' datatype={dataTypes.radiomics}/>
            </Row>
        </Wrapper>
    );
}

export default Main;