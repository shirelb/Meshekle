module.exports = (sequelize, type) => {
    return sequelize.define('Announcements', {
        announcementId:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        serviceProviderId: {
            type: type.INTEGER,
            required: true
        },
        userId: {
            type: type.INTEGER,
            required: true
        },
        categoryId: {
            type: type.INTEGER,
            required: true
        },
        creationTime: {
            type: type.DATE,
            required: true
        },
        title: {
            type: type.STRING,
            required: true
        },
        content: {
            type: type.STRING,
            required: true
        },
        expirationTime: {
            type: type.DATE,
            required: false
        },
        file: {
            type: type.STRING,
            required: false
        },
        fileName: {
            type: type.STRING,
            required: false
        },
        dateOfEvent: {
            type: type.DATE,
            required: false
        },
        status: {
            type: type.STRING,
            required: true
        },
    });
};