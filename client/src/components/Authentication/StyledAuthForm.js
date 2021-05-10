import styled from 'styled-components'; 

const StyledLoginForm = styled.div`
    width: 400px;
    margin-left: auto;
    margin-right: auto;
    background-color:rgb(255, 255, 255,0.5);
    border-radius: 10px;
    padding-top: 10px;
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 30px;
    margin-top: 200px;

    label {
        font-size: 12px;
    }

    .message {
        color: red;
        font-size: 12px;
    }

    .emailInput{
        display: flex;
        align-items: center;
        .p-inputtext {
            font-size: 12px;
            margin-right: 10px;
            width: 80%;
        }
        .p-button.p-button-text-icon-left .p-button-text {
            padding: 0.3em 0.5em 0.3em 2.0em;
        }
    }

    .pwdInput{
        width: 80%;
        margin-bottom: 20px;
    }

    .forgotPasswordBtn{
        background: none;
        outline: none;
        border: none;
        cursor: pointer;
        color: #3D405A;
        text-decoration: underline;
    }
`;

export default StyledLoginForm;