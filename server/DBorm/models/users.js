module.exports = (sequelize, type) => {
    return sequelize.define('Users', {
        userId:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            required: true
        },
        username: {
            type: type.STRING,
            allowNull: false,
            required: true
        },
        firstName: {
            type: type.STRING,
            allowNull: false,
            required: true
        },
        lastName: {
            type: type.STRING,
            allowNull: false,
            required: true
        },
        password: {
            type: type.STRING,
            allowNull: false,
            required: true
        },
        email: {
            type: type.STRING,
            allowNull: false,
            required: true
        },
        mailbox: {
            type: type.INTEGER,
            allowNull: false,
            required: true
        },
        cellphone: {
            type: type.STRING,
            allowNull: false,
            required: true
        },
        phone: {
            type: type.STRING
        }
    });
};