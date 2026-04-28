import { useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const QualityControlViewer = () => {
    const [html, setHtml] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const qcUrl = params.get('url');

        const loadQc = async () => {
            try {
                const res = await fetch(`/api/view/single-data-object/qc?url=${encodeURIComponent(qcUrl)}`);

                if (!res.ok) {
                    throw new Error(`Failed to load QC file: ${res.status}`);
                }

                const text = await res.text();
                setHtml(text);
            } catch (err) {
                setError(err.message);
            }
        };
        loadQc();
    }, []);

    if (error) return <div>{error}</div>;
    if (!html)
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <ProgressSpinner className="w-56 h-56" />
            </div>
        );

    return (
        <iframe
            title="QC Viewer"
            srcDoc={html}
            style={{ width: '100%', height: '100vh', border: 'none', paddingTop: '96px' }}
        />
    );
};

export default QualityControlViewer;
