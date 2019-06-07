
module.exports = function (socket,pushToWebClient,pushToAppClient) {
    socket.on('userPostAppointmentRequests', (data) => {
        console.log('socket userPostAppointmentRequests data ', data);
        pushToWebClient(data, 'getServiceProviderAppointmentRequests');
    });

    socket.on('userCancelAppointmentRequests', (data) => {
        console.log('socket userCancelAppointmentRequests data ', data);
        pushToWebClient(data, 'getServiceProviderAppointmentRequests');
    });

    socket.on('userCancelAppointment', (data) => {
        console.log('socket userCancelAppointment data ', data);
        pushToWebClient(data, 'getServiceProviderAppointments');
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
