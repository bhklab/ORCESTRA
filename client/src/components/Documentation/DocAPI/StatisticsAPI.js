import React, {useState, useEffect} from 'react';
import {ScrollPanel} from 'primereact/scrollpanel';

const StatisticsAPI = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        const getData = async () => {
            const res = await fetch('/api/psets/statistics/5')
            const data = await res.json()
            setData(JSON.stringify(data, null, 2))
        }
        getData()
    }, [])
    
    return(
        <div className='documentation'>
            <h2>List of Available PSets</h2>
            <p>
                This RESTful API call restrives a list of PSets in order of number of downloads:<br />
                <code className='code'>curl http://orcestra.ca/api/psets/statistics/[ number of psets to be returned ]</code><br />
                Example:<br />
                <code className='code'>curl http://orcestra.ca/api/psets/statistics/5</code><br />
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

export default StatisticsAPI