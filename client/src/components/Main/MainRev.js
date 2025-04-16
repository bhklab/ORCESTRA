import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathContext } from '../../hooks/Context';
import { dataTypes } from '../Shared/Enums';

const Main = () => {
    const path = useContext(PathContext);
    const navigate = useNavigate();

    useEffect(() => {
        path.setDatatype('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div className="h-screen text-red-900">testing</div>;
};

export default Main;
