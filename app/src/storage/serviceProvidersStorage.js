import axios from "axios";
import {SERVER_URL} from "../shared/constants";

var getServiceProviders = function (userHeaders) {
    return axios.get(`${SERVER_URL}/api/serviceProviders`,
        {headers: userHeaders}
    )
        .then(response => {
            return response.data.filter(serviceProvider => serviceProvider.serviceProviderId !== 1 && serviceProvider.serviceProviderId !== "1").filter(serviceProvider => serviceProvider.active === true);
        })
        .catch(error => {
            console.log('get serviceProviders error ', error)
            return error;
        });
};

var getServiceProviderUserDetails = function (serviceProviderId, userHeaders) {
    return axios.get(`${SERVER_URL}/api/serviceProviders/userDetails/serviceProviderId/${serviceProviderId}`,
        {headers: userHeaders}
    )
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get serviceProvider user details error ', error)
            return error;
        });
};


export default {getServiceProviders, getServiceProviderUserDetails};
