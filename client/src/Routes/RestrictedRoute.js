import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { ThreeDots } from 'react-loader-spinner'; // Corrected import
import { AuthContext } from '../hooks/Context'

const StyledContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const RestrictedRoute = ({ children, redirect, type }) => {
    const auth = useContext(AuthContext);
    const [authorized, setAuthorized] = useState(null);
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const url = `/api/${type}` + 
                    `/check_private/${params.id1}/${params.id2}` + 
                    `${location.search.length > 0 ? location.search : ''}`;
                    
        const checkPrivate = async () => {
            try {
                const res = await axios.get(url);
                setAuthorized(res.data.authorized);
            } catch (error) {
                console.error(error);
                navigate(redirect, { state: { from: location }, replace: true });
            }
        }

        checkPrivate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id1, params.id2, location.search]);
    
    if(authorized === null){
        return(
            <StyledContainer>
                <h1>Loading...</h1>
                <ThreeDots color="#3D405A" height={100} width={100} /> {/* Corrected usage */}
            </StyledContainer>
        );
    }

    if(!authorized && auth.user){
        return(
            <StyledContainer>
                <h1>You do not have access to this page</h1>   
            </StyledContainer>
        );
    }

    return authorized ? children : <Navigate to={redirect} state={{ from: location }} replace />;
}

export default RestrictedRoute;
