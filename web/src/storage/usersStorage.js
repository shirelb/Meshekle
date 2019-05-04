import axios from "axios";
import {SERVER_URL, WEB_SOCKET} from "../shared/constants";
import store from "store";

const serviceProviderHeaders = {
    'Authorization': 'Bearer ' + store.get('serviceProviderToken'),
    //'Access-Control-Allow-Credentials': true,
    //'Access-Control-Allow-Origin':'*'
};

var getUserByUserID = (userId, headers) => {
    return axios.get(`${SERVER_URL}/api/users/userId/${userId}`,
        {headers: headers}
    )
        .then((response) => {
            let user = response.data[0];
            return user;
        })
        .catch((error) => {
            console.log('getUserByUserID ', userId, ' error ', error);
            return null;
        });
};

var getUsers = () => {
    return axios.get(`${SERVER_URL}/api/users`,
        {headers: serviceProviderHeaders}
    )
        .then((response) => {
            return response.data.filter(user => user.userId !== 1 && user.userId !== "1");
        })
        .catch((error) => {
            console.log('getUsers error ', error);
            return null;
        });
};

var deleteUserByUserID = (userId, headers) => {
    return axios.delete(`${SERVER_URL}/api/serviceProviders/users/userId/${userId}/delete`,
        {headers: headers}
    )
        .then((response) => {
            WEB_SOCKET.emit('userShallowDeleted');

            return response;
        })
        .catch((error) => {
            console.log('deleteUserByUserID ', userId, ' error ', error);
            return null;
        });
};

var createUser = (newUser, serviceProviderHeaders) => {
    serviceProviderHeaders['Access-Control-Allow-Origin'] = '*';
    return axios.post(`${SERVER_URL}/api/serviceProviders/users/add`,
        {
            userId: newUser.userId,
            fullname: newUser.fullname,
            email: newUser.email,
            mailbox: newUser.mailbox,
            cellphone: newUser.cellphone,
            phone: newUser.phone,
            bornDate: newUser.bornDate,
            image: newUser.image ? newUser.image : null,
        },
        {headers: serviceProviderHeaders}
    )
        .then((response) => {
            WEB_SOCKET.emit('userCreated');

            return response;
        })
        .catch((error) => {
            console.log('createUser error ', error);
            return null;
        });
};

var updateUserById = function (updatedUser, serviceProviderHeaders) {
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
        {headers: serviceProviderHeaders}
    )
        .then(response => {
            WEB_SOCKET.emit('userUpdated');

            return response;
        })
        .catch(error => {
            console.log('updateUserById error ', error)
            return null;
        });
};


export default {getUserByUserID, getUsers, deleteUserByUserID, createUser, updateUserById};
