import React, { useState } from 'react';
import styled from 'styled-components';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import PSetTable from '../../Shared/PSetTable';
import * as Helper from '../../Shared/Helper';

const StyledUserPSet = styled.div`
    width: 100%;
    max-width: 1000px;
    margin-bottom: 20px;
    border-radius: 10px;
    padding-top: 1px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    background-color: rgba(255, 255, 255, 0.8);

    .userPSetContent{
        margin-top: 20px;
        width: 100%;
    }

    .footer{
        margin-top: 20px;
    }
`;

const UserPSet = (props) => {
    const { heading, btnLabel, pset, handleBtnClick, messages, pending } = props;
    const [selectedPSets, setSelectedPSets] = useState([]);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [btnYesDisplayed, setBtnYesDisplayed] = useState(false);

    const handleSelectionChange = (selected) => {
        setSelectedPSets(selected);
        if(selected && selected.length > 0){
            setBtnDisabled(false);
        }else{
            setBtnDisabled(true);
        }
    }

    const showMessages = (status, data) => {
        Helper.messageAfterRequest(status, data, null, messages);
    }

    const onClickYes = () => {
        setBtnDisabled(true);
        setBtnYesDisplayed(true);
        handleBtnClick(selectedPSets, (err)=>{
            if(!err){
                setSelectedPSets([]);
                setDialogVisible(false);
            }else{
                setBtnDisabled(false);
            }   
        });
    }
    
    const onHide = () => {
        setDialogVisible(false);
        setBtnYesDisplayed(false);
    }

    const dialogFooter = (
        <div>
            <Button label="Yes" onClick={onClickYes} disabled={btnYesDisplayed}/>
            <Button label="Cancel" onClick={onHide} />
        </div>
    );

    return(
        <StyledUserPSet>
            <h3>{heading}</h3>
            <div className='userPSetContent'>
                {
                    pset.length > 0 ? 
                    <React.Fragment>
                        <div>
                            <PSetTable 
                                allData={pset} 
                                selectedPSets={selectedPSets} 
                                updatePSetSelection={handleSelectionChange} 
                                scrollHeight='350px' 
                                pending={pending}
                                download={true}
                                authenticated={true}
                            />
                        </div>
                        <div className='footer'>
                        { 
                            !pending && 
                            <Button 
                                label={btnLabel} 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setDialogVisible(true);
                                }} 
                                disabled={btnDisabled} 
                            /> 
                        } 
                        </div>
                    </React.Fragment> 
                    : 
                    <p>No data available.</p>
                }
            </div>
            <div>
                <Dialog 
                    header='Removing Pset(s)'
                    footer={dialogFooter} 
                    visible={dialogVisible} 
                    style={{width: '300px'}} 
                    modal={true} 
                    onHide={onHide}
                >
                    Are you sure you would like to remove the selected PSet(s) from the saved list?
                </Dialog>
            </div>
        </StyledUserPSet>
    );
}

export default UserPSet;