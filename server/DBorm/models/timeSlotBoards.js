module.exports = (sequelize, type) => {
    return sequelize.define('TimeSlotBoards', {
        timeSlotBourdId:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        serviceProviderId: {
            type: type.INTEGER,
            required: true
        },
        role: {
            type: type.STRING,
            required: true
        },
        startDayTime: {
            type: type.DATE,
            required: true
        },
        endDayTime: {
            type: type.DATE,
            required: true
        },
        subject: {
            type: type.STRING,
            required: true
        },
        appointmentDuration: {
            type: type.INTEGER,
            required: true
        },
        status: {
            type: type.STRING,
            required: true
        },
    });
};