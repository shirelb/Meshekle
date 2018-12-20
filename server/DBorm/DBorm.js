const Sequelize = require('sequelize');
const UsersModel = require('./models/users');
const ServiceProvidersModel = require('./models/serviceProviders');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    port: 8091,
    dialect: 'sqlite',
    operatorsAliases: false,

    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // SQLite only
    storage: './sqlite.db'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


const Users = UsersModel(sequelize, Sequelize);
const ServiceProviders = ServiceProvidersModel(sequelize, Sequelize);

sequelize.sync({ force: false })
    .then(() => {
        console.log(`Database & tables created!`)
    });

module.exports = {
    Users,
    ServiceProviders
};