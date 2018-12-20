const Sequelize = require('sequelize');
const UsersModel = require('./models/users');
const ServiceProvidersModel = require('./models/serviceProviders');
const PermissionsModel = require('./models/permissions');
const RulesModulesModel = require('./models/rulesModules');
const CategoriesModel = require('./models/categories');
const AnnouncementsModel = require('./models/announcements');
const AnnouncementSubscriptionsModel = require('./models/announcementSubscriptions');
const ChoreTypesModel = require('./models/choreTypes');
const UsersChoresTypesModel = requre('./models/usersChoresTypes');
const UsersChoresModel = requre('./models/usersChores');
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
const Permissions = PermissionsModel(sequelize, sequelize);
const RulesModules = RulesModulesModel(sequelize, sequelize);
const Categories = CategoriesModel(sequelize, sequelize);
const Announcements = AnnouncementsModel(sequelize, sequelize);
const AnnouncementSubscriptions = AnnouncementSubscriptionsModel(sequelize, sequelize);
const ChoreTypes = ChoreTypesModel(sequelize, sequelize);
const UsersChoresTypes = UsersChoresTypesModel(sequelize, sequelize);
const UsersChores = UsersChoresModel(sequelize,sequelize);
const SwapRequests = SwapRequestsModel(sequelize,sequelize);
const UsersReleases = UsersReleasesModel(sequelize, sequelize);
const AppointmentRequests = AppointmentRequestsModel(sequelize,sequelize);
const ScheduledAppointments = ScheduledAppointmentsModel(sequelize, sequelize);
const Incidents = IncidentsModel(sequelize, sequelize);
const TimeSlotBoards = TimeSlotBoardsModel(sequelize,sequelize);
const TimeSlotBoardAppointments = TimeSlotBoardAppointmentsModel(sequelize,sequelize);
const ApartmentConstraints = ApartmentConstraintsModel(sequelize,sequelize);
const ApartmentReservations = ApartmentReservationsModel(sequelize,sequelize);
const UserYearUtilization = UserYearUtilizationModel(sequelize,sequelize);
const Events = EventsModel(sequelize,sequelize);
const Logs = LogsModel(sequelize,sequelize);




sequelize.sync({ force: false })
    .then(() => {
        console.log(`Database & tables created!`)
    });

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