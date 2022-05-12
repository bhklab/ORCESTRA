import React, { useState } from 'react';

import { Messages } from 'primereact/messages';
import styled from 'styled-components';
import StyledPage from '../../styles/StyledPage';
import CanonicalPSetManager from './CanonicalPSetManager';
import ProcessedDataObjects from './ProcessedDataObjects';
import DataSubmissionManager from './DataSubmissionManager';

const Container = styled.div`
    .title {
        font-size: 20px;
        font-weight: bold;
    }
    .bottom {
        margin-top: 20px;
    }
`;

const TabNavigation = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    height: 70px;
    .nav-item {
        margin-right: 20px;
        padding-bottom: 2px;
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
    }
    .active {
        border-bottom: 2px solid rgb(241, 144, 33);
    }
`;

const Admin = () => {
    const [selectedMenu, setSelectedMenu] = useState('canonical-psets');
    
    return(
        <StyledPage>
            <Container>
                <div className='title'>Administrator's Menu</div>
                <Messages ref={(el) => Admin.messages = el} />
                <TabNavigation>
                    <span 
                        className={`nav-item ${selectedMenu === 'canonical-psets' ? 'active' : ''}`} 
                        onClick={(e) => {setSelectedMenu('canonical-psets')}}
                    >
                        Canonical PSets
                    </span>
                    <span 
                        className={`nav-item ${selectedMenu === 'processed-data-obj' ? 'active' : ''}`}
                        onClick={(e) => {setSelectedMenu('processed-data-obj')}}
                    >
                        Processed Data Objects
                    </span>
                    <span 
                        className={`nav-item ${selectedMenu === 'data-submissions' ? 'active' : ''}`}
                        onClick={(e) => {setSelectedMenu('data-submissions')}}
                    >
                        Data Submissions
                    </span>
                </TabNavigation>
                {
                    selectedMenu === 'canonical-psets' && <CanonicalPSetManager />
                }
                {
                    selectedMenu === 'processed-data-obj' && <ProcessedDataObjects />
                }
                {
                    selectedMenu === 'data-submissions' && <DataSubmissionManager />
                }
            </Container>
        </StyledPage>
    )
}

export default Admin