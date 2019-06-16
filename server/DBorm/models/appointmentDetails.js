module.exports = (sequelize, type) => {
    return sequelize.define('AppointmentDetails', {
        appointmentId:{
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        clientId: {
            type: type.STRING,
            required: true
        },
        serviceProviderId: {
            type: type.STRING,
            required: true
        },
        role: {
            type: type.STRING,
            required: true
        },
        subject: {
            type: type.STRING,
        },
    });
};