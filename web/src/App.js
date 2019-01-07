import React, {Component} from 'react';
import {Switch, BrowserRouter as Router, Route} from "react-router-dom";
import './App.css';
import MainPage from './pages/mainPage/MainPage';
import LoginPage from './pages/loginPage/LoginPage';

class App extends Component {
    /*constructor(props) {
        super(props);
        // the initial application state
        this.state = {
            user: null
        }
    }


    // App "actions" (functions that modify state)
    signIn(username, password) {
        // This is where you would call Firebase, an API etc...
        // calling setState will re-render the entire app (efficiently!)

        this.setState({
            user: {
                username,
                password,
            }
        })
    }

    signOut() {
        // clear out user from state
        this.setState({user: null})
    }*/

    /*render() {
        // Here we pass relevant state to our child components
        // as props. Note that functions are passed using `bind` to
        // make sure we keep our scope to App
        return (
            <div>
                <h1>My cool App</h1>
                {
                    (this.state.user) ?
                        <MainPage
                            user={this.state.user}
                            onSignOut={this.signOut.bind(this)}
                        />
                        :
                        <LoginForm
                            onSignIn={this.signIn.bind(this)}
                        />
                }
            </div>
        )

    }*/
    /*constructor() {
        super();
        this.requireAuth = this.requireAuth.bind(this);
    }*/

    /*requireAuth(nextState, replace, callback) {
        const token = window.sessionStorage.token;
        if (!token) {
            replace('/login');
            callback();
            return;
        }
        fetch('/api/auth/check', {headers: {'Authorization': token}})
            .then(res => callback())
            .catch(err => {
                replace('/login');
                callback();
            })
    }

    logout(nextState, replace) {
        delete window.sessionStorage.token;
    }
*/

    render() {
        return (
            /*<Router history={hashHistory}>*/
            /*<Route name="login" path="/login" component={LoginPage} onEnter={this.logout}/>
                    <Route name="app" path="/" component={MainPage}
                           onEnter={(nextState, replace, callback) => this.requireAuth(nextState, replace, callback)}>
                        <IndexRoute component={DashboardPage}/>
                    </Route>*/

            <Router>
                <div className="app-routes">
                    <Switch>
                        <Route path="/login" component={LoginPage}/>
                        <Route path="/" component={MainPage}/>
                    </Switch>
                </div>
            </Router>

            /*<div>
                <nav className="navbar navbar">
                    <ul className="nav">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/category">Category</Link>
                        </li>
                        <li>
                            <Link to="/products">Products</Link>
                        </li>
                        <li>
                            <Link to="/admin">Admin area</Link>
                        </li>
                    </ul>
                </nav>

                <Switch>
                    <Route path="/login" component={LoginPage} />
                    <Route exact path="/" component={HomePage} />
                    <Route path="/category" component={CategoryPage} />
                    <PrivateRoute path="/admin" component={AdminPage} />
                    <Route path="/products" component={ProductsPage} />
                </Switch>
            </div>*/
        )
            ;
    }

    /*render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Edit <code>src/App.jsle.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
            </div>
        );
    }*/
}

export default App;
