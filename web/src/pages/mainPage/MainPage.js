import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Icon, Menu, Sidebar} from 'semantic-ui-react';
import {Helmet} from 'react-helmet';
import store from 'store';
import styles from './styles.css';
import {PhoneBookManagementPage as Users} from '../phoneBookManagementPage/PhoneBookManagementPage';
import {Redirect} from 'react-router-dom';
import isLoggedIn from '../shared/isLoggedIn';


const handleLogout = history => () => {
    store.remove('loggedIn');
    store.remove('serviceProviderData');
    console.log('you have been logged out. boo!');
    history.push('/login');
};

const MainPage = ({ history })=> {
    if (!isLoggedIn()) {
        return <Redirect to="/login" />;
    }

    return (
        <div>
            <Helmet>
                <title>CMS</title>
            </Helmet>

            <Sidebar as={Menu} inverted visible vertical width="thin" icon="labeled">
                <Menu.Item name="users">
                    <Icon name="users" />
                    Users
                </Menu.Item>
                <Menu.Item name="logout" onClick={handleLogout(history)}>
                    <Icon name="power" />
                    Logout
                </Menu.Item>
            </Sidebar>
            <div className={styles.mainBody}>
                <Users />
            </div>
        </div>
    )
};

export default MainPage;
