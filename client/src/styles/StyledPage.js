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
`;

export default StyledPage;