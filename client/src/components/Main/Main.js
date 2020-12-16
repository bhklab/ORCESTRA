import React, {useContext, useEffect} from 'react';
import {PathContext} from '../../context/path';
import * as MainStyle from './MainStyle';
import styled from 'styled-components';
import {dataTypes} from '../Shared/Enums';

const StyledBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color:rgb(255, 255, 255,0.5);
    margin: 0px 10px 10px 10px;
    padding: 10px 30px 30px 30px;
    border-radius: 10px;
    width: 30%;
    height: 250px;
    min-width: 200px;
    max-width: 370px;

    .header {
        height: 25%;
        width: 90%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
    }

    button {
        height: 75%;
        border: none;
        outline: none;
        cursor: pointer;
        background: none;

        :hover .hover-cover {
            opacity: 0.7;
        }

        :hover .hover-text {
            display: block;
        }
    }

    .btn-content {
        position relative;
        display: flex;
        justify-content center;
        align-items: center;
    }

    img {
        width: ${props => (props.imgWidth)};
        min-width: 130px;
        margin: 10px;
    }

    .hover-cover {
        position absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ffffff;
        border-radius: 5px;
        opacity: 0;
    }

    .hover-text {
        display: none;
        position absolute;
        font-size: 45px;
        font-weight: bold;
        color: #3D405A;
    }

    @media only screen and (max-width: 1000px) {
        width: 60%;
        min-width: 360px;
    }
`;


const Main = (props) => {

    const path = useContext(PathContext);
    const { history } = props;

    useEffect(() => {
        path.setDatatype('');
    }, []);

    const DatatypeBox = (props) => (
            <StyledBox imgWidth={props.imgWidth}>
                <div className='header'>{props.title}</div>
                <button 
                    onClick={() => {
                        path.setDatatype(props.datatype);
                        history.push({pathname: `/${props.datatype}`});
                    }}
                    disabled={props.disabled}
                >
                    <div className='btn-content'>
                        <img src={`/images/icons/${props.datatype}.png`} />
                        <div className='hover-cover'></div>
                        <div className='hover-text'>{props.text}</div>
                    </div>
                </button>
            </StyledBox>
    );

    return (
        <MainStyle.Wrapper>
            <MainStyle.HeaderGroup>
                <h1>ORCESTRA</h1>   
                <h2>Orchestration platform for reproducing multimodal data</h2>
            </MainStyle.HeaderGroup>
            <MainStyle.Row>
                <DatatypeBox title='Pharmacogenomics Data' datatype={dataTypes.pharmacogenomics} text='GO' imgWidth='45%' />
                <DatatypeBox title='Toxicogenomics Data' datatype={dataTypes.toxicogenomics} text='GO' imgWidth='70%'/>
                <DatatypeBox title='Xenographic Pharmacogenomics Data' datatype={dataTypes.xenographic} text='GO' imgWidth='70%'/>
            </MainStyle.Row>  
            <MainStyle.Row>
                <DatatypeBox title='Radiogenomics Data' datatype={dataTypes.radiogenomics} text='GO' imgWidth='45%'/>
                <DatatypeBox title='Clinical Genomics Data' datatype={dataTypes.clinicalgenomics} text='GO'  imgWidth='45%'/>
            </MainStyle.Row>
        </MainStyle.Wrapper>
    );
    
}

export default Main;