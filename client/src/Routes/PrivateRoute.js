import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../hooks/Context';

const PrivateRoute = ({ children, redirect }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return null; // Or a loading spinner/component
    }

    return user ? children : <Navigate to={redirect} state={{ from: location }} replace />;
}

export default PrivateRoute;
