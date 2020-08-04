import React, {Component} from "react";
import styled from "styled-components";

const Card = styled.div`
display: flex;
flex-direction: column;
align-items: center;
width: 100%;
background-color: #82bef6;
color: #fff;
font-size: 20px;
margin-bottom: 20px;
padding: 24px;
-webkit-column-break-inside: avoid;
box-sizing: border-box;
border-radius: 25px;
`;

const CardText = styled.div`
margin: 20px;
text-align: center;
`;

const cardTextParagrafStyle = {
    marginTop: '10px'
};

const foodIconStyle = {
    filter: 'invert(1)'
}

class BasicCard extends Component {
    render(){
        return (
            <Card>
                <CardText>
                    <img alt="foods" src="food.svg" style={foodIconStyle} height="100" width="100"/>
                    <h4>Madanalyse</h4>
                    <h6 style={cardTextParagrafStyle}>Du har endnu ikke tilføjet nogen madvare.</h6>
                </CardText>
            </Card>
        )
    }
}

export default BasicCard;