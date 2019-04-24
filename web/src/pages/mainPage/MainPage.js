import React, {Component} from 'react';
import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Grid, Header, Icon, Image, Menu, Sidebar} from 'semantic-ui-react';
import {Helmet} from 'react-helmet';
import store from 'store';
import {NavLink, Redirect, Route, Switch} from 'react-router-dom';
import isLoggedIn from '../../shared/isLoggedIn';
import strings from '../../shared/strings';
import {PhoneBookManagementPage} from '../phoneBookManagementPage/PhoneBookManagementPage'
import AppointmentsManagementPage from '../appointmentsManagementPage/AppointmentsManagementPage'
import {ChoresManagementPage} from '../choresManagementPage/ChoresManagementPage'
import {AnnouncementsManagementPage} from '../announcementsManagementPage/AnnouncementsManagementPage'
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import usersStorage from "../../storage/usersStorage";
import {connectToServerSocket, WEB_SOCKET} from "../../shared/constants";
import AppointmentsReportPage from "../appointmentsManagementPage/AppointmentsReportPage";

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
        connectToServerSocket(store.get('serviceProviderId'));
    }

    render() {

        console.log("serviceProviderRoles  ", this.state.serviceProviderRoles);
        return (
            <div className={"landing-image"}>
                <Grid stretched textAlign={"center"}>
                    <Grid.Column stretched textAlign={"center"}>
                        <Image centered src={require('../../images/logo1.png')} size={'large'}/>
                        <Header size={"huge"} textAlign={"center"} icon style={{marginTop: "-10px"}}>
                            משקל'ה
                            <Header.Subheader>יש משק ויש משקל'ה</Header.Subheader>
                        </Header>

                        <div style={{marginTop: 20, textAlign: "center"}}>
                            <Header as={'h2'}>
                                ברוכים הבאים {this.props.userFullname}
                            </Header>
                            <Header as={'h3'}>
                                ההרשאות שלך
                                הן: {Array.isArray(this.props.serviceProviderPermissions) ? this.props.serviceProviderPermissions.join(", ") : this.props.serviceProviderPermissions}
                            </Header>
                            <Header as={'h3'}>
                                התפקידים באחריותך הם:
                                {Array.isArray(this.props.serviceProviderRoles) ? this.props.serviceProviderRoles.map(role => strings.roles[role]).join(", ") : this.props.serviceProviderRoles}
                            </Header>
                        </div>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}


class MainPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: true,

            userFullname: "",
            serviceProviderPermissions: "",
            serviceProviderRoles: "",
        };
    }

    componentDidMount() {
        isLoggedIn()
            .then(answer => {
                console.log('hhhh compooooo abs ', answer);
                this.setState({isLoggedIn: answer});

                if (answer)
                    this.getServiceProviderHomeDetails();
            })
            .catch(answer => {
                console.log('hhhh compooooo abs ', answer);
                this.setState({isLoggedIn: answer});
            });
    }

    getServiceProviderHomeDetails = () => {
        usersStorage.getUserByUserID(store.get('userId'), serviceProviderHeaders)
            .then(user => {
                if (user !== null && user !== undefined)
                    this.setState({
                        userFullname: user.fullname,
                    })
            })
        serviceProvidersStorage.getServiceProviderPermissionsById(store.get('serviceProviderId'))
            .then(modulesPermitted => {
                if (modulesPermitted !== null && modulesPermitted !== undefined)
                    this.setState({
                        serviceProviderPermissions: modulesPermitted,
                    })
            })
        serviceProvidersStorage.getRolesOfServiceProvider(store.get('serviceProviderId'))
            .then(roles => {
                if (roles !== null && roles !== undefined)
                    this.setState({
                        serviceProviderRoles: roles,
                    })
            })
    }


    render() {
        console.log('main page props ', this.props);
        if (Array.isArray(this.state.serviceProviderPermissions)) {
            console.log('this.state.serviceProviderRoles ', this.state.serviceProviderRoles);
            console.log('this.state.serviceProviderRoles.filter(role => role.includes("appointments")) ', this.state.serviceProviderRoles.filter(role => role.includes("appointments")));
        }

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
                    {Array.isArray(this.state.serviceProviderPermissions) ?
                        this.state.serviceProviderPermissions.includes("phoneBook") ?
                            <Menu.Item name="phoneBook" as={NavLink} to="/phoneBook">
                                <Icon name="address book outline"/>
                                {strings.mainPageStrings.PHONE_BOOK_PAGE_TITLE}
                            </Menu.Item>
                            : null
                        : null
                    }
                    {Array.isArray(this.state.serviceProviderPermissions) ?
                        this.state.serviceProviderPermissions.includes("appointments") ?
                            <Menu.Item name={"appointments"} as={NavLink} to={"/appointments"}>
                                <Icon name="calendar alternate outline"/>
                                {strings.mainPageStrings.APPOINTMENTS_PAGE_TITLE}
                            </Menu.Item>
                            : null
                        : null
                    }
                    {Array.isArray(this.state.serviceProviderPermissions) ?
                        this.state.serviceProviderPermissions.includes("chores") ?
                            <Menu.Item name="chores" as={NavLink} to="/chores">
                                <Icon name="industry"/>
                                {strings.mainPageStrings.CHORES_PAGE_TITLE}
                            </Menu.Item>
                            : null
                        : null
                    }
                    {Array.isArray(this.state.serviceProviderPermissions) ?
                        this.state.serviceProviderPermissions.includes("announcements") ?
                            <Menu.Item name="announcements" as={NavLink} to="/announcements">
                                <Icon name="announcement"/>
                                {strings.mainPageStrings.ANNOUNCEMENTS_PAGE_TITLE}
                            </Menu.Item>
                            : null
                        : null
                    }
                    <Menu.Item name="logout" onClick={handleLogout(this.props.history)}>
                        <Icon name="power"/>
                        {strings.mainPageStrings.LOGOUT}
                    </Menu.Item>
                </Sidebar>
                <div className="mainBody">
                    {/*<Router>*/}
                    <Switch>
                        <Route path={`/home`} render={() => <Home userId={store.get('userId')}
                                                                  serviceProviderId={store.get('serviceProviderId')}
                                                                  userFullname={this.state.userFullname}
                                                                  serviceProviderPermissions={this.state.serviceProviderPermissions}
                                                                  serviceProviderRoles={this.state.serviceProviderRoles}
                        />}/>
                        <Route path={`/phoneBook`} component={PhoneBookManagementPage}/>
                        <Route exec path={`/appointments/report`} component={AppointmentsReportPage}/>
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


