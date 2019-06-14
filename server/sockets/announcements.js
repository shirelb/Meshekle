
module.exports = function (socket,pushToAllWebClient,pushToAppClient) {
    socket.on('userPostAnnouncementsRequest', (data) => {
        console.log('socket userPostAnnouncementsRequest data ', data);
        pushToAllWebClient('getAnnouncementsRequests');
    });
};
