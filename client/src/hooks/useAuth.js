import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import
import axios from 'axios';
import { AuthContext } from './Context';

/**
 * Custom hook to handle authentication.
 * @returns 
 */
const useAuth = () => {
    const navigate = useNavigate(); // Updated to use useNavigate
    const { setUser } = useContext(AuthContext);
    const [error, setError] = useState(false);

    /**
     * Gets a user and sets it in UserContext, then navigates to another page based on location value
     * @param {*} location 
     */ 
    const setUserContext = async (location) => {
        const res = await axios.get('/api/user/session');
        console.log(res.data);
        setUser(res.data);
        if(res.data){
            if(location.state && location.state.from){
                navigate(location.state.from); // Updated to use navigate
            }else{
                navigate('/app/profile'); // Updated to use navigate
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

    /**
     * Logs out the user.
     */
    const logoutUser = async () => {
        try{
            await axios.get(`/api/user/logout`); // Call API to reset cookie token
            setUser(null); // Reset user in UserContext to null
            navigate('/app/authentication'); // Updated to use navigate
        }catch(err){
            console.log(err);
        }
    }

    return {
        submitUser,
        logoutUser,
        error
    }
}

export default useAuth;
