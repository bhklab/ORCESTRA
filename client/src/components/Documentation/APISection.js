import React, { useEffect, useState } from 'react';

const BASE_URL =
    process.env.REACT_APP_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://orcestra.ca');

const apiEndpoints = [
    {
        method: 'GET',
        path: '/api/public/datasets/all/:info',
        title: 'Get All Datasets',
        id: 'api-all-datasets',
        description: 'Retrieves all public datasets across all data layers in ORCESTRA.',
        params: [
            {
                name: 'info',
                type: 'string',
                required: true,
                description: "Can be either 'concise' (lightweight summary) or 'full' (complete Data Nutrition Label)."
            }
        ],
        exampleUrl: '/api/public/datasets/all/concise'
    },
    {
        method: 'GET',
        path: '/api/public/datasets/:datatype/:info',
        title: 'Get Datasets by Datatype',
        id: 'api-datatype-datasets',
        description: 'Retrieves all public datasets belonging to a specific biomedical data layer.',
        params: [
            {
                name: 'datatype',
                type: 'string',
                required: true,
                description:
                    "One of: 'pharmacogenomics', 'toxicogenomics', 'xenographic', 'clinicalgenomics', 'radiogenomics', 'radiomics', 'icb', 'annotations'."
            },
            {
                name: 'info',
                type: 'string',
                required: true,
                description: "Can be either 'concise' (lightweight summary) or 'full' (complete Data Nutrition Label)"
            }
        ],
        exampleUrl: '/api/public/datasets/pharmacogenomics/concise'
    },
    {
        method: 'GET',
        path: '/api/public/dataset/:id/:info',
        title: 'Get Single Dataset by ID',
        id: 'api-single-dataset',
        description: 'Retrieves comprehensive metadata and Data Nutrition Label for a specific dataset ID.',
        params: [
            {
                name: 'id',
                type: 'string',
                required: true,
                description: "The MongoDB ObjectId of the dataset (e.g., '694953faa3591a7b70fce109')."
            },
            {
                name: 'info',
                type: 'string',
                required: true,
                description: "Can be either 'concise' (lightweight summary) or 'full' (complete Data Nutrition Label)"
            }
        ],
        exampleUrl: '/api/public/dataset/694953faa3591a7b70fce109/concise'
    }
    // {
    //     method: 'GET',
    //     path: '/api/view/statistics',
    //     title: 'Get Platform Datatype Statistics',
    //     id: 'api-statistics',
    //     description:
    //         'Returns metadata, priorities, dataset counts, and canonical counts for all supported data layers.',
    //     params: [],
    //     exampleUrl: '/api/view/statistics'
    // }
];

const getSnippet = (lang, endpoint) => {
    const fullUrl = `${BASE_URL}${endpoint.exampleUrl}`;
    switch (lang) {
        case 'curl':
            return `curl -X GET ${fullUrl}`;
        case 'js':
            return `const res = await fetch('${fullUrl}');\nconst data = await res.json();\nconsole.log(data);`;
        case 'r':
            return `library(httr)\nlibrary(jsonlite)\n\nres <- GET("${fullUrl}")\ndata <- fromJSON(content(res, "text"))`;
        case 'python':
            return `import requests\n\nres = requests.get('${fullUrl}')\ndata = res.json()`;
        default:
            return `curl -X GET ${fullUrl}`;
    }
};

