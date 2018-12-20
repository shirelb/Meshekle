module.exports = (sequelize, type) => {
    return sequelize.define('Permissions', {
        module:{
            type: type.STRING,
            primaryKey: true,
            required: true
        },
        operationName: {
            type: type.STRING,
            primaryKey: true,
            required: true
        },
        api: {
            type: type.STRING,
            required: true
        },
        
    });
};
