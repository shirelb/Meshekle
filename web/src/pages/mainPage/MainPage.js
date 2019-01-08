import React, {Component} from 'react';
import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Icon, Menu, Sidebar} from 'semantic-ui-react';
import {Helmet} from 'react-helmet';
import store from 'store';
import {Redirect} from 'react-router-dom';
import isLoggedIn from '../../shared/isLoggedIn';
import strings from '../../shared/strings';
import {PhoneBookManagementPage} from '../phoneBookManagementPage/PhoneBookManagementPage'
import {AppointmentsManagementPage} from '../appointmentsManagementPage/AppointmentsManagementPage'
import {ChoresManagementPage} from '../choresManagementPage/ChoresManagementPage'

const handleLogout = history => () => {
    store.remove('serviceProviderToken');
    store.remove('serviceProviderId');
    store.remove('userId');
    console.log('you have been logged out. boo!');
    history.push('/login');
};


class MainPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            renderComponent: 'home',
            isLoggedIn: true
        };

        this.chosedComponent= <PhoneBookManagementPage history={this.props.history}/>;
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

    renderedContent = (componentName) => {
        switch (componentName) {
            case 'phoneBook':
                this.props.history.push('/phoneBook');
                this.chosedComponent = <PhoneBookManagementPage history={this.props.history}/>;
                break;
            case 'appointments':
                this.props.history.push('/appointments');
                this.chosedComponent = <AppointmentsManagementPage history={this.props.history}/>;
                break;
            case 'chores':
                this.props.history.push('/chores');
                this.chosedComponent = <ChoresManagementPage history={this.props.history}/>;
                break;
            default:
                this.props.history.push('/home');
                this.chosedComponent = <AppointmentsManagementPage history={this.props.history}/>;
                break;
        }
        console.log(" this.chosedComponent ", this.chosedComponent);
        this.forceUpdate();
    };

    render() {
        if (!this.state.isLoggedIn)
            return <Redirect to="/login"/>;

        return (
            <div>
                <Helmet>
                    <title>CMS</title>
                </Helmet>

                <Sidebar as={Menu} inverted visible vertical width="thin" icon="labeled" direction="right">
                    <Menu.Item name="phoneBook" onClick={() => this.renderedContent('phoneBook')}>
                        <Icon name="users"/>
                        {strings.mainPageStrings.PHONE_BOOK_PAGE_TITLE}
                    </Menu.Item>
                    <Menu.Item name="appointments" onClick={() => this.renderedContent('appointments')}>
                        <Icon name="handshake outline"/>
                        {strings.mainPageStrings.APPOINTMENTS_PAGE_TITLE}
                    </Menu.Item>
                    <Menu.Item name="chores" onClick={() => this.renderedContent('chores')}>
                        <Icon name="industry"/>
                        {strings.mainPageStrings.CHORES_PAGE_TITLE}
                    </Menu.Item>
                    <Menu.Item name="logout" onClick={handleLogout(this.props.history)}>
                        <Icon name="power"/>
                        {strings.mainPageStrings.LOGOUT}
                    </Menu.Item>
                </Sidebar>
                <div className="mainBody">
                    {this.chosedComponent}
                </div>
            </div>
        )
    }
}

export default MainPage;


