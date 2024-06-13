import styled from 'styled-components';

const StyledLoginForm = styled.div`
    width: 400px;
    margin-left: auto;
    margin-right: auto;
    background-color: rgb(255, 255, 255, 0.5);
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

    .emailInput {
        display: flex;
        align-items: center;
        justify-content: center;
        label {
            margin-right: 10px;
        }
        .p-inputtext {
            font-size: 12px;
            margin-right: 10px;
            width: 80%;
        }
    }

    .pwdInput {
        width: 80%;
        margin-bottom: 20px;
    }

    .forgotPasswordBtn {
        background: none;
        outline: none;
        border: none;
        cursor: pointer;
        color: #3d405a;
        text-decoration: underline;

        &:hover {
            background-color: transparent;
            color: rgb(241, 144, 33);
        }
    }
`;

export default StyledLoginForm;
