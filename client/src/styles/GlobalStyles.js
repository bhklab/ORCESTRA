import { createGlobalStyle } from 'styled-components';
import img from './img/bg3.png'

const GlobalStyles = createGlobalStyle`
    html, body{
        height: 100%;
        margin: 0;
    }
    #root {
        margin-top: 0;
        margin-left: 0;
        margin-right: 0;
        padding-top: 80px;
        font-family: "Raleway", "Segoe UI", "Roboto", "Oxygen",
            "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
            sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale; 
        background: linear-gradient(
            to right top,
            rgba(255, 255, 255, 0.5),
            rgba(255, 255, 255, 0.5)
            ),url(${img});
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }
    code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
    }
    h1, h2, h3, h4, h5{
        color: #3D405A;
    }
`;

export default GlobalStyles;