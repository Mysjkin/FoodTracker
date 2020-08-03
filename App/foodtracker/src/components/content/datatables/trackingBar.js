import React, {Component, Fragment} from "react";
import styled from "styled-components";
import "./trackingbarstyle.css";
import MockFoodData from "./MockStats";
import Chart from 'react-apexcharts'

const TrackingBox = styled.div`
box-sizing: border-box;
width: 100%;
margin: 30px 0;
text-align: center;
`;

const Bar = styled.div`
background: #20232a;
padding: 2px;
box-sizing: border-box;
border-radius: 40px;
`;

const BarLevel = styled.div`
background: ${props => props.color};
height: 10px;
border-radius: 40px;
width: ${props => props.progress}%;
`;

const TopBar = styled.div`
box-sizing: border-box;
height: 10px;
width: 100%;
`;

class TrackingBar extends Component {

    constructor(props){
        super(props);

        this.state = {
            showStats: false,
            chartData: {}
        }
    }

    handleExpand = () => {
        if (this.state.showStats) {
            this.setState({
                showStats: false
            });
        }
        else {
            var stats = new MockFoodData;
            let data = stats.getData()
            this.setState({
                showStats: true,
                chartData: data
            });
        }
    } 

    render(){
        const {label, value, progress, indicator} = this.props;
        var reached = progress;
        var color = "#3D9970";
        if (indicator !== undefined){
            color = "#FF851B";
        }
        if (reached > 100) {
            reached = 100;
            if (indicator !== undefined){
                color = "#FF4136";
            }
        }
        return ( 
            <Fragment>
                <TrackingBox>
                    <TopBar>
                        <p>{label}</p> 
                        <p>{value}</p>
                        <p>{progress}%</p>
                        <button className="statistics" onClick={this.handleExpand}>Expand</button>
                    </TopBar>
                    <Bar>
                        <BarLevel progress={reached} color={color}/>
                    </Bar>
                </TrackingBox>
                {this.state.showStats && this.state.chartData !== undefined &&
                        <Chart options={this.state.chartData.options} series={this.state.chartData.series} height={320}/>}
            </Fragment>
        )
    }
}

export default TrackingBar;