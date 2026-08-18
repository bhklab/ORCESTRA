import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { PathContext, AuthContext } from '../../hooks/Context';
import useAuth from '../../hooks/useAuth';

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
        setIsMenuOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    const onLogoutClick = async event => {
        event.preventDefault();
        await logoutUser();
    };

    const isDocActive = location.pathname.includes('/documentation');
    const isDataTypesActive =
        location.pathname === '/datatypes' ||
        (location.pathname !== '/' && !location.pathname.startsWith('/app/') && !isDocActive);
    const isContactActive = location.pathname === '/app/contact';

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
            <div className="max-w-[1350px] mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer group">
                        <img
                            src="/images/orcestra-icon.svg"
                            alt="ORCESTRA Logo"
                            className="w-16 transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="text-heading3Xl font-black tracking-tight text-darkBlue">RCESTRA</span>
                    </div>

                    <nav className="flex md:hidden items-center gap-1.5 pl-4 border-l border-gray-200">
                        <NavLink
                            to="/datatypes"
                            className={() =>
                                `px-3.5 py-2 rounded-xl text-bodyMd font-semibold transition-all duration-200 ${
                                    isDataTypesActive
                                        ? 'bg-lightYellow/40 text-darkBlue font-bold shadow-2xs'
                                        : 'text-gray-600 hover:text-darkBlue hover:bg-gray-100/80'
                                }`
                            }
                        >
                            Data Types
                        </NavLink>

                        <NavLink
                            to="/app/documentation/overview"
                            className={() =>
                                `px-3.5 py-2 rounded-xl text-bodyMd font-semibold transition-all duration-200 ${
                                    isDocActive
                                        ? 'bg-lightYellow/40 text-darkBlue font-bold shadow-2xs'
                                        : 'text-gray-600 hover:text-darkBlue hover:bg-gray-100/80'
                                }`
                            }
                        >
                            Documentation
                        </NavLink>

                        <NavLink
                            to="/app/contact"
                            className={() =>
                                `px-3.5 py-2 rounded-xl text-bodyMd font-semibold transition-all duration-200 ${
                                    isContactActive
                                        ? 'bg-lightYellow/40 text-darkBlue font-bold shadow-2xs'
                                        : 'text-gray-600 hover:text-darkBlue hover:bg-gray-100/80'
                                }`
                            }
                        >
                            Contact
                        </NavLink>
                    </nav>
                </div>

                <div className="flex md:hidden items-center gap-3">
                    {auth.user ? (
                        <>
                            <NavLink
                                to="/app/data_submission"
                                className={({ isActive }) =>
                                    `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-bodySm font-semibold transition-all ${
                                        isActive
                                            ? 'bg-lightYellow/40 text-darkBlue font-bold'
                                            : 'text-gray-700 hover:text-darkBlue hover:bg-gray-100'
                                    }`
                                }
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Submit Data</span>
                            </NavLink>

                            <NavLink
                                to="/app/profile"
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-bodySm font-semibold transition-all ${
                                        isActive
                                            ? 'bg-darkBlue text-white shadow-xs'
                                            : 'bg-gray-100 text-darkBlue hover:bg-gray-200'
                                    }`
                                }
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                <span className="max-w-28 truncate">{auth.user.username || 'Profile'}</span>
                            </NavLink>

                            <button
                                onClick={onLogoutClick}
                                className="px-3.5 py-2 rounded-xl border border-gray-200 text-bodySm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-200"
                                title="Log out"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <NavLink
                            to="/app/authentication"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-darkBlue text-white hover:bg-lightBlue text-bodySm font-bold shadow-xs hover:shadow-md transition-all duration-200"
                        >
                            <span>Login / Register</span>
                        </NavLink>
                    )}
                </div>

                <div className="hidden md:flex items-center">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-xl text-darkBlue hover:bg-gray-100 transition-colors"
                        aria-label="Toggle navigation menu"
                    >
                        {isMenuOpen ? (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="hidden md:flex border-t border-gray-200 bg-white px-6 py-4 flex-col gap-2 shadow-lg">
                    <NavLink
                        to="/datatypes"
                        className={`px-4 py-2.5 rounded-xl text-bodyMd font-semibold ${
                            isDataTypesActive
                                ? 'bg-lightYellow/40 text-darkBlue font-bold'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Data Types
                    </NavLink>
                    <NavLink
                        to="/app/documentation/overview"
                        className={`px-4 py-2.5 rounded-xl text-bodyMd font-semibold ${
                            isDocActive
                                ? 'bg-lightYellow/40 text-darkBlue font-bold'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Documentation
                    </NavLink>
                    <NavLink
                        to="/app/contact"
                        className={`px-4 py-2.5 rounded-xl text-bodyMd font-semibold ${
                            isContactActive
                                ? 'bg-lightYellow/40 text-darkBlue font-bold'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Contact
                    </NavLink>

                    <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                        {auth.user ? (
                            <>
                                <NavLink
                                    to="/app/data_submission"
                                    className="px-4 py-2 rounded-xl text-bodyMd font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Submit Data</span>
                                </NavLink>
                                <NavLink
                                    to="/app/profile"
                                    className="px-4 py-2 rounded-xl text-bodyMd font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span>Profile ({auth.user.username})</span>
                                </NavLink>
                                <button
                                    onClick={onLogoutClick}
                                    className="w-full text-left px-4 py-2 rounded-xl text-bodyMd font-semibold text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <NavLink
                                to="/app/authentication"
                                className="w-full text-center py-2.5 rounded-xl bg-darkBlue text-white font-bold text-bodySm"
                            >
                                Login / Register
                            </NavLink>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default NavigationRev;
