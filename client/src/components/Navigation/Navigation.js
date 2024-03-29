import React, { useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {Button} from 'primereact/button';

import { PathContext, AuthContext } from '../../hooks/Context';
import useAuth from '../../hooks/useAuth';
import { StyledHeader, NavigationWrapper, BurgerNav } from './StyledNavigation';
import { slide as Menu } from 'react-burger-menu';
import {withRouter} from 'react-router';
import {dataTypes} from '../Shared/Enums';

const Navigation = (props) => {
    const { location, history } = props;
    const path = useContext(PathContext);
    const auth = useContext(AuthContext);
    const { logoutUser } = useAuth();

    useEffect(() => {
        if(location.pathname !== '/' && path.datatype.length === 0){
            path.setDatatype(location.pathname.split('/').filter((el) =>(el.length))[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onLoginClick = (event) => {
        event.preventDefault();
        history.push({pathname: '/app/authentication', state:{path: location.pathname}});
    }

    const onLogoutClick = async (event) => {
        event.preventDefault();
        await logoutUser();            
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
                return '';
        }
    }

    return(
        <StyledHeader>
            <NavigationWrapper datasetType={path.datatype}>
                <div className='left'>
                    <div className='logo'>
                        <NavLink exact to='/'>
                            <img src={process.env.PUBLIC_URL + "/images/trumpet-orcestra.png"} alt='' />
                        </NavLink>
                    </div>
                    <NavLink exact to={`/`} className='link' activeClassName='active-link'>Home</NavLink>
                    {
                        path.datatype.length > 0 && 
                        <React.Fragment>
                            <NavLink exact to={`/${path.datatype}`} className='link' activeClassName='active-link'>{getDatatype(path.datatype)}</NavLink>
                            {
                                path.datatype === dataTypes.pharmacogenomics && 
                                <NavLink exact to={`/${path.datatype}/search`} className='link' activeClassName='active-link'>Search and Request</NavLink>
                            }
                            {
                                path.datatype === dataTypes.pharmacogenomics && 
                                <NavLink exact to={`/${path.datatype}/status`} className='link' activeClassName='active-link'>Request Status</NavLink>
                            }
                            {
                                path.datatype === dataTypes.pharmacogenomics && 
                                <NavLink exact to={`/${path.datatype}/stats`} className='link' activeClassName='active-link'>Statistics</NavLink>
                            } 
                        </React.Fragment>
                    }
                    <NavLink exact to={`/app/documentation/overview`} className='link' activeClassName='active-link'>Documentation</NavLink>
                    <NavLink exact to={`/app/contact`} className='link' activeClassName='active-link'>Contact</NavLink>
                </div>
                <div className='right'>
                    {
                        auth.user &&
                        <NavLink exact to={`/app/data_submission`} className='link' activeClassName='active-link'>Data Submission</NavLink>
                    }
                    { 
                        auth.user && 
                        <NavLink exact to="/app/profile" className='link' activeClassName='active-link'>Profile</NavLink>
                    }
                    <Button 
                        className='button' 
                        label={auth.user ? 'Logout' : 'Login/Register'} 
                        onClick={auth.user ? onLogoutClick : onLoginClick}
                    /> 
                    {
                        auth.user ? <div className='loggedIn'>{`Logged in as: ${auth.user.username}`}</div> : ''
                    }  
                </div> 
            </NavigationWrapper>
            <BurgerNav>
                <Menu width={ 200 } isOpen={true} > 
                    {
                        path.datatype.length > 0 &&
                        <React.Fragment>
                            <NavLink exact to={`/`} activeClassName='active-link'>Home</NavLink>
                            <NavLink exact to={`/${path.datatype}`} activeClassName='active-link'>{getDatatype(path.datatype)}</NavLink>
                            <NavLink exact to={`/${path.datatype}/search`} activeClassName='active-link'>Search and Request</NavLink>
                            <NavLink exact to={`/${path.datatype}/status`} activeClassName='active-link'>Request Status</NavLink>
                            <NavLink exact to={`/${path.datatype}/documentation/overview`} activeClassName='active-link'>Documentation</NavLink>
                        </React.Fragment>
                    }
                    {/* { auth.user && <NavLink exact to={`/app/data_submission`} className='link' activeClassName='active-link'>Data Submission</NavLink>} */}
                    { auth.user && <NavLink exact to="/app/profile" activeClassName='active-link'>Profile</NavLink>}
                    <Button 
                        className='button' 
                        label={auth.user ? 'Logout' : 'Login/Register'} 
                        onClick={auth.user ? onLogoutClick : onLoginClick}
                    />
                </Menu>
            </BurgerNav> 
        </StyledHeader>
    );
}

export default withRouter(Navigation);