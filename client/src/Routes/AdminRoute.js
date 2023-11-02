import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../hooks/Context';

const AdminRoute = ({ children, redirect }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        // You might want to render some loading indicator here
        return null;
    }

    return user && user.admin ? children : <Navigate to={redirect} replace />;
};

export default AdminRoute;