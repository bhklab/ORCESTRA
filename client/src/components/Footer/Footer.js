import React, {useContext} from 'react';
import { NavLink } from 'react-router-dom';
import { PathContext } from '../../hooks/Context';
import styled from 'styled-components';
import {dataTypes} from '../Shared/Enums';

const StyledFooter = styled.div`
    position: relative;
    clear: both;
    bottom: 0%;
    width: 100%;
    background-color: rgb(255,255,255, 0.7);
    height: 150px;
    font-size: calc(0.7em + 0.2vw);
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: flex-;

    .footerContainer {
        width: 95%;
        margin-left: auto;
        margin-right: auto;
        display:flex;
        font-size: 12px;
    }
    
    .footerLinks {
        width:200px;
        a, div {
            display: block;
            margin-bottom: 5px;
            color: #3D405A;
        }
        a:hover {
            color: #555975;
        }
    }

    .footerMenu {
        flex-grow: 1;
        text-align: left;
    }
    
    .footerSupport{
        flex-grow: 1;
        text-align: left;
    }
    
    .footerContact {
        flex-grow: 1;
        text-align: left;
    }
    
    .contactInfo{
        font-size: calc(0.7em + 0.2vw);
        line-height: 20px;
        margin-top: -5px;
    }
`

const Footer = () => {

    const path = useContext(PathContext);

    return(
        <StyledFooter>
            <div className='footerContainer'>
                <div className="footerMenu footerLinks">
                    <h3>Menu</h3>
                    <NavLink exact to="/" onClick={() => {path.setDatatype('')}}>Home</NavLink>
                    {
                        path.datatype.length === 0 ? 
                        <React.Fragment>
                            <NavLink exact to={`/${dataTypes.pharmacogenomics}`} onClick={() => {path.setDatatype(dataTypes.pharmacogenomics)}}>Pharmacogenomics Data</NavLink>
                            <NavLink exact to={`/${dataTypes.toxicogenomics}`} onClick={() => {path.setDatatype(dataTypes.toxicogenomics)}}>Toxicogenomics Data</NavLink>
                            <NavLink exact to={`/${dataTypes.xenographic}`} onClick={() => {path.setDatatype(dataTypes.xenographic)}}>Xenographic Pharmacogenomics Data</NavLink>
                            <div>Clinical Genomics Data (Coming soon)</div>
                            <div>Radiogenomics Data (Coming soon)</div>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            {/* <NavLink exact to={`/${path.datatype}/canonical`} >Canonical PSets</NavLink> */}
                            <NavLink exact to={`/${path.datatype}/search`} >Search and Request</NavLink>
                            {/* <NavLink exact to={`/${path.datatype}/status`} >Request Status</NavLink> */}
                            {/* <NavLink exact to={`/${path.datatype}/stats`} >Statistics</NavLink> */}
                        </React.Fragment>
                    }
                </div>
                <div className="footerSupport footerLinks">
                    <h3>Support</h3>
                    {
                        path.datatype.length > 0 && 
                        <React.Fragment>
                            <NavLink exact to={`/${path.datatype}/documentation/overview`} >Documentation</NavLink>
                            <NavLink exact to={`/${path.datatype}/documentation/datacontribution`} >Contributing your data</NavLink>
                        </React.Fragment>
                    }
                    <a href="https://github.com/bhklab">GitHub</a>
                    <a href="https://bhklab.ca/">BHKLab</a>
                    <div>support@orcestra.ca</div>
                </div>
                <div className="footerContact">
                    <h3>BHKLab</h3>
                    <div className='contactInfo'>
                        The MaRS center
                        <br />
                        101 College St, Toronto ON
                        {' '}
                        <br />
                        TMDT RM 11-310
                    </div>
                </div>
            </div>
        </StyledFooter>
    );
} 

export default Footer;