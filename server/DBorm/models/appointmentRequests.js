module.exports = (sequelize, type) => {
    return sequelize.define('AppointmentRequests', {
        requestId:{
            choreIdOfSender: type.INTEGER,
            primaryKey: true,
            required: true
        },
        clientId: {
            type: type.INTEGER,
            required: true
        },
        serviceProviderId: {
            type: type.INTEGER,
            required: true
        },
        role: {
            type: type.sTRING,
            required: true
        },
        optionalTimes: {
            type: type.STRING,
            required: true
        },
        notes: {
            type: type.STRING,
            required: true
        },
        creationDate: {
            type: type.DATE,
            required: true
        },
        status: {
            type: type.STRING,
            required: true
        },
    });
};