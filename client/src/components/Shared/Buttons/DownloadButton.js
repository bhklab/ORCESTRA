import React from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';

const DownloadButton = props => {
    const { className, datasetType, doi, downloadLink, mode, disabled, label, tooltip } = props;

    const download = async event => {
        event.preventDefault();

        const anchor = document.createElement('a');
        anchor.setAttribute('download', null);
        anchor.style.display = 'none';
        anchor.setAttribute('href', downloadLink);
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        if (mode === 'dataset') {
            await axios.post('/api/data-object/download', {
                datasetType: datasetType,
                datasetDOI: doi
            });
        }
    };

    return (
        <Button
            className={className}
            label={label}
            icon="pi pi-download"
            disabled={disabled}
            onClick={download}
            tooltip={tooltip}
        />
    );
};

export default DownloadButton;
