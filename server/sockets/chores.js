
module.exports = function (socket,pushToWebClient,pushToAppClient) {
    // socket.on('userPostAppointmentRequests', (data) => {
    //     console.log('socket userPostAppointmentRequests data ', data);
    //     pushToWebClient(data, 'getServiceProviderAppointmentRequests');
    // });

    socket.on('usersMadeChoreReplacement', (data) => {
        console.log('socket usersMadeChoreReplacement data ', data);
        pushToWebClient(data, 'getChangeInUserChores');
    });

    socket.on('serviceProviderPostUserChore', (data) => {
        console.log('socket serviceProviderPostUserChore data ', data);
        pushToAppClient(data, 'getUserChore');
    });

    // socket.on('serviceProviderUpdateAppointment', (data) => {
    //     console.log('socket serviceProviderUpdateAppointment data ', data);
    //     pushToAppClient(data, 'getUserAppointments');
    // });

    
};
