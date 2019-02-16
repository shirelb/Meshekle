import axios from "axios";
import {SERVER_URL} from "../shared/constants";

var getUserEvents = function (userId, userHeaders) {
    return axios.get(`${SERVER_URL}/api/users/events/userId/${userId}`,
        {headers: userHeaders}
    )
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('load appointments error ', error)
        });
};

export default {getUserEvents};
