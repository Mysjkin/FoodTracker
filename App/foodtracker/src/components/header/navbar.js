import React, {useState, useEffect, useRef} from 'react';
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
    transition: filter 300ms;
    :hover {
        filter: brightness(1.2);
    }
`;

const NavDropdown = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

const DropDownMenu = styled.div`
    position: absolute;
    z-index: 100;
    top: 65px;
    width: 200px;
    transform: translateX(10%);
    background-color: #484a4d;
    border: 1px solid #474a4d;
    border-radius: 8px;
    padding: 1rem;
    overflow: hidden;
`;

const MenuItem = styled.div`
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    transition: background 300ms;
    padding: 0.5rem;
    :hover {
        background-color: #525357;
    }
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

function DropdownMenuItem(props) {
    return (
        <MenuItem>
            <Link style={props.linkstyle} to={props.linkTo}>
                { props.icon } 
                { props.contentText }
            </Link>
        </MenuItem>
    )
}

function NavbarDropdown(props) {

    const [open, setOpen] = useState(false);

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(e) {
                if (ref.current && !ref.current.contains(e.target)) {
                    setOpen(false);
                }
            }
        
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            }
        }, [ref]);
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    return (
        <NavDropdown ref={wrapperRef} style={props.style}>
            <div onClick={() => setOpen(!open)}>
                {props.icon}
            </div>
            {open && 
                <DropDownMenu>
                    {React.Children.map(props.children, (child, i) => {
                        return <div onClick={() => setOpen(false)}>{React.cloneElement(child)}</div>
                    })}
                </DropDownMenu>
            }
        </NavDropdown>
    )
}

export {
    NavbarList,
    NavbarItem,
    NavbarDropdown,
    DropdownMenuItem
}