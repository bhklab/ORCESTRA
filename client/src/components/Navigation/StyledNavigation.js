import styled from 'styled-components';

export const StyledHeader = styled.header`
    top: 0%;
    width:100%;
    background-color:rgb(255,255,255, 0.7);
    height: 60px;
    position: fixed;
    z-index: 999;
`;

export const NavigationWrapper = styled.div`
    position: relative;
    height: 100%;
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
	flex-direction: row;
    justify-content: space-between;

    .left {
        flex: 1;
		display: flex;
        align-items: center;
    }

	.middle{
		display: flex;
        align-items: center;
        justify-content: center;
	}

    .right {
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .loggedIn{
            position: absolute;
            right: 0;
            top: 1px;
            font-size: 11px;
            color: red;
        }
    }

    .logo {

        img {
            max-width: 50px;
        }
    }

    .link {
        margin-right: 20px;
        padding-bottom: 2px;
        color: rgb(61, 64, 90);
        font-size: 12px;
        font-weight: bold;
        transition: .2s ease-out;
        text-decoration: none
    }
    .link:hover {
        color: #555975;
        border-bottom: 2px solid rgb(241, 144, 33);
        transition: .2s ease-out;
    }
    .active-link{
        text-decoration: none;
        color: #555975;
        border-bottom: 2px solid rgb(241, 144, 33);
    }
    
    .home-button {
        color:rgb(61, 64, 90);
        font-weight:bold;
    }
    
    .home-button:hover {
        cursor:pointer;
    }

    @media only screen and (max-width: 900px) {
        .link, .right {
            display: none;
        }
    }

`;

export const PachydermStatus = styled.div`
    display: flex;
    align-items: center;
    font-weight: bold;
    color: ${props => props.isOnline ? '#0ea353' : '#bb2003'};
    .icon {
        font-size: 20px;
    }
    .text {
        font-size: 11px;
    }
`;

export const BurgerNav = styled.div`
    position: fixed;
    right: 0;
    /*react-burger-nav style*/

    /* Position and sizing of burger button */
    .bm-burger-button {
        position: fixed;
        width: 36px;
        height: 30px;
        right: 36px;
        top: 15px;
    }

    /* Color/shape of burger icon bars */
    .bm-burger-bars {
        background: #3D405A;
    }

    /* Color/shape of burger icon bars on hover*/
    .bm-burger-bars-hover {
        background: #555975;
    }

    /* Position and sizing of clickable cross button */
    .bm-cross-button {
        height: 24px;
        width: 24px;
    }

    /* Color/shape of close button cross */
    .bm-cross {
        background: #3D405A;
    }

    /*
    Sidebar wrapper styles
    Note: Beware of modifying this element as it can break the animations - you should not need to touch it in most cases
    */
    .bm-menu-wrap {
        position: fixed;
        height: 100%;
    }

    /* General sidebar styles */
    .bm-menu {
        background: rgba(255, 255, 255, 0.7);
        padding: 30px 10px 20px 10px;
        font-size: 16px;
        nav {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            a {
                margin-bottom: 15px;
                color: rgb(61, 64, 90);
            }
            button {
                text-align: center;
            }
            .status {
                display: flex;
            }
        }
    }

    /* Morph shape necessary with bubble or elastic */
    .bm-morph-shape {
        fill: #373a47;
    }

    /* Wrapper for item list */
    .bm-item-list {
        color: #b8b7ad;
        padding: 0.8em;
    }

    /* Individual item */
    .bm-item {
        margin-bottom: 20px;
        text-align: left;
    }

    /* Styling of overlay */
    .bm-overlay {
        background: rgba(61, 64, 90, 0.5);
    }

    @media only screen and (min-width: 900px) {
        display: none;
        .bm-burger-button {
            display: none;
        }

        .bm-menu {
            display: none;
        }

        .bm-cross {
            display: none;
        }
    }
`;