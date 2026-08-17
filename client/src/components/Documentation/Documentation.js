import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OverviewSection from './OverviewSection';
import DataContributionSection from './DataContributionSection';
import APISection from './APISection';

const sectionSlugMap = {
    overview: 'Overview',
    search: 'Overview',
    request: 'Overview',
    userprofile: 'Overview',
    userProfile: 'Overview',
    datacontribution: 'Contributing your data',
    contribute: 'Contributing your data',
    'data-contribution': 'Contributing your data',
    api: 'API',
    'api-psets-available': 'API',
    'api-pset-single': 'API'
};

const slugReverseMap = {
    Overview: 'overview',
    'Contributing your data': 'datacontribution',
    API: 'api'
};

const Documentation = () => {
    const { section } = useParams();
    const navigate = useNavigate();

    const sections = useMemo(
        () => [
            {
                id: 'Overview',
                component: OverviewSection,
                subsections: [
                    { id: 'orcestra-overview', value: 'Platform Overview' },
                    { id: 'fair-principles', value: 'FAIR Data Principles' },
                    { id: 'data-nutrition-label', value: 'Data Nutrition Label (DNL)' },
                    { id: 'pipeline-architecture', value: 'Data Processing API & Pipeline' }
                ]
            },
            {
                id: 'Contributing your data',
                component: DataContributionSection,
                subsections: [
                    { id: 'submission-workflow', value: 'Submission & Publishing Lifecycle' },
                    { id: 'data-specifications', value: 'Required Formats & Schemas' },
                    { id: 'downloadable-templates', value: 'Downloadable CSV Templates' },
                    { id: 'pipeline-configs', value: 'Pipelines & Environments' }
                ]
            },
            {
                id: 'API',
                component: APISection,
                subsections: [
                    { id: 'api-overview', value: 'API Overview & Base URLs' },
                    { id: 'api-all-datasets', value: 'All Datasets Endpoint' },
                    { id: 'api-datatype-datasets', value: 'Datasets by Datatype' },
                    { id: 'api-single-dataset', value: 'Single Dataset & DNL' },
                    { id: 'api-statistics', value: 'Datatype Statistics' }
                ]
            }
        ],
        []
    );

    const initialSection = (section && sectionSlugMap[section.toLowerCase()]) || 'Overview';
    const [selected, setSelected] = useState(initialSection);
    const [selectedSub, setSelectedSub] = useState(undefined);
    const [scrollTarget, setScrollTarget] = useState(null);

    // Synchronize section parameter if route changes externally
    useEffect(() => {
        if (section) {
            const mapped = sectionSlugMap[section.toLowerCase()];
            if (mapped && mapped !== selected) {
                setSelected(mapped);
            }
        }
    }, [section]);

    const handleSelectSection = id => {
        setSelected(id);
        setSelectedSub(undefined);
        setScrollTarget(null);
        const slug = slugReverseMap[id] || 'overview';
        navigate(`/app/documentation/${slug}`, { replace: true });
    };

    const handleSelectSub = (e, sectionId, subId) => {
        e.stopPropagation();
        setSelected(sectionId);
        setSelectedSub(subId);
        setScrollTarget(subId);
        const slug = slugReverseMap[sectionId] || 'overview';
        navigate(`/app/documentation/${slug}`, { replace: true });
    };

    const Active = sections.find(s => s.id === selected)?.component;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="grid grid-cols-4 md:grid-cols-1 gap-8 py-32 max-w-[1300px] m-auto px-6">
                {/* Left Sticky Sidebar Navigation */}
                <div className="flex flex-col gap-3 col-span-1 sticky top-32 h-fit shrink-0 bg-white py-6 px-6 rounded-2xl border border-gray-200 shadow-sm">
                    <ul className="flex flex-col gap-4 list-disc pl-5 text-gray-600">
                        {sections.map(sects => (
                            <li
                                key={sects.id}
                                className={`text-headingMd py-1 hover:cursor-pointer hover:font-bold hover:text-darkBlue group w-fit ${
                                    selected === sects.id ? 'font-bold text-darkBlue' : 'font-medium text-gray-600'
                                }`}
                                onClick={() => handleSelectSection(sects.id)}
                            >
                                <div className="w-fit">
                                    {sects.id}
                                    <span
                                        className={`block group-hover:max-w-full group-hover:bg-darkBlue transition-all duration-300 h-0.5 ${
                                            selected === sects.id ? 'bg-darkBlue max-w-full' : 'bg-transparent max-w-0'
                                        }`}
                                    />
                                </div>

                                {sects.subsections.length !== 0 && (
                                    <ul className="list-disc pl-5 flex flex-col gap-1.5 pt-2">
                                        {sects.subsections.map(sub => (
                                            <li
                                                key={sub.id}
                                                className={`text-bodyMd py-0.5 hover:cursor-pointer hover:text-darkBlue hover:font-semibold group w-fit font-normal ${
                                                    selectedSub === sub.id
                                                        ? 'text-lightBlue font-bold'
                                                        : 'text-gray-500'
                                                }`}
                                                onClick={e => handleSelectSub(e, sects.id, sub.id)}
                                            >
                                                {sub.value}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Active Content Panel */}
                <div className="flex flex-col gap-10 col-span-3 text-darkBlue p-8 md:p-10 bg-white border border-gray-200 shadow-sm rounded-2xl">
                    {Active ? <Active scrollTarget={scrollTarget} /> : null}
                </div>
            </div>
        </div>
    );
};

export default Documentation;
