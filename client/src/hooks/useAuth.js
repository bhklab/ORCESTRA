import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';

/**
 * Custom hook to handle authentication.
 * @returns 
 */
const useAuth = () => {
    const history = useHistory();
    const { setUser } = useContext(AuthContext);
    const [error, setError] = useState(false);

    /**
     * Gets a user and sets it in UserContext, then pushes to another page based on location value
     * @param {*} location 
     */ 
    const setUserContext = async (location) => {
        const res = await axios.get('/api/user/session');
        setUser(res.data);
        if(res.data){
            if(location.state && location.state.from){
                history.push(location.state.from);
            }else{
                history.push('/');
            }
        }else{
            console.log('authentication failed');
            setError(true);
        }
    }

    /**
     * Submits user data to be logged in or registered.
     * @param {*} user user data to be submitted (set in Authentication.js)
     * @param {*} location 
     */
    const submitUser = async (user, location) => {
        try{
            await axios.post('/api/user/submit', user);
            await setUserContext(location);
        }catch(err){
            console.log(err);
        }
    }

    const signoutUser = async () => {
        try{
            await axios.get(`/api/user/signout`); // call API to reset cookie token
            setUser(null); // reset user in UserContext to null
            history.push('/signin'); // push to signin page
        }catch(err){
            console.log(err);
        }
    }

    return {
        submitUser,
        signoutUser,
        error
    }
}

export default useAuth;