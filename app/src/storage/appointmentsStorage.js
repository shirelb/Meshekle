import axios from "axios";
import {SERVER_URL} from "../shared/constants";

var getUserAppointments = function (userId, userHeaders) {
    return axios.get(`${SERVER_URL}/api/users/appointments/userId/${userId}`,
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
    return axios.get(`${SERVER_URL}/api/users/appointments/userId/${userId}`,
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

var postUserAppointmentRequest = function (userId, serviceProvider,roles,appointmentRequest, userHeaders) {
    return axios.post(`${SERVER_URL}/api/users/appointments/request`,
        {
            userId: userId,
            serviceProviderId: serviceProvider.serviceProviderId,
            role: serviceProvider.role,
            availableTime:appointmentRequest.availableTime,
            notes: appointmentRequest.notes ? appointmentRequest.notes : '',
            subject: JSON.stringify(appointmentRequest.subject)
        },
        {
            headers: userHeaders,
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('post user appointment request error ', error)
        });
};


export default {getUserAppointments, getUserAppointmentById,postUserAppointmentRequest};
