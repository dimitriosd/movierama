import React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";

import Navbar from "./components/Navbar";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import MoviesList from "./components/MoviesList";

const App = () =>{
  return (
    <div className="app-wrapper">
      <Navbar/>
      <Switch>
        <Route path="/signup" component={Signup}/>
        <Route path="/login" component={Login}/>
        <Route path="/movies" component={MoviesList}/>
        {/*<Route exact path="/" render={() => <Redirect to="/stories"/>}/>*/}
      </Switch>
    </div>
  )
}

export default App;
