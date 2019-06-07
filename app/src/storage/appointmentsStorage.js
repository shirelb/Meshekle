import axios from "axios";
import {APP_SOCKET, SERVER_URL} from "../shared/constants";


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

var cancelAppointmentRequestById = (appointmentRequest, headers) => {
    return axios.put(`${SERVER_URL}/api/appointmentRequests/user/reject`,
        {
            userId: appointmentRequest.AppointmentDetail.clientId,
            appointmentRequestId: appointmentRequest.requestId,
        },
        {
            headers: headers,
            params: {
                status: 'rejected'
            },
        }
    )
        .then((response) => {
            APP_SOCKET.emit('userCancelAppointmentRequests', {
                serviceProviderId: appointmentRequest.AppointmentDetail.serviceProviderId,
            });

            return response
        })
        .catch((error) => {
            console.log('reject appointment request error ', error);
        });
};

var cancelAppointmentById = (appointment, headers) => {
    return axios.put(`${SERVER_URL}/api/appointments/user/cancel/userId/${appointment.AppointmentDetail.clientId}/appointmentId/${appointment.appointmentId}`,
        {},
        {
            headers: headers
        }
    )
        .then((response) => {
            APP_SOCKET.emit('userCancelAppointment', {
                serviceProviderId: appointment.AppointmentDetail.serviceProviderId,
            });

            return response
        })
        .catch((error) => {
            console.log('cancel appointment error ', error);
        });
};


export default {
    getUserAppointments,
    getUserAppointmentById,
    postUserAppointmentRequest,
    getUserAppointmentRequests,
    cancelAppointmentRequestById,
    cancelAppointmentById,
};
