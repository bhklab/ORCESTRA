import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../hooks/Context';

const PrivateRoute = ({ element: Element, redirect }) => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    if (loading) {
        // Render a loader or spinner here if necessary
        return null;
    }

    if (!user) {
        navigate(redirect, { replace: true, state: { from: location } });
        return null;
    }

    return Element;
}


export default PrivateRoute;
