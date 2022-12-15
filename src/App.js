import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import './App.css';
import GraphPage from "./pages/GraphPage";
import Login from "./pages/Login";
import Temp from "./pages/Temp";
import Token from "./pages/Token";

function App() {

  const { loading } = useSelector(state=>state.mainSlice);
  const dispatch = useDispatch();
  const[userCreds,setUserCreds] =useState(null)

  useEffect(() => {
    localStorage.getItem('userCreds')
    setUserCreds(localStorage.getItem('userCreds'))
    window.addEventListener('storage', () => {
      console.log("userCreds changed to ::",localStorage.getItem('userCreds'))
      setUserCreds(localStorage.getItem('userCreds'))
    })
  }, []);


  return (
    <div style={{height: "100%"}}>
      {loading?<p>Loading</p>:
      <Router>
      {userCreds!=null?
        <Routes>
          <Route exact path="/temp" element={<Temp/>}/>
          <Route exact path="/token" element={<Token/>}/>
          <Route exact path="/" element={<GraphPage/>}/>
          {/* <Route exact path="/login" element={<Login/>}/> */}
          {/* <Route exact path="/recovery-password" element={<RecoveryPassword/>}/> */}
          {/* <Route path="*" element={<NotFound/>}/> */}
        </Routes>
      // </Router>
      :
      // <Router>
        <Routes>
          <Route exact path="/token" element={<Token/>}/>
          <Route exact path="*" element={<Login/>}/>
          {/* <Route exact path="/login" element={<Login/>}/> */}
          {/* <Route exact path="/recovery-password" element={<RecoveryPassword/>}/> */}
          {/* <Route path="*" element={<NotFound/>}/> */}
        </Routes>
      }
      </Router>
    }
    </div>
  );
}

export default App;
