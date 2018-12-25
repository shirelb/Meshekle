module.exports = (sequelize, type) => {
    return sequelize.define('Events', {
        userId:{
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        eventType: {
            type: type.STRING,
            required: true
        },
        eventId: {
            type: type.INTEGER,
            required: true
        },
        
    });
};
