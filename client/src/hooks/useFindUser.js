import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Checks if a user has a valid cookie when they arrive on the site.
 */
const useFindUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const res = await axios.get('/api/user/session');
            setUser(res.data);
            setLoading(false);
        }
        getSession();
    }, []);

    return {
        user,
        setUser,
        loading
    }
}

export default useFindUser;