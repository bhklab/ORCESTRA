import React, {useState, useEffect} from 'react';
import {ScrollPanel} from 'primereact/scrollpanel';

const StatisticsAPI = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        const getData = async () => {
            const res = await fetch('/api/psets/statistics/metrics/all')
            const data = await res.json()
            setData(JSON.stringify(data, null, 2))
        }
        getData()
    }, [])
    
    return(
        <div className='documentation'>
            <h2>Statistics</h2>
            <p>
                This RESTful API call restrieves a list of PSets ordered by the number of downloads:<br />
                <code className='code'>curl http://api.orcestra.ca/psets/statistics/download/[ number of psets to be returned ]</code><br />
                Example:<br />
                <code className='code'>curl http://api.orcestra.ca/psets/statistics/download/5</code><br />
            </p>
            <p>
                This RESTful API call returns metric data for each PSet:<br />
                <code className='code'>curl http://api.orcestra.ca/psets/statistics/metrics/[ name of dataset OR 'all' for all dataset metrics]</code><br />
                Example:<br />
                <code className='code'>curl http://api.orcestra.ca/psets/statistics/metrics/all</code><br />
                Current result of the successful metrics API call is as follows:<br />
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