const Sequelize = require('sequelize');
const UsersModel = require('./models/users');
const ServiceProvidersModel = require('./models/serviceProviders');
const PermissionsModel = require('./models/permissions');
const RulesModulesModel = require('./models/rulesModules');
const CategoriesModel = require('./models/categories');
const AnnouncementsModel = require('./models/announcements');
const AnnouncementSubscriptionsModel = require('./models/announcementSubscriptions');
const ChoreTypesModel = require('./models/choreTypes');
const UsersChoresTypesModel = require('./models/usersChoresTypes');
const UsersChoresModel = require('./models/usersChores');
const SwapRequestsModel = require('./models/swapRequests');
const UsersReleasesModel = require('./models/usersReleases');
const AppointmentRequestsModel = require('./models/appointmentRequests');
const ScheduledAppointmentsModel = require('./models/scheduledAppointments');
const IncidentsModel = require('./models/incidents');
const TimeSlotBoardsModel = require('./models/timeSlotBoards') ;
const TimeSlotBoardAppointmentsModel = require('./models/timeSlotBoardAppointments');
const ApartmentConstraintsModel = require('./models/apartmentConstraints')
const ApartmentReservationsModel = require('./models/apartmentReservations');
const UserYearUtilizationModel = require('./models/userYearUtilization');
const EventsModel = require('./models/events');
const LogsModel = require('./models/logs');

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
const Permissions = PermissionsModel(sequelize, Sequelize);
const RulesModules = RulesModulesModel(sequelize, Sequelize);
const Categories = CategoriesModel(sequelize, Sequelize);
const Announcements = AnnouncementsModel(sequelize, Sequelize);
const AnnouncementSubscriptions = AnnouncementSubscriptionsModel(sequelize, Sequelize);
const ChoreTypes = ChoreTypesModel(sequelize, Sequelize);
const UsersChoresTypes = UsersChoresTypesModel(sequelize, Sequelize);
const UsersChores = UsersChoresModel(sequelize,Sequelize);
const SwapRequests = SwapRequestsModel(sequelize,Sequelize);
const UsersReleases = UsersReleasesModel(sequelize, Sequelize);
const AppointmentRequests = AppointmentRequestsModel(sequelize,Sequelize);
const ScheduledAppointments = ScheduledAppointmentsModel(sequelize, Sequelize);
const Incidents = IncidentsModel(sequelize, Sequelize);
const TimeSlotBoards = TimeSlotBoardsModel(sequelize,Sequelize);
const TimeSlotBoardAppointments = TimeSlotBoardAppointmentsModel(sequelize,Sequelize);
const ApartmentConstraints = ApartmentConstraintsModel(sequelize,Sequelize);
const ApartmentReservations = ApartmentReservationsModel(sequelize,Sequelize);
const UserYearUtilization = UserYearUtilizationModel(sequelize,Sequelize);
const Events = EventsModel(sequelize,Sequelize);
const Logs = LogsModel(sequelize,Sequelize);




sequelize.sync({ force: false })
    .then(() => {
        console.log(`Database & tables created!`)
    });

    
    // Users.hasMany(UsersChores, {
    //     foreignKey : 'userId',
    //     targetKey:'userId'
    // });
    
module.exports = {
    Users,
    ServiceProviders,
    Permissions,
    RulesModules,
    Categories, 
    Announcements, 
    AnnouncementSubscriptions,
    ChoreTypes,
    UsersChoresTypes,
    UsersChores,
    SwapRequests,
    UsersReleases,
    AppointmentRequests,
    ScheduledAppointments,
    Incidents,
    TimeSlotBoards,
    TimeSlotBoardAppointments,
    ApartmentConstraints,
    ApartmentReservations,
    UserYearUtilization,
    Events,
    Logs
};
