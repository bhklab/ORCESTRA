import React from 'react';

const Overview = () => {
    return(
        <div className='documentation'>
            <h1>Overview</h1>

                <div>
                    <h3>Introduction</h3>
                    <p>
                        <b>ORCESTRA</b> is a new web application that enables users to search, request and manage pharmacogenomic datasets (PSets).
                        <br />
                        PSets are generated with an automated pipeline by using a version controlling platform called Pachyderm. Upon completion of the pipeline, a newly generated PSet is uploaded to Zenodo, a data-sharing platform, and is assigned a DOI.
                        <br />
                        With Pachyderm's strict version controlling system, coupled with the DOI assignment, ORCESTRA ensures that your experiments with PSets are transparent and easily reproducible.
                    </p>
                    <h3>System Overview</h3>  
                    <p>
                        The <b>ORCESTRA</b> system consists of three main layers:   
                    </p>  
                    <ol>
                        <li><b>Web application layer</b> which allows users to view and submit PSet requests</li>
                        <li><b>Data processing layer</b> which utilizes a version control software called Pachyderm to process requested data</li>
                        <li><b>Data sharing layer</b> which utilizes Zenodo to ensure that the generated dataset is tagged with a DOI</li>
                    </ol>     
                    <div className='img-architecture'>
                        <img src={process.env.PUBLIC_URL + "/images/documentation/architecture.png"} alt=''/>
                    </div>
                    <div className='bottom-fill'></div>  
                </div>  
        </div>    
    );
}

export default Overview