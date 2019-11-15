import React from 'react';
import './Profile.css';
import Navigation from '../Navigation/Navigation'

class Profile extends React.Component{

    constructor(){
        super();

    }

    componentDidMount(){
        // fetch user data.
    }

    render(){
        return(
            <React.Fragment>
                <Navigation />
                <div className='pageContent'>
                    <h1>Your Profile</h1>

                </div>
            </React.Fragment>
        );
    }
}

export default Profile;