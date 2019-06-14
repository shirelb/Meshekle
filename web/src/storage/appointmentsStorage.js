import axios from "axios";
import {SERVER_URL, WEB_SOCKET} from "../shared/constants";
import moment from "moment";


var getAppointmentByAppointmentID = (serviceProviderId, appointmentId, headers) => {
    return axios.get(`${SERVER_URL}/api/appointments/serviceProvider/serviceProviderId/${serviceProviderId}`,
        {
            headers: headers,
            params: {
                appointmentId: appointmentId,
            }
        }
    )
        .then((response) => {
            let appointment = response.data[0];
            // console.log('getAppointmentByAppointmentID ', appointmentId, ' ', appointment);
            return appointment;
        })
        .catch((error) => {
            console.log('getAppointmentByAppointmentID ', appointmentId, ' ', error);
            return error;
        });
};

var getAppointmentRequestByAppointmentRequestID = (serviceProviderId, appointmentRequestId, headers) => {
    return axios.get(`${SERVER_URL}/api/appointmentRequests/serviceProvider/serviceProviderId/${serviceProviderId}`,
        {
            headers: headers,
            params: {
                appointmentRequestId: appointmentRequestId,
            }
        }
    )
        .then((response) => {
            let appointmentRequest = response.data[0];
            // console.log('getAppointmentByAppointmentID ', appointmentRequestId, ' ', appointmentRequest);
            return appointmentRequest;
        })
        .catch((error) => {
            console.log('getAppointmentByAppointmentID ', appointmentRequestId, ' ', error);
            return error;
        });
};

var getServiceProviderAppointmentRequests = (serviceProviderId, headers) => {
    return axios.get(`${SERVER_URL}/api/appointmentRequests/serviceProvider/serviceProviderId/${serviceProviderId}`,
        {
            headers: headers,
            params: {
                status: 'requested'
            },
        }
    )
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log('get service provider appointment requests error ', error);
            return error;
        });
};

var getServiceProviderAppointments = (serviceProviderId, headers) => {
    return axios.get(`${SERVER_URL}/api/appointments/serviceProvider/serviceProviderId/${serviceProviderId}`,
        {
            headers: headers,
            params: {
                status: 'set'
            },
        }
    )
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log('get service provider appointment requests error ', error);
            return error;
        });
};

var setAppointment = (appointment, serviceProviderId, roles, headers) => {
    return axios.post(`${SERVER_URL}/api/appointments/serviceProvider/set`,
        {
            userId: appointment.clientId,
            serviceProviderId: serviceProviderId,
            role: appointment.role,
            date: moment.isMoment(appointment.date) ? appointment.date.format('YYYY-MM-DD') : appointment.date,
            startHour: moment.isMoment(appointment.startTime) ? appointment.startTime.format("HH:mm") : appointment.startTime,
            endHour: moment.isMoment(appointment.endTime) ? appointment.endTime.format("HH:mm") : appointment.endTime,
            notes: appointment.remarks ? appointment.remarks : '',
            subject: JSON.stringify(appointment.subject)
        },
        {
            headers: headers
        }
    )
        .then((response) => {
            WEB_SOCKET.emit('serviceProviderPostAppointment', {
                userId: appointment.clientId,
            });

            return response;
        })
        .catch((error) => {
            console.log('add appointment ', error);
            return error;
        });
};

var updateAppointment = (event, headers) => {
    return axios.put(`${SERVER_URL}/api/appointments/serviceProvider/update/appointmentId/${event.appointmentId}`,
        {
            startDateAndTime: moment(event.date + ' ' + event.startTime).toDate(),
            endDateAndTime: moment(event.date + ' ' + event.endTime).toDate(),
            remarks: event.remarks,

            subject: JSON.stringify(event.subject),
            clientId: event.clientId,
            role: event.role,
        },
        {
            headers: headers,
        }
    )
        .then((response) => {
            WEB_SOCKET.emit('serviceProviderUpdateAppointment', {
                userId: event.clientId
            });

            return response;
        })
        .catch((error) => {
            console.log('update appointment error ', error);
            return error;
        });
};

var cancelAppointmentById = (appointment, headers) => {
    return axios.put(`${SERVER_URL}/api/appointments/serviceProvider/cancel/appointmentId/${appointment.appointmentId}`,
        {},
        {
            headers: headers
        }
    )
        .then((response) => {
            WEB_SOCKET.emit('serviceProviderCancelAppointment', {
                userId: appointment.AppointmentDetail.clientId,
            });

            return response
        })
        .catch((error) => {
            console.log('cancel appointment error ', error);
            return error;
        });
};

var rejectAppointmentRequestById = (appointmentRequest, headers) => {
    return axios.put(`${SERVER_URL}/api/appointmentRequests/serviceProvider/update/status/appointmentRequestId/${appointmentRequest.requestId}`,
        {},
        {
            headers: headers,
            params: {
                status: 'rejected'
            },
        }
    )
        .then((response) => {
            WEB_SOCKET.emit('serviceProviderRejectAppointmentRequest', {
                userId: appointmentRequest.AppointmentDetail.clientId,
            });

            return response
        })
        .catch((error) => {
            console.log('reject appointment request error ', error);
            return error;
        });
};

var approveAppointmentRequestById = (appointmentRequest, headers) => {
    return axios.put(`${SERVER_URL}/api/appointmentRequests/serviceProvider/update/status/appointmentRequestId/${appointmentRequest.requestId}`,
        {},
        {
            headers: headers,
            params: {
                status: 'approved'
            },
        }
    )
        .then((response) => {
            WEB_SOCKET.emit('serviceProviderApproveAppointmentRequest', {
                userId: appointmentRequest.AppointmentDetail.clientId,
            });

            return response
        })
        .catch((error) => {
            console.log('approve appointment request error ', error);
            return error;
        });
};


export default {
    getAppointmentByAppointmentID,
    getAppointmentRequestByAppointmentRequestID,
    setAppointment,
    cancelAppointmentById,
    rejectAppointmentRequestById,
    approveAppointmentRequestById,
    getServiceProviderAppointmentRequests,
    getServiceProviderAppointments,
    updateAppointment,
};
