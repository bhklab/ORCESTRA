import styled from 'styled-components';
import {Accordion} from 'primereact/accordion';

export const TabContainer = styled.div`
    width: 100%;
`

export const TabHeader = styled.h1`
    margin-left: 20px;
`
export const TabContent = styled.div`
    margin-left: 40px;
    margin-right: 20px;
`

export const TabContentSection = styled.div`
    margin-top: 30px;
    margin-bottom: 50px;
    h3 {
        font-size: 16px;
    }
    .subContent {
        margin-left: 20px;
        font-size: 14px;
        max-width: 90%;
    }
`

export const StyledAccordion = styled(Accordion)`
    width: 100%;
    margin-top: 10px;
    margin-bottom: 30px;
    h4 {
        margin-left: 20px;
        font-size: 14px;
        max-width: 90%;
    }
`