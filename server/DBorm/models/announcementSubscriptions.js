module.exports = (sequelize, type) => {
    return sequelize.define('AnnouncementSubscriptions', {
        userId:{
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        categoryId: {
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        
    });
};
