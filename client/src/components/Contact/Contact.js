import React from 'react';
import './Contact.css';
import Navigation from '../Navigation/Navigation';

class Contact extends React.Component{

    render(){
        return(
            <React.Fragment>
                <Navigation routing={this.props} />
                <div className='pageContent'>
                    <h1>Contact Us</h1>
                    
                </div>
            </React.Fragment>
        );
    }

}

export default Contact;