import React from 'react';

const Overview = () => {
    return(
        <div className='documentation'>
            <h1>Overview</h1>
            <h3>Introduction</h3>
            <p>
                ORCESTRA is a new web application that enables users to search, request and manage pharmacogenomic datasets (PSets).
                <br />
                PSets are generated with an automated pipeline by using a verion controll platform called Pachyderm. Upon completion of the pipeline, a newly generated PSet is uploaded to Zenodo, a data-sharing platform, and is assigned a DOI.
                <br />
                With Pachyderm's strict version controlling system, coupled with the DOI assignment, ORCESTRA ensures that your experiements with PSets are transparent and easily reproducible.
            </p>    
        </div>    
    );
}

export default Overview