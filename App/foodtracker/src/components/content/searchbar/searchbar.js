import React, {Component} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";

const CntWrapper2 = styled.div`
    display:flex;
    flex-direction:row;
    justify-content: center;
    align-items: center;
`;

const SearchWrapper = styled.div`
    margin-top: 20px;
    width: 80%;
    height: 40px;
    text-align: center;
    border-radius: 40px;
    background: #fff;
    display:flex;
    flex-direction:row;
    justify-content: center;
    align-items: center;
    border:1px solid grey;
    padding:2px;
`;

const SearchBtn = styled.div`
    color: #000;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #fff;
    cursor:pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    top: 2px;
    right: 2%;
`;

const inputStyle = {
    width: '95%',
    height: '50%',
    textAlign: 'left',
    border: 'none',
    fontSize: '14'
};

const searchBntStyle = {
    color: 'black'
};

const formStyle = {
    width: '88%',
    textAlign: 'center'
};

class SearchBar extends Component {
    render(){
        const {handleSubmit, handleInputChange} = this.props;
        return (
            <CntWrapper2>
                <SearchWrapper>
                    <SearchBtn>
                        <Link to={"/search?name="+this.props.query} 
                              onClick={(e) => handleSubmit(e)}>
                              <i style={searchBntStyle} className="fas fa-search fa-2x"></i>
                        </Link>
                    </SearchBtn>
                    <form style={formStyle}
                        onSubmit={(e) => handleSubmit(e)}>
                        <input type="text" style={inputStyle} placeholder="Search.."
                        onChange={handleInputChange}
                        value={this.props.query}/>
                    </form>
                </SearchWrapper>
            </CntWrapper2>
        )
    }
}

export default SearchBar;