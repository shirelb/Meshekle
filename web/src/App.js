import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';
import MainPage from './pages/mainPage/MainPage';
import LoginPage from './pages/loginPage/LoginPage';

class App extends Component {
    render() {
        return (
            <Router>
                <div className="app-routes">
                    <Switch>
                        <Route path="/login" component={LoginPage}/>
                        <Route path="/" component={MainPage}/>
                    </Switch>
                </div>
            </Router>

        );
    }
}

export default App;
