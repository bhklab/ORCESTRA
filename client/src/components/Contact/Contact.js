import React, { useState } from 'react';

const Contact = () => {
    const [copiedEmail, setCopiedEmail] = useState(null);

    const handleCopy = (key, text) => {
        navigator.clipboard.writeText(text);
        setCopiedEmail(key);
        setTimeout(() => setCopiedEmail(null), 2000);
    };

    return (
        <div className="pt-32 pb-24 max-w-[1300px] mx-auto px-6 flex flex-col gap-12 text-darkBlue">
            <div className="flex flex-col gap-4 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <span className="bg-lightYellow text-darkBlue text-headingXs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        BHK Lab · UHN
                    </span>
                    <span className="text-bodySm font-semibold text-gray-500">
                        Allan Slaight Medical Innovation Labs{' '}
                    </span>
                </div>
                <h1 className="text-heading4Xl md:text-heading2Xl font-bold text-darkBlue">Get in Touch</h1>
                <p className="text-bodyLg text-gray-600 max-w-3xl leading-relaxed">
                    Have questions about ORCESTRA datasets, pipeline execution, data contributions, or collaborative
                    research? Reach out to the BHK Lab team or submit an issue on our open-source repositories.
                </p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-1 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col gap-3">
                        <div className="w-12 h-12 rounded-xl bg-darkBlue/10 text-lightBlue flex items-center justify-center">
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
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-headingLg font-bold text-darkBlue">ORCESTRA Support</h3>
                        <p className="text-bodySm text-gray-600">
                            For technical questions, pipeline troubleshooting, account support, or dataset inquiries.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                        <span className="text-bodySm font-mono font-bold text-lightBlue truncate">
                            support@orcestra.ca
                        </span>
                        <div className="flex items-center gap-2">
                            <a
                                href="mailto:support@orcestra.ca"
                                className="flex-1 text-center py-2 px-3 rounded-lg bg-darkBlue text-white text-bodySm font-semibold hover:bg-lightBlue transition-colors"
                            >
                                Email Support
                            </a>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col gap-3">
                        <div className="w-12 h-12 rounded-xl bg-darkYellow/20 text-darkBlue flex items-center justify-center">
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
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-headingLg font-bold text-darkBlue">Dr. Benjamin Haibe-Kains</h3>
                        <p className="text-bodySm text-gray-600">
                            Principal Investigator · Senior Scientist at Allan Slaight Medical Innovation Labs
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                        <span className="text-bodySm font-mono font-bold text-lightBlue truncate">
                            https://bhklab.ca
                        </span>
                        <div className="flex items-center gap-2">
                            <a
                                href="https://bhklab.ca"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-center py-2 px-3 rounded-lg bg-darkBlue text-white text-bodySm font-semibold hover:bg-lightBlue transition-colors"
                            >
                                <span>Lab Website</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-200/60 text-darkBlue flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-headingLg font-bold text-darkBlue">Open Source Repositories</h3>
                        <p className="text-bodySm text-gray-600">
                            Report bugs, submit feature requests, or contribute pipelines and packages on GitHub.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                        <span className="text-bodySm font-mono font-bold text-lightBlue truncate">
                            github.com/bhklab
                        </span>
                        <div className="flex items-center gap-2">
                            <a
                                href="https://github.com/bhklab/ORCESTRA/issues"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-center py-2 px-3 rounded-lg bg-darkBlue text-white text-bodySm font-semibold hover:bg-lightBlue transition-colors"
                            >
                                Submit an Issue
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-8 items-stretch">
                <div className="flex flex-col gap-6">
                    <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-5 h-full">
                        <div className="flex items-center gap-2">
                            <h2 className="text-headingXl font-bold text-darkBlue">
                                Computational Biology & Pharmacogenomics
                            </h2>
                        </div>
                        <p className="text-bodyMd text-gray-700 leading-relaxed">
                            The <strong>BHK Lab</strong> is composed of a multidisciplinary team of bioinformaticians,
                            computational biologists, and software engineers analyzing high-dimensional molecular,
                            pharmacological, and radiological data to develop predictive models for personalized
                            oncology.
                        </p>
                        <p className="text-bodyMd text-gray-700 leading-relaxed">
                            We build open computational infrastructure including <strong>ORCESTRA</strong>,{' '}
                            <strong>AnnotationDB</strong>, and standardized Bioconductor analysis packages (
                            <em>PharmacoGx</em>, <em>RadioGx</em>, <em>ToxicoGx</em>, <em>Xeva</em>) to make biomedical
                            research findable, accessible, interoperable, and reusable (FAIR).
                        </p>

                        <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                            <h4 className="text-headingSm font-bold text-darkBlue uppercase tracking-wider">
                                Institutional Affiliations
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-bodySm text-gray-600">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
                                    <span className="font-bold text-darkBlue">
                                        Allan Slaight Medical Innovation Labs
                                    </span>
                                    <span>University Health Network (UHN)</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
                                    <span className="font-bold text-darkBlue">University of Toronto</span>
                                    <span>Department of Medical Biophysics</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
                                    <span className="font-bold text-darkBlue">OICR</span>
                                    <span>Ontario Institute for Cancer Research</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
                                    <span className="font-bold text-darkBlue">Vector Institute</span>
                                    <span>AI for Health Research</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-5 h-full">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                                <h2 className="text-headingXl font-bold text-darkBlue">MaRS Discovery District</h2>
                            </div>
                            <a
                                href="https://maps.google.com/?q=101+College+St,+Toronto,+ON+M5G+1L7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-bodySm font-semibold text-blue-600 hover:underline flex items-center gap-1"
                            >
                                <span>Get Directions</span>
                                <svg
                                    className="w-3.5 h-3.5"
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
                            </a>
                        </div>

                        <div className="flex flex-col gap-1 text-bodyMd text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <span className="font-bold text-darkBlue">Toronto Medical Discovery Tower (TMDT)</span>
                            <span>The MaRS Centre, Room 11-310</span>
                            <span>101 College Street, Toronto, ON, M5G 1L7, Canada</span>
                        </div>

                        <div className="w-full flex-1 min-h-[300px] rounded-xl overflow-hidden border border-gray-200 shadow-inner relative">
                            <iframe
                                title="BHK Lab, 101 College St. Toronto, ON"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.4364889480303!2d-79.39081378450204!3d43.65989117912103!2m3!1f0!2f0!3f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34b632b77689%3A0x901c210dff19e5a4!2s101+College+St%2C+Toronto%2C+ON+M5G+1L7!5e0!3m2!1sen!2sca!4v1502307889999"
                                width="100%"
                                height="100%"
                                style={{ minHeight: '300px', border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
