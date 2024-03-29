import styled from "styled-components";
import { Accordion } from "primereact/accordion";

export const TabContainer = styled.div`
  width: 100%;
`;

export const TabHeader = styled.h1`
  margin-left: 20px;
`;

export const TabContent = styled.div`
  margin-left: 40px;
  margin-right: 20px;
  .indent {
    margin-left: 20px;
  }
`;

export const TabContentSection = styled.div`
  margin-top: 30px;
  margin-bottom: 20px;
  h3 {
    font-size: 16px;
  }
  .pubList {
    margin-bottom: 10px;
  }
  .subContent {
    margin-left: 20px;
    font-size: 12px;
    max-width: 90%;
    .subContentHeader {
      color: #3d405a;
      font-weight: bold;
      font-size: 14px;
    }
    td {
      padding: 10px;
    }
    .code {
      font-family: courier new;
      font-weight: bold;
    }
  }
  .horizontal {
    display: flex;
    align-items: center;
    margin-left: 20px;
    .label {
      margin-right: 5px;
    }
  }
`;

export const StyledAccordion = styled(Accordion)`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 30px;
  h4 {
    margin-left: 20px;
    font-size: 14px;
    max-width: 90%;
  }
`;
