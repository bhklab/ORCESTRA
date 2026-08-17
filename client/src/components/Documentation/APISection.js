import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        exampleUrl: '/api/public/datasets/all/concise',
        curl: 'curl -X GET https://orcestra.ca/api/public/datasets/all/concise',
        js: `const res = await fetch('https://orcestra.ca/api/public/datasets/all/concise');
const datasets = await res.json();
console.log(datasets);`,
        r: `library(httr)
library(jsonlite)
res <- GET("https://orcestra.ca/api/public/datasets/all/concise")
datasets <- fromJSON(content(res, "text"))`,
        python: `import requests
res = requests.get('https://orcestra.ca/api/public/datasets/all/concise')
datasets = res.json()`
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
            { name: 'info', type: 'string', required: true, description: "Can be either 'concise' or 'full'." }
        ],
        exampleUrl: '/api/public/datasets/pharmacogenomics/concise',
        curl: 'curl -X GET https://orcestra.ca/api/public/datasets/pharmacogenomics/concise',
        js: `const res = await fetch('https://orcestra.ca/api/public/datasets/pharmacogenomics/concise');
const psets = await res.json();`,
        r: `library(httr)
res <- GET("https://orcestra.ca/api/public/datasets/pharmacogenomics/concise")
psets <- fromJSON(content(res, "text"))`,
        python: `import requests
res = requests.get('https://orcestra.ca/api/public/datasets/pharmacogenomics/concise')
psets = res.json()`
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
            { name: 'info', type: 'string', required: true, description: "Can be either 'concise' or 'full'." }
        ],
        exampleUrl: '/api/public/dataset/694953faa3591a7b70fce109/concise',
        curl: 'curl -X GET https://orcestra.ca/api/public/dataset/694953faa3591a7b70fce109/concise',
        js: `const res = await fetch('https://orcestra.ca/api/public/dataset/694953faa3591a7b70fce109/concise');
const dataset = await res.json();`,
        r: `library(httr)
res <- GET("https://orcestra.ca/api/public/dataset/694953faa3591a7b70fce109/concise")
dataset <- fromJSON(content(res, "text"))`,
        python: `import requests
res = requests.get('https://orcestra.ca/api/public/dataset/694953faa3591a7b70fce109/concise')
dataset = res.json()`
    },
    {
        method: 'GET',
        path: '/api/view/statistics',
        title: 'Get Platform Datatype Statistics',
        id: 'api-statistics',
        description:
            'Returns metadata, priorities, dataset counts, and canonical counts for all supported data layers.',
        params: [],
        exampleUrl: '/api/view/statistics',
        curl: 'curl -X GET https://orcestra.ca/api/view/statistics',
        js: `const res = await fetch('https://orcestra.ca/api/view/statistics');
const stats = await res.json();`,
        r: `library(httr)
res <- GET("https://orcestra.ca/api/view/statistics")
stats <- fromJSON(content(res, "text"))`,
        python: `import requests
res = requests.get('https://orcestra.ca/api/view/statistics')
stats = res.json()`
    }
];

export const APISection = ({ scrollTarget }) => {
    const [selectedEndpoint, setSelectedEndpoint] = useState(apiEndpoints[0]);
    const [selectedLang, setSelectedLang] = useState('curl');
    const [copied, setCopied] = useState(false);

    // Interactive tester state
    const [testEndpoint, setTestEndpoint] = useState('/api/view/statistics');
    const [paramDatatype, setParamDatatype] = useState('pharmacogenomics');
    const [paramInfo, setParamInfo] = useState('concise');
    const [paramId, setParamId] = useState('694953faa3591a7b70fce109');
    const [responseLoading, setResponseLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [responseStatus, setResponseStatus] = useState(null);
    const [responseLatency, setResponseLatency] = useState(null);

    useEffect(() => {
        async function scrollTo() {
            await new Promise(resolve => setTimeout(resolve, 75));
            if (!scrollTarget) return;
            const el = document.getElementById(scrollTarget);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        scrollTo();
    }, [scrollTarget]);

    const handleCopy = text => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRunRequest = async () => {
        setResponseLoading(true);
        setResponseData(null);
        setResponseStatus(null);
        const startTime = Date.now();

        let requestUrl = testEndpoint;
        if (testEndpoint === 'all') {
            requestUrl = `/api/public/datasets/all/${paramInfo}`;
        } else if (testEndpoint === 'datatype') {
            requestUrl = `/api/public/datasets/${paramDatatype}/${paramInfo}`;
        } else if (testEndpoint === 'single') {
            requestUrl = `/api/public/dataset/${paramId}/${paramInfo}`;
        } else if (testEndpoint === 'stats') {
            requestUrl = `/api/view/statistics`;
        }

        try {
            const res = await axios.get(requestUrl);
            const latency = Date.now() - startTime;
            setResponseLatency(latency);
            setResponseStatus(res.status);
            setResponseData(res.data);
        } catch (error) {
            const latency = Date.now() - startTime;
            setResponseLatency(latency);
            setResponseStatus(error.response?.status || 500);
            setResponseData(error.response?.data || { error: error.message });
        } finally {
            setResponseLoading(false);
        }
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
                        All endpoints are served over HTTPS and return JSON responses. No authentication or API keys are
                        required for public dataset discovery and download link resolution.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-1 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col gap-1">
                        <span className="text-bodySm font-bold text-gray-500 uppercase tracking-wider">
                            Production Base URL
                        </span>
                        <span className="text-headingMd font-mono font-semibold text-lightBlue">
                            https://orcestra.ca/api/
                        </span>
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
                    {apiEndpoints.map(endpoint => (
                        <div
                            key={endpoint.path}
                            className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col gap-4 scroll-mt-32"
                            id={endpoint.id}
                        >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-1 rounded-md text-headingXs font-bold bg-green-600 text-white">
                                        {endpoint.method}
                                    </span>
                                    <span className="text-headingLg font-mono font-bold text-darkBlue">
                                        {endpoint.path}
                                    </span>
                                </div>
                                <span className="text-bodySm font-semibold text-gray-500">{endpoint.title}</span>
                            </div>

                            <p className="text-bodyMd text-gray-700">{endpoint.description}</p>

                            {endpoint.params.length > 0 && (
                                <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                                    <span className="text-bodySm font-bold text-gray-700 uppercase tracking-wider">
                                        Parameters
                                    </span>
                                    <div className="divide-y divide-gray-200">
                                        {endpoint.params.map(param => (
                                            <div key={param.name} className="py-2 flex items-start gap-4 text-bodySm">
                                                <span className="font-mono font-bold text-lightBlue min-w-24">
                                                    :{param.name}
                                                </span>
                                                <span className="font-mono text-gray-500 min-w-16">{param.type}</span>
                                                <span className="text-gray-600 flex-1">{param.description}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Code snippet block */}
                            <div className="flex flex-col bg-gray-900 rounded-xl overflow-hidden mt-2">
                                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 text-bodyXs font-semibold text-gray-300">
                                    <span>cURL Example</span>
                                    <button
                                        onClick={() => handleCopy(endpoint.curl)}
                                        className="text-darkYellow hover:underline"
                                    >
                                        Copy cURL
                                    </button>
                                </div>
                                <div className="p-4 overflow-x-auto text-bodySm font-mono text-gray-100">
                                    <code>{endpoint.curl}</code>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default APISection;
