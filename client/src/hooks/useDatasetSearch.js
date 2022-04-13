import { useState } from 'react';
import axios from 'axios';
import qs from 'qs';

/**
 * A custom hook that provides dataset search function
 * @param {*} datasetType 
 * @returns 
 */
const useDatasetSearch = (datasetType) => {
    const [searchAll, setSeatchAll] = useState(true);

    const search = async (parameters) => {
        const res = await axios.get(
            `/api/data-objects/search`, 
            {
                params: {
                    ...parameters,
                    datasetType: datasetType
                },
                paramsSerializer: params => {
                    return qs.stringify(params)
                }
            },
        );
        let all = true;
        Object.keys(parameters).forEach(key => {
            if(Array.isArray(parameters[key]) && parameters[key].length > 0){
                all = false;
            }
        });
        setSeatchAll(all);
        return res.data;
        return [];
    }
    
    return {
        searchAll,
        search
    };
}

export default useDatasetSearch;