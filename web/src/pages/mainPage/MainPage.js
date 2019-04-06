import React, {Component} from 'react';
import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Form, Icon, Menu, Radio, Sidebar} from 'semantic-ui-react';
import {Helmet} from 'react-helmet';
import store from 'store';
import {NavLink, Redirect, Route, Switch} from 'react-router-dom';
import isLoggedIn from '../../shared/isLoggedIn';
import strings from '../../shared/strings';
import {PhoneBookManagementPage} from '../phoneBookManagementPage/PhoneBookManagementPage'
import AppointmentsManagementPage from '../appointmentsManagementPage/AppointmentsManagementPage'
import SettingsPage from '../settingsPage/SettingsPage'
import {ChoresManagementPage} from '../choresManagementPage/ChoresManagementPage'
import {AnnouncementsManagementPage} from '../announcementsManagementPage/AnnouncementsManagementPage'

import {Header} from "semantic-ui-react/dist/commonjs/elements/Header";
import mappers from "../../shared/mappers";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import usersStorage from "../../storage/usersStorage";
import {WEB_SOCKET, connectToServerSocket} from "../../shared/constants";


const handleLogout = history => () => {
    WEB_SOCKET.emit('disconnectWebClient', {serviceProviderId: store.get('serviceProviderId')});
    store.remove('serviceProviderToken');
    store.remove('serviceProviderId');
    store.remove('userId');
    console.log('you have been logged out. boo!');
    history.push('/login');
};

const serviceProviderHeaders = {
    'Authorization': 'Bearer ' + store.get('serviceProviderToken')
};


class Home extends Component {
// const Home = ({userId, serviceProviderId}) => {
    constructor(props) {
        super(props);

        this.state = {
            userFullname: "",
            serviceProviderPermissions: "",
            serviceProviderRoles: "",
        };
    }


    componentDidMount() {
        usersStorage.getUserByUserID(store.get('userId'), serviceProviderHeaders)
            .then(user => {
                if (user !== null)
                    this.setState({
                        userFullname: user.fullname,
                    })
            })
        serviceProvidersStorage.getServiceProviderPermissionsById(store.get('serviceProviderId'))
            .then(permissions => {
                this.setState({
                    serviceProviderPermissions: permissions,
                })
            })
        serviceProvidersStorage.getRolesOfServiceProvider(store.get('serviceProviderId'))
            .then(roles => {
                this.setState({
                    serviceProviderRoles: roles.map(role => mappers.rolesMapper(role)),
                })
            })

        connectToServerSocket(store.get('serviceProviderId'));
    }

    render() {
        return (
            <div>
                <p>
                    ברוכים הבאים {this.state.userFullname}
                </p>
                <p>
                    ההרשאות שלך הן: {this.state.serviceProviderPermissions}
                </p>
                <p>
                    התפקידים עליהם את/ה אחראיים הם: {this.state.serviceProviderRoles}
                </p>
            </div>
        );
    }
}


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
                    <Menu.Item name="home" as={NavLink} to="/home">
                        <Icon name="home"/>
                        {strings.mainPageStrings.MAIN_PAGE_TITLE}
                    </Menu.Item>
                    <Menu.Item name="settings" as={NavLink} to="/settings">
                        <Icon name="settings"/>
                        {strings.mainPageStrings.SETTINGS_PAGE_TITLE}
                    </Menu.Item>
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
                    <Menu.Item name="announcements" as={NavLink} to="/announcements">
                        <Icon name="announcement"/>
                        {strings.mainPageStrings.ANNOUNCEMENTS_PAGE_TITLE}
                    </Menu.Item>
                    <Menu.Item name="logout" onClick={handleLogout(this.props.history)}>
                        <Icon name="power"/>
                        {strings.mainPageStrings.LOGOUT}
                    </Menu.Item>
                </Sidebar>
                <div className="mainBody">
                    {/*<Router>*/}
                    <Switch>
                        <Route path={`/home`} render={() => <Home userId={store.get('userId')}
                                                                  serviceProviderId={store.get('serviceProviderId')}/>}/>
                        <Route path={`/settings`} component={SettingsPage}/>
                        <Route path={`/phoneBook`} component={PhoneBookManagementPage}/>
                        <Route path={`/appointments`} component={AppointmentsManagementPage}/>
                        <Route path={`/chores`} component={ChoresManagementPage}/>
                        <Route path={`/announcements`} component={AnnouncementsManagementPage}/>
                        <Redirect to={`/home`}/>
                    </Switch>
                    {/*</Router>*/}
                </div>
            </div>
        )
    }
}

export default MainPage;


