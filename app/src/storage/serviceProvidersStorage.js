import axios from "axios";
import {SERVER_URL} from "../shared/constants";

var getServiceProviders = function (userHeaders) {
    return axios.get(`${SERVER_URL}/api/serviceProviders`,
        {headers: userHeaders}
    )
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('load appointments error ', error)
        });
};


export default {getServiceProviders};
