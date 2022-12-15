
import './Login.css';
import Header from "../components/Header";
import LoginContainer from "../components/LoginContainer";
import {Grid} from "@mui/material";

function App() {
  return (
    <div className="App full-height">
      <div className="split-screen full-height">
        <Grid container spacing={2} className=" full-height">
          <Grid item md={6} sm={12} className="header-container full-height">
            <Header/>
          </Grid>
          <Grid item md={6} sm={12} className="login-container full-height">
            <LoginContainer/>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default App;
