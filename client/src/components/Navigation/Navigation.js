import React, {useState, useEffect, useContext} from 'react';
import { NavLink } from 'react-router-dom';
import {Button} from 'primereact/button';
import {AuthContext} from '../../context/auth';
import './Navigation.css';
import { slide as Menu } from 'react-burger-menu';

const Navigation = (props) => {

    const auth = useContext(AuthContext);

    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            const status = await fetch('/pachyderm/status');
            const json = await status.json();
            setIsOnline(json.isOnline);
        }
        checkStatus();
    }, []);

    const onLoginClick = (event) => {
        event.preventDefault();
        props.routing.history.push({pathname: '/Authentication', state:{path: props.routing.path}});
    }

    const onLogoutClick = (event) => {
        event.preventDefault();
        console.log(props.routing);
        fetch('/user/logout/:' + auth.username)
            .then(res => {
                auth.resetAuthToken();
                props.routing.history.push({pathname: '/Authentication', state:{path: props.routing.location.pathname, logoutMsg: 'You have logged out'}});
            });            
    }

    return(
        <React.Fragment>
            <header>
                <NavLink exact to='/'><img src={process.env.PUBLIC_URL + "/images/trumpet-orcestra.png"} alt='' /></NavLink>
                <div className='navBarContainer'>
                    <div className='navBar'>
                        <div><NavLink exact to='/' activeClassName='active-link'>Home</NavLink></div>
                        <div><NavLink exact to="/PSetSearch" activeClassName='active-link'>Search and Request</NavLink></div>
                        <div><NavLink exact to="/Dashboard" activeClassName='active-link'>Dashboard</NavLink></div>
                        <div><NavLink exact to="/Documentation" activeClassName='active-link'>Documentation</NavLink></div>
                        { auth.authenticated && <div className='menu-item'><NavLink exact to="/Profile" activeClassName='active-link'>Profile</NavLink></div> }
                        <div>
                            {
                                auth.authenticated ? 
                                <Button label='Logout' onClick={onLogoutClick}/> : <Button label='Login/Register' onClick={onLoginClick}/>
                            }
                        </div> 
                        <div>
                            {isOnline ? 
                                <div className='pachydermStatus isOnline'>
                                    <div className='icon'><i className='pi pi-check'></i></div><div className='text'>Pachyderm is <br />online</div>
                                </div> 
                                : 
                                <span className='pachydermStatus isOffline'>
                                    <div className='icon'><i className='pi pi-ban'></i></div><div className='text'>Pachyderm is <br />offline</div>
                                </span>
                            }
                        </div>    
                    </div>
                    <div className='burgerNav'>
                        <Menu width={ 200 } isOpen={true} > 
                            <div className='menu-item'><NavLink exact to='/' activeClassName='active-link'>Home</NavLink></div>
                            <div className='menu-item'><NavLink exact to="/PSetSearch" activeClassName='active-link'>Search and Request</NavLink></div>
                            <div><NavLink exact to="/Dashboard" activeClassName='active-link'>Dashboard</NavLink></div>
                            <div><NavLink exact to="/Documentation" activeClassName='active-link'>Documentation</NavLink></div>
                            { auth.authenticated && <div className='menu-item'><NavLink exact to="/Profile" activeClassName='active-link'>Profile</NavLink></div> }
                            <div className='menu-item'>
                                {
                                    auth.authenticated ? 
                                    <Button label='Logout' onClick={onLogoutClick}/> : <Button label='Login/Register' onClick={onLoginClick}/>
                                }
                            </div>
                            <div>
                                {isOnline ? 
                                    <div className='pachydermStatus isOnline'>
                                        <div className='icon'><i className='pi pi-check'></i></div><div className='text'>Pachyderm is <br />online</div>
                                    </div> 
                                    : 
                                    <span className='pachydermStatus isOffline'>
                                        <div className='icon'><i className='pi pi-ban'></i></div><div className='text'>Pachyderm is <br />offline</div>
                                    </span>
                                }
                            </div>
                        </Menu>
                    </div>   
                </div>
                
                <div className='loggedIn'>{auth.authenticated ? 'Logged in as: ' + auth.username : ''}</div> 
            </header>
        </React.Fragment>
    );
}

export default Navigation;