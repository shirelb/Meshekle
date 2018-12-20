module.exports = (sequelize, type) => {
    return sequelize.define('ScheduledAppointments', {
        requestId:{
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        appointmentDateAndTime: {
            type: type.DATE,
            required: true
        },
        remarks: {
            type: type.STRING,
            required: true
        },
        status: {
            type: type.STRING,
            required: true
        },
        
    });
};