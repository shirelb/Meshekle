import axios from "axios";
import {SERVER_URL,WEB_SOCKET} from "../shared/constants";
import moment from 'moment';

//import moment from "../components/appointment/AppointmentAdd";
//WEB
var getAllChoreTypes = (serviceProviderId, headers) => {
    return axios.get(`${SERVER_URL}/api/chores/choreTypes`,
        {
            headers: headers,
            //params: {
            //}
        }
    )
        .then((response) => {
            let choreTypes = [];
            var type;
            for(type in response.data){
                if(response.data[type].serviceProviderId === serviceProviderId){
                    choreTypes.push(response.data[type]);
                }
                else{
                    console.log("else: ", type.serviceProviderId,  serviceProviderId)
                }

            }
            console.log('getAllChoreTypesForSeviceProvider id: ', serviceProviderId, ' and his types: ', choreTypes);
            return choreTypes;
        })
        .catch((error) => {
            console.log('getAllChoreTypesForSeviceProvider ', serviceProviderId, ' ', error);
            return null;
        });
};

var getChoreTypeSetting = function(userId, userHeaders, type){
    console.log("userHeaders: ",userHeaders);
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

var editChoreTypeSetting = function(serviceProviderId, headers, typeSettings){
    console.log("type: ",typeSettings);
    return axios.put(`${SERVER_URL}/api/chores/type/${typeSettings.choreTypeName}/settings/set`,
    {
        days: typeSettings.days,
        numberOfWorkers: Number(typeSettings.numberOfWorkers),
        frequency: Number(typeSettings.frequency),
        startTime: typeSettings.startTime,
        endTime: typeSettings.endTime,
        color: typeSettings.color
    },    
    
    {
            headers: headers, //
            
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get user chores error ', error)
        });
};

var createNewChoreType = function(serviceProviderId, headers, typeSettings){
    console.log("type: ",typeSettings,serviceProviderId );
    return axios.post(`${SERVER_URL}/api/chores/add/choreType`,
    {
        choreTypeName: typeSettings.choreTypeName,
        serviceProviderId: serviceProviderId,
        days: typeSettings.days,
        numberOfWorkers: Number(typeSettings.numberOfWorkers),
        frequency: Number(typeSettings.frequency),
        startTime: typeSettings.startTime,
        endTime: typeSettings.endTime,
        color: 'blue'/*typeSettings.color*/
      },    
    
    {
            headers: headers //
            
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('add chore type error ', error, headers)
        });
};

var getUserChoresForType = function(userId, userHeaders, type, date){
    console.log("type: and month ",type, moment(Date.now()).format('MM'));
    return axios.get(`${SERVER_URL}/api/chores/usersChores/type/${type}/month/${moment(Date.now()).format('MM')}/year/${moment(Date.now()).year()}`,
        {
            headers: userHeaders, //
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get user chores error ', error)
        });
};

var getUsersForChoreType = function(userId, userHeaders, type){
    console.log("type:getUsersForChoreType ",type);
    return axios.get(`${SERVER_URL}/api/chores/type/${type}/users`,
        {
            headers: userHeaders, //
        })
        .then(response => {
            console.log("4:getUsersForChoreType ",response);
            return response;
        })
        .catch(error => {
            console.log('get users for type error ', error)
        });
};

var createNewUserChore = function(serviceProviderId, headers, typeName, userId, date){
    console.log("type: ",typeName,serviceProviderId );
    return axios.post(`${SERVER_URL}/api/chores/add/userChore`,
    {
        userId: userId,
        choreTypeName: typeName,
        date: date,
        //originDate: date,
        isMark: false
      },    
    
    {
            headers: headers, //
            
        })
        .then(response => {
            WEB_SOCKET.emit('serviceProviderPostUserChore', {
                userId: userId,
            });
            return response;
        })
        .catch(error => {
            console.log('add chore type error ', error)
        });
};

var deleteUserChore = function(serviceProviderId, headers, id){//api29
    console.log("id:deleteUserChore ",id);
    return axios.delete(`${SERVER_URL}/api/chores/userChoreId/${id}/delete`,
        {
            headers: headers, //
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('deleting userchore error ', error)
        });
};

var deleteChoreType = function(serviceProviderId, headers, typeName){// api28
    console.log("typeName:deleteChoreType ",typeName);
    return axios.delete(`${SERVER_URL}/api/chores/type/${typeName}/delete`,
        {
            headers: headers, //
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('deleting chore type error ', error)
        });
};

var addUserToChoreType = function(serviceProviderId, headers, userId, typeName){
    console.log("type: ",typeName,serviceProviderId );
    return axios.post(`${SERVER_URL}/api/chores/choreType/users/add/userId`,
    {
        userId: userId,
        choreTypeName: typeName,
      },    
    
    {
            headers: headers, //
            
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('add user to chore type error ', error)
        });
};

var deleteUserFromChoreType = function(serviceProviderId, headers,userId, typeName){// api28
    console.log("typeName:deleteUserFromChoreType ",typeName);
    return axios.delete(`${SERVER_URL}/api/chores/type/${typeName}/users/userId/${userId}`,
        {
            headers: headers, //
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('deleting user from chore type error ', error)
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

var createUserchoreEvent = function(serviceProviderId, headers, userId,eventId){
    return axios.post(`${SERVER_URL}/api/chores/add/event/userChore`,
    {
        userId: userId,
        eventType: 'UsersChores',
        eventId: eventId,
      },    
    
    {
            headers: headers, //
            
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('add chore event error ', error)
        });
};

var getAllPastUserChores = function(userId, userHeaders){
    return axios.get(`${SERVER_URL}/api/chores/usersChores/future/false`,
        {
            headers: userHeaders, //
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get all past user chores error ', error)
        });
};
//router.get('/userChores/userId/:userId/future/:future', function (req, res, next) {


export default {
    getAllChoreTypes,
    getChoreTypeSetting,
    editChoreTypeSetting,
    createNewChoreType,
    getUserChoresForType,
    getUsersForChoreType,
    createNewUserChore,
    deleteUserChore,
    deleteChoreType,
    addUserToChoreType,
    deleteUserFromChoreType,
    getReplacementRequests,
    createUserchoreEvent,
    getAllPastUserChores
}