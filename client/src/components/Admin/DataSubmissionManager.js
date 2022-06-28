import React, { useState } from 'react';
import axios from 'axios';
import DataSubmissionList from '../DataSubmission/DataSubmissionList';

const DataSubmissionManager = () => {
    const [submissions, setSubmissions] = useState([]);

    const markCompleteSubmisson = async (e, id) => {
        e.preventDefault();
        console.log(id);
        await axios.post(`/api/admin/submission/complete/${id}`, {});
        const res = await axios.get('/api/admin/submission/list');
        setSubmissions(res.data);
    }

    return(
        <DataSubmissionList 
            className='bottom'
            heading='Data Submissions'
            datasets={submissions}
            admin={true}
            markComplete={markCompleteSubmisson}
        /> 
    )
}

export default DataSubmissionManager;