import styled from 'styled-components';

const Wrapper = styled.div`
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    max-width: 1700px;
    color:#3D405A;
    min-height: 100vh;
    padding-bottom: 200px;
`

const HeaderGroup = styled.div`
    display: flex;
    flex-direction: column;
    h1 {
        margin: auto;
        text-align: left;
        font-size: 100px;
        color: #3D405A;
    }
    h2 {
        margin: auto;
        text-align: left;
        font-weight: bold;
        color: #3D405A;
    }

    @media only screen and (max-width: 700px) {
        h1 {
            font-size: 60px
        }
        h2 {
            font-size: 24px;
            text-align: center;
        }
    }
`

const DatasetHeaderGroup = styled.div`
    display: flex;
    flex-direction: column;
    h1 {
        margin: auto;
        text-align: left;
        font-size: 50px;
        color: #3D405A;
    }
    h2 {
        margin: auto;
        text-align:left;
        font-weight: bold;
        color: #3D405A;
    }
`

const Button = styled.a`
    background-color: #3D405A;
    border-radius: 5px;
    border: none;
    padding: 10px 10px;
    color: white;
    text-align: center;
    text-decoration: none;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 5px;

    :hover {
        background-color: #555975;
        color: rgb(241, 144, 33);
    }
`

const Row = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
	margin-top: 40px;
    gap: 10px;
    width: 100%;
	padding: 0 100px;
`;



const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;

    @media only screen and (max-width: 1000px) {
        max-width: 100%;
    }
`

const Item = styled.div`
    background-color:rgb(255, 255, 255,0.5);
    padding: 20px;
    border-radius: 10px;
    width: 100%;

    .content {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        p {
            line-height: 1.5;
        }
    }

    .line {
        margin-bottom: 10px;
        font-size: 16px;
        height: 20%;
        display: flex;
        align-items: center;
        span {
            margin-left: 5px;
        }
    }

    .link {
        margin-top: 25px;
    }
    .header{
        margin-top: 0px;
    }
`

const Number = styled.span`
    font-size: 70px;
    font-weight: bold;
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
    button {
        font-size: 75px;
        font-weight: bold;
        font-family: Arial, Helvetica, sans-serif;
        color: #3D405A;
        border: none;
        background: none;
        outline: none;
        cursor: pointer;
    }
    button:hover {
        color: #555975;
    }
`
export {
    Wrapper,
    HeaderGroup,
    DatasetHeaderGroup,
    Button,
    Row,
    Column,
    Item,
    Number,
}
