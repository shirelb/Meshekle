module.exports = (sequelize, type) => {
    return sequelize.define('Events', {
        userId:{
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        eventType: {
            type: type.STRING,
            primaryKey: true,
            required: true
        },
        eventId: {
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        
    });
};
