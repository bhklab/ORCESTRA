import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathContext } from '../../hooks/Context';

const MainRev = () => {
    const path = useContext(PathContext);
    const navigate = useNavigate();

    useEffect(() => {
        path.setDatatype('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className="min-h-screen flex flex-col pt-28 justify-center items-center gap-28 px-72 lg:px-60 smd:px-4 bg-white"
            id="landing"
        >
            <div className="flex flex-col gap-6 items-center">
                <img src="/images/orcestra-logo-test.svg" className="w-[600px]" />
                <div className="h-1 w-1/2 bg-darkYellow" />
                <h2 className="text-headingXl text-lightBluetext-center">
                    Creating and sharing standardized datasets for computational analysis
                </h2>
                <button
                    onClick={() => navigate('/datatypes')}
                    className="flex bg-darkYellow text-bodyLg text-darkBlue font-semibold px-5 py-3 rounded-xl ease-in-out duration-200 hover:cursor-pointer hover:scale-110 drop-shadow-sm"
                >
                    View Data Types
                </button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-8 mdlg:px-0">
                <div className="flex flex-col gap-2 border-1 border-gray-100 p-4 rounded-md shadow-md">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="bg-lightYellow p-3 rounded-lg">
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#001D3D" stroke-width="2">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                                ></path>
                            </svg>
                        </div>
                        <h3 className="text-headingLg text-darkBlue font-semibold">Multimodal Integration</h3>
                    </div>
                    <p className="text-bodyLg text-lightBlue">
                        Seamlessly combine genomic, transcriptomic, proteomic, clinical, imaging, and metabolomic data
                        in a unified framework
                    </p>
                </div>
                <div className="flex flex-col gap-2 border-1 border-gray-100 p-4 rounded-md shadow-md">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="bg-lightYellow p-3 rounded-lg">
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#001D3D" stroke-width="2">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                ></path>
                            </svg>
                        </div>
                        <h3 className="text-headingLg text-darkBlue font-semibold">Standardized Formats</h3>
                    </div>
                    <p className="text-bodyLg text-lightBlue">
                        Leverage industry-standard formats and schemas for maximum interoperability and reproducibility
                    </p>
                </div>
                <div className="flex flex-col gap-2 border-1 border-gray-100 p-4 rounded-md shadow-md">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="bg-lightYellow p-3 rounded-lg">
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#001D3D" stroke-width="2">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    data-fg-kqz25="1.18:1.7585:/src/app/components/LandingPage.tsx:68:19:2727:248:e:path"
                                ></path>
                            </svg>
                        </div>
                        <h3 className="text-headingLg text-darkBlue font-semibold">Quality Assurance</h3>
                    </div>
                    <p className="text-bodyLg text-lightBlue">
                        In house validation ensures data integrity and consistency across all dataset types and formats
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MainRev;
