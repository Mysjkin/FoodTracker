import React, {Component} from "react";
import styled from "styled-components";
import BasicCard from "./basicCard";

const MainCards = styled.div`
margin: 20px;
column-gap: 10px;
`;

class BasicMain extends Component {
    render(){
        return (
            <MainCards>
                <BasicCard/>
            </MainCards>
        )
    }
}

export default BasicMain;