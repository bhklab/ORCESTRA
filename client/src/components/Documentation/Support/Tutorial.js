import React, { useState } from 'react';
import Navigation from '../../Navigation/Navigation';
import Footer from '../../Footer/Footer';

const Tutorial = (props) => {
    return(
        <React.Fragment>
            <Navigation routing={props} />
            <div className='pageContent'>
                <h1>Generating PSet with Your Data</h1>
                  
            </div>
            <Footer />
        </React.Fragment>
    )
}

export default Tutorial