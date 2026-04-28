import React, { useState, useEffect, useContext, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { PathContext, AuthContext } from '../../hooks/Context';
import useAuth from '../../hooks/useAuth';
import { dataTypes } from '../Shared/Enums';

const NavigationRev = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const path = useContext(PathContext);
    const auth = useContext(AuthContext);
    const { logoutUser } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (location.pathname !== '/' && path.datatype.length === 0) {
            path.setDatatype(location.pathname.split('/').filter(el => el.length)[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    const onLoginClick = event => {
        event.preventDefault();
        navigate('/app/authentication', { state: { path: location.pathname } });
    };

    const onLogoutClick = async event => {
        event.preventDefault();
        await logoutUser();
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };
    return (
        <div className="flex flex-row justify-between items-center w-full px-10 py-2 drop-shadow bg-white fixed top-0 z-50">
            <div className="flex flex-row gap-10">
                <img
                    onClick={() => navigate('/')}
                    src="/images/orcestra-icon.svg"
                    alt="orc ic"
                    className="w-20 ease-in-out duration-300 hover:cursor-pointer hover:scale-110"
                />
                <div className="flex flex-row justify-center items-center gap-4">
                    <NavLink
                        to="/datatypes"
                        className={({ isActive }) =>
                            `h-full flex font-semibold items-center px-1 text-headingMd duration-300 hover:cursor-pointer hover:text-darkYellow hover:font-bold ${
                                isActive ? 'text-darkYellow font-semibold' : 'text-darkBlue text-opacity-80'
                            }`
                        }
                    >
                        Data types
                    </NavLink>
                    <NavLink
                        to="/app/documentation/overview"
                        className={({ isActive }) =>
                            `h-full flex font-semibold items-center px-1 text-headingMd duration-300 hover:cursor-pointer hover:text-darkYellow hover:font-bold ${
                                isActive ? 'text-darkYellow font-semibold' : 'text-darkBlue text-opacity-80'
                            }`
                        }
                    >
                        Documentation
                    </NavLink>
                    <NavLink
                        to="/app/contact"
                        className={({ isActive }) =>
                            `h-full flex font-semibold items-center px-1 text-headingMd duration-300 hover:cursor-pointer hover:text-darkYellow hover:font-bold ${
                                isActive ? 'text-darkYellow font-semibold' : 'text-darkBlue text-opacity-80'
                            }`
                        }
                    >
                        Contact
                    </NavLink>
                </div>
            </div>
            <NavLink
                to="/app/authentication"
                className={({ isActive }) =>
                    `flex font-semibold text-headingMd duration-300 hover:cursor-pointer hover:text-darkYellow hover:font-bold ${
                        isActive ? 'text-darkYellow font-bold' : 'text-gray-600'
                    }`
                }
            >
                {auth.user ? <span onClick={onLogoutClick}>Logout</span> : 'Login/Register'}
            </NavLink>
        </div>
    );
};

export default NavigationRev;
