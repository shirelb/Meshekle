module.exports = (sequelize, type) => {
    return sequelize.define('ServiceProviders', {
        serviceProviderId:{
            type: type.STRING,
            primaryKey: true,
            allowNull: false,
            required: true
        },
        role : {
            type: type.STRING,
            primaryKey: true,
            allowNull: false,
            required: true
        },
        userId: {
            type: type.STRING,
            allowNull: false,
            required: true
        },
        operationTime: {
            type: type.STRING,
            allowNull: true,
            required: true
        },
        phoneNumber: {
            type: type.STRING,
            required: true
        },
        appointmentWayType: {
            type: type.STRING,
            allowNull: true,
            required: true
        },
        subjects: {
            type: type.STRING,
            allowNull: true,
            required: true
        },
        active: {
            type: type.BOOLEAN,
            required: true,
            defaultValue: false
        },
    });
};
