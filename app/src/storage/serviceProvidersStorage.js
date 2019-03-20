import axios from "axios";
import {SERVER_URL} from "../shared/constants";

var getServiceProviders = function (userHeaders) {
    return axios.get(`${SERVER_URL}/api/serviceProviders`,
        {headers: userHeaders}
    )
        .then(response => {
            return response.data.filter(serviceProvider => serviceProvider.serviceProviderId !== 1 && serviceProvider.serviceProviderId !== "1");
        })
        .catch(error => {
            console.log('get serviceProviders error ', error)
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
        });
};


export default {getServiceProviders, getServiceProviderUserDetails};
