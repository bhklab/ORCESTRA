import React from 'react';
import styled from 'styled-components';
import StyledPage from '../../styles/StyledPage';

const StyledContact = styled.div`
    .introduction {
        margin-bottom: 20px;
    }
    .contact-info-wrapper{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .section {
            width: 49%;
            line-height: 1.5;
        }
    }
`;

const Contact = () => {
    
    return(
        <StyledPage>
            <div className='page-title'>BHK Lab</div>
            <StyledContact>
                
                <div className='contact-info-wrapper'>
                    <div className='section'>
                        <div className='introduction'>
                            The <a href="https://www.pmgenomics.ca/bhklab/" target="_blank" rel="noopener noreferrer">BHKLAB </a>
                            is composed of a multidisciplinary team of researchers analyzing high-dimensional molecular and imaging data to
                            develop new predictive tools foranticancer therapies. We develop databases and analysis pipelines to leverage
                            large compendia of pharmacogenomic datasets for biomarker discovery and compound repurposing. <br />
                            The BHKLAB is part of the Princess Margaret Cancer Centre – University Health Network, located in the heart of the Toronto Discovery
                            District in Ontario, Canada.
                        </div>
                        <h3>Address</h3>
                        <div className='contactInfo'>
                            The MaRS center
                            <br />
                            101 College St. Toronto, ON
                            {' '}
                            <br />
                            TMDT RM 11-310
                        </div>
                    </div> 
                    <div className='section'>
                        <iframe
                            title="BHK Lab, 101 College St. Toronto, ON"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.4364889480303!2d-79.39081378450204!3d43.65989117912103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34b632b77689%3A0x901c210dff19e5a4!2s101+College+St%2C+Toronto%2C+ON+M5G+1L7!5e0!3m2!1sen!2sca!4v1502307889999"
                            width="100%" 
                            height="600" 
                            align="center" 
                            allowFullScreen
                        >
                        </iframe>
                    </div>
                </div>
            </StyledContact>
        </StyledPage>
    );
}

export default Contact;