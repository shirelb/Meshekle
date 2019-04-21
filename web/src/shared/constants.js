/*
export const SERVER_URL = __DEV__ ?
    "http://192.168.0.107:4000"
    :
    "https://my-production-url.com";
*/

// import socketIOClient from "socket.io-client";
import openSocket from "socket.io-client";
import store from "store";

const SERVER_URL = "http://10.0.0.236:4000";

const WEB_SOCKET = openSocket(SERVER_URL);

var connectToServerSocket = (serviceProviderId) => {
    WEB_SOCKET.on('socketServerID', function (socketServerID) {
        console.log('Connection to server established. SocketID is', socketServerID);
        WEB_SOCKET.emit('storeWebClientInfo', {serviceProviderId: serviceProviderId});
    });
};

export {SERVER_URL, WEB_SOCKET,connectToServerSocket}
