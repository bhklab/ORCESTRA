import styled from 'styled-components';

export const Wrapper = styled.div`
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    max-width: 1700px;
    padding-top: 50px;
    color:#3D405A;
    min-height: 100vh;
    padding-bottom: 170px;
`

export const HeaderGroup = styled.div`
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
`

export const DatasetHeaderGroup = styled.div`
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

export const Button = styled.a`
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
    margin-top: 30px;

    :hover {
        background-color: #555975;
        color: rgb(241, 144, 33);
    }
`

export const Row = styled.div`
    margin-top: 60px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`

export const Column = styled.div`
    flex: 28%;
    max-width: 28%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media only screen and (max-width: 1000px) {
        flex: 50%;
        max-width: 100%;
    }
`

export const Item = styled.div`
    background-color:rgb(255, 255, 255,0.5);
    margin: 0px 10px 10px 10px;
    padding: 10px 30px 30px 30px;
    border-radius: 10px;
    width: 95%;
    min-height:200px;
    min-width: 300px;

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
        width: 95%;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        align-items: center;
    }

    .link {
        margin-top: 50px;
    }
`

export const Number = styled.span`
    font-size: 70px;
    font-weight: bold;
    font-family: Arial, Helvetica, sans-serif;
    width: 35%;
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

