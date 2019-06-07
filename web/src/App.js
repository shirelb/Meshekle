import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';
import MainPage from './pages/mainPage/MainPage';
import LoginPage from './pages/loginPage/LoginPage';
import ErrorBoundary from './pages/errorPage/ErrorBoundary';


class App extends Component {
    render() {

        return (
            <Router>
                <Switch>
                    <Route path="/login" render={() => (
                        <ErrorBoundary>
                            <LoginPage/>
                        </ErrorBoundary>
                    )}/>
                    <Route path="/" render={() => (
                        <ErrorBoundary>
                            <MainPage/>
                        </ErrorBoundary>
                    )}/>
                </Switch>
            </Router>
        );
    }
}

export default App;
