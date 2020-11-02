import React from 'react';
import { Link } from 'react-router-dom';
import * as MainStyle from './MainStyle';

const Main = () => {

    return (
        <MainStyle.Wrapper>
            <MainStyle.HeaderGroup>
                <h1>ORCESTRA</h1>   
                <h2>An orchestration platform for reproducing multimodal data</h2>
            </MainStyle.HeaderGroup>
            <MainStyle.Row>
                <MainStyle.Column>
                    <MainStyle.Item style={{ alignSelf: 'flex-start'}}>
                        <h3>Pharmacogenomics Data</h3>
                        <div className='content'>
                            <div className='link'>
                                <MainStyle.Button href="/pharmacogenomics">GO</MainStyle.Button>
                            </div>
                        </div>
                    </MainStyle.Item>
                </MainStyle.Column>
                <MainStyle.Column>
                   
                </MainStyle.Column> 
                <MainStyle.Column>
                    
                </MainStyle.Column>    
            </MainStyle.Row>  
        </MainStyle.Wrapper>
    );
    
}

export default Main;