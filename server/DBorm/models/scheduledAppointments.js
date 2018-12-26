module.exports = (sequelize, type) => {
    return sequelize.define('ScheduledAppointments', {
        appointmentId:{
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        startDateAndTime: {
            type: type.DATE,
            required: true
        },
        endDateAndTime: {
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
