import React from 'react';
import { Button } from 'primereact/button';
import StyledPage from '../../styles/StyledPage';

const Test = () => {
    const download = async (event) => {
        event.preventDefault();

        const anchor = document.createElement('a');
        anchor.setAttribute('download', null);
        anchor.style.display = 'none';
        anchor.setAttribute('href', '');
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    return(
        <StyledPage>
            <Button 
                label='download' 
                icon='pi pi-download'
                disabled={false}
                onClick={download}
            />
        </StyledPage>
    );
}

export default Test;
