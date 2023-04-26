import React, {useState, useEffect} from 'react';
import {ScrollPanel} from 'primereact/scrollpanel';

const PSetMetadata = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        const getData = async () => {
            const res = await fetch('/api/pset/10.5281/zenodo.3905461')
            const data = await res.json()
            console.log(data)
            setData(JSON.stringify(data, null, 2))
        }
        getData()
    }, [])
    
    return(
        <div className='documentation'>
            <h2>Single Dataset</h2>
            <p>
                This RESTful API call restrieves a dataset associated with specified DOI:<br /> 
                <code className='code'>curl http://api.orcestra.ca/[dataset type]/[ DOI ]</code> or,<br />
                <code className='code'>curl https://wwww.orcestra.ca/api/[dataset type]/[ DOI ]</code><br />
                Input Parameters:<br />
                <div className='code'>
                    <b>Dataset Type:</b> Accepts one of <code>pset</code>, <code>toxicoset</code>, <code>xevaset</code>, <code>clinicalgenomics</code>, and <code>radioset</code>. <br />
                </div>
                Example:<br />
                <code className='code'>curl http://api.orcestra.ca/pset/10.5281/zenodo.3905461</code><br />
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

export default PSetMetadata