export const APISection = ({ scrollTarget }) => {
    // Independent language state per endpoint
    const [selectedLangs, setSelectedLangs] = useState({
        'api-all-datasets': 'curl',
        'api-datatype-datasets': 'curl',
        'api-single-dataset': 'curl'
    });

    // Independent copied state tracking which endpoint was copied
    const [copiedEndpointId, setCopiedEndpointId] = useState(null);

    useEffect(() => {
        async function scrollTo() {
            await new Promise(resolve => setTimeout(resolve, 75));
            if (!scrollTarget) return;
            const el = document.getElementById(scrollTarget);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        scrollTo();
    }, [scrollTarget]);

    const handleCopy = (endpointId, text) => {
        navigator.clipboard.writeText(text);
        setCopiedEndpointId(endpointId);
        setTimeout(() => setCopiedEndpointId(null), 2000);
    };

    return (
        <div className="flex flex-col gap-12 text-darkBlue">
            {/* Header / Hero */}
            <div className="flex flex-col gap-3 pb-6 border-b border-gray-100">
                <h1 className="text-heading3Xl md:text-heading2Xl font-bold text-darkBlue">REST API Documentation</h1>
                <p className="text-bodyLg text-gray-600 leading-relaxed">
                    ORCESTRA exposes public RESTful API endpoints for programmatic search, catalog retrieval, and Data
                    Nutrition Label extraction.
                </p>
            </div>

            {/* Subsection 1: API Overview */}
            <div className="flex flex-col gap-4">
                <h3 className="text-headingXl font-bold text-darkBlue scroll-mt-32" id="api-overview">
                    API Overview & Base URLs
                </h3>
                <div className="flex flex-col gap-4 text-bodyLg text-gray-700 leading-relaxed">
                    <p>
                        All endpoints are served over HTTP/HTTPS and return JSON responses. No authentication or API
                        keys are required for public dataset discovery and download link resolution.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-1 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col gap-1">
                        <span className="text-bodySm font-bold text-gray-500 uppercase tracking-wider">
                            Base API URL
                        </span>
                        <span className="text-headingMd font-mono font-semibold text-lightBlue">{BASE_URL}/api/</span>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col gap-1">
                        <span className="text-bodySm font-bold text-gray-500 uppercase tracking-wider">
                            Response Format
                        </span>
                        <span className="text-headingMd font-mono font-semibold text-lightBlue">application/json</span>
                    </div>
                </div>
            </div>

            {/* Endpoints Reference */}
            <div className="flex flex-col gap-8 pt-6 border-t border-gray-100">
                <h3 className="text-headingXl font-bold text-darkBlue">API Endpoints Reference</h3>

                <div className="flex flex-col gap-6">
                    {apiEndpoints.map(endpoint => {
                        const currentLang = selectedLangs[endpoint.id] || 'curl';
                        const isCopied = copiedEndpointId === endpoint.id;

                        return (
                            <div
                                key={endpoint.path}
                                className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col gap-4 scroll-mt-32"
                                id={endpoint.id}
                            >
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2.5 py-1 rounded-md text-headingXs font-bold bg-green-600 text-white">
                                            {endpoint.method}
                                        </span>
                                        <span className="text-headingLg font-mono font-bold text-darkBlue">
                                            {endpoint.path}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-bodySm font-semibold text-gray-500">
                                            {endpoint.title}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-bodyMd text-gray-700">{endpoint.description}</p>

                                {endpoint.params.length > 0 && (
                                    <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                                        <span className="text-bodySm font-bold text-gray-700 uppercase tracking-wider">
                                            Parameters
                                        </span>
                                        <div className="divide-y divide-gray-200">
                                            {endpoint.params.map(param => (
                                                <div
                                                    key={param.name}
                                                    className="py-2 flex items-start gap-4 text-bodySm"
                                                >
                                                    <span className="font-mono font-bold text-lightBlue min-w-24">
                                                        :{param.name}
                                                    </span>
                                                    <span className="font-mono text-gray-500 min-w-16">
                                                        {param.type}
                                                    </span>
                                                    <span className="text-gray-600 flex-1">{param.description}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Code Examples Drawer */}
                                <div className="flex flex-col gap-3 pt-2">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            {['curl', 'js', 'r', 'python'].map(lang => (
                                                <button
                                                    key={lang}
                                                    onClick={() =>
                                                        setSelectedLangs(prev => ({
                                                            ...prev,
                                                            [endpoint.id]: lang
                                                        }))
                                                    }
                                                    className={`px-3 py-1 rounded-lg text-bodyXs font-bold uppercase transition-all ${
                                                        currentLang === lang
                                                            ? 'bg-lightBlue text-white'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                                >
                                                    {lang === 'js' ? 'JavaScript' : lang === 'r' ? 'R' : lang}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <a
                                                href={`${BASE_URL}${endpoint.exampleUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-bodySm font-semibold text-lightBlue hover:underline flex items-center gap-1"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                    />
                                                </svg>
                                                <span>Open URL</span>
                                            </a>
                                            <span className="text-gray-300">|</span>
                                            <button
                                                onClick={() =>
                                                    handleCopy(endpoint.id, getSnippet(currentLang, endpoint))
                                                }
                                                className="text-bodySm font-semibold text-lightBlue hover:underline flex items-center gap-1"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-900 rounded-xl font-mono text-bodySm text-gray-100 overflow-x-auto">
                                        <pre>
                                            <code>{getSnippet(currentLang, endpoint)}</code>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default APISection;
