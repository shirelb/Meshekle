import axios from "axios";
import {SERVER_URL} from "../shared/constants";
import moment from 'moment';


var getUserChoresForUser = function (userId, userHeaders) {
    return axios.get(`${SERVER_URL}/api/chores/userChores/userId/${userId}/future/any`,
        {
            headers: userHeaders, //
            params: {
                status: 'set'
            },
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get user chores error ', error)
        });
};

var getOtherWorkers = function(userId, userHeaders, type, month, year, day){
    return axios.get(`${SERVER_URL}/api/chores/usersChores/type/${type}/month/${month}/year/${year}`,
        {
            headers: userHeaders, //
            params: {
                status: 'set'
            },
        })
        .then(response => {
            let otherWorkers ="";
            for(element in response.data.usersChores){
                if(moment(response.data.usersChores[element].date).format('DD-MM-YYYY')===String(moment(day).format('DD-MM-YYYY'))){
                    otherWorkers= otherWorkers+String(response.data.usersChores[element].User.fullname+"\n");
                }
            }
            /*response.data.chores.forEach(element => {
                if(element.date ===new Date(String(year+'-'+month+'-'+day))){
                    otherWorkers = otherWorkers +', '+ String(element.userId);
                    otherWorkers = "lll",
                }
            });*/
            return otherWorkers;
        })
        .catch(error => {
            console.log('get user chores error ', error)
        });
};

var getChoreTypeSetting = function(userId, userHeaders, type){
    return axios.get(`${SERVER_URL}/api/chores/type/${type}/settings`,
        {
            headers: userHeaders, //
            params: {
                status: 'set'
            },
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get user chores error ', error)
        });
};

var getReplacementRequests = function(userId, userHeaders, type,status){
    return axios.get(`${SERVER_URL}/api/chores/replacementRequests/status/${status}`,
        {
            headers: userHeaders, 
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get Replacement Requests error ', error)
        });
};

var createSpecificReplacementRequest = function(userId, headers, choreIdOfSender, choreIdOfReceiver, status){
    return axios.post(`${SERVER_URL}/api/chores/replacementRequests/specificRequest`,
    {
        choreIdOfSender: choreIdOfSender,
        choreIdOfReceiver: choreIdOfReceiver,
        status: status,
      },    
    
    {
            headers: headers, //
            
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('create specific replacement request error ', error)
            
        });
};

var changeReplacementRequestStatus = function(userId, headers, choreIdOfSender, choreIdOfReceiver, status){
    return axios.put(`${SERVER_URL}/api/chores/replacementRequests/changeStatus`,
    {
        choreIdOfSender: choreIdOfSender,
        choreIdOfReceiver: choreIdOfReceiver,
        status: status
    },    
    
    {
            headers: headers, //
            
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('change replacement request status error ', error)
        });
};

var replaceUserChores = function(userId, headers, choreIdOfSender, choreIdOfReceiver){
    return axios.put(`${SERVER_URL}/api/chores/replacementRequests/replace`,
    {
        choreIdOfSender: choreIdOfSender,
        choreIdOfReceiver: choreIdOfReceiver,
    },    
    
    {
            headers: headers, //
            
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('replace UserChores error ', error)
        });
};

var generalReplacementRequest = function(userId, headers, userChoreId ,isMark){
    return axios.put(`${SERVER_URL}/api/chores/replacementRequests/generalRequest`,
    {
        userChoreId: userChoreId,
        isMark: isMark,
    },    
    
    {
            headers: headers, //
            
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('general Replacement Request error ', error)
        });
};

var getUserChoresForType = function (userId, userHeaders, type, month, year) {
    return axios.get(`${SERVER_URL}/api/chores/usersChores/type/${type}/month/${month}/year/${year}`,
        {
            headers: userHeaders, 
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get user chores for type and month error ', error)
        });
};

export default {getUserChoresForUser,
                getChoreTypeSetting, 
                getOtherWorkers, 
                getReplacementRequests, 
                createSpecificReplacementRequest, 
                changeReplacementRequestStatus,
                replaceUserChores,
                generalReplacementRequest,
                getUserChoresForType
            };