import React, {Component} from 'react';
import './App.css';
import Header from "./components/header/header"
import Content from "./components/content/content"
import { BrowserRouter, Route } from "react-router-dom";

require('dotenv').config()

class App extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <BrowserRouter>
                <div className="App">
                    <Header />
                    <Route path='/' component={Content}/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
