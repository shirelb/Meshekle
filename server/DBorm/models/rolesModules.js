module.exports = (sequelize, type) => {
    return sequelize.define('RolesModules', {
        role:{
            type: type.STRING,
            primaryKey: true,
            required: true
        },
        module: {
            type: type.STRING,
            required: true
        },
        
        
    });
};
