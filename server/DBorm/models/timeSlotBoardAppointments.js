module.exports = (sequelize, type) => {
    return sequelize.define('TimeSlotBoardAppointments', {
        timeSlotBoardId:{
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        appointmentId: {
            type: type.INTEGER,
            required: true
        },
    });
};
