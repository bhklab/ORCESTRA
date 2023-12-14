import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { ThreeDots } from 'react-loader-spinner';
import { AuthContext } from '../hooks/Context';

const StyledContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const RestrictedRoute = ({ component: Component, type, ...rest }) => {
    const auth = useContext(AuthContext);
    const [authorized, setAuthorized] = useState(null);
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();

    useEffect(() => {
        let url = '';
        let queryParams = {}; // Renamed to avoid confusion with useParams

        switch(type){
            case 'dataset':
                url = '/api/data-object/check_private';
                queryParams = {
                    datasetType: params.datatype,
                    doi: `${params.id1}/${params.id2}`,
                    shareToken: location.search.length > 0 ? new URLSearchParams(location.search).get('shared') : null
                };
                break;
            case 'dataSubmission':
                url = `/api/user/dataset/submit/check_private/${params.id}`;
                break;
            default:
                break;
        }
        
        const checkPrivate = async () => {
            try {
                const res = await axios.get(url, { params: queryParams });
                setAuthorized(res.data.authorized);
            } catch (error) {
                console.error(error);
                // Handle error appropriately
            }
        };

        checkPrivate();
    }, [type, params, location]);

    if (authorized === null) {
        return (
            <StyledContainer>
                <h1>Loading...</h1>
                <ThreeDots color="#3D405A" height={100} width={100} />
            </StyledContainer>
        );
    }

    if (!authorized && auth.user) {
        return (
            <StyledContainer>
                <h1>You do not have access to this page</h1>   
            </StyledContainer>
        );
    }

    return (
        authorized ?
        <Component {...rest} />
        :
        (() => { navigate(rest.redirect, { replace: true, state: { from: location } }); return null; })()
    );
};

export default RestrictedRoute;
