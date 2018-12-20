module.exports = (sequelize, type) => {
    return sequelize.define('Categories', {
        categoryId:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        categoryName: {
            type: type.STRING,
            required: true
        },
        
    });
};
