module.exports = function (socket, pushToWebClient, pushToAllAppClient) {
    socket.on('serviceProviderUpdate', (data) => {
        console.log('socket serviceProviderUpdate data ', data);
        // pushToWebClient(data, 'getServiceProviders');
        pushToAllAppClient('getServiceProviders');
    });

    socket.on('serviceProviderAddRole', (data) => {
        console.log('socket serviceProviderAddRole data ', data);
        // pushToWebClient(data, 'getServiceProviders');
        pushToAllAppClient('getServiceProviders');
    });

    socket.on('serviceProviderRemoveRole', (data) => {
        console.log('socket serviceProviderRemoveRole data ', data);
        // pushToWebClient(data, 'getServiceProviders');
        pushToAllAppClient('getServiceProviders');
    });

    socket.on('serviceProviderCreated', (data) => {
        console.log('socket serviceProviderCreated data ', data);
        // pushToWebClient(data, 'getServiceProviders');
        pushToAllAppClient('getServiceProviders');
    });

    socket.on('serviceProviderShallowDeleted', (data) => {
        console.log('socket serviceProviderShallowDeleted data ', data);
        // pushToWebClient(data, 'getServiceProviders');
        pushToAllAppClient('getServiceProviders');
    });

    socket.on('serviceProviderDeepDeleted', (data) => {
        console.log('socket serviceProviderDeepDeleted data ', data);
        // pushToWebClient(data, 'getServiceProviders');
        pushToAllAppClient('getServiceProviders');
    });
};
