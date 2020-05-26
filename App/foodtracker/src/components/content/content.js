import React, {Component} from "react";
import styled from "styled-components";
import SearchBar from "./searchbar/searchbar"
import BasicMain from "./main/basicMain"
import SearchTable from "./datatables/searchTable"
import Axios from "axios";
import { Route, Switch, Redirect } from "react-router";
import SelectionTable from "./datatables/selectionTable";
import AddedTable from "./datatables/addedTable";

const CntWrapper = styled.div`
grid-area: content;
margin: 0px;
`;

const CntWrapper2 = styled.div`
display:flex;
flex-direction:row;
justify-content: center;
align-items: center;
`;

class Content extends Component {
    constructor(props){
        super(props);
        this.state = {
            query: '',
            data: [],
            selectedFood: {},
            addedFoods: [],
            content: <BasicMain />
        };
    }

    handleInputChange = (e) => {
        this.setState({
          query: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var query = this.state.query;
        var trimed = query.trimLeft();
        if (trimed !== ""){
            var searchQuery = "/search?name="+trimed+"&pageNumber=1";
            this.props.history.push(searchQuery);
        }
    }

    handleFoodSelection = (food) => {
        var endPoint = process.env.REACT_APP_API_URL + food['id'];
        Axios.get(endPoint).then(response => {
            this.setState({
                selectedFood: response.data
            });
        });
    }

    handleFoodAddition = (food) => {
        this.state.addedFoods.push(JSON.parse(JSON.stringify(food)));
        this.setState({
            content: <AddedTable foods={this.state.addedFoods} 
                                 handleAddedFoodSelection={this.handleAddedFoodSelection} 
                                 handleFoodRemoval={this.handleFoodRemoval}>
                     </AddedTable>,
        });
    }

    handleFoodRemoval = (index) => {
        const remainder = this.state.addedFoods.filter((food, i) => {
            if (i !== index){
                return food;
            }
        });

        var cnt =   <AddedTable foods={remainder} 
                            handleAddedFoodSelection={this.handleAddedFoodSelection} 
                            handleFoodRemoval={this.handleFoodRemoval}>
                    </AddedTable>;
        if (!remainder.length){
            cnt = <BasicMain />;
        }
        this.setState({
            addedFoods: remainder,
            content: cnt
        });
    }

    handleAddedFoodSelection = (food) => {
        this.setState({
            selectedFood: food
        })
    }

    render(){
        const {query} = this.state;
        return (
            <CntWrapper>
                <CntWrapper2>
                    <SearchBar
                        handleSubmit={this.handleSubmit} 
                        handleInputChange={this.handleInputChange} 
                        query={query}/>
                </CntWrapper2>
                <Switch>
                    <Route path="/foods/:id">
                        <SelectionTable food={this.state.selectedFood} handleFoodAddition={this.handleFoodAddition}></SelectionTable>
                    </Route>
                    <Route path="/search">
                        <SearchTable location={this.props.location} 
                                    data={this.state.data} query={this.state.query} 
                                    handleFoodSelection={this.handleFoodSelection}
                                    history={this.props.history}>
                        </SearchTable>
                    </Route>
                    <Route exact path="/">
                        {this.state.content}
                    </Route>
                </Switch>
            </CntWrapper>
        )
    }
}

export default Content;