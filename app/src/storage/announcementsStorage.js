import axios from "axios";
import {APP_SOCKET, SERVER_URL} from "../shared/constants";
import {Alert} from "react-native";


var getOnAirAnnouncements = function (userHeaders) {
    return axios.get(`${SERVER_URL}/api/announcements/status/${"On air"}`,
        {
            headers: userHeaders,
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get anouncements error ', error)
        });
};

var getUserAnnouncements = function (userHeaders,userId) {
    return axios.get(`${SERVER_URL}/api/announcements/userId/${userId}`,
        {
            headers: userHeaders,
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get anouncements error ', error)
        });
};

var getCategories = function (userHeaders) {
    console.log(userHeaders);
    return axios.get(`${SERVER_URL}/api/announcements/categories`,
        {
            headers: userHeaders,
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get anouncements error ', error)
        });
};

var getUniqueCategories = function (userHeaders) {
    console.log(userHeaders);
    return axios.get(`${SERVER_URL}/api/announcements/categories`,
        {
            headers: userHeaders,
        })
        .then(response => {
            let data = JSON.parse(JSON.stringify(response.data));
            data = data.map(item => item.categoryName);
            data = data.filter((item,pos) => {
                return data.indexOf(item) === pos;
            });
            data = data.map(item => {
               return {categoryName:item, categoryId: response.data.filter(a => a.categoryName === item)[0].categoryId}
            });
            response.data = data;
            return response;
        })
        .catch(error => {
            console.log('get anouncements error ', error)
        });
};

var getCategoriesSubs = function (userHeaders,userId) {
    console.log(userHeaders);
    return axios.get(`${SERVER_URL}/api/announcements/subscription/userId/${userId}` ,
        {
            headers: userHeaders,
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get anouncements error ', error)
        });
};

var addCategorySub = function (userHeaders,userId,categoryId) {
    console.log(userHeaders);
    return axios.put(`${SERVER_URL}/api/announcements/subscription/add` ,
        {
            userId:userId,
            categoryId:categoryId,
        },{
            headers: userHeaders,
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get anouncements error ', error)
        });
};


var deleteCategorySub = function (userHeaders,userId,categoryId) {
    console.log(userHeaders);
    return axios.put(`${SERVER_URL}/api/announcements/subscription/delete` ,
        {
            userId:userId,
            categoryId:categoryId,
        },{
            headers: userHeaders,
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get anouncements error ', error)
        });
};

var updateCategorySub = function (userHeaders,userId,switches) {
    console.log(userHeaders);
    return axios.post(`${SERVER_URL}/api/announcements/subscription/update` ,
        {
            userId:userId,
            categories:switches,
        },{
            headers: userHeaders,
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get anouncements error ', error)
        });
};

var addAnnouncement = (announcement,headers) => {
    return axios.post(`${SERVER_URL}/api/announcements/add`,
        announcement,
        {headers: headers}
    )
        .then((response) => {
            APP_SOCKET.emit('userPostAnnouncementsRequest', {});
            return response;
        })
        .catch((error)=>{
            Alert.alert(
                'אופס, יש בעיה',
                error.response.data.message,
                [
                    {text: 'אישור', style: 'cancel'},
                ]
            );
            return error.response;
        });
};


var addEvent = (userId,announcementId,headers) => {
    return axios.post(`${SERVER_URL}/api/announcements/event/add`,
        {userId: userId, announcementId: announcementId},
        {headers: headers}
    )
        .then((response) => {
            return response;
        })
        .catch((error)=>{
            Alert.alert(
                'אופס, יש בעיה',
                error.response.data.message,
                [
                    {text: 'אישור', style: 'cancel'},
                ]
            );
            return error.response;
        });
};



export default {
    getOnAirAnnouncements,
    getCategories,
    getCategoriesSubs,
    addCategorySub,
    deleteCategorySub,
    updateCategorySub,
    addAnnouncement,
    getUserAnnouncements,
    getUniqueCategories,
    addEvent,
};
