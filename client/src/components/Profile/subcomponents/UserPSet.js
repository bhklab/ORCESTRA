import React, { useState } from 'react';
import styled from 'styled-components';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import PSetTable from '../../Shared/PSetTable';

const StyledUserPSet = styled.div`
    width: 100%;
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 1px 20px 20px 20px;
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
    const { heading, btnLabel, pset, handleBtnClick, pending } = props;
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

    const onClickYes = () => {
        setBtnDisabled(true);
        setBtnYesDisplayed(true);
        handleBtnClick(selectedPSets);
        setSelectedPSets([]);
        setDialogVisible(false);
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
                                psets={pset} 
                                selectedPSets={selectedPSets} 
                                updatePSetSelection={handleSelectionChange} 
                                scrollHeight='350px' 
                                pending={pending}
                                download={true}
                                authenticated={true}
                                showPrivate={true}
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
                    <p>None</p>
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