module.exports = (sequelize, type) => {
    return sequelize.define('Users', {
        userId:{
            type: type.STRING,
            primaryKey: true,
            required: true
        },
        fullname: {
            type: type.STRING,
            required: true
        },
        password: {
            type: type.STRING,
            required: true
        },
        email: {
            type: type.STRING,
            required: true
        },
        mailbox: {
            type: type.INTEGER,
            required: true
        },
        cellphone: {
            type: type.STRING,
            required: true
        },
        phone: {
            type: type.STRING
        },
        bornDate: {
            type: type.DATE,
            required: true
        },
        active: {
            type: type.BOOLEAN,
            required: true,
            defaultValue: true
        },
        image: {
            type: type.BLOB,
        }
    });
};