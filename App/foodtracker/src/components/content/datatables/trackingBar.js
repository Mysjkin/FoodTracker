import React, {Component} from "react";
import styled from "styled-components";
import "./trackingbarstyle.css";

const TrackingBox = styled.div`
box-sizing: border-box;
width: 100%;
margin: 30px 0;
text-align: center;
`;

const Bar = styled.div`
background: #20232a;
padding: 2px;
box-sizing: border-box;
border-radius: 40px;
`;

const BarLevel = styled.div`
background: ${props => props.color};
height: 10px;
border-radius: 40px;
width: ${props => props.progress}%;
`;

class TrackingBar extends Component {

    constructor(props){
        super(props);
    }

    render(){
        const {label, value, progress, indicator} = this.props;
        var reached = progress;
        var color = "#3D9970";
        if (indicator !== undefined){
            color = "#FF851B";
        }
        if (reached > 100) {
            reached = 100;
            if (indicator !== undefined){
                color = "#FF4136";
            }
        }
    return <TrackingBox>
                <p>{label}</p> 
                <p>{value}</p>
                <p>{progress}%</p>
                <Bar>
                    <BarLevel progress={reached} color={color}/>
                </Bar>
            </TrackingBox>
    }
}

export default TrackingBar;