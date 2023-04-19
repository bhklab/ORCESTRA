import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import CustomSelect from '../Shared/CustomSelect';
import CustomInputText from '../Shared/CustomInputText';
import {dataTypes} from '../Shared/Enums';
import datasetNoteObj from './JSONStructures/datasetnote';
import { psetDataset, genericDataset, clinicalDataset } from './JSONStructures/dataset';
import { baseDataObject, genomeDataObject } from './JSONStructures/dataobject';
import ObjectTextArea from './SubComponents/ObjectTextArea';

const StyledAddNewObject = styled.div`
  width: 800px;
  .dropdown {
    margin-bottom: 10px;
  }

`;

const AddNewObject = () => {

  const [selected, setSelected] = useState(null);
  const [datasetName, setDatasetName] = useState('');
  const [datasetNote, setDatasetNote] = useState({text: '', submitting: false, id: ''});
  const [dataset, setDataset] = useState({text: '', submitting: false, id: ''});
  const [dataObj, setDataObj] = useState({text: '', submitting: false, id: ''});

  useEffect(() => {
    if(selected){
      setDatasetNote({...datasetNote, text: JSON.stringify(datasetNoteObj, null, 2)});
      if(selected.value === 'pset'){
        setDataset({...dataset, text: JSON.stringify(psetDataset, null, 2)});
      }else if(selected.value === 'clinicalgenomics' || selected.value === 'clinical_icb'){
        setDataset({...dataset, text: JSON.stringify(clinicalDataset, null, 2)});
      }else{
        setDataset({...dataset, text: JSON.stringify(genericDataset, null, 2)});
      }
      if(selected.value === 'pset' || selected.value === 'radioset'){
        setDataObj({...dataObj, text: JSON.stringify(genomeDataObject, null, 2)});
      }else{
        setDataObj({...dataObj, text: JSON.stringify(baseDataObject, null, 2)});
      }
    }
  }, [selected]);

  useEffect(() => {
    if(selected){
      let noteObj = JSON.parse(datasetNote.text);
      let datasetObj = JSON.parse(dataset.text);
      let dataObject = JSON.parse(dataObj.text);
      noteObj.name = datasetName;
      datasetObj.name = datasetName;
      dataObject.name = datasetName;
      setDatasetNote({...datasetNote, text: JSON.stringify(noteObj, null, 2)});
      setDataset({...dataset, text: JSON.stringify(datasetObj, null, 2)});
      setDataObj({...dataObj, text: JSON.stringify(dataObject, null, 2)});
    }
  }, [datasetName]);

  const submitObject = (type, object) => async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post(
        '/api/admin/data-processing/submit_obj', 
        {objectType: type, object: object}
      );
      console.log(res.data);
      switch(type){
        case 'datasetNote':
          setDatasetNote({...datasetNote, id: String(res.data._id)});
          break;
        case 'dataset':
          setDataset({...dataset, id: String(res.data._id)});
          break;
        case 'dataObj':
          setDataObj({...dataObj, id: String(res.data._id)});
          break;
        default:
          break;
      }
    }catch(error){
      console.log(error)
    }
  }

  return(
    <StyledAddNewObject>
      <h3>Add new data object to the compendium</h3>
      <div className='dropdown'>
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
          rows={10}
          cols={100}
        />
      </div>
      <ObjectTextArea 
        title='Add a DatasetNote document'
        submit={submitObject('datasetNote', datasetNote)}
        object={datasetNote}
        setObject={setDatasetNote}
        rows={10} 
        cols={100} 
      />
      <ObjectTextArea 
        title='Add a Dataset document'
        submit={submitObject('dataset', dataset)}
        object={dataset}
        setObject={setDataset}
        rows={30} 
        cols={100} 
      />
      <ObjectTextArea 
        title='Add a DataObject document'
        submit={submitObject('dataObj', dataObj)}
        object={dataObj}
        setObject={setDataObj}
        rows={30} 
        cols={100} 
      />
    </StyledAddNewObject>
  )
}

export default AddNewObject;