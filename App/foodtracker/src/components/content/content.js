import React, {Component} from "react";
import styled from "styled-components";
import SearchBar from "./searchbar/searchbar"
import BasicMain from "./main/basicMain"
import SearchTable from "./datatables/searchTable"
import Axios from "axios";
import { Route, Switch, Redirect } from "react-router";
import SelectionTable from "./datatables/selectionTable";
import AddedTable from "./datatables/addedTable";
import Login from "./login/Login";
import Signup from "./login/Signup";

const CntWrapper = styled.div`
grid-area: content;
margin: 0px;
`;

class Content extends Component {
    constructor(props){
        super(props);
        this.state = {
            query: '',
            data: [],
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
            var search = "/search?name="+trimed+"&pageNumber=1";
            this.props.history.push(search);
            this.setState({
                query: ''
            });
        }
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

    render(){
        var searchBarTop = 
            <SearchBar 
                handleSubmit={this.handleSubmit} 
                handleInputChange={this.handleInputChange} 
                query={this.state.query}/>

        return (
            <CntWrapper>
                <Switch>
                    <Route path="/foods/:id">
                        {searchBarTop}
                        <SelectionTable
                            handleFoodAddition={this.handleFoodAddition}
                            history={this.props.history}></SelectionTable>
                    </Route>
                    <Route path="/search">
                        {searchBarTop}
                        <SearchTable location={this.props.location} 
                            data={this.state.data}
                            handleFoodSelection={this.handleFoodSelection}
                            history={this.props.history}>
                        </SearchTable>
                    </Route>
                    <Route exact path="/">
                        {searchBarTop}
                        {this.state.content}
                    </Route>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <Route exact path="/signup">
                        <Signup />
                    </Route>
                </Switch>
            </CntWrapper>
        )
    }
}

export default Content;