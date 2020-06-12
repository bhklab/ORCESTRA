import React, {useState, useEffect} from 'react';
import {ScrollPanel} from 'primereact/scrollpanel';

const AvailablePSets = () => {
    
    const [data, setData] = useState([])

    useEffect(() => {
        const getData = async () => {
            const res = await fetch('/api/psets/available')
            const data = await res.json()
            setData(JSON.stringify(data, null, 2))
        }
        getData()
    }, [])
    
    return(
        <div className='documentation'>
            <h2>List of Available PSets</h2>
            <p>
                This RESTful API call restrieves a list of available PSets in the database:<br />
                <code className='code'>curl http://api.orcestra.ca/psets/available</code><br />
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