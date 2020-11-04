import React, {useContext, useEffect} from 'react';
import {PathContext} from '../../context/path';
import * as MainStyle from './MainStyle';
import styled from 'styled-components';

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
    max-width: 370px;
    min-height:200px;
    min-width: 200px;

    button {
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
        width: 45%;
        margin: 10px;
    }

    .hover-cover {
        position absolute;
        width: 60%;
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
`;


const Main = (props) => {

    const path = useContext(PathContext);
    const { history } = props;

    useEffect(() => {
        path.setDatatype('');
    }, []);

    const DatatypeBox = (props) => (
            <StyledBox>
                <h2>{props.title}</h2>
                <button 
                    onClick={() => {
                        path.setDatatype(props.datatype);
                        history.push({pathname: `/${props.datatype}`});
                    }}
                >
                    <div className='btn-content'>
                        <img src={`/images/icons/${props.datatype}.png`} />
                        <div className='hover-cover'></div>
                        <div className='hover-text'>GO</div>
                    </div>
                </button>
            </StyledBox>
    );

    return (
        <MainStyle.Wrapper>
            <MainStyle.HeaderGroup>
                <h1>ORCESTRA</h1>   
                <h2>An orchestration platform for reproducing multimodal data</h2>
            </MainStyle.HeaderGroup>
            <MainStyle.Row>
                <DatatypeBox title='Pharmacogenomics Data' datatype='pharmacogenomics'/>
                <DatatypeBox title='Pharmacogenomics Data' datatype='pharmacogenomics'/>
                <DatatypeBox title='Pharmacogenomics Data' datatype='pharmacogenomics'/>
            </MainStyle.Row>  
            <MainStyle.Row>
                <DatatypeBox title='Pharmacogenomics Data' datatype='pharmacogenomics'/>
                <DatatypeBox title='Pharmacogenomics Data' datatype='pharmacogenomics'/>
            </MainStyle.Row>
        </MainStyle.Wrapper>
    );
    
}

export default Main;