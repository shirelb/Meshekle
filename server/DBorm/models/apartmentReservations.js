module.exports = (sequelize, type) => {
    return sequelize.define('ApartmentReservations', {
        requestId:{
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        userId: {
            type: type.INTEGER,
            required: true
        },
        startDateTime:{
            type: type.DATE,
            required: true
        },
        endDateTime: {
            type: type.DATE,
            required: true
        },
        status: {
            type: type.STRING,
            required: true
        },
    });
};
