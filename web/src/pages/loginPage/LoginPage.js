import React, {Component} from 'react';
import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Form, Grid, Header, Message} from 'semantic-ui-react';
import {Helmet} from 'react-helmet';
import store from 'store';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import isLoggedIn from '../../shared/isLoggedIn';
import {SERVER_URL} from "../../shared/constants";
import strings from '../../shared/strings'
import mappers from '../../shared/mappers'

class LoginPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userId: '',
            password: '',
            error: false,
            err: [],
            isLoggedIn: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        isLoggedIn()
            .then(answer => {
                this.setState({isLoggedIn: answer});
            })
            .catch(answer => {
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
        const {history} = this.props;

        this.setState({error: false});

        const errors = this.validate(userId, password);
        if (errors.length > 0) {
            console.log(errors);
            this.setState({error: true});
            this.setState({err: errors});
        } else {
            axios.post(`${SERVER_URL}/api/serviceProviders/login/authenticate`,
                {
                    "userId": this.state.userId,
                    "password": this.state.password
                },
            )
                .then((response) => {
                    console.log(response);
                    store.set('serviceProviderToken', response.data.token);
                    axios.post(`${SERVER_URL}/api/serviceProviders/validToken`,
                        {
                            "token": response.data.token
                        },
                    )
                        .then((validTokenResponse) => {
                            console.log(validTokenResponse);
                            store.set('serviceProviderId', validTokenResponse.data.payload.serviceProviderId);
                            store.set('userId', validTokenResponse.data.payload.userId);
                            console.log("you're logged in. yay!");
                            this.setState({isLoggedIn: true});
                            history.push('/users');
                        });
                })

                .catch((error) => {
                    let msg = mappers.loginPageMapper(error.response.data.message);
                    this.setState({err: [msg]});
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
            return <Redirect to="/users"/>;
        }

        const {error} = this.state;

        return (
            <Grid>
                <Helmet>
                    <title>CMS | Login</title>
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
