import React, {useState, useEffect, useContext} from 'react';
import { NavLink } from 'react-router-dom';
import {Button} from 'primereact/button';
import {AuthContext} from '../../context/auth';
import {PathContext} from '../../context/path';
import { StyledHeader } from './StyledNavigation';
import { slide as Menu } from 'react-burger-menu';
import {withRouter} from 'react-router';
import {dataTypes} from '../Shared/Enums';

const Navigation = (props) => {

    const auth = useContext(AuthContext);
    const path = useContext(PathContext);

    const [isOnline, setIsOnline] = useState(false);
    const { location, history } = props

    useEffect(() => {
        const checkStatus = async () => {
            const status = await fetch('/api/pachyderm/status');
            const json = await status.json();
            setIsOnline(json.isOnline);
        }
        checkStatus();
        if(location.pathname !== '/' && path.datatype.length === 0){
            path.setDatatype(location.pathname.split('/').filter((el) =>(el.length))[0]);
        }
    }, []);

    const onLoginClick = (event) => {
        event.preventDefault();
        history.push({pathname: '/app/authentication', state:{path: location.pathname}});
    }

    const onLogoutClick = (event) => {
        event.preventDefault();
        fetch('/api/user/logout/:' + auth.username)
            .then(res => {
                auth.resetAuthToken();
                history.push({pathname: '/app/authentication', state:{path: location.pathname, logoutMsg: 'You have logged out'}});
            });            
    }

    const getDatatype = (datatype) => {
        switch(datatype){
            case dataTypes.pharmacogenomics:
                return 'Pharmacogenomics';
            case dataTypes.toxicogenomics:
                return 'Toxicogenomics';
            case dataTypes.xenographic:
                return 'Xenographic Pharmacogenomics';
            case dataTypes.clinicalgenomics:
                return 'Clinical Genomics';
            case dataTypes.radiogenomics:
                return 'Radiogenomics';
            default:
                return 'Pharmacogenomics';
        }
    }

    return(
        <StyledHeader isMain={path.datatype.length === 0} >
            <NavLink exact to='/'><img src={process.env.PUBLIC_URL + "/images/trumpet-orcestra.png"} alt='' /></NavLink>
            <div className='navBarContainer'>
                <div className='navbar'>
                    {
                        path.datatype.length > 0 &&
                        <React.Fragment>
                            <div><NavLink exact to={`/`} activeClassName='active-link'>Home</NavLink></div>
                            <div><NavLink exact to={`/${path.datatype}`} activeClassName='active-link'>{getDatatype(path.datatype)}</NavLink></div>
                            <div><NavLink exact to={`/${path.datatype}/search`} activeClassName='active-link'>Search and Request</NavLink></div>
                            {
                                path.datatype === dataTypes.pharmacogenomics && 
                                <div><NavLink exact to={`/${path.datatype}/status`} activeClassName='active-link'>Request Status</NavLink></div>
                            }
                            <div><NavLink exact to={`/${path.datatype}/stats`} activeClassName='active-link'>Statistics</NavLink></div>
                            <div><NavLink exact to={`/${path.datatype}/documentation/overview`} activeClassName='active-link'>Documentation</NavLink></div>
                        </React.Fragment>
                    }
                    { auth.authenticated && <div className='menu-item'><NavLink exact to="/app/profile" activeClassName='active-link'>Profile</NavLink></div> }
                    <div>
                        {
                            auth.authenticated ? <Button label='Logout' onClick={onLogoutClick}/> : <Button label='Login/Register' onClick={onLoginClick}/>
                        }
                    </div> 
                    <div>
                        {
                            isOnline ? 
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
                        {
                            path.datatype.length > 0 &&
                            <React.Fragment>
                                <div><NavLink exact to={`/`} activeClassName='active-link'>Home</NavLink></div>
                                <div><NavLink exact to={`/${path.datatype}`} activeClassName='active-link'>{getDatatype(path.datatype)}</NavLink></div>
                                <div className='menu-item'><NavLink exact to={`/${path.datatype}/search`} activeClassName='active-link'>Search and Request</NavLink></div>
                                <div><NavLink exact to={`/${path.datatype}/status`} activeClassName='active-link'>Request Status</NavLink></div>
                                <div><NavLink exact to={`/${path.datatype}/documentation/overview`} activeClassName='active-link'>Documentation</NavLink></div>
                            </React.Fragment>
                        }
                        { auth.authenticated && <div className='menu-item'><NavLink exact to="/app/profile" activeClassName='active-link'>Profile</NavLink></div> }
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
        </StyledHeader>
    );
}

export default withRouter(Navigation);