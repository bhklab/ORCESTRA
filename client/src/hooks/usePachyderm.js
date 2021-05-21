import { useState, useEffect } from 'react';
import axios from 'axios';

const usePachyderm = () => {
    const [online, setOnline] = useState(false);
    
    useEffect(() => {
        const checkOnline = async () => {
            console.log('checking Pachyderm status');
            const res = await axios.get('/api/pachyderm/status');
            setOnline(res.data.isOnline);
            console.log(res.data.isOnline ? 'Pachyderm is online' : 'Pachyderm is offline');
        }
        checkOnline();
    }, []);
    
    return({ online });
}

export default usePachyderm;