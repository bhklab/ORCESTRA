import React from 'react';

const Request = () => {
    return(
        <div className='documentation'>
            <h1>Request</h1> 
                <div>
                    <h3>How to request a PSet</h3>
                    <p>
                        To request a PSet, turn on the Request mode on <a href='/PSetSearch'>Search and Request</a> view with the toggle button on top of the PSet Parameters pane. In the requets mode, two text fields to enter the PSet name and email address to receive pipeline completion notification will be displayed.<br />
                        Once all the information is filled out, including the PSet name and email address, the Submit Request button becomes active.<br />
                        PSet request is submitted upon clicking the Submit button.
                    </p> 
                    <div className='img-full'>
                        <img src={process.env.PUBLIC_URL + "/images/documentation/request.png"} alt='' />
                    </div>  
                    <h3>How to check status of your request</h3>
                    <p>
                        Status of your pipeline request can be viewed at <a href='/Dashboard'>Request Status</a> view.<br /> 
                        Status of your request can either be "pending" or "in-process". Pending requests are the ones that have been successfully submitted, and will be processed once the Pachyderm cluster is online. In-process requests have been successfully submitted, and the pipeline execution has been started.
                    </p> 
                    <div className='img-full'>
                        <img src={process.env.PUBLIC_URL + "/images/documentation/request_status.png"} alt='' />
                    </div> 
                    <div className='bottom-fill'></div>
                </div>
        </div>    
    );
}

export default Request