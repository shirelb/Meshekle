import axios from "axios";
import {SERVER_URL} from "../shared/constants";
import store from "store";

// const serviceProviderHeaders = {
//     'Authorization': 'Bearer ' + store.get('serviceProviderToken')
// };

// var getUserByUserID = (userId, headers) => {
//     return axios.get(`${SERVER_URL}/api/users/userId/${userId}`,
//         {headers: headers}
//     )
//         .then((response) => {
//             let user = response.data[0];
//             return user;
//         })
//         .catch((error) => {
//             console.log('getUserByUserID ', userId, ' ', error);
//             return null;
//         });
// };

var getAnnouncements = (serviceProviderId,headers) => {
    return axios.get(`${SERVER_URL}/api/announcements/serviceProviderId/${serviceProviderId}`,
        {headers: headers}
    )
        .then((response) => {
            return response;
        });
};

var getAnnouncementsRequests = (serviceProviderId,headers) => {
    return axios.get(`${SERVER_URL}/api/announcements/requests/serviceProviderId/${serviceProviderId}`,
        {headers: headers}
    )
        .then((response) => {
            return response;
        });
};
var getCategoriesByServiceProviderId = (serviceProviderId,headers) => {
    return axios.get(`${SERVER_URL}/api/announcements/categories/serviceProviderId/${serviceProviderId}`,
        {headers: headers}
    )
        .then((response) => {
            return response;
        });
};
var addAnnouncement = (announcement,headers) => {
    return axios.post(`${SERVER_URL}/api/announcements/add`,
        announcement,
        {headers: headers}
    )
        .then((response) => {
            return response;
        });
};

export default {getAnnouncements, getAnnouncementsRequests, getCategoriesByServiceProviderId,addAnnouncement};
