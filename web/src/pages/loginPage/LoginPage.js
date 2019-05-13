import React, {Component} from 'react';
import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Form, Grid, Header, Message} from 'semantic-ui-react';
import {Helmet} from 'react-helmet';
import store from 'store';
import {Redirect} from 'react-router-dom';
import isLoggedIn from '../../shared/isLoggedIn';
import strings from '../../shared/strings'
import mappers from '../../shared/mappers'
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";


var sha512 = require('js-sha512');


class LoginPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userId: '',
            password: '',
            error: false,
            err: [],
            isLoggedIn: false,
            redirectToReferrer: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        isLoggedIn()
            .then(answer => {
                console.log('in LoginPage isLoggedIn then ', answer);
                this.setState({isLoggedIn: answer});
            })
            .catch(answer => {
                console.log('in LoginPage isLoggedIn catch ', answer);
                this.setState({isLoggedIn: answer});
            });
    }


    validate = (userId, password) => {
        console.log('in validate func');
        const errors = [];
        let item = strings.loginPageStrings.WRONG_CREDENTIALS;

        if (userId.length === 0) {
            errors.push(strings.loginPageStrings.EMPTY_USER_ID);
        } else {

            if (userId.length > 9) {
                if (errors.indexOf(item) === -1) errors.push(item);
            }
            if (!(/^\d+$/.test(userId))) {
                if (errors.indexOf(item) === -1) errors.push(item);
            }
        }


        if (password.length === 0) {
            errors.push(strings.loginPageStrings.EMPTY_PASSWORD);
        } else {
            if (password.length < 8) {
                if (errors.indexOf(item) === -1) errors.push(item);
            }
            if (password.length > 12) {
                if (errors.indexOf(item) === -1) errors.push(item);
            }
            if (!(/\d/.test(password) && /[a-zA-Z]/.test(password))) {
                if (errors.indexOf(item) === -1) errors.push(item);
            }
        }

        return errors;
    };

    onSubmit(e) {
        e.preventDefault();

        const {userId, password} = this.state;
        // const {history} = this.props;

        this.setState({error: false});

        const errors = this.validate(userId, password);
        if (errors.length > 0) {
            console.log(errors);
            this.setState({error: true});
            this.setState({err: errors});
        } else {
            let hash = sha512.update(this.state.password);
            serviceProvidersStorage.serviceProviderLogin(this.state.userId, hash.hex())
                .then((response) => {
                    console.log(response);
                    store.set('serviceProviderToken', response.data.token);
                    console.log("you're logged in. yay!");
                    this.setState({isLoggedIn: true});
                })

                .catch((error) => {
                    if (error.response) {
                        let msg = mappers.loginPageMapper(error.response.data.message);
                        this.setState({err: [msg]});
                    }
                    this.setState({error: true});
                });
        }
    }

    handleChange(e, {name, value}) {
        this.setState({[name]: value});
    }

    render() {
        if (this.state.isLoggedIn) {
            console.log("isLoggedIn === true");
            return <Redirect to="/"/>;
        }

        const {error} = this.state;

        return (
            <Grid>
                <Helmet>
                    <title>Meshekle | Login</title>
                </Helmet>

                <Grid.Column width={6}/>
                <Grid.Column width={4}>
                    <Form className="loginForm" error={error} onSubmit={this.onSubmit}>
                        <Header as="h1">{strings.loginPageStrings.LOGIN}</Header>
                        {error && <Message
                            error={error}
                            content={strings.loginPageStrings.WRONG_CREDENTIALS}
                        />}
                        <Form.Input
                            inline
                            label={strings.loginPageStrings.USER_ID_PLACEHOLDER}
                            name="userId"
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            inline
                            label={strings.loginPageStrings.PASSWORD_PLACEHOLDER}
                            type="password"
                            name="password"
                            onChange={this.handleChange}
                        />
                        <Form.Button type="submit">{strings.loginPageStrings.SUBMIT}</Form.Button>
                    </Form>
                </Grid.Column>
            </Grid>
        );
    }
}

export default LoginPage;
