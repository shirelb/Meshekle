import axios from "axios";
import {SERVER_URL, APP_SOCKET} from "../shared/constants";


var getUserAppointmentRequests = function (userId, userHeaders) {
    return axios.get(`${SERVER_URL}/api/appointmentRequests/user/userId/${userId}`,
        {
            headers: userHeaders,
            params: {
                status: 'requested'
            },
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get user appointment requests error ', error)
        });
};

var getUserAppointments = function (userId, userHeaders) {
    return axios.get(`${SERVER_URL}/api/appointments/user/userId/${userId}`,
        {
            headers: userHeaders,
            params: {
                status: 'set'
            },
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get user appointments error ', error)
        });
};

var getUserAppointmentById = function (userId, userHeaders, eventId) {
    return axios.get(`${SERVER_URL}/api/appointments/user/userId/${userId}`,
        {
            headers: userHeaders,
            params: {status: 'set', appointmentId: eventId}
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('get user appointments by id error ', error)
        });
};

var postUserAppointmentRequest = function (userId, serviceProvider, appointmentRequest, userHeaders) {
    return axios.post(`${SERVER_URL}/api/appointmentRequests/user/request`,
        {
            userId: userId,
            serviceProviderId: serviceProvider.serviceProviderId,
            role: serviceProvider.role,
            availableTime: appointmentRequest.availableTime,
            notes: appointmentRequest.notes ? appointmentRequest.notes : '',
            subject: JSON.stringify(appointmentRequest.subject)
        },
        {
            headers: userHeaders,
        })
        .then(response => {
            APP_SOCKET.emit('userPostAppointmentRequests', {
                serviceProviderId: serviceProvider.serviceProviderId
            });

            return response;
        })
        .catch(error => {
            console.log('post user appointment request error ', error)
        });
};


export default {getUserAppointments, getUserAppointmentById, postUserAppointmentRequest, getUserAppointmentRequests};
