import React, {useState, useEffect} from 'react';
import {ScrollPanel} from 'primereact/scrollpanel';

const PSetMetadata = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        const getData = async () => {
            const res = await fetch('/api/pset/10.5281/zenodo.3848004')
            const data = await res.json()
            console.log(data)
            setData(JSON.stringify(data, null, 2))
        }
        getData()
    }, [])
    
    return(
        <div className='documentation'>
            <h2>Single PSet</h2>
            <p>
                This RESTful API call restrieves a PSet associated with specified DOI:<br />
                <code className='code'>curl https://www.orcestra.ca/api/pset/[ DOI ]</code><br />
                Example:<br />
                <code className='code'>curl https://www.orcestra.ca/api/pset/10.5281/zenodo.3848004</code><br />
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