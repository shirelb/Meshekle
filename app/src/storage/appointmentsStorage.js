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


export default {getUserAppointments,getUserAppointmentById};
