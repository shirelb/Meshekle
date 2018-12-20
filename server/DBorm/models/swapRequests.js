module.exports = (sequelize, type) => {
    return sequelize.define('SwapRequests', {
        choreIdOfSender:{
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        choreIdOfReceiver: {
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        status: {
            type: type.STRING,
            required: true
        },
        
    });
};