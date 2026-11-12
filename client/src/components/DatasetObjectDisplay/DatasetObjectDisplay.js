import axios from 'axios';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dropdown } from 'primereact/dropdown';
import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, ChevronUp, Share2, Check } from 'lucide-react';

const TechnicalInformation = ({ header, info }) => (
    <div className="flex justify-between items-center w-full py-4 px-4 bg-white border-1 border-gray-200 drop-shadow-sm">
        <h3 className="text-gray-600 text-headingMd">{header}</h3>
        <span className="text-black text-headingMd font-semibold">{info}</span>
    </div>
);

const DatasetObjectDisplay = ({ dataset }) => {
    // header state
    const [selectedObject, setSelectedObject] = useState('');
    const [selectedCSV, setSelectedCSV] = useState('');
    const [shareInfo, setShareInfo] = useState(null); // state for the shareable link ot be created
    const [copiedShareLink, setCopiedShareLink] = useState(false); // state for rendering notice when link is clipboard copied

    const handleGetShareLink = async () => {
        try {
            const res = await axios.post('/api/dataset-object/sharelink', {
                datasetId: dataset._id
            });
            const url = `${window.location.origin}/${dataset.datasetType}/${dataset._id}?shared=${res.data.token}`;
            setShareInfo({
                url,
                expireDate: new Date(res.data.expire).toLocaleDateString()
            });
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                setCopiedShareLink(true);
                setTimeout(() => setCopiedShareLink(false), 3000);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Main content state
    const [showDescription, setShowDescription] = useState(false);
    const [showPolicy, setShowPolicy] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    // Ref to handle the 'show more' for clamping for descriptions, policy, and disclaimers
    const descriptionRef = useRef(null);
    const policyRef = useRef(null);
    const disclaimerRef = useRef(null);
    const [isDescriptionClamped, setIsDescriptionClamped] = useState(false);
    const [isPolicyClamped, setIsPolicyClamped] = useState(false);
    const [isDisclaimerClamped, setIsDisclaimerClamped] = useState(false);

    useEffect(() => {
        if (descriptionRef.current) {
            setIsDescriptionClamped(descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight);
        }
        if (policyRef.current) {
            setIsPolicyClamped(policyRef.current.scrollHeight > policyRef.current.clientHeight);
        }
        if (disclaimerRef.current) {
            setIsDisclaimerClamped(disclaimerRef.current.scrollHeight > disclaimerRef.current.clientHeight);
        }
    }, [dataset]);

    return (
        <div className="flex flex-col">
            <div className="flex py-4 px-24 flex-col bg-lightBlue gap-4 min-h-20">
                <div className="flex flex-col flex-wrap gap-4">
                    <h1 className="font-bold text-heading3Xl text-darkYellow">{dataset.name}</h1>
                    <div className="flex flex-row gap-3 items-start">
                        {dataset?.repositories.downloadLink && dataset.repositories.downloadLink.length > 0 && (
                            <div className="flex flex-row gap-2 items-center">
                                <Dropdown
                                    pt={{
                                        root: {
                                            className: 'flex gap-4 rounded-md px-3 py-1.5'
                                        },
                                        input: ({ props }) => ({
                                            className: `${props.value ? 'text-darkBlue' : 'text-gray-600'} text-headingSm font-bold p-0`
                                        }),
                                        item: { className: 'p-2 pr-6' },
                                        itemLabel: { className: 'text-headingSm' },
                                        wrapper: { className: 'rounded-md' },
                                        list: { className: 'py-0' },

                                        trigger: { className: 'p-0 w-4' },
                                        dropdownIcon: ({ props }) => ({
                                            className: `${props.value ? 'text-darkBlue' : 'text-gray-600'}`
                                        }),
                                        collapseIcon: ({ props }) => ({
                                            className: `${props.value ? 'text-darkBlue' : 'text-gray-600'}`
                                        })
                                    }}
                                    value={selectedObject}
                                    onChange={e => setSelectedObject(e.value)}
                                    options={dataset.repositories.downloadLink.map((link, ind) => {
                                        let labelName = 'Empty Link';
                                        if (link) {
                                            labelName = link.includes('/files/')
                                                ? link.split('/files/')[1].split('?')[0]
                                                : link;
                                        }
                                        return {
                                            label: `${ind + 1}. ${labelName}`,
                                            value: link
                                        };
                                    })}
                                    placeholder="Download Dataset Object(s)"
                                    dropdownIcon={
                                        <>
                                            <ChevronDown
                                                className={`size-4 ${selectedObject ? 'text-darkBlue' : 'text-gray-600'}`}
                                                strokeWidth={4}
                                            />
                                        </>
                                    }
                                    collapseIcon={
                                        <>
                                            <ChevronUp
                                                className={`size-4 ${selectedObject ? 'text-darkBlue' : 'text-gray-600'}`}
                                                strokeWidth={4}
                                            />
                                        </>
                                    }
                                />
                                <a
                                    href={selectedObject}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-md px-2 py-1.5"
                                >
                                    <>
                                        <Download className="w-[18px] h-[18px] text-white" strokeWidth={3} />
                                    </>
                                </a>
                            </div>
                        )}

                        {dataset?.repositories.csvLinks && dataset.repositories.csvLinks.length > 0 && (
                            <div className="flex flex-row gap-2 items-center">
                                <Dropdown
                                    pt={{
                                        root: {
                                            className: 'flex gap-4 rounded-md px-3 py-1.5'
                                        },
                                        input: ({ props }) => ({
                                            className: `${props.value ? 'text-darkBlue' : 'text-gray-600'} text-headingSm font-bold p-0`
                                        }),
                                        item: { className: 'p-2 pr-6' },
                                        itemLabel: { className: 'text-headingSm' },
                                        wrapper: { className: 'rounded-md' },
                                        list: { className: 'py-0' },

                                        trigger: { className: 'p-0 w-4' },
                                        dropdownIcon: ({ props }) => ({
                                            className: `${props.value ? 'text-darkBlue' : 'text-gray-600'}`
                                        }),
                                        collapseIcon: ({ props }) => ({
                                            className: `${props.value ? 'text-darkBlue' : 'text-gray-600'}`
                                        })
                                    }}
                                    value={selectedCSV}
                                    onChange={e => setSelectedCSV(e.value)}
                                    options={dataset.repositories.csvLinks.map((link, ind) => {
                                        let labelName = 'Empty Link';
                                        if (link) {
                                            labelName = link.includes('/files/')
                                                ? link.split('/files/')[1].split('?')[0]
                                                : link;
                                        }
                                        return {
                                            label: `${ind + 1}. ${labelName}`,
                                            value: link
                                        };
                                    })}
                                    placeholder="Select a file"
                                    dropdownIcon={
                                        <>
                                            <ChevronDown
                                                className={`size-4 ${selectedCSV ? 'text-darkBlue' : 'text-gray-600'}`}
                                                strokeWidth={4}
                                            />
                                        </>
                                    }
                                    collapseIcon={
                                        <>
                                            <ChevronUp
                                                className={`size-4 ${selectedCSV ? 'text-darkBlue' : 'text-gray-600'}`}
                                                strokeWidth={4}
                                            />
                                        </>
                                    }
                                />
                                <a
                                    href={selectedCSV}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-md px-2 py-1.5"
                                >
                                    <>
                                        <Download className="w-[18px] h-[18px] text-white" strokeWidth={3} />
                                    </>
                                </a>
                            </div>
                        )}
                        {dataset?.info?.private && dataset?.isOwner && (
                            <div className="flex flex-row items-center gap-3">
                                <button
                                    onClick={handleGetShareLink}
                                    className="flex flex-row items-center gap-2 px-3 py-1.5 text-headingSm rounded-md font-bold bg-white text-darkBlue hover:bg-gray-100 duration-200"
                                >
                                    {copiedShareLink ? (
                                        <>
                                            <Check className="size-4 text-green-700" strokeWidth={3} />
                                            <span>Copied Share Link!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Share2 className="size-4" strokeWidth={2.5} />
                                            <span>Get Shareable Link</span>
                                        </>
                                    )}
                                </button>
                                {shareInfo && (
                                    <span className="text-bodyXs text-white">
                                        Expires {shareInfo.expireDate}: <span className="underline">{shareInfo.url}</span>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex">
                        <a
                            className="flex flex-row items-center gap-1"
                            href={`https://doi.org/${dataset.repositories.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src="/images/icons/zenodo.svg" alt="zenodo" className="w-5 h-5" />
                            <span className="text-white text-headingSm">{dataset.repositories.doi}</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="flex flex-col px-24 py-10" id="main">
                <div className="flex flex-row gap-10" id="general">
                    <div className="flex flex-col items-start gap-4 max-w-[400px]" id="description">
                        {dataset.description && (
                            <div className="flex flex-col gap-2 items-start">
                                <h1 className="text-headingXl text-lightBlue">Description</h1>
                                <div className="flex flex-col items-start w-full">
                                    <div
                                        ref={descriptionRef}
                                        className={`text-bodyMd ${
                                            showDescription
                                                ? '[&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1 [&_strong]:block [&_strong]:mt-3 [&_strong]:mb-1'
                                                : 'line-clamp-2 [&_*]:inline'
                                        } duration-300 transition [&_a]:text-blue-600 [&_a]:underline`}
                                        dangerouslySetInnerHTML={{
                                            __html: dataset.description
                                        }}
                                    />
                                    {isDescriptionClamped && (
                                        <button
                                            className="text-bodySm text-blue-600 font-bold"
                                            onClick={() => setShowDescription(!showDescription)}
                                        >
                                            {showDescription ? 'show less' : 'show more'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col items-start w-full gap-2" id="technical">
                            <h1 className="text-headingXl text-lightBlue">Technical Information</h1>
                            <div className="flex flex-col items-start w-full gap-2">
                                <TechnicalInformation header="Dataset" info={dataset.datasetNote.name} />
                                <TechnicalInformation
                                    header="Dataset Type"
                                    info={dataset.datasetType.charAt(0).toUpperCase() + dataset.datasetType.slice(1)}
                                />
                                {dataset.repositories.downloadLink.length > 0 &&
                                dataset.repositories?.csvLinks?.length > 0 ? (
                                    <TechnicalInformation header="Format" info="RDS and CSV" />
                                ) : (
                                    <TechnicalInformation header="Format" info="RDS" />
                                )}
                                <TechnicalInformation header="Version" info={dataset.version} />
                                <TechnicalInformation header="License" info="CC BY 4.0" />
                                <TechnicalInformation header="Author" info={dataset.info.createdBy} />
                                <TechnicalInformation
                                    header="Date Uploaded"
                                    info={dataset?.info?.dateCreated?.slice(0, 10)}
                                />
                                <TechnicalInformation header="User Downloads" info={dataset.info.numDownload} />
                                {dataset.info?.other?.pipeline?.url && (
                                    <TechnicalInformation
                                        header={
                                            <>
                                                <img src="/images/icons/github.png" className="w-6 h-6" />
                                            </>
                                        }
                                        info={
                                            <div className="text-wrap break-normal text-right">
                                                <a
                                                    href={`${dataset.info.other.pipeline.url.replace('.git', '')}/tree/${dataset.info.other.pipeline.commit_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-right"
                                                >
                                                    <span className="text-black text-headingXs font-semibold hover:text-darkYellow">
                                                        {dataset.info.other.pipeline.commit_id}
                                                    </span>
                                                </a>
                                            </div>
                                        }
                                    />
                                )}
                                {dataset.info?.other?.additionalRepo &&
                                    dataset.info?.other?.additionalRepo.length > 0 && (
                                        <TechnicalInformation
                                            header={
                                                <>
                                                    <img src="/images/icons/additional-repo.png" className="w-6 h-6" />
                                                </>
                                            }
                                            info={dataset.info?.other?.additionalRepo.map((repo, index) => (
                                                <div className="text-wrap text-right">
                                                    <a
                                                        href={`${repo.git_url.replace('.git', '')}/tree/${repo.commit_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <span className="text-black text-headingXs font-semibold hover:text-darkYellow">
                                                            {repo.commit_id} ({repo.repo_type})
                                                        </span>
                                                    </a>
                                                </div>
                                            ))}
                                        />
                                    )}
                            </div>
                        </div>
                        {dataset?.datasetNote?.citations > 0 && (
                            <div className="flex flex-col items-start w-full gap-2" id="citations">
                                <h1 className="text-headingXl text-lightBlue">Citations</h1>
                                <Accordion
                                    pt={{
                                        accordiontab: {
                                            headerAction: ({ context }) => ({
                                                className: `py-4 border border-gray-200 bg-white ${context.selected ? 'border-b-0' : 'border-b-1'} drop-shadow-xs`
                                            }),
                                            content: {
                                                className: 'p-5 border border-gray-200 bg-white rounded-sm'
                                            },
                                            headerTitle: {
                                                className: 'text-black'
                                            },
                                            headerIcon: {
                                                className: 'text-black'
                                            }
                                        }
                                    }}
                                    header="Citations"
                                    className="w-full flex flex-col gap-2"
                                >
                                    {dataset.datasetNote.citations.map((citation, index) => (
                                        <AccordionTab
                                            key={index}
                                            header={
                                                <div className="flex justify-between items-center">
                                                    <span>Citation {index + 1}</span>
                                                    <button
                                                        className="flex gap-2 text-gray-500"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            navigator.clipboard.writeText(citation);
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="2"
                                                            stroke="currentColor"
                                                            className="size-4"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                                                            />
                                                        </svg>
                                                        Copy
                                                    </button>
                                                </div>
                                            }
                                            className="w-full"
                                        >
                                            <p className="whitespace-pre-wrap">{citation}</p>
                                        </AccordionTab>
                                    ))}
                                </Accordion>
                            </div>
                        )}

                        {dataset?.qualityControl?.length > 0 && (
                            <div className="flex flex-col items-start w-full gap-2" id="quality control">
                                <h1 className="text-headingXl text-lightBlue">Quality Control</h1>
                                <div className="flex flex-row flex-wrap gap-2">
                                    {dataset.qualityControl.map((qc, ind) => (
                                        <a
                                            className="text-bodyMd font-bold border border-gray-200 py-2 px-4 rounded-full bg-white text-darkBlue drop-shadow-sm hover:border-darkBlue duration-300 ease-in-out"
                                            key={ind}
                                            href={`/qc-viewer?url=${encodeURIComponent(qc.url)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {qc.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col items-start w-full gap-2" id="policy">
                            <h1 className="text-headingXl text-lightBlue">Usage Policy</h1>
                            <div className="flex flex-col items-start">
                                <p
                                    ref={policyRef}
                                    dangerouslySetInnerHTML={{ __html: dataset.datasetNote.usagePolicy }}
                                    className={`text-bodyMd ${showPolicy ? '' : 'line-clamp-2'} duration-300 transition [&_a]:text-blue-600 [&_a]:underline`}
                                />
                                {isPolicyClamped && (
                                    <button
                                        className="text-bodySm text-blue-600 font-bold"
                                        onClick={() => setShowPolicy(!showPolicy)}
                                    >
                                        {showPolicy ? 'show less' : 'show more'}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-start w-full gap-2" id="policy">
                            <h1 className="text-headingXl text-lightBlue">Data Disclaimer</h1>
                            <div className="flex flex-col items-start">
                                <p
                                    ref={disclaimerRef}
                                    dangerouslySetInnerHTML={{ __html: dataset.datasetNote.disclaimer }}
                                    className={`text-bodyMd ${showDisclaimer ? '' : 'line-clamp-2'} duration-300 transition [&_a]:text-blue-600 [&_a]:underline`}
                                />
                                {isDisclaimerClamped && (
                                    <button
                                        className="text-bodySm text-blue-600 font-bold"
                                        onClick={() => setShowDisclaimer(!showDisclaimer)}
                                    >
                                        {showDisclaimer ? 'show less' : 'show more'}
                                    </button>
                                )}
                            </div>
                        </div>
                        {dataset?.datasetNote?.citations?.length > 0 && (
                            <div className="flex flex-col items-start w-full gap-2" id="quality control">
                                <h1 className="text-headingXl text-lightBlue">Citations</h1>
                                <div className="flex flex-row flex-wrap gap-2">
                                    {dataset.datasetNote?.citations?.map((citation, ind) => (
                                        <div className="flex flex-col gap-2 w-full  " key={ind}>
                                            <ul className="text-headingSm italic list-disc list-inside">
                                                <li
                                                    className=""
                                                    dangerouslySetInnerHTML={{
                                                        __html: citation
                                                            ?.replace(/^<p>([\s\S]*?)<\/p>$/, '$1')
                                                            .replace(/<br\s*\/?>/g, '')
                                                    }}
                                                />
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col w-full gap-2">
                        {dataset.dataSources && Object.keys(dataset.dataSources).length > 0 && (
                            <div className="flex flex-col w-full gap-2">
                                <h1 className="text-headingXl text-lightBlue">Data</h1>
                                {Object.entries(dataset.dataSources).map(([noteType, notes], ind) => {
                                    return (
                                        <>
                                            {notes.length > 0 ? (
                                                <div className="flex flex-col gap-2" key={ind}>
                                                    <h2
                                                        className="text-headingMd text-gray-700 font-semibold"
                                                        key={noteType}
                                                    >
                                                        {noteType}
                                                    </h2>
                                                    <div className="flex flex-row gap-2 flex-wrap">
                                                        {notes.map((note, ind) => (
                                                            <a
                                                                className="flex flex-col gap-2 w-full py-4 px-4 bg-white border-1 border-gray-200 drop-shadow-sm group hover:cursor-pointer"
                                                                key={ind}
                                                                href={note.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <div
                                                                    href={note.url}
                                                                    className="flex justify-between text-gray-600"
                                                                >
                                                                    <h3 className="text-headingMd">{note.name}</h3>
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth="2"
                                                                        stroke="currentColor"
                                                                        className="size-5 group-hover:text-darkYellow"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <div className="flex flex-row justify-between items-center gap-2">
                                                                    <span className="text-black text-headingSm font-semibold">
                                                                        {note.description}
                                                                    </span>
                                                                </div>
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : null}
                                        </>
                                    );
                                })}
                            </div>
                        )}
                        {dataset.tools && dataset.tools.length > 0 && (
                            <div className="flex flex-col w-full gap-2">
                                <h1 className="text-headingXl text-lightBlue">Tools</h1>
                                {dataset.tools.map((tool, ind) => (
                                    <a
                                        className="flex flex-col gap-2 w-full py-4 px-4 bg-white border-1 border-gray-200 drop-shadow-sm group hover:cursor-pointer"
                                        key={ind}
                                        href={tool.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <div href={tool.url} className="flex justify-between text-gray-600">
                                            <h3 className="text-headingMd">
                                                {tool.name} ({tool.version})
                                            </h3>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                className="size-5 group-hover:text-darkYellow"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex flex-row justify-between items-center gap-2">
                                            <span className="text-black text-headingMd font-semibold">
                                                {tool.description}
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}

                        {dataset.releaseNotes && Object.keys(dataset.releaseNotes).length > 0 && (
                            <div className="flex flex-col w-full gap-2">
                                <h1 className="text-headingXl text-lightBlue">Release Notes</h1>
                                {Object.entries(dataset.releaseNotes).map(([noteType, notes], ind) => {
                                    return (
                                        <div className="flex flex-col gap-2" key={ind}>
                                            <h2 className="text-headingMd text-gray-700 font-semibold" key={noteType}>
                                                {noteType}
                                            </h2>
                                            <div className="flex flex-row gap-2 flex-wrap">
                                                {notes.map((note, ind) => (
                                                    <div
                                                        className="text-bodyMd font-bold text-black py-2 px-4 border-1 border-gray-200 rounded-full bg-white"
                                                        key={ind}
                                                    >
                                                        {note.name}: {note.current}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DatasetObjectDisplay;
