import React, {Component, Fragment} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import Axios from "axios";
import queryString from 'query-string';
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from '../../extra/LoadingIndicator'

const TableContainer = styled.div`
    text-align: center;
    marginBottom: 80px;
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

const pageBntStyle = {
    "display":"inline-block",
    "padding":"0.6em 2em",
    "margin":"0.5em 0.3em 0.3em 0.2em",
    "borderRadius":"2em",
    "boxSizing": "border-box",
    "fontSize": "12px",
    "fontFamily":"'Roboto',sans-serif",
    "fontWeight":"300",
    "textAlign":"center",
    "transition": "all 0.2s",
    "float": "center",
    "color": "#FFFFFF",
    "backgroundColor": "#20232a",
    "border": "none"
}

const ElSpan = styled.span``;

class SearchTable extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: [],
            name: "",
            pageNumber: -1,
            prevSearchName: ""
        }
    }

    fetchSearchResults(query, pageNumber) {
        var endPoint = process.env.REACT_APP_API_URL + "search?name=" + query + "&pageNumber=" + pageNumber;
        trackPromise(
            Axios.get(endPoint).then(response => {
                if (response.data != null && response.data.length > 0) {
                    this.setState({
                        data: response.data,
                        name: query,
                        pageNumber: pageNumber,
                        prevSearchName: this.props.history.location.search
                    });
                }
                else {
                    this.props.history.push(this.state.prevSearchName);
                }
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

    getSearchNameAndPageNumber() {
        const search = this.props.history.location.search;

        var searchParams = queryString.parse(search);
        var searchName = searchParams.name;
        var pageNumber = parseInt(searchParams.pageNumber);

        return [searchName, pageNumber];
    }

    componentDidMount() {
        const searchInfo = this.getSearchNameAndPageNumber();
        var searchName = searchInfo[0];
        var pageNumber = searchInfo[1];

        if (searchName === undefined || pageNumber === undefined) return;

        this.fetchSearchResults(searchName, pageNumber);
    }

    componentDidUpdate() {
        if (this.props.history === undefined) return;

        if (this.state.prevSearchName !== this.props.history.location.search) {
            const searchInfo = this.getSearchNameAndPageNumber();
            var searchName = searchInfo[0];
            var pageNumber = searchInfo[1];
            this.fetchSearchResults(searchName, pageNumber);
        }
    }

    render(){
        var els = [];
        // onClick this way causes re-renders not really optimal. Fix later.
        this.state.data.forEach(el => {
            els.push(
            <RowBox key={el['id']}>
                <Link to={"foods/"+el['id']} 
                      style={linkStyle} 
                      value={el}>{el['nameDk']}
                </Link> 
                <div>Pr. 100g</div> 
                <div>
                    Kcal: {el['kcal']} 
                    <ElSpan>-</ElSpan> Protein: {el['protein']} 
                    <ElSpan>-</ElSpan> Kulhydrater: {el['carbs']} 
                    <ElSpan>-</ElSpan> Fedt: {el['fat']}
                </div>
            </RowBox>);
        });
        return (
            <TableContainer>
                <LoadingIndicator />
                {els}
                {els.length > 0 &&
                 <Fragment>
                    <button style={pageBntStyle} onClick={() => this.handlePrevPage()}>Prev</button>
                    <button style={pageBntStyle} onClick={() => this.handleNextpage()}>Next</button>
                 </Fragment>
                }
            </TableContainer>
        )
    }
}

export default SearchTable;