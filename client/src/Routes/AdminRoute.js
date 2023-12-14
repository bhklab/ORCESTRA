import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../hooks/Context';

const AdminRoute = ({ element: Element, redirect }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        // Render a loader or spinner here if necessary
        return null;
    }

    return user && user.admin ? <Element /> : <Navigate to={redirect} replace />;
};

export default AdminRoute;
