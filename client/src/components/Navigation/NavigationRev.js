import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
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

    const getDatatype = datatype => {
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
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };
    return (
        <div className="flex flex-row justify-between items-center px-10 py-2 drop-shadow bg-white">
            <div className="flex flex-row gap-10">
                <img
                    onClick={() => navigate('/')}
                    src="/images/orcestra-icon.svg"
                    alt="orc ic"
                    className="w-20 ease-in-out duration-300 hover:cursor-pointer hover:scale-110"
                />
                <div className="flex flex-row justify-center items-center gap-4">
                    <div
                        onClick={() => navigate('/datatypes')}
                        className="h-full flex items-center px-1 text-darkBlue text-opacity-80 text-headingMd duration-300 hover:cursor-pointer hover:text-darkYellow hover:font-semibold"
                    >
                        <span>Data types</span>
                    </div>
                    <div
                        onClick={() => navigate('/app/documentation/overview')}
                        className="h-full flex items-center px-1 text-darkBlue text-opacity-80 text-headingMd duration-300 hover:cursor-pointer hover:text-darkYellow hover:font-semibold"
                    >
                        <span>Documentation</span>
                    </div>
                    <div
                        onClick={() => navigate('/app/contact')}
                        className="h-full flex items-center px-1 text-darkBlue text-opacity-80 text-headingMd duration-300 hover:cursor-pointer hover:text-darkYellow hover:font-semibold"
                    >
                        <span>Contact</span>
                    </div>
                </div>
            </div>
            <button className="flex font-semibold text-headingMd text-gray-600 duration-300 hover:cursor-pointer hover:text-darkYellow hover:font-bold">
                Log in
            </button>
        </div>
    );
};

export default NavigationRev;
