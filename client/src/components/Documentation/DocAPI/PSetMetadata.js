import React, {useState, useEffect} from 'react';
import {ScrollPanel} from 'primereact/scrollpanel';

const PSetMetadata = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        const getData = async () => {
            const res = await fetch('/api/pset/10.5281/zenodo.3598711')
            const data = await res.json()
            setData(JSON.stringify(data, null, 2))
        }
        getData()
    }, [])
    
    return(
        <div className='documentation'>
            <h2>List of Available PSets</h2>
            <p>
                This RESTful API call restrives a PSet associated with a DOI:<br />
                <code className='code'>curl http://orcestra.ca/api/pset/[ DOI ]</code><br />
                Example:<br />
                <code className='code'>curl http://orcestra.ca/api/pset/10.5281/zenodo.3598711e</code><br />
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