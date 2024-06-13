import styled from 'styled-components';

const StyledPage = styled.div`
    font-family: "Roboto", "Segoe UI", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    min-height: 100vh;
    padding-bottom: 200px;
    color: #3D405A;
	display: flex;
    flex-direction: column;
    align-items: center;
    .page-title {
        font-size: 25px;
        font-weight: bold;
        margin-bottom: 15px;
    }
    .table-container {
        max-height: 600px;
        flex-direction: column;
        width: 50%;
        margin-top: 10px;
        display: flex;
    }
    @media only screen and (max-width: 1000px) {
        .page-title {
            font-size: 20px
        }
        .table-container {
            font-size: 20px;
            text-align: center;
            max-width: 100%;
            width: 100%;
            margin-top: -10px;
        }
`;

export default StyledPage;