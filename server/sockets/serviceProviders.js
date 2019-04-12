
module.exports = function (socket,pushToWebClient,pushToAppClient) {
    socket.on('serviceProviderUpdate', (data) => {
        console.log('socket serviceProviderUpdate data ', data);
        //todo complete push to all clients + push to specific serviceProvider
        pushToWebClient(data, 'getServiceProviderAfterUpdate');
    });

    socket.on('serviceProviderAddRole', (data) => {
        console.log('socket serviceProviderAddRole data ', data);
        //todo complete push to all clients + push to specific serviceProvider
        pushToWebClient(data, 'getServiceProviderAfterUpdate');
    });

    socket.on('serviceProviderRemoveRole', (data) => {
        console.log('socket serviceProviderRemoveRole data ', data);
        //todo complete push to all clients + push to specific serviceProvider
        pushToWebClient(data, 'getServiceProviderAfterUpdate');
    });

    socket.on('serviceProviderCreated', (data) => {
        console.log('socket serviceProviderCreated data ', data);
        //todo complete push to all clients + push to specific serviceProvider
        pushToWebClient(data, 'getServiceProviders');
    });

    socket.on('serviceProviderPostAppointment', (data) => {
        console.log('socket serviceProviderPostAppointment data ', data);
        pushToAppClient(data, 'getUserAppointments');
    });

    socket.on('serviceProviderUpdateAppointment', (data) => {
        console.log('socket serviceProviderUpdateAppointment data ', data);
        pushToAppClient(data, 'getUserAppointments');
    });

    socket.on('serviceProviderCancelAppointment', (data) => {
        console.log('socket serviceProviderCancelAppointment data ', data);
        pushToAppClient(data, 'getUserAppointments');
    });

    socket.on('serviceProviderRejectAppointmentRequest', (data) => {
        console.log('socket serviceProviderRejectAppointmentRequest data ', data);
        pushToAppClient(data, 'getUserAppointmentRequests');
    });

    socket.on('serviceProviderApproveAppointmentRequest', (data) => {
        console.log('socket serviceProviderApproveAppointmentRequest data ', data);
        pushToAppClient(data, 'getUserAppointmentRequests');
    });
};
