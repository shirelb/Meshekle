import React, {Component} from 'react';
import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Icon, Menu, Sidebar} from 'semantic-ui-react';
import {Helmet} from 'react-helmet';
import store from 'store';
import {NavLink, Redirect, Route, Switch} from 'react-router-dom';
import isLoggedIn from '../../shared/isLoggedIn';
import strings from '../../shared/strings';
import {PhoneBookManagementPage} from '../phoneBookManagementPage/PhoneBookManagementPage'
import {AppointmentsManagementPage} from '../appointmentsManagementPage/AppointmentsManagementPage'
import {ChoresManagementPage} from '../choresManagementPage/ChoresManagementPage'
import axios from "axios";
import {SERVER_URL} from "../../shared/constants";
import helpers from "../../shared/helpers";
import {Header} from "semantic-ui-react/dist/commonjs/elements/Header";

const handleLogout = history => () => {
    store.remove('serviceProviderToken');
    store.remove('serviceProviderId');
    store.remove('userId');
    console.log('you have been logged out. boo!');
    history.push('/login');
};

const serviceProviderHeaders = {
    'Authorization': 'Bearer ' + store.get('serviceProviderToken')
};

const getServiceProviderPermissionsById = (serviceProviderId) => {
    return axios.get(`${SERVER_URL}/api/serviceProviderId/${serviceProviderId}/permissions`,
        {headers: serviceProviderHeaders}
    )
        .then((response) => {
            let permissions = response.data;
            console.log('permissions ', permissions);
            return permissions;
        })
        .catch((error) => {
            console.log('error ', error);
        });
};

const Home = ({userId, serviceProviderId}) => {
    let userData = {fullname: 'Administrator'};
    helpers.getUserByUserID(userId, serviceProviderHeaders)
        .then(user => userData = user)
        .catch(error => console.log('error ', error));
    let serviceProviderPermissions = '';
    getServiceProviderPermissionsById(serviceProviderId)
        .then(permissions => serviceProviderPermissions = permissions)
        .catch(error => console.log('error ', error));
    return (
        <div>
            <p>
                Hello and welcome {userData.fullname}
            </p>
            <p>
                your permissions are {serviceProviderPermissions}
            </p>
        </div>
    );
};


class MainPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: true
        };
    }

    componentDidMount() {
        isLoggedIn()
            .then(answer => {
                console.log('hhhh compooooo abs ', answer);
                this.setState({isLoggedIn: answer});
            })
            .catch(answer => {
                console.log('hhhh compooooo abs ', answer);
                this.setState({isLoggedIn: answer});
            });
    }

    render() {
        console.log('main page props ', this.props);

        if (!this.state.isLoggedIn)
            return <Redirect to="/login"/>;

        return (
            <div>
                <Helmet>
                    <title>Meshekle</title>
                </Helmet>

                <Sidebar as={Menu} inverted visible vertical width="thin" icon="labeled" direction="right">
                    <Menu.Item name="phoneBook" as={NavLink} to="/phoneBook">
                        <Icon name="users"/>
                        {strings.mainPageStrings.PHONE_BOOK_PAGE_TITLE}
                    </Menu.Item>
                    <Menu.Item name="appointments" as={NavLink} to="/appointments">
                        <Icon name="handshake outline"/>
                        {strings.mainPageStrings.APPOINTMENTS_PAGE_TITLE}
                    </Menu.Item>
                    <Menu.Item name="chores" as={NavLink} to="/chores">
                        <Icon name="industry"/>
                        {strings.mainPageStrings.CHORES_PAGE_TITLE}
                    </Menu.Item>
                    <Menu.Item name="logout" onClick={handleLogout(this.props.history)}>
                        <Icon name="power"/>
                        {strings.mainPageStrings.LOGOUT}
                    </Menu.Item>
                </Sidebar>
                <div className="mainBody">
                    <Switch>
                        <Route path={`/home`} render={() => <Home userId={store.get('userId')}
                                                                  serviceProviderId={store.get('serviceProviderId')}/>}/>
                        <Route path={`/phoneBook`} component={PhoneBookManagementPage}/>
                        <Route path={`/appointments`} component={AppointmentsManagementPage}/>
                        <Route path={`/chores`} component={ChoresManagementPage}/>
                        <Redirect to={`/home`}/>
                    </Switch>
                </div>
            </div>
        )
    }
}

export default MainPage;


