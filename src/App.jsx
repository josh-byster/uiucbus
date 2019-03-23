import React from 'react';
import './App.css';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import ReactGA from 'react-ga';
import HomePage from './pages/HomePage';
import TrackingPage from './pages/TrackingPage';
import BusNavbar from './components/BusNavbar';

ReactGA.initialize('UA-109186351-1');
ReactGA.pageview(window.location.pathname + window.location.search);

function App() {
  return (
    <Router>
      <div>
        <BusNavbar />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/track/:id" component={TrackingPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
