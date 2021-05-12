import React, { useRef, useEffect } from 'react';
import { Messages } from 'primereact/messages';
import styled from 'styled-components';

const StyledMessages = styled(Messages)`
    .p-message {
        font-size: 12px;
        .p-message-icon {
            font-size: 18px;
            font-weight: bold;
        }
        .p-message-summary {
            font-size: 14px;
            font-weight: bold;
            padding-right: 10px;
        }
    }
`;

const CustomMessages = (props) => {
    const { trigger, message } = props;
    const messages = useRef(null);

    useEffect(() => {
        if(trigger){
            messages.current.show([
                { 
                    severity: message.severity, 
                    summary: message.summary, 
                    detail: message.detail, 
                    sticky: message.sticky 
                }
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger]);

    return(
        <StyledMessages ref={messages} />
    );
}

export default CustomMessages;