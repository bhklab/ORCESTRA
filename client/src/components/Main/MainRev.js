import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathContext } from '../../hooks/Context';
import { dataTypes } from '../Shared/Enums';

const MainRev = () => {
    const path = useContext(PathContext);
    const navigate = useNavigate();

    useEffect(() => {
        path.setDatatype('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className="min-h-screen flex flex-col margin-auto justify-center items-center gap-10 px-60 lg:px-36 smd:px-4"
            id="landing"
        >
            <div className="flex flex-col">
                <img src="/images/orcestra-logo-test.svg" className="w-full" />
                <h2 className="text-[3.5em] text-darkYellow text-center">
                    Creating and sharing standardized datasets for computational analysis
                </h2>
            </div>
            <button
                onClick={() => navigate('/datatypes')}
                className="flex bg-darkBlue  text-heading2Xl text-white px-5 py-3 rounded-xl ease-in-out duration-200 hover:cursor-pointer hover:scale-110 hover:bg-lightYellow hover:text-darkBlue hover:font-semibold"
            >
                View Data Types
            </button>

            <h3></h3>
        </div>
    );
};

export default MainRev;
