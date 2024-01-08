import React, { useEffect, useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

import { PathContext, AuthContext } from '../../hooks/Context';
import useAuth from '../../hooks/useAuth';
import { StyledHeader, NavigationWrapper, BurgerNav } from './StyledNavigation';
import { slide as Menu } from 'react-burger-menu';
import { dataTypes } from '../Shared/Enums';

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const path = useContext(PathContext);
    const auth = useContext(AuthContext);
    const { logoutUser } = useAuth();

    useEffect(() => {
        if (location.pathname !== '/' && path.datatype.length === 0) {
            path.setDatatype(location.pathname.split('/').filter((el) => (el.length))[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    const onLoginClick = (event) => {
        event.preventDefault();
        navigate('/app/authentication', { state: { path: location.pathname } });
    }

    const onLogoutClick = async (event) => {
        event.preventDefault();
        await logoutUser();
    }

    const getDatatype = (datatype) => {
        switch (datatype) {
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

    return (
        <StyledHeader>
            <NavigationWrapper datasetType={path.datatype}>
                <div className='left'>
                    <div className='logo'>
                        <NavLink to='/'>
                            <img src={process.env.PUBLIC_URL + "/images/trumpet-orcestra.png"} alt='ORCESTRA logo' />
                        </NavLink>
                    </div>
				</div>
				<div className='middle'>
                    <NavLink to={`/`} className='link' activeclassname='active-link'>Home</NavLink>
                    {
                        path.datatype.length > 0 && path.datatype === dataTypes.pharmacogenomics &&
						(
							<>
                                <NavLink to={`/${path.datatype}/search`} className='link' activeclassname='active-link'>Search and Request</NavLink>
                                <NavLink to={`/${path.datatype}/status`} className='link' activeclassname='active-link'>Request Status</NavLink>
                                <NavLink to={`/${path.datatype}/stats`} className='link' activeclassname='active-link'>Statistics</NavLink>
							</>
						)
                    }
                    <NavLink to={`/app/documentation/overview`} className='link' activeclassname='active-link'>Documentation</NavLink>
                    <NavLink to={`/app/contact`} className='link' activeclassname='active-link'>Contact</NavLink>
					</div>
                <div className='right'>
                    {
                        auth.user &&
                        <NavLink to={`/app/data_submission`} className='link' activeclassname='active-link'>Data Submission</NavLink>
                    }
                    {
                        auth.user &&
                        <NavLink to="/app/profile" className='link' activeclassname='active-link'>Profile</NavLink>
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
                <Menu width={200} isOpen={true}>
                    {
                        path.datatype.length > 0 &&
                        <React.Fragment>
                            <NavLink to={`/`} activeclassname='active-link'>Home</NavLink>
                            <NavLink to={`/${path.datatype}`} activeclassname='active-link'>{getDatatype(path.datatype)}</NavLink>
                            {
                                path.datatype === dataTypes.pharmacogenomics &&
                                <NavLink to={`/${path.datatype}/search`} activeclassname='active-link'>Search and Request</NavLink>
                            }
                            {
                                path.datatype === dataTypes.pharmacogenomics &&
                                <NavLink to={`/${path.datatype}/status`} activeclassname='active-link'>Request Status</NavLink>
                            }
                            <NavLink to={`/${path.datatype}/documentation/overview`} activeclassname='active-link'>Documentation</NavLink>
                        </React.Fragment>
                    }
                    {
                        auth.user && <NavLink to="/app/profile" activeclassname='active-link'>Profile</NavLink>
                    }
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

export default Navigation;
