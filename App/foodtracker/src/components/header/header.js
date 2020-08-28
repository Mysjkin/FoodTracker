import React from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {NavbarList, NavbarItem, NavbarDropdown, DropdownMenuItem} from "./navbar";
import {useMediaPredicate} from "react-media-hook";
import './header.css';
import {ReactComponent as  DropDownIcon} from '../../icons/dropdown.svg'

const HeaderContainer = styled.div`
    grid-area: header;
    padding: 2rem 0;
    background-color: #20232a;
    width: 100%;
    height: 100%;
    display: grid;
`;

const Brand = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const brandLinkStyle = {
    "fontSize": '2rem',
    "color": '#fff',
    "cursor":'pointer'
};

const navLinkStyle = {
    "height": "25px",
    "width": "60px",
    "borderRadius": "28px",
    "backgroundColor": '#484a4d',
    "cursor": 'pointer',
    "fontSize": '1rem',
    "fontFamily": "'Roboto',sans-serif",
    "fontWeight": "300",
    "display": "flex",
    "justifyContent": "center",
    "alignItems": "center",
    "marginRight": "20px"
};

const responsiveMinWidthPx = 1025; 

function BrandItem(props) {
    let brandGridArea = "area1";
    let fontsize = "1.5rem";
    let brandPlacement = "flex-start";

    if (props.isLargeScreen) {
        brandGridArea = "area2";
        fontsize = "2rem";
        brandPlacement = "center"
    }

    let additionalLinkStyle = {
        fontSize: fontsize,
        paddingLeft: "0.5cm"
    };

    return (
        <Brand style={{"gridArea": brandGridArea, "justifyContent": brandPlacement}}>
            <Link to="/" style={{...brandLinkStyle, ...additionalLinkStyle}}> 
                <h3>Food Tracker</h3>
            </Link>
        </Brand>
    )
}

function getNavBarItems(showProfile, Component, style) {

    let profileItem = <> </>;

    if (showProfile) {
        profileItem =  <Component key="profile" contentText="Profile" icon="" linkTo="/" linkstyle={style}/>;
    }

    return (
        [profileItem,
        <Component key="signin" contentText="Sign In" icon="" linkTo="/signin" linkstyle={style} />,
        <Component key="signup" contentText="Sign Up" icon="" linkTo="/signup" linkstyle={style} />])
}

function Header(props) {
    const isLargeScreen = useMediaPredicate("(min-width: " + responsiveMinWidthPx + "px)");
    const showProfileNavItem = true;

    return (
        <HeaderContainer className="HeaderContainer">
            <BrandItem isLargeScreen={isLargeScreen} />
            {isLargeScreen && 
                <NavbarList style={{"gridArea": "area3", 
                                    "paddingRight": "1cm", 
                                    "justifyContent": "flex-end",
                                    "width": "100%", "height": "100%"}}>
                    {getNavBarItems(showProfileNavItem, NavbarItem, navLinkStyle)}
                </NavbarList>
            }
            {!isLargeScreen &&
                <NavbarDropdown style={{"gridArea": "area3", 
                                        "paddingRight": "1cm", 
                                        "justifyContent": "flex-end",
                                        "width": "100%", "height": "100%"}}
                                icon={<DropDownIcon className="dropdownIcon" />}>
                    {getNavBarItems(showProfileNavItem, DropdownMenuItem)}
                </NavbarDropdown>
            }
        </HeaderContainer>
    )
}

export default Header;