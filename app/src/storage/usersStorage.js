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
        },
        {headers: userHeaders}
    )
        .then(response => {
            APP_SOCKET.emit('userUpdated');

            return response;
        })
        .catch(error => {
            console.log('get user by id error ', error)
        });
};


export default {getUserEvents, getUserById, userValidToken, userLogin, getUsers, updateUserById};
