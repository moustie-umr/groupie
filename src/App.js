import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Auth from './modules/Auth';
import Home from './modules/Home';
import Notfound from './modules/Notfound';
import User from './providers/user';

import './App.css';

function App() {
  const [url, setUrl] = useState(User.isLoggedIn()? 'home' : 'auth');

  return (
    <div className="App">
      <Router>
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/home" component={Home} />
        <Redirect exact from="/" to={`/${url}`} />
        <Route component={Notfound} />
      </Switch>
      </Router>
    </div>
  );
}

export default App;
