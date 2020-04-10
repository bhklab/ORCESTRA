import React from 'react';

const UserProfile = () => {
    return(
        <div className='documentation'>
            <h2>User Profile and Usage Statistics</h2>
            <div>
                <h3>What you can do with your profile</h3>
                <p>
                    <b>ORCESTRA</b> comes with user account feature which allows registred users to:
                    <ul>
                        <li>Save existing PSets as "favorites".</li>
                        <li>Keep track of the user's PSet reguqest status.</li>
                    </ul>
                    To register for the user account, simply click on the "Login/Register" button on navigation 
                    bar, and enter your email address and password.
                </p>   
            </div>
            <div>
                <h3>Usage Statistics</h3>
                <p>
                    <b>ORCESTRA</b>'s usage metrics can be viewed at <a href='http://orcestra.ca/Stats'>Statistics</a> page.<br />
                    <b>ORCESTRA</b> currently provides the download ranking of the existing PSets.
                </p>   
            </div>
        </div>    
    );
}

export default UserProfile