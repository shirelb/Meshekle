import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';
import MainPage from './pages/mainPage/MainPage';
import LoginPage from './pages/loginPage/LoginPage';
import {AppointmentsManagementPage} from "./pages/appointmentsManagementPage/AppointmentsManagementPage";
import UserAdd from "./components/UserAdd";
import UserInfo from "./components/UserInfo";
import {PhoneBookManagementPage} from "./pages/phoneBookManagementPage/PhoneBookManagementPage";

class App extends Component {
    render() {
        return (
            <Router>
                <div className="app-routes">
                    <Switch>
                        <Route path="/login" component={LoginPage}/>
                        <Route path="/" component={MainPage}>
                            <Route exact path="/appointments" component={AppointmentsManagementPage}>
                                <Route exact path="/appointments/add" component={UserAdd}/>
                            </Route>
                            <Route exact path="/phoneBook" component={PhoneBookManagementPage}>
                                <Route exact path="/phoneBook/users/:userId" component={UserInfo}/>
                            </Route>
                        </Route>
                    </Switch>
                </div>
            </Router>

        );
    }
}

export default App;
