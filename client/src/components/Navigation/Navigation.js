import React from 'react';
import { NavLink } from 'react-router-dom';
import {Button} from 'primereact/button';
import {Messages} from 'primereact/message';
import {Growl} from 'primereact/growl';
import {AuthContext} from '../../context/auth';
import './Navigation.css';

class Navigation extends React.Component {
    constructor(){
        super();
        this.onLoginClick = this.onLoginClick.bind(this);
        this.onLogoutClick = this.onLogoutClick.bind(this);
    }

    static contextType = AuthContext;

    onLoginClick(event){
        event.preventDefault();
        this.props.routing.history.push({pathname: '/Authentication', state:{path: this.props.routing.path}});
    }

    onLogoutClick(event){
        event.preventDefault();
        this.context.setAuthToken({authenticated: false, user: ''});
        this.growl.show({sticky: true, severity: 'info', summary: 'Logged out', detail: 'You have logged out of ORCESTRA'});
        this.props.routing.history.push('/');
    }

    render(){   
        return(
            <React.Fragment>
                <header>
                    <NavLink exact to='/'><img src="./images/trumpet-orcestra.png" alt='' /></NavLink>
                    <div className='navBar'>
                        <div><NavLink exact to='/' activeClassName='active-link'>Home</NavLink></div>
                        <div><NavLink exact to="/PSetList" activeClassName='active-link'>Search</NavLink></div>
                        <div><NavLink exact to="/PSetRequest" activeClassName='active-link'>Request</NavLink></div>
                        <div><NavLink exact to="/Stats" activeClassName='active-link'>Statistics</NavLink></div>
                        <div><NavLink exact to="/Profile" activeClassName='active-link'>Profile</NavLink></div>
                        <div><a href="https://pharmacodb.pmgenomics.ca">PharmacoDB</a></div>
                        <div><a href="https://www.pmgenomics.ca/bhklab/">Contact</a></div>
                        <div>{
                            this.context.authenticated ? 
                            <Button label='Logout' onClick={this.onLogoutClick}/> : <Button label='Login/Register' onClick={this.onLoginClick}/>
                        }</div>   
                    </div>
                    <div className='loggedIn'>{this.context.authenticated ? 'Logged in as: ' + this.context.user : ''}</div> 
                    <div className='loginGrowl'><Growl  ref={(el) => this.growl = el}></Growl></div>
                </header>
            </React.Fragment>
        );
    }
}

export default Navigation;