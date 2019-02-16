import axios from "axios";
import {SERVER_URL} from "../shared/constants";
import moment from "../components/calendars/appointmentsCalendar/AppointmentsCalendar";

var getAppointmentsOfUser = function (userId,userHeaders) {
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
            console.log('load appointments error ', error)
        });
};

export default {getAppointmentsOfUser};
