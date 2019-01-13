import axios from "axios";
import {SERVER_URL} from "./constants";

var getUserByUserID = (userId, headers) => {
    return axios.get(`${SERVER_URL}/api/users/userId/${userId}`,
        {headers: headers}
    )
        .then((response) => {
            let user = response.data[0];
            console.log('getUserByUserID ', userId, ' ', user);
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

export default {getUserByUserID, getAppointmentByAppointmentID};
