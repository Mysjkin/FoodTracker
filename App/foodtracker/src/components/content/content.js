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
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';

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

const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();
    
    return ( promiseInProgress && 
        <div
            style={{
            width: "100%",
            height: "100",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
            }}>
        <Loader type="ThreeDots" color="#82bef6" height="100" width="100" />
        </div>
    );  
}

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
        trackPromise(Axios.get(endPoint).then(response => {
            this.setState({
                selectedFood: response.data,
                query: ""
            });
        }));
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

        const searchBarTop = <CntWrapper2>
                                <SearchBar
                                    handleSubmit={this.handleSubmit} 
                                    handleInputChange={this.handleInputChange} 
                                    query={query}/>
                            </CntWrapper2>;

        return (
            <CntWrapper>
                <Switch>
                    <Route path="/foods/:id">
                        {searchBarTop}
                        <SelectionTable food={this.state.selectedFood} handleFoodAddition={this.handleFoodAddition}></SelectionTable>
                    </Route>
                    <Route path="/search">
                        {searchBarTop}
                        <SearchTable location={this.props.location} 
                                    data={this.state.data} query={this.state.query} 
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
                <LoadingIndicator />
            </CntWrapper>
        )
    }
}

export default Content;