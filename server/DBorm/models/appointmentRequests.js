module.exports = (sequelize, type) => {
    return sequelize.define('AppointmentRequests', {
        requestId:{
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        optionalTimes: {
            type: type.STRING,
            required: true
        },
        notes: {
            type: type.STRING,
            required: false
        },
        status: {
            type: type.STRING,
            required: true
        },
    });
};