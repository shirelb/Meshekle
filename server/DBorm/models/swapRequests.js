module.exports = (sequelize, type) => {
    return sequelize.define('SwapRequests', {
        role:{
            choreIdOfSender: type.INTEGER,
            primaryKey: true,
            required: true
        },
        choreIdOfReceiver: {
            type: type.INTEGER,
            required: true
        },
        status: {
            type: type.STRING,
            required: true
        },
        
    });
};