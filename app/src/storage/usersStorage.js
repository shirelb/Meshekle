import axios from "axios";
import {SERVER_URL} from "../shared/constants";

var getUserEvents = function (userId, userHeaders) {
    return axios.get(`${SERVER_URL}/api/users/events/userId/${userId}`,
        {headers: userHeaders}
    )
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get user events error ', error)
        });
};

var getUserById = function (userId, userHeaders) {
    return axios.get(`${SERVER_URL}/api/users/userId/${userId}`,
        {headers: userHeaders}
    )
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get user by id error ', error)
        });
};

var getUsers = function (userHeaders) {
    return axios.get(`${SERVER_URL}/api/users`,
        {headers: userHeaders}
    )
        .then(response => {
            return response.data.filter(user => user.userId !== 1 && user.userId !== "1");
        })
        .catch(error => {
            console.log('get user by id error ', error)
        });
};

var userValidToken = function (token) {
    return axios.post(`${SERVER_URL}/api/users/validToken`,
        {
            "token": token,
        },
    );
}

var userLogin = function (userId, password) {
    return axios.post(`${SERVER_URL}/api/users/login/authenticate`,
        {
            "userId": userId,
            "password": password
        },
    );
}


export default {getUserEvents, getUserById, userValidToken, userLogin, getUsers};
