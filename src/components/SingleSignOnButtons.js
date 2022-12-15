import React from 'react';
import {FacebookLoginButton, GoogleLoginButton, OktaLoginButton,createButton} from "react-social-login-buttons";
import { useDispatch, useSelector } from "react-redux";
import { setUser} from "../redux/mainStore";
import axios from "axios";

function SingleSignOnButtons(props) {

  const dispatch = useDispatch();

  const config = {
    text: "Log in with Oauth",
    icon: "snowflake",
    iconFormat: name => `fa fa-snowflake`,
    style: { background: "#3b5998" },
    activeStyle: { background: "#293e69" }
  };

  const OauthLoginButton = createButton(config);

  const loginWithOkta = () =>{
    // alert("Hello")
    var userData = {
      "userName" : "satyajit.s.maitra@apisero.com",
      "account" : "pi74264.ap-south-1.aws",
      "password" : "Rbac@100"
    };
    
    var config = {
      method: 'post',
      url: `http://localhost:8888/login`,
      data: {
        "userName":JSON.parse(localStorage.getItem('userCreds')).username,
        "password":JSON.parse(localStorage.getItem('userCreds')).password,
        "account":JSON.parse(localStorage.getItem('userCreds')).account
      },
      headers: { 
        'Accept-Charset': 'UTF-8', 
        'Content-Type': 'application/json'
      },
      data : userData
    };
    
    axios(config)
    .then(function (response) {
      console.log("login response is : ",JSON.stringify(response.data));
      if(response.data.success==true){
        dispatch(setUser(userData.userName))
      }
      else{
        alert("Login failed")
      }
    })
    .catch(function (error) {
      console.log("error response is : ",error);
    });
  }

  const loginWithOauth = () =>{
    window.open(
      "https://pi74264.ap-south-1.aws.snowflakecomputing.com/oauth/authorize?client_id=gPodDDNws%2FFTXws9USnTK54B%2FZs%3D&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3100%2Ftoken", "_blank");
  }

  return (
    <div className="single-sign-on-buttons">
      <OktaLoginButton onClick={loginWithOkta}/>
      <OauthLoginButton onClick={loginWithOauth} />
    </div>
  );
}

export default SingleSignOnButtons;