import axios from "axios";
import {SERVER_URL} from "../shared/constants";
import moment from "../components/appointment/AppointmentAdd";

var getAppointmentByAppointmentID = (serviceProviderId, appointmentId, headers) => {
    return axios.get(`${SERVER_URL}/api/serviceProviders/appointments/serviceProviderId/${serviceProviderId}`,
        {
            headers: headers,
            params: {
                appointmentId: appointmentId,
            }
        }
    )
        .then((response) => {
            let appointment = response.data[0];
            console.log('getAppointmentByAppointmentID ', appointmentId, ' ', appointment);
            return appointment;
        })
        .catch((error) => {
            console.log('getAppointmentByAppointmentID ', appointmentId, ' ', error);
            return null;
        });
};

var getAppointmentRequestByAppointmentRequestID = (serviceProviderId, appointmentRequestId, headers) => {
    return axios.get(`${SERVER_URL}/api/serviceProviders/appointmentRequests/serviceProviderId/${serviceProviderId}`,
        {
            headers: headers,
            params: {
                appointmentRequestId: appointmentRequestId,
            }
        }
    )
        .then((response) => {
            let appointmentRequest = response.data[0];
            console.log('getAppointmentByAppointmentID ', appointmentRequestId, ' ', appointmentRequest);
            return appointmentRequest;
        })
        .catch((error) => {
            console.log('getAppointmentByAppointmentID ', appointmentRequestId, ' ', error);
            return null;
        });
};

var getServiceProviderAppointmentRequests = (serviceProviderId, headers) => {
    return axios.get(`${SERVER_URL}/api/serviceProviders/appointmentRequests/serviceProviderId/${serviceProviderId}`,
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
        });
};

var getServiceProviderAppointments = (serviceProviderId, headers) => {
    return axios.get(`${SERVER_URL}/api/serviceProviders/appointments/serviceProviderId/${serviceProviderId}`,
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
        });
};

var setAppointment = (appointment, serviceProviderId, roles, headers) => {
    return axios.post(`${SERVER_URL}/api/serviceProviders/appointments/set`,
        {
            userId: appointment.clientId,
            serviceProviderId: serviceProviderId,
            role: roles[0],
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
            return response;
        })
        .catch((error) => {
            console.log('add appointment ', error);
        });
};

var updateAppointment = (event, headers) => {
    return  axios.put(`${SERVER_URL}/api/serviceProviders/appointments/update/appointmentId/${event.appointmentId}`,
        {
            startDateAndTime: event.startDateAndTime,
            endDateAndTime: event.endDateAndTime,
        },
        {
            headers: headers,
        }
    )
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log('update appointment error ', error);
        });
};

var cancelAppointmentById = (appointmentId, headers) => {
    return axios.put(`${SERVER_URL}/api/serviceProviders/appointments/cancel/appointmentId/${appointmentId}`,
        {},
        {
            headers: headers
        }
    )
        .then((response) => {
            return response
        })
        .catch((error) => {
            console.log('cancel appointment error ', error);
        });
};

var rejectAppointmentRequestById = (appointmentRequestId, headers) => {
    return axios.put(`${SERVER_URL}/api/serviceProviders/appointmentRequests/status/appointmentRequestId/${appointmentRequestId}`,
        {},
        {
            headers: headers,
            params: {
                status: 'reject'
            },
        }
    )
        .then((response) => {
            return response
        })
        .catch((error) => {
            console.log('reject appointment request error ', error);
        });
};


export default {
    getAppointmentByAppointmentID,
    getAppointmentRequestByAppointmentRequestID,
    setAppointment,
    cancelAppointmentById,
    rejectAppointmentRequestById,
    getServiceProviderAppointmentRequests,
    getServiceProviderAppointments,
    updateAppointment,
};
