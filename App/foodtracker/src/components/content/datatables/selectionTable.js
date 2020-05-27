import React, {Component} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import './selectionTable.css';
import {thresholds} from './thresholdValues.js';

const TableContainer = styled.div`
text-align: center;
`;

const RowBox = styled.div`
width: 100%;
padding-top: 16px;
padding-bottom: 8px;
font-size: 12px;
border-bottom: 1px solid #eeeeee;
overflow: auto;
`;

const linkStyle = {
    "display":"inline-block",
    "padding":"0.6em 2em",
    "margin":"0.5em 0.3em 0.3em 0.2em",
    "border-radius":"2em",
    "box-sizing": "border-box",
    "text-decoration":"none",
    "font-size": "12px",
    "font-family":"'Roboto',sans-serif",
    "font-weight":"300",
    "color":"#FFFFFF",
    "background-color":"#82bef6",
    "text-align":"center",
    "transition": "all 0.2s",
    "float": "center",
}

const selectedFoodStyle = {
    "color": "#20232a",
    "fontSize": "16px",
    "fontWeight": "500"
}

const elSpan = styled.span``;

const columnHeader = {
    "fontSize": "16px",
    "fontWeight": "bold",
    "textAlign": "left",
    "margin-bottom": "10px",
    "margin-left":"5px"
}

class SelectionTable extends Component {

    constructor(props){
        super(props);
        this.state = {
            amount: 0,
            error: 0
            
        }
    }

    handleAmountChange = (e) =>{
        var parsed = parseInt(e.target.value);
        if (parsed){
            this.setState({
                amount: parsed
            })
        }
    }

    addFood = (food) => {
        var addedFood = {"amount": this.state.amount, "data": food};
        this.props.handleFoodAddition(addedFood);
    }

    render(){
        const {food, handleFoodAddition} = this.props;
        if (Object.keys(food).length === 0 && food.constructor === Object)
            return <h1>Loading...</h1>
        
        var tables = [];
        Object.keys(food).forEach(key => {
            if (key === 'food' || key === 'id' || key === 'nameDk') { return; }

            if (food[key] === null) { return; }

            var tablebody = [];
            food[key].forEach(category => {
                var unit = category['unit'];
                if (unit === undefined) {
                    var lastkey = Object.keys(category)[Object.keys(category).length - 1];
                    if (lastkey === "unitMgPerGNitrogen") unit = "mg pr. g nitrogen";
                    else if (lastkey === "percentOfTotal") unit = "percent of total";
                    else unit = "unknown";
                }
                var rowStyle = {};
                if (thresholds[key] !== undefined) {
                    var betterThanMedian = parseFloat(thresholds[key][category['name']].val) <= parseFloat(category['value']);
                    if (betterThanMedian && thresholds[key][category['name']].i === undefined){
                        rowStyle = {"background": "#3D9970"};
                    }
                    else if (betterThanMedian && thresholds[key][category['name']].i === -1){
                        rowStyle = {"background": "#FF4136"};
                    }
                }
            tablebody.push(<tr key={category['id']} style={rowStyle}><td>{category['name']}</td><td>{category['value']}</td><td>{unit}</td></tr>)
            });
            var table = <table>
                            <thead>
                                <tr><th>{key.toUpperCase()}</th><th>Value</th><th>Unit</th></tr>
                            </thead>
                            <tbody>
                                {tablebody}
                            </tbody>
                        </table>
            tables.push(table);
        });

        return (
            <TableContainer>
                <RowBox>
                    <div style={selectedFoodStyle}>{food['food']['nameDk']}</div>
                    <form><input 
                            type="text"
                            amount={this.state.amount} 
                            onChange={this.handleAmountChange} 
                            placeholder="amount"></input></form>
                    <Link className="foodAddLink" to={"/"} style={linkStyle} value={food} onClick={() => this.addFood(food)}>Add</Link>
                </RowBox>
                <div style={columnHeader}>Næringsindhold (100g)</div>
                {tables}
            </TableContainer>
        )
    }
}

export default SelectionTable;