import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import TrackingPage from "./pages/TrackingPage";
import BusNavbar from "./components/BusNavbar";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <BusNavbar />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/track/:id" component={TrackingPage} />
            {/* <Route path='/contact' component={Contact}></Route> */}
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
