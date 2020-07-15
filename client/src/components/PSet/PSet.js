import React, {useState, useEffect} from 'react';
import './PSet.css';
import PSetTab from './PSetTab';
import {GeneralInfoAccordion} from './PSetAccordion';
import DownloadPSetButton from '../Shared/Buttons/DownloadPSetButton';

const PSet = (props) => {
    const [pset, setPSet] = useState({})
    const [ready, setReady] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        const getData = async () => {
            let apiStr = '/api/pset/one/' + props.match.params.id1 + '/' + props.match.params.id2;
            try{
                const res = await fetch(apiStr)
                if(res.ok){
                    const json = await res.json()
                    setPSet(json)
                    setReady(true)
                }else{
                    setError(true)
                }
            }catch(error){
                console.log(error)
                setError(true)
            } 
        }
        getData()
    }, [])

    return(
        <div className='pageContent'>
            {
                ready &&
                <React.Fragment>
                    <div className='psetTitle'>
                        <h2>Explore PSet - {pset.name}</h2>
                        <DownloadPSetButton disabled={false} pset={pset} />
                    </div>
                    <GeneralInfoAccordion data={pset.generalInfo}/>
                    <div className='tabContainer'>
                        <PSetTab dataset={pset.datasetInfo} rnaData={pset.rnaData} dnaData={pset.dnaData} />
                    </div>
                </React.Fragment>
            } 
            { error && <h3>PSet with the specified DOI could not be found</h3>}
        </div>
    );
}

export default PSet;