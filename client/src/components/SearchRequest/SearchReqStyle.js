import styled from 'styled-components';

export const SearchReqWrapper = styled.div`
    display: flex;
    width: 50%;
    margin-bottom: 10px
`;

export const Filter = styled.div`
    max-width: 400px;
    max-height: 620px;
    color: #3D405A;
    background-color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    padding-top: 5px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    border-radius: 10px;
    .form-field {
        margin-bottom: 20px;
    }
`;

export const MainPanel = styled.div`
    width: 100%;
    margin-left: 20px;
`;

export const SearchReqPanel = styled.div`
    display: flex;
    justify-content: space-between;
    max-width: 100%;
    border-radius: 10px;
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 30px;
    color: #3D405A;
    background-color: rgba(255, 255, 255, 0.8);
`;