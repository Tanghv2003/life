import React, { Component } from "react";
import Header from '../../../components/Header'
import Greeting from "./hello/Greeting";
import './MainContent.css'
import Overview from "./overview/Overview";
import Rate from "./rate/rate";

class MainContent extends Component{
    render(){
        return (
            <div className="main1">
                <div className="main-content1">
                <Header/>
                <Greeting/>
                <Overview/>
                <Rate/>
                </div>
                
            </div>
        )
    }
}

export default MainContent