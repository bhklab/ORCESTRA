import React from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.css';

const Footer = (props) => {
    return(
        <div className='appFooter'>
            <div className='footerContainer'>
                <div className="footerMenu footerLinks">
                    <h3>Menu</h3>
                    <NavLink exact to="/PSetSearch" >Search and Request</NavLink>
                    <NavLink exact to="/Dashboard" >Request Status</NavLink>
                    <NavLink exact to="/Stats" >Statistics</NavLink>
                </div>
                <div className="footerSupport footerLinks">
                    <h3>Support</h3>
                    <NavLink exact to="/Documentation" >Documentation</NavLink>
                    <NavLink exact to="/Tutorial" >Contributing your data</NavLink>
                    <a href="https://github.com/bhklab">GitHub</a>
                    <a href="https://bhklab.ca/">BHKLab</a>
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
        </ div>
    );
} 

export default Footer;