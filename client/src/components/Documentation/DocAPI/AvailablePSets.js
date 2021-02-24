import React, {useState, useEffect} from 'react';
import {ScrollPanel} from 'primereact/scrollpanel';

const AvailablePSets = () => {
    
    const [data, setData] = useState([])

    useEffect(() => {
        const getData = async () => {
            const res = await fetch('/api/psets/canonical')
            const data = await res.json()
            setData(JSON.stringify(data, null, 2))
        }
        getData()
    }, [])
    
    return(
        <div className='documentation'>
            <h2>List of Available Datasets</h2>
            <p>
                This RESTful API call restrieves a list of available datasets in the database:<br />
                <code className='code'>curl http://api.orcestra.ca/[dataset type]/[dataset classification]</code> or,<br />
                <code className='code'>curl https://www.orcestra.ca/[dataset type]/[dataset classification]</code><br />
                Input Parameters:<br />
                <div className='code'>
                    <b>Dataset Type:</b> Accepts one of <code>psets</code>, <code>toxicosets</code>, <code>xevasets</code>, <code>clinicalgenomics</code>, and <code>radiosets</code>. <br />
                    <b>Dataset Classification:</b> Accepts one of <code>canonical</code> or <code>available</code>.<br />
                    "Canonical" returns the latest datasets created by BHK Lab and are recommended for analysis.<br />
                    "Available" returns all datasets currently available in ORCESTRA.<br />
                </div>
                Example:<br />
                <code className='code'>curl http://api.orcestra.ca/psets/canonical</code><br />
                Current result of the successful API call is as follows:<br />
            </p>
            <ScrollPanel className='documentation-scroll'>
                <div>
                    <pre>
                        {data}
                    </pre>    
                </div>
            </ScrollPanel>
        </div>    
    );
}

export default AvailablePSets