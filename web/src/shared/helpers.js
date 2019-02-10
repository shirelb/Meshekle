import axios from "axios";
import {SERVER_URL} from "./constants";
import store from "store";


const serviceProviderHeaders = {
    'Authorization': 'Bearer ' + store.get('serviceProviderToken')
};

var getUserByUserID = (userId, headers) => {
    return axios.get(`${SERVER_URL}/api/users/userId/${userId}`,
        {headers: headers}
    )
        .then((response) => {
            let user = response.data[0];
            return user;
        })
        .catch((error) => {
            console.log('getUserByUserID ', userId, ' ', error);
            return null;
        });
};

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

var getUsers = () => {
    return axios.get(`${SERVER_URL}/api/users`,
        {headers: serviceProviderHeaders}
    )
        .then((response) => {
            return response.data;
        });
};

var getRolesOfServiceProvider = (serviceProviderId) => {
    return axios.get(`${SERVER_URL}/api/serviceProviders/roles/serviceProviderId/${serviceProviderId}`,
        {headers: serviceProviderHeaders}
    )
        .then((response) => {
            let roles = response.data;
            console.log('roles ', roles);
            return roles;
        })
        .catch((error) => {
            console.log('error ', error);
        });
};

export default {
    getUserByUserID,
    getAppointmentByAppointmentID,
    getUsers,
    getRolesOfServiceProvider,
    getAppointmentRequestByAppointmentRequestID
};
