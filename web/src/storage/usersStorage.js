import axios from "axios";
import {SERVER_URL} from "../shared/constants";
import store from "store";

const serviceProviderHeaders = {
    'Authorization': 'Bearer ' + store.get('serviceProviderToken')
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
            console.log('getUserByUserID ', userId, ' ', error);
            return null;
        });
};

var getUsers = () => {
    return axios.get(`${SERVER_URL}/api/users`,
        {headers: serviceProviderHeaders}
    )
        .then((response) => {
            return response;
        });
};


export default {getUserByUserID, getUsers};
