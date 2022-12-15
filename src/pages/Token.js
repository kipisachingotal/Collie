import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { decrement, fetchUserDetails, increment, incrementByAmount } from "../redux/mainStore";
import axios from "axios"

const Token = () => {

    const dispatch = useDispatch();
    const { count,user,loading } = useSelector(state=>state.mainSlice);
    const [token,setToken] = useState("ABC")
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(()=>{
      var a  = searchParams.get("code")
      // alert(a)
      if(a){
        // localStorage.setItem('Name', 'P Sai Nikhil');
        // alert("Making a request")
        axios.post('http://localhost:5050/getAccessToken', { code :a })
        .then((res) => {
        console.log("RESPONSE RECEIVED: ", res.data);
        localStorage.setItem('accessDetails', JSON.stringify(res.data));
        // window.open("", "_self");
        // window.close();
        })
        .catch((err) => {
        console.log("AXIOS ERROR: ", err);
        localStorage.setItem('LoginError', JSON.stringify(err));
        // window.open("", "_self");
        // window.close();
        })
      }
      else{
        localStorage.setItem('LoginError', 'Token not found');
        window.open("", "_self");
        window.close();
      }
    },[])

    return (
        <div>
          <p>Please wait...</p>
      </div>
    );
};

export default Token;