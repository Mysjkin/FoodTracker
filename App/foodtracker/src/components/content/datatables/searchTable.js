import React, {Component, Fragment} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import Axios from "axios";
import queryString from 'query-string';
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from '../../extra/LoadingIndicator'

const TableContainer = styled.div`
text-align: center;
margin-bottom: 80px;
`;

const RowBox = styled.div`
width: 100%;
padding-top: 16px;
padding-bottom: 8px;
font-size: 12px;
border-bottom: 1px solid #eeeeee;
`;

const linkStyle = {
    "color": "#20232a",
    "fontSize": "16px",
    "fontWeight": "500"
}

const ElSpan = styled.span``;

class SearchTable extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: [],
            name: "",
            pageNumber: 1
        }
    }

    fetchSearchResults(query, pagenr) {
        var endPoint = process.env.REACT_APP_API_URL + "search?name=" + query + "&pageNumber=" + pagenr;
        trackPromise(
            Axios.get(endPoint).then(response => {
                this.setState({
                    data: response.data,
                    name: query,
                    pageNumber: pagenr
                });
            })
        );
    }

    handleNextpage(){
        if (this.state.data.length > 0){
            var n = this.state.name;
            var pgnr = this.state.pageNumber + 1;
            this.fetchSearchResults(n, pgnr)
            var searchQuery = "/search?name="+n+"&pageNumber="+pgnr;
            this.props.history.push(searchQuery);
        }
    }

    handlePrevPage(){
        if (this.state.data.length > 0 && this.state.pageNumber > 1){
            var n = this.state.name;
            var pgnr = this.state.pageNumber - 1;
            this.fetchSearchResults(n, pgnr)
            var searchQuery = "/search?name="+n+"&pageNumber="+pgnr;
            this.props.history.push(searchQuery);
        }
    }

    render(){
        const {location, handleFoodSelection} = this.props;
        
        const search = location.search;
        var searchParams = queryString.parse(search);
        var n = searchParams.name;
        var pgnr = parseInt(searchParams.pageNumber);
        if (n !== undefined && pgnr !== undefined
            && (n !== this.state.name || pgnr !== this.state.pageNumber)){
            
            this.fetchSearchResults(n, pgnr);
        }

        var els = [];
        // onClick this way causes re-renders not really optimal. Fix later.
        this.state.data.forEach(el => {
            els.push(
            <RowBox key={el['id']}>
                <Link to={"foods/"+el['id']} style={linkStyle} value={el} onClick={() => handleFoodSelection(el)}>{el['nameDk']}</Link> 
                <div>Pr. 100g</div> 
                <div>
                    Kcal: {el['kcal']} <ElSpan>-</ElSpan> Protein: {el['protein']} <ElSpan>-</ElSpan> Kulhydrater: {el['carbs']} <ElSpan>-</ElSpan> Fedt: {el['fat']}
                </div>
            </RowBox>);
        });
        return (
            <TableContainer>
                {els}
                {els.length > 0 &&
                 <Fragment>
                    <button onClick={() => this.handlePrevPage()}>Prev</button>
                    <button onClick={() => this.handleNextpage()}>Next</button>
                 </Fragment>
                }
                <LoadingIndicator />
            </TableContainer>
        )
    }
}

export default SearchTable;