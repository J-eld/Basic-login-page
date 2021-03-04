import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import SignIn from "./components/SignIn";
import SignInSuccess from "./components/SignInSuccess";
import SignInFailed from "./components/SignInFailed";
import SignUp from "./components/SignUp";
import SignUpFailed from "./components/SignUpFailed";
import SignUpSuccess from "./components/SignUpSuccess";
import { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }));
  }

  componentDidMount() {
    this.callAPI();
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={SignIn}/>
          <Route path="/register" component={SignUp}/>
          <Route path="/user" component={SignInSuccess}/>
          <Route path="/error" component={SignInFailed}/>
          <Route path="/!register" component={SignUpFailed}/>
          <Route path="/registered" component={SignUpSuccess}/>
        </Switch>
      </Router>
    );
  }
}
export default App;
