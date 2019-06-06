
// import socketIOClient from "socket.io-client";
import io from "socket.io-client";
import store from "store";

const SERVER_URL = "http://212.199.203.85:80";

const WEB_SOCKET = io(SERVER_URL);

var connectToServerSocket = (serviceProviderId) => {
    WEB_SOCKET.connect();
    WEB_SOCKET.on('socketServerID', function (socketServerID) {
        console.log('Connection to server established. SocketID is', socketServerID);
        WEB_SOCKET.emit('storeWebClientInfo', {serviceProviderId: serviceProviderId});
    });
};

export {SERVER_URL, WEB_SOCKET,connectToServerSocket}
