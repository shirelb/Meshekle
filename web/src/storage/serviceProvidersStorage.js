import axios from "axios";
import {SERVER_URL} from "../shared/constants";
import store from "store";

const serviceProviderHeaders = {
    'Authorization': 'Bearer ' + store.get('serviceProviderToken')
};

var getServiceProviders = function () {
    return axios.get(`${SERVER_URL}/api/serviceProviders`,
        {headers: serviceProviderHeaders}
    )
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get serviceProviders error ', error)
        });
};

var getRolesOfServiceProvider = (serviceProviderId) => {
    return axios.get(`${SERVER_URL}/api/serviceProviders/roles/serviceProviderId/${serviceProviderId}`,
        {headers: serviceProviderHeaders}
    )
        .then((response) => {
            let roles = response.data;
            console.log('roles ', roles);
            return roles;
        })
        .catch((error) => {
            console.log('get serviceProvider roles error ', error)
        });
};

var serviceProviderLogin = (userId, password) => {
    return axios.post(`${SERVER_URL}/api/serviceProviders/login/authenticate`,
        {
            "userId": userId,
            "password": password
        },
    );
};

var serviceProviderValidToken = function (token) {
    return axios.post(`${SERVER_URL}/api/serviceProviders/validToken`,
        {
            "token": token
        },
    );
}

var getServiceProviderPermissionsById = (serviceProviderId) => {
    return axios.get(`${SERVER_URL}/api/serviceProviders/serviceProviderId/${serviceProviderId}/permissions`,
        {headers: serviceProviderHeaders}
    )
        .then((response) => {
            let permissions = response.data;
            console.log('permissions ', permissions);
            return permissions;
        })
        .catch((error) => {
            console.log('error ', error);
        });
};


export default {
    getServiceProviders,
    getRolesOfServiceProvider,
    serviceProviderLogin,
    serviceProviderValidToken,
    getServiceProviderPermissionsById,

};
