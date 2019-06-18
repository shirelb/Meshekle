import axios from "axios";
import {APP_SOCKET, SERVER_URL} from "../shared/constants";

var getUserEvents = function (userId, userHeaders) {
    return axios.get(`${SERVER_URL}/api/users/events/userId/${userId}`,
        {headers: userHeaders}
    )
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get user events error ', error)
            return error;
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
            return error;
        });
};

var getUsers = function (userHeaders) {
    return axios.get(`${SERVER_URL}/api/users`,
        {headers: userHeaders}
    )
        .then(response => {
            return response.data.filter(user => user.userId !== 1 && user.userId !== "1").filter(user => user.active === true);
        })
        .catch(error => {
            console.log('get user by id error ', error)
            return error;
        });
};

var userValidToken = function (token) {
    return axios.post(`${SERVER_URL}/api/users/validToken`,
        {
            "token": token,
        },
    );
};

var userLogin = function (userId, password) {
    return axios.post(`${SERVER_URL}/api/users/login/authenticate`,
        {
            "userId": userId,
            "password": password
        },
    );
};


var updateUserById = function (updatedUser, userHeaders) {
    return axios.put(`${SERVER_URL}/api/users/update/userId/${updatedUser.userId}`,
        {
            fullname: updatedUser.fullname ? updatedUser.fullname : null,
            password: updatedUser.password ? updatedUser.password : null,
            email: updatedUser.email ? updatedUser.email : null,
            mailbox: updatedUser.mailbox ? updatedUser.mailbox : null,
            cellphone: updatedUser.cellphone ? updatedUser.cellphone : null,
            phone: updatedUser.phone ? updatedUser.phone : null,
            bornDate: updatedUser.bornDate ? updatedUser.bornDate : null,
            active: typeof updatedUser.active === 'boolean' ? updatedUser.active : null,
            image: updatedUser.image ? updatedUser.image : null,
        },
        {headers: userHeaders}
    )
        .then(response => {
            APP_SOCKET.emit('userUpdated');

            return response;
        })
        .catch(error => {
            console.log('get user by id error ', error)
            return error;
        });
};

var forgetPassword = function (userDetailsRemembered) {
    return axios.put(`${SERVER_URL}/api/users/forgetPassword`,
        {
            userId: userDetailsRemembered.userId ? userDetailsRemembered.userId : null,
            email: userDetailsRemembered.email ? userDetailsRemembered.email : null,
            mailbox: userDetailsRemembered.mailbox ? userDetailsRemembered.mailbox : null,
            cellphone: userDetailsRemembered.cellphone ? userDetailsRemembered.cellphone : null,
            phone: userDetailsRemembered.phone ? userDetailsRemembered.phone : null,
            bornDate: userDetailsRemembered.bornDate ? userDetailsRemembered.bornDate : null,
        },
    )
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('forgetPassword error ', error);
            return error;
        });
};

var saveRegistrationToken = function (userId, registrationToken, userHeaders) {
    return axios.put(`${SERVER_URL}/api/users/notifications/saveRegistrationToken`,
        {
            userId: userId,
            registrationToken: registrationToken,
        },
        {headers: userHeaders}
    )
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('saveRegistrationToken error ', error);
            return error;
        });
};


export default {
    getUserEvents,
    getUserById,
    userValidToken,
    userLogin,
    getUsers,
    updateUserById,
    forgetPassword,
    saveRegistrationToken
};
