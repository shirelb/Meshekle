import React from 'react';
import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Icon, Menu, Sidebar} from 'semantic-ui-react';
import {Helmet} from 'react-helmet';
import store from 'store';
import {PhoneBookManagementPage as Users} from '../phoneBookManagementPage/PhoneBookManagementPage';
import {Redirect} from 'react-router-dom';
import isLoggedIn from '../../shared/isLoggedIn';
import strings from '../../shared/strings';


const handleLogout = history => () => {
    // store.remove('loggedIn');
    store.remove('serviceProviderToken');
    store.remove('serviceProviderId');
    store.remove('userId');
    console.log('you have been logged out. boo!');
    history.push('/login');
};


const MainPage = ({history}) => {
    isLoggedIn()
        .then(answer => {
            if(!answer)
                return <Redirect to="/login"/>;
        })
        .catch(answer => {
            if(!answer)
                return <Redirect to="/login"/>;
        });
    /*if (!isLoggedIn()) {
        return <Redirect to="/login"/>;
    }*/

    return (
        <div>
            <Helmet>
                <title>CMS</title>
            </Helmet>

            <Sidebar as={Menu} inverted visible vertical width="thin" icon="labeled" direction="right">
                <Menu.Item name="users">
                    <Icon name="users"/>
                    {strings.mainPageStrings.PHONE_BOOK_PAGE_TITLE}
                </Menu.Item>
                <Menu.Item name="logout" onClick={handleLogout(history)}>
                    <Icon name="power"/>
                    {strings.mainPageStrings.LOGOUT}
                </Menu.Item>
            </Sidebar>
            <div className="mainBody">
                <Users history={history}/>
            </div>
        </div>
    )
};

export default MainPage;
