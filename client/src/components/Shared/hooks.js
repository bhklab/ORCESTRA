import { useState, useEffect } from "react";

function useFetch(url){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchData(){
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);
    return([data, loading]);
}

export { useFetch };