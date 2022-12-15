import React, {useState} from 'react';
import {Box, Container, IconButton, InputAdornment, Tooltip, Typography} from "@mui/material";
import SingleSignOnButtons from "./SingleSignOnButtons";
import StyledTextField from "./StyledTextField";
import LoginButton from "./LoginButton";
import ErrorIcon from '@mui/icons-material/Error';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../redux/mainStore";
import axios from "axios";
import Swal from 'sweetalert2'
import { ClipLoader } from 'react-spinners';

function Login(props) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [invalidPassword, setInvalidPassword] = useState(true);
  const [invalidUsername, setInvalidUsername] = useState(true);
  // const [invalidPasswordReason, setInvalidPasswordReason] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [disableLogin, setDisableLogin] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (password.length > 0) {
      setInvalidPassword(false);
    }
    else {
      setInvalidPassword(true);
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    if (username.length > 0) {
      setInvalidUsername(false);
    }
    else {
      setInvalidUsername(true);
    }
  };

  // handle when user clicks on the password show icon
  const handleShowPassword = () => setShowPassword(!showPassword);

  const loginClicked = () =>{
    console.log("Login clicked")
    if(username.length<1 || password.length<1){
      alert("Username and Password are mandatory")
    }
    else{
      setDisableLogin(true)
      axios({
        method: 'post',
        url: `https://ww6g8cugsl.execute-api.ap-south-1.amazonaws.com/dev/login`,
        data: { 
          "userName":username,
          "password":password,
          "account":"jm48581.ap-south-1.aws",
        },
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then((response) => {
          setDisableLogin(true)
          console.log("Login response is :", response);
          Swal.fire({
            title: response.data.success==true?'User Logged in successfully':'Login failed, invalid username or password',
            customClass: 'swal_alert__box',
            position:"center",
            icon: response.data.success==true?'success':'error',
            confirmButtonText: 'Okay',
            timer:'2000',
            timerProgressBar:true,
            didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        if(response.data.success==true){
          localStorage.setItem('userCreds', JSON.stringify(response.data.userCreds));
          window.dispatchEvent(new Event("storage"));
        }
        else{
          setDisableLogin(false);
        }
        })
        .catch((error) => {
          setDisableLogin(false)
          console.log(error)
          alert(error)
        })
    }
  }

  return (
    <Container className="login-box" component="main" maxWidth="xs">
      <Box>
        <Typography className="login-text" component="h1" variant="h4">
          Login
        </Typography>
        <Box component="form">
          <StyledTextField
            margin="normal"
            label="Username"
            name="username"
            onChange={(e) => handleUsernameChange(e)}
            required
            fullWidth
          />
          <StyledTextField
            margin="normal"
            label="Password"
            name="password"
            onChange={(e) => handlePasswordChange(e)}
            type={showPassword ? "text" : "password"}
            required
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {/*<Tooltip title={invalidPasswordReason}>*/}
                  {/*  <IconButton*/}
                  {/*  >*/}
                  {/*    {invalidPassword ? <ErrorIcon color="error"/> : ''}*/}
                  {/*  </IconButton>*/}
                  {/*</Tooltip>*/}
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleShowPassword}
                    onMouseDown={handleShowPassword}
                  >
                    {showPassword ? <Visibility sx={{color: "#8B8A8B"}}/> : <VisibilityOff sx={{color: "#8B8A8B"}} />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <div className="login-button-container">
            <LoginButton
              onClick={loginClicked}
              // type="submit"
              className="login-button"
              fullWidth
              variant="outlined"
              disabled={disableLogin}
              // disabled={invalidPassword || invalidUsername}
              sx={{ mt: 3, mb: 2 }}
            >
              <p>LOGIN</p>
              {disableLogin && <ClipLoader color="yellow" size={15} />}
            </LoginButton>
          </div>

        </Box>
      </Box>
      <hr/>
      <SingleSignOnButtons/>
    </Container>
  );
}

export default Login;