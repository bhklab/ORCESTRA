import { Button } from 'primereact/button';

const DownloadAllButton = props => {
    const { className, downloadLinks, label } = props;

    const download = async event => {
        event.preventDefault();
        downloadLinks.forEach(link => {
            const anchor = document.createElement('a');
            anchor.setAttribute('download', null);
            anchor.style.display = 'none';
            anchor.setAttribute('href', link);
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        });
    };

    return <Button className={className} label={label} icon="pi pi-download" onClick={download} />;
};

export default DownloadAllButton;
