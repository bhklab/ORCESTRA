import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import CustomMessages from '../Shared/CustomMessages';
import CustomSelect from '../Shared/CustomSelect';
import CustomInputText from '../Shared/CustomInputText';
import { InputTextarea } from 'primereact/inputtextarea';
import {dataTypes} from '../Shared/Enums';

const StyledAddNewObject = styled.div`
  width: 800px;
`;

const AddNewObject = () => {

  const [selected, setSelected] = useState(null);
  const [datasetName, setDatasetName] = useState('');
  const [datasetNote, setDatasetNote] = useState('');
  const [dataset, setDataset] = useState('');
  const [dataObj, setDataObj] = useState('');

  useEffect(() => {
    if(selected){

    }
  }, [selected])

  return(
    <StyledAddNewObject>
      <h3>Add new data object to the compendium</h3>
      <div>
        <CustomSelect 
          selectOne
          selected={selected}
          options={Object.values(dataTypes).map(datatype => ({label: datatype, value: datatype}))}
          onChange={(e) => {setSelected(e.value)}}
          label='Select a dataset type to add: '
        />
      </div>
      <div>
        <CustomInputText 
          className='textfield'
          label='Dataset name:'
          value={datasetName} 
          onChange={(e) => {setDatasetName( e.target.value)}}
        />
      </div>
      <h4>Add a DatasetNote document</h4>
      <div>
        <InputTextarea value={datasetNote} onChange={(e) => setDatasetNote(e.target.value)} rows={10} cols={100} />
      </div>
      <h4>Add a Dataset document</h4>
      <div>
        <InputTextarea value={dataset} onChange={(e) => setDataset(e.target.value)} rows={30} cols={100} />
      </div>
      <h4>Add a DataObject document</h4>
      <div>
        <InputTextarea value={dataObj} onChange={(e) => setDataObj(e.target.value)} rows={30} cols={100} />
      </div>
    </StyledAddNewObject>
  )
}

export default AddNewObject;