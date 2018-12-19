import React, {Component} from 'react';
import LoginForm from "../loginPage/LoginPage";

const MainPage = ({user, onSignOut})=> {
    // This is a dumb "stateless" component
    return (
        <div>
            Welcome <strong>{user.username}</strong>!
            <a href="javascript:;" onClick={onSignOut}>Sign out</a>
        </div>
    )
};

export default MainPage;
