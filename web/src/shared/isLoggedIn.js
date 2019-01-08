import store from 'store';
import axios from 'axios';
import {SERVER_URL} from "./constants";

export default () => {
    // !!store.get('loggedIn') ?
    var serviceProviderToken = store.get('serviceProviderToken');
    console.log("serviceProviderToken ", serviceProviderToken);

    if (serviceProviderToken === null || serviceProviderToken === undefined)
        return new Promise(resolve => false);
    else {
        return axios.post(`${SERVER_URL}/api/serviceProviders/validToken`,
            {
                "token": serviceProviderToken,
            },
        )
            .then(validTokenResponse => {
                console.log("validTokenResponse ", validTokenResponse);
                store.set('serviceProviderId', validTokenResponse.data.payload.serviceProviderId);
                store.set('userId', validTokenResponse.data.payload.userId);
                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            });
        // return true;
        // setTimeout(() => {
        // }, 1000)
    }
}