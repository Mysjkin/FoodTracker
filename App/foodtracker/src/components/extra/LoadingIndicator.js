import React from 'react'
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';

function LoadingIndicator(props) {
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

export default LoadingIndicator;
