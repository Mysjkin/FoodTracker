import React, {Component} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import TrackingBar from "./trackingBar";
import Tracker from "./tracker";

const TableContainer = styled.div`
    text-align: center;
`;

const TrackingBarContainer = styled.div`

`;

const RowBox = styled.div`
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 12px;
    border-bottom: 1px solid #eeeeee;
`;

const linkStyle = {
    "color": "#20232a",
    "fontSize": "16px",
    "fontWeight": "500"
}

const removeBntStyle = {
    "lineHeight": "12px",
    "width": "18px",
    "textAlign": "center",
    "background": "white",
    "textDecoration":"none",
    "border": "none",
    "float": "right"
}

class AddedTable extends Component {

    constructor(props){
        super(props);
        this.tracker = new Tracker();
        this.tracker.updateTracker(this.props.foods);
    }

    deleteFoodFromAddedTable(index){
        this.tracker.removeFromTracker(index, this.props.foods);
        this.props.handleFoodRemoval(index);
    }

    render(){
        var els = [];
        this.props.foods.forEach((el, index) => {
            els.push(
            /* Note, key is the index which is bad practice. */
            <RowBox key={index}>
                <button style={removeBntStyle} value={index} onClick={() => this.deleteFoodFromAddedTable(index)}>
                    <i className="fas fa-times" />
                </button>
                <Link to={"/foods/"+el.data.food['id']} style={linkStyle} value={el.data}>
                    {el.data.food['nameDk']}, {el.amount}g
                </Link>
            </RowBox>);
        });

        var trackingInfo = this.tracker.getTrackingInfo();
        var trackingBars = {
            "macros": [],
            "aminoAcids": [],
            "vitamins": [],
            "minerals": [],
            "fattyAcids": []
        };
        Object.keys(trackingInfo).forEach(key => {
            Object.keys(trackingInfo[key]).forEach(label => {
                var category = trackingInfo[key][label];
                var tb = <TrackingBar key={label+key}
                                      label={label} 
                                      value={Math.round(category.value * 10) / 10} 
                                      progress={Math.round((category.value / category.goal * 100) * 10) / 10}
                                      indicator ={category.i}/>
                
                if (trackingBars[key] !== undefined) trackingBars[key].push(tb);
            });
        });

        return (
            <TableContainer>
                {els}
                <TrackingBarContainer>
                    <h2 style={{marginTop: "20px"}}>Makronæringsstoffer</h2>
                    {trackingBars["macros"]}
                    <h2>Vitaminer</h2>
                    {trackingBars["vitamins"]}
                    <h2>Mineraler</h2>
                    {trackingBars["minerals"]}
                </TrackingBarContainer>
            </TableContainer>
        )
    }
}

export default AddedTable;