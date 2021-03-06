process.dbMode='prod';
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var serviceProvidersRouter = require('./routes/serviceProviders');
var announcementsRouter = require('./routes/announcements');
var managersRouter = require('./routes/managers');
var permissionsRouter = require('./routes/permissions');
var choresRouter = require('./routes/chores');
var appointmentsRouter = require('./routes/appointments');
var appointmentRequestsRouter = require('./routes/appointmentRequests');
var incidentsRouter = require('./routes/incidents');

// for push notification
var firebaseAdmin = require('firebase-admin');
var firebaseServiceAccount = require("./meshekle-firebase-adminsdk-2f4ll-af78a541e1.json");
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
    databaseURL: "https://meshekle.firebaseio.com"
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/serviceProviders', serviceProvidersRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/managers', managersRouter);
app.use('/api/permissions', permissionsRouter);
app.use('/api/chores', choresRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/appointmentRequests', appointmentRequestsRouter);
app.use('/api/incidents', incidentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
