import React, {Component} from 'react';
import logo from './images/logo.svg';
import './App.css';

import LoginForm from './pages/loginPage/LoginPage';
import MainPage from './pages/mainPage/MainPage';

class App extends Component {
    constructor(props) {
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
    }

    render() {
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
