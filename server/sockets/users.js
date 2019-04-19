
module.exports = function (socket,pushToAllWebClient,pushToAllAppClient) {
    socket.on('userShallowDeleted', (data) => {
        console.log('socket userShallowDeleted data ', data);
        pushToAllWebClient('getUsers');
        pushToAllAppClient('getUsers');
    });

    socket.on('userCreated', (data) => {
        console.log('socket userCreated data ', data);
        pushToAllWebClient('getUsers');
        pushToAllAppClient('getUsers');
    });

    socket.on('userUpdated', (data) => {
        console.log('socket userUpdated data ', data);
        pushToAllWebClient('getUsers');
        pushToAllAppClient('getUsers');
    });


};
