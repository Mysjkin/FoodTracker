import React, {Component} from "react";
import styled from "styled-components";
import {Link, Redirect} from "react-router-dom";
import './selectionTable.css';
import {thresholds} from './thresholdValues.js';
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from '../../extra/LoadingIndicator'
import Axios from "axios";

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
    "padding":"0.5em 2em",
    "margin":"0.3em 0.3em 0.3em 0.5em",
    "border-radius":"2em",
    "box-sizing": "border-box",
    "font-size": "12px",
    "font-family":"'Roboto',sans-serif",
    "font-weight":"300",
    "text-align":"center",
    "transition": "all 0.2s",
    "float": "center",
    "color": "#FFFFFF",
    "background-color": "#82bef6",
    "border": "none"
}

const inputStyle = {
"text-align": "center",
"border-radius": "6px",
"background-color": "#fff",
"border":"1px solid grey",
"padding":"0px"
}

const addBntDisabled = {
    "pointerEvents": "none",
    "color": "white",
    "background-color": "grey"
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
    "marginLeft":"5px"
}

class SelectionTable extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedFood: {},
            fetchedId: -1,
            amount: 0,
            error: 0,
            addBntState: addBntDisabled,
            redirectState: false
        }
    }

    handleAmountChange = (e) =>{
        var parsed = parseInt(e.target.value);
        var newAddBntState = addBntDisabled;
        if (parsed){
            if (parsed > 0) newAddBntState = {};
            this.setState({
                amount: parsed,
                addBntState: newAddBntState
            });
        }
        else {
            this.setState({
                addBntState: newAddBntState
            });
        }
    }

    addFood = () => {
        if (Number(this.state.amount) && this.state.amount > 0) {
            var addedFood = {"amount": this.state.amount, "data": this.state.selectedFood};
            this.props.handleFoodAddition(addedFood);
            this.setState({
                redirectState: true
            })
        }
    }

    componentDidMount(){
        let foodId = this.props.history.location.pathname.split('/')[2];

        if (this.state.fetchedId !== foodId) {
            this.fetchFoodFromUrl(foodId);
        }
    }

    fetchFoodFromUrl(foodId){
        if(Number(foodId) && foodId > 0){
            var endPoint = process.env.REACT_APP_API_URL + foodId;
            trackPromise(Axios.get(endPoint).then(response => {
                this.setState({
                    selectedFood: response.data,
                    fetchedId: foodId
                });
            }));
        }
    }

    render(){
        const {handleFoodAddition, history} = this.props;

        const food = this.state.selectedFood;

        if (Object.keys(food).length === 0 && food.constructor === Object)
            return <h1></h1>

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
                    var categoryValue =  parseFloat(thresholds[key][category['name']].val);
                    var betterThanMedian = categoryValue <= parseFloat(category['value']) && categoryValue > 0;
                    if (betterThanMedian && thresholds[key][category['name']].i === undefined){
                        rowStyle = {"background": "#3D9970"};
                    }
                    else if (betterThanMedian && thresholds[key][category['name']].i === -1){
                        rowStyle = {"background": "#FF4136"};
                    }
                }
            tablebody.push(<tr key={category['id']} style={rowStyle}><td>{category['name']}</td><td>{category['value']}</td><td>{unit}</td></tr>)
            });
            var table = <table key={key}>
                            <thead>
                                <tr><th>{key.toUpperCase()}</th><th>Value</th><th>Unit</th></tr>
                            </thead>
                            <tbody>
                                {tablebody}
                            </tbody>
                        </table>
            tables.push(table);
        });
        
        if (this.state.redirectState){
            return <Redirect to="/"/>       
        }

        return (
            <TableContainer>
                <RowBox>
                    <div style={selectedFoodStyle}>{food['food']['nameDk']}</div>
                    <form onSubmit={this.addFood}>
                        <input
                            style = {inputStyle}
                            type = "text"
                            amount = {this.state.amount} 
                            onChange = {this.handleAmountChange} 
                            placeholder = "Amount">
                        </input>
                        <button type="submit" className="foodAddLink" to={"/"} style={{...linkStyle, ...this.state.addBntState}} onClick={(e) => this.addFood}>Add</button>
                    </form>
                </RowBox>
                <div style={columnHeader}>Næringsindhold (100g)</div>
                {tables}
                <LoadingIndicator />
            </TableContainer>
        )
    }
}

export default SelectionTable;