import React from 'react';
import { NavLink } from 'react-router-dom';
import {Button} from 'primereact/button';
import {AuthContext} from '../../context/auth';
import './Navigation.css';

class Navigation extends React.Component {

    static contextType = AuthContext;
    
    constructor(){
        super();
        this.onLoginClick = this.onLoginClick.bind(this);
        this.onLogoutClick = this.onLogoutClick.bind(this);
    }

    onLoginClick(event){
        event.preventDefault();
        this.props.routing.history.push({pathname: '/Authentication', state:{path: this.props.routing.path}});
    }

    onLogoutClick(event){
        event.preventDefault();
        console.log(this.props.routing);
        fetch('/user/logout/:' + this.context.username)
            .then(res => {
                this.context.resetAuthToken();
                this.props.routing.history.push({pathname: '/Authentication', state:{path: this.props.routing.location.pathname, logoutMsg: 'You have logged out'}});
            });            
    }

    render(){   
        return(
            <React.Fragment>
                <header>
                    <NavLink exact to='/'><img src={process.env.PUBLIC_URL + "/images/trumpet-orcestra.png"} alt='' /></NavLink>
                    <div className='navBar'>
                        <div><NavLink exact to='/' activeClassName='active-link'>Home</NavLink></div>
                        <div><NavLink exact to="/PSetSearch" activeClassName='active-link'>Search</NavLink></div>
                        <div><NavLink exact to="/PSetRequest" activeClassName='active-link'>Request</NavLink></div>
                        <div><NavLink exact to="/Stats" activeClassName='active-link'>Statistics</NavLink></div>
                        <div><NavLink exact to="/Profile" activeClassName='active-link'>Profile</NavLink></div>
                        <div><a href="https://pharmacodb.pmgenomics.ca">PharmacoDB</a></div>
                        <div><a href="https://www.pmgenomics.ca/bhklab/">Contact</a></div>
                        <div>
                            {
                                this.context.authenticated ? 
                                <Button label='Logout' onClick={this.onLogoutClick}/> : <Button label='Login/Register' onClick={this.onLoginClick}/>
                            }
                        </div>     
                    </div>
                    <div className='loggedIn'>{this.context.authenticated ? 'Logged in as: ' + this.context.username : ''}</div> 
                </header>
            </React.Fragment>
        );
    }
}

export default Navigation;