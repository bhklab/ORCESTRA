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

const DatasetRoute = ({component: Component, location, computedMatch, ...rest}) => {
    const auth = useContext(AuthContext);
    const [authorized, setAuthorized] = useState(null);

    useEffect(() => {
        console.log(computedMatch);
        const checkPrivate = async () => {
            const res = await axios.get(`/api/${computedMatch.params.datatype}/check_private/${computedMatch.params.id1}/${computedMatch.params.id2}`);
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
                <h1>You do not have access to this dataset</h1>   
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

export default DatasetRoute;
