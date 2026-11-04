import React, { useState } from 'react';

const Contact = () => {
    return (
        <div className="pt-32 pb-24 max-w-[1300px] mx-auto px-6 flex flex-col gap-12 text-darkBlue">
            <div className="flex flex-col gap-4 pb-8 border-b border-gray-200">
                {/* <div className="flex items-center gap-2">
                    <span className="bg-lightYellow text-darkBlue text-headingXs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        BHK Lab · UHN
                    </span>
                    <span className="text-bodySm font-semibold text-gray-500">
                        Allan Slaight Medical Innovation Labs{' '}
                    </span>
                </div> */}
                <h1 className="text-heading4Xl md:text-heading2Xl font-bold text-darkBlue">Get in Touch</h1>
                <p className="text-bodyLg text-gray-600 max-w-3xl leading-relaxed">
                    Have questions about ORCESTRA datasets, pipeline execution, data contributions, or collaborative
                    research? Reach out to the BHK Lab team or submit an issue on our open-source repositories.
                </p>
            </div>

            <div className="flex flex-row gap-6">
                <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-shadow duration-300 max-w-[400px]">
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

                <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-shadow duration-300 max-w-[400px]">
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
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-8 items-stretch">
                <div className="flex flex-col gap-6">
                    <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-5 h-full">
                        <div className="flex items-center gap-2">
                            <h2 className="text-headingXl font-bold text-darkBlue">About The Team</h2>
                        </div>
                        <p className="text-bodyMd text-gray-700 leading-relaxed">
                            The <strong>BHK Lab</strong> is composed of a multidisciplinary oncology team of
                            bioinformaticians, computational biologists, and software engineers analyzing
                            high-dimensional molecular, pharmacological, and radiological data.
                        </p>
                        <p className="text-bodyMd text-gray-700 leading-relaxed">
                            We build open computational infrastructure including <strong>ORCESTRA</strong>,{' '}
                            <strong>AnnotationDB</strong>, and standardized Bioconductor analysis packages (
                            <em>PharmacoGx</em>, <em>RadioGx</em>, <em>ToxicoGx</em>, <em>Xeva</em>) to make biomedical
                            research findable, accessible, interoperable, and reusable (FAIR).
                        </p>

                        <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                            <h4 className="text-headingSm font-bold text-darkBlue uppercase tracking-wider">
                                Affiliations
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
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-5 h-full">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                                <h2 className="text-headingXl font-bold text-darkBlue">Location</h2>
                            </div>
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
