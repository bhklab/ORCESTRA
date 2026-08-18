import React, { useContext, useEffect } from 'react';
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
            className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center gap-16 pt-32 pb-20 px-6 max-w-[1250px] mx-auto text-darkBlue"
            id="landing"
        >
            <div className="flex flex-col gap-6 items-center text-center max-w-3xl">
                <img
                    src="/images/orcestra-logo-test.svg"
                    alt="ORCESTRA Logo"
                    className="w-[560px] max-w-full drop-shadow-xs"
                />
                <div className="h-1 w-24 bg-darkYellow rounded-full" />
                <h2 className="text-heading2Xl text-darkBlue font-bold leading-snug">
                    Creating and sharing standardized datasets for computational analysis
                </h2>
                <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
                    <button
                        onClick={() => navigate('/datatypes')}
                        className="flex items-center gap-2 bg-darkYellow hover:bg-amber-400 text-darkBlue font-bold text-bodyLg px-6 py-3 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        <span>View Data Types</span>
                    </button>
                    <a
                        href="https://github.com/bhklab/ORCESTRA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-darkBlue font-semibold text-bodyLg px-6 py-3 rounded-xl border border-gray-200 shadow-2xs transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            />
                        </svg>
                        <span>GitHub</span>
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-1 gap-6 w-full">
                <div className="flex flex-col gap-3.5 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-lightYellow/50 text-darkBlue flex items-center justify-center shrink-0">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                                />
                            </svg>
                        </div>
                        <h3 className="text-headingLg text-darkBlue font-bold">Multimodal Integration</h3>
                    </div>
                    <p className="text-bodyMd text-gray-600 leading-relaxed">
                        Seamlessly combine genomic, transcriptomic, proteomic, clinical, imaging, and metabolomic data
                        in a unified framework.
                    </p>
                </div>

                <div className="flex flex-col gap-3.5 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-lightYellow/50 text-darkBlue flex items-center justify-center shrink-0">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                />
                            </svg>
                        </div>
                        <h3 className="text-headingLg text-darkBlue font-bold">Standardized Formats</h3>
                    </div>
                    <p className="text-bodyMd text-gray-600 leading-relaxed">
                        Leverage industry-standard formats and schemas for maximum interoperability and reproducibility.
                    </p>
                </div>

                <div className="flex flex-col gap-3.5 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-lightYellow/50 text-darkBlue flex items-center justify-center shrink-0">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-headingLg text-darkBlue font-bold">Quality Assurance</h3>
                    </div>
                    <p className="text-bodyMd text-gray-600 leading-relaxed">
                        In-house validation ensures data integrity and consistency across all dataset types and formats.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MainRev;
