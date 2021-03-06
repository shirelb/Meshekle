import axios from "axios";
import {SERVER_URL} from "../shared/constants";


var getAnnouncements = (serviceProviderId,headers) => {
    return axios.get(`${SERVER_URL}/api/announcements/serviceProviderId/${serviceProviderId}`,
        {headers: headers}
    )
        .then((response) => {
            return response;
        });
};

var getAnsweredAnnouncements = (serviceProviderId,headers) => {
    return axios.get(`${SERVER_URL}/api/announcements/answeredRequests/serviceProviderId/${serviceProviderId}`,
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
var getCategories = (headers) => {
    return axios.get(`${SERVER_URL}/api/announcements/categories`,
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
        }).catch(error => error.response);
};

var updateAnnouncement = (announcement,headers) => {
    return axios.put(`${SERVER_URL}/api/announcements/update/announcementId/${announcement.announcementId}`,
        announcement,
        {headers: headers}
    )
        .then((response) => {
            return response;
        }).catch(error => error.response);
};

var removeAnnouncement = (announcementId,headers) => {
    return axios.put(`${SERVER_URL}/api/announcements/delete/announcementId/${announcementId}`,
        [],
        {headers: headers}
    )
        .then((response) => {
            return response;
        });
};

var removeCategory = (categoryName,headers) => {
    return axios.put(`${SERVER_URL}/api/announcements/categories/delete/categoryName/${categoryName}`,
        [],
        {headers: headers}
    )
        .then((response) => {
            return response;
        });
};

var getUsers = function (userHeaders) {
    return axios.get(`${SERVER_URL}/api/users`,
        {
            headers: userHeaders,
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get users error ', error)
        });
};

var addCategory = function (categoryList,userHeaders) {
    return axios.post(`${SERVER_URL}/api/announcements/categories/add`,
        categoryList,
        {
            headers: userHeaders,
        })
        .then(response => {
            return response;
        })
        .catch(error => error.response);
};

var updateCategory = function (categoryList,userHeaders) {
    categoryList.managers = categoryList.managers.filter(item => item != null);
    return axios.post(`${SERVER_URL}/api/announcements/categories/update`,
        categoryList,
        {
            headers: userHeaders,
        })
        .then(response => {
            return response;
        })
        .catch(error => error.response);
};

export default {
    getAnsweredAnnouncements,
    getAnnouncements,
    getAnnouncementsRequests,
    getCategoriesByServiceProviderId,
    addAnnouncement,
    updateAnnouncement,
    removeAnnouncement,
    getUsers,
    getCategories,
    addCategory,
    updateCategory,
    removeCategory
};
