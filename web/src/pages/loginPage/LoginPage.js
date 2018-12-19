import React, {Component} from 'react';
import axios from 'axios';

class LoginForm extends Component {

    // Using a class based component here because we're accessing DOM refs

    handleSignIn(e) {
        e.preventDefault();
        let username = this.refs.username.value;
        let password = this.refs.password.value;

        axios.get("http://localhost:4000/users")
            .then(response => {
                console.log("after get response");
                console.log(response);
                this.props.onSignIn(username, password)
            })
            .catch(error => {
                console.log("after get error");
                console.log(error);
            });
    }

    render() {
        return (
            <form onSubmit={this.handleSignIn.bind(this)}>
                <h3>Sign in</h3>
                <input type="text" ref="username" placeholder="enter you username" />
                <input type="password" ref="password" placeholder="enter password" />
                <input type="submit" value="Login" />
            </form>
        )
    }

}

export default LoginForm;
