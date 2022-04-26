import React, {useState, useEffect, useContext} from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';
import { AuthContext } from '../hooks/Context'

const StyledContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const RestrictedRoute = ({component: Component, location, computedMatch, type, ...rest}) => {
    const auth = useContext(AuthContext);
    const [authorized, setAuthorized] = useState(null);

    useEffect(() => {
        console.log(location);
        console.log(type);
        let url = '';
        let params = {};
        switch(type){
            case 'dataset':
                url = '/api/data-object/check_private';
                params = {
                    datasetType: computedMatch.params.datatype,
                    doi: `${computedMatch.params.id1}/${computedMatch.params.id2}`,
                    shareToken: location.search.length > 0 ? location.search : null
                }
                break;
            case 'dataSubmission':
                url = `/api/user/dataset/submit/check_private/${computedMatch.params.id}`;
                break;
            default:
                break;
        }
        const checkPrivate = async () => {
            const res = await axios.get(url, {params: params});
            console.log(res.data);
            setAuthorized(res.data.authorized);
        }
        checkPrivate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    if(authorized === null){
        return(
            <StyledContainer>
                <h1>Loading...</h1>
                <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
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

    return(
        <Route 
            {...rest} 
            render={props => (
                authorized ? 
                <Component {...props} />
                :
                <Redirect to={{pathname: rest.redirect, state:{ from: location }}} />
            )} 
        />
    );
}

export default RestrictedRoute;