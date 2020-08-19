import React from 'react';
import styled from "styled-components";

import {Link} from "react-router-dom";

const NavList = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

const NavItem = styled.div`
    justify-content: center;
    align-items: center;
`;

const NavDropdown = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

function NavbarList(props) {
    return (
        <NavList style={props.style}>
            { props.children }
        </NavList>
    )
}

function NavbarItem(props) {
    return (
        <NavItem>
            <Link style={props.linkstyle} to={props.linkTo}>
                { props.icon } 
                { props.contentText }
            </Link>
        </NavItem>
    )
}

function NavbarDropdown(props) {
    return (
        <NavDropdown style={props.style}>
            {props.icon}
        </NavDropdown>
    )
}

export {
    NavbarList,
    NavbarItem,
    NavbarDropdown
}