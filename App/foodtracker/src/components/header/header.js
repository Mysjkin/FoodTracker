import React, {Component} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";

const HeaderContainer = styled.div`
grid-area: header;
display: flex;
`;

const Brand = styled.div`
padding: 2rem 0;
background-color: #20232a;
width: 100%;
height: 100%;
text-align: center;
`;

const brandLinkStyle = {
fontSize: '2rem',
color: '#fff',
cursor:'pointer'
};

class Header extends Component {
    render(){
        return (
            <HeaderContainer>
                <Brand>
                    <Link to="/" style={brandLinkStyle}> <h3>Food Tracker</h3></Link>
                </Brand>
            </HeaderContainer>
        )
    }
}

export default Header;