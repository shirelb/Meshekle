module.exports = (sequelize, type) => {
    return sequelize.define('Logs', {
        actionId:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        userId: {
            type: type.INTEGER,
            required: true
        },
        module: {
            type: type.STRING,
            required: true
        },
        
    });
};
