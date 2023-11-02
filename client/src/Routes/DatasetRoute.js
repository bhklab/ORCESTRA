import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';
import { AuthContext } from '../hooks/Context';

const StyledContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const DatasetRoute = ({ children, redirect }) => {
    const auth = useContext(AuthContext);
    const location = useLocation();
    const params = useParams();
    const [authorized, setAuthorized] = useState(null);

    useEffect(() => {
        console.log(location);
        let url = `/api/${params.datatype}/check_private/${params.id1}/${params.id2}${location.search.length > 0 ? location.search : ''}`;
        
        const checkPrivate = async () => {
            const res = await axios.get(url);
            console.log(res.data);
            setAuthorized(res.data.authorized);
        }
        checkPrivate();
    }, [location, params]);
    
    if (authorized === null) {
        return (
            <StyledContainer>
                <h1>Loading...</h1>
                <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
            </StyledContainer>
        );
    }

    if (!authorized && auth.user) {
        return (
            <StyledContainer>
                <h1>You do not have access to this dataset</h1>   
            </StyledContainer>
        );
    }

    return authorized ? children : <Navigate to={redirect} state={{ from: location }} replace />;
};

export default DatasetRoute;
