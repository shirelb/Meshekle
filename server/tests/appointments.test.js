var expect = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

const db = require('../DBorm/DBorm');
const {sequelize, Users, ServiceProviders, AppointmentDetails, ScheduledAppointments, Incidents, UsersChoresTypes, Events} = require('../DBorm/DBorm');

let server = require('../app');

var constants = require('../routes/shared/constants');
var serviceProvidersRoute = constants.serviceProvidersRoute;
var validation = require('../routes/shared/validations');

chai.use(chaiHttp);


describe('appointments route', function () {
    this.timeout(20000);

    before((done) => {
        setTimeout(function () {
            done();
        }, 5000);
    });

    beforeEach((done) => {
        tokenTest === null ?
            loginAuthenticateUser(userTest)
                .then(token => {
                    tokenTest = `Bearer ${token}`;
                    done()
                })
            :
            done()
    });

    var tokenTest = null;

    let userTest = {
        userId: "436547125",
        fullname: "test test",
        password: "tset22",
        email: "test@gmail.com",
        mailbox: 444,
        cellphone: "1234567896",
        phone: "012365948",
        bornDate: "1992-05-20"
    };

    let appointmentTest = {
        userId: userTest.userId,
        serviceProviderId: 123,
        role: "Driver",
        date: "2019-05-20",
        startHour: "10:00",
        endHour: "12:00",
        notes: "this is a note"
    };


    let schedAppointmentTest = {
        appointmentId: '1',
        startDateAndTime: '2018-12-12 11:00',
        endDateAndTime: '2018-12-12 13:00',
        remarks: 'blob',
        status: constants.appointmentStatuses.APPOINTMENT_SET
    };

    let appointmentDetailTest = {
        appointmentId: '1',
        clientId: '436547125',
        serviceProviderId: '123456789',
        role: constants.roles.DENTIST_ROLE,
        subject: 'blob'
    };

    let serviceProviderTest = {
        serviceProviderId: '123456789',
        role: 'Dentist',
        userId: '436547125',
        operationTime: "[\n" +
            "    {\n" +
            "      \"day\": \"Sunday\",\n" +
            "      \"hours\": [\n" +
            "        {\n" +
            "          \"startHour\": \"10:30\",\n" +
            "          \"endHour\": \"12:15\"\n" +
            "        },\n" +
            "        {\n" +
            "          \"startHour\": \"18:30\",\n" +
            "          \"endHour\": \"21:00\"\n" +
            "        }\n" +
            "      ]\n" +
            "    },\n" +
            "  ]",
        phoneNumber: '0535311303',
        appointmentWayType: constants.appointmentWayTypes.DIALOG_WAY_TYPE
    };


    describe('/POST appointment set of user', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    tokenTest === null ?
                        loginAuthenticateUser(userTest)
                            .then(token => {
                                tokenTest = `Bearer ${token}`;
                                done()
                            })
                        :
                        done()
                );
        });

        it('it should POST an appointment set of user ', (done) => {
            chai.request(server)
                .post('/api/appointments/user/set')
                .set('Authorization', tokenTest)
                .send(appointmentTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Appointment successfully added!');
                    done();
                });
        });

        it('it should save the appointment in Event table', (done) => {
            chai.request(server)
                .get('/api/users/events/userId/' + userTest.userId)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].should.have.property('eventType');
                    res.body[0].eventType.should.eql("Appointments");
                    done();
                });
        });

        after((done) => {
            ScheduledAppointments.destroy({where: {}})
                .then(AppointmentDetails.destroy({where: {}}))
                .then(Events.destroy({where: {}}))
                .then(Users.destroy({where: {}}))
                .then(done());
        });
    });

    describe('/GET scheduled appointments of user', () => {
        before((done) => {
            setTimeout(function () {
                createUser(userTest)
                    .then(createScheduledAppointment(appointmentTest)
                        .then(
                            tokenTest === null ?
                                loginAuthenticateUser(userTest)
                                    .then(token => {
                                        tokenTest = `Bearer ${token}`;
                                        done()
                                    })
                                :
                                done()
                        ));
            }, 5000);
        });

        it('it should GET all schedule appointments of user ', (done) => {
            chai.request(server)
                .get('/api/appointments/user/userId/' + userTest.userId)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        after((done) => {
            ScheduledAppointments.destroy({where: {}})
                .then(AppointmentDetails.destroy({where: {}}))
                .then(Users.destroy({where: {}}))
                .then(done());
        });
    });

    describe('/PUT cancel scheduled appointments of user', () => {
        before((done) => {
            tokenTest === null ?
                loginAuthenticateUser(userTest)
                    .then(token => {
                        tokenTest = `Bearer ${token}`;
                        done()
                    })
                :
                done()
        });

        beforeEach((done) => {
            setTimeout(function () {
                done();
            }, 5000);
        });

        describe('test with non existent appointment', () => {
            before((done) => {
                setTimeout(function () {
                    createUser(userTest)
                        .then(
                            tokenTest === null ?
                                loginAuthenticateUser(userTest)
                                    .then(token => {
                                        tokenTest = `Bearer ${token}`;
                                        done()
                                    })
                                :
                                done()
                        );
                }, 5000);
            });

            it('it should not cancel an appointment without existing one ', (done) => {
                chai.request(server)
                    .put(`/api/appointments/user/cancel/userId/${userTest.userId}/appointmentId/2`)
                    .set('Authorization', tokenTest)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                        res.body.message.should.equal('Appointment not found!');
                        done();
                    });
            });

            after((done) => {
                Users.destroy({where: {}})
                    .then(done());
            });
        });

        describe('test with existent user and existent appointment', () => {
            before((done) => {
                setTimeout(function () {
                    createUser(userTest)
                        .then(createScheduledAppointment(appointmentTest)
                            .then(
                                tokenTest === null ?
                                    loginAuthenticateUser(userTest)
                                        .then(token => {
                                            tokenTest = `Bearer ${token}`;
                                            done()
                                        })
                                    :
                                    done()
                            ));
                }, 1000);
            });

            it('it should cancel an appointment of user ', (done) => {
                chai.request(server)
                    .put(`/api/appointments/user/cancel/userId/${userTest.userId}/appointmentId/2`)
                    .set('Authorization', tokenTest)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('appointment');
                        res.body.appointment.should.have.property('status').eql('canceled');
                        res.body.should.have.property('message').eql('Appointment canceled successfully!');
                        done();
                    });
            });

            it('it should not cancel a canceled appointment of user ', (done) => {
                chai.request(server)
                    .put(`/api/appointments/user/cancel/userId/${userTest.userId}/appointmentId/2`)
                    .set('Authorization', tokenTest)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('appointment');
                        res.body.appointment.should.have.property('status').eql('canceled');
                        res.body.should.have.property('message').eql('Appointment already canceled !');
                        done();
                    });
            });

            it('it should delete the appointment from Event table', (done) => {
                chai.request(server)
                    .get('/api/users/events/userId/' + userTest.userId)
                    .set('Authorization', tokenTest)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(0);
                        done();
                    });
            });

            after((done) => {
                ScheduledAppointments.destroy({where: {}})
                    .then(AppointmentDetails.destroy({where: {}}))
                    .then(Events.destroy({where: {}}))
                    .then(Users.destroy({where: {}}))
                    .then(done());
            });
        });
    });


    //Set cancelled status to appointment by appointmentID
    describe('/Put cancelled status to appointment ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createSchedAppointment(schedAppointmentTest)
                                .then(
                                    done()
                                )
                        )
                );

        });
        it('it should update the status of the appointment to cancelled', (done) => {
            chai.request(server)
                .put('/api/appointments/serviceProvider/cancel/appointmentId/1')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(serviceProvidersRoute.APPOINTMENT_STATUS_CACELLED);
                    validation.getSchedAppointmentByIdPromise(1).then(schedAppointment => {
                        schedAppointment[0].status.should.be.eql(constants.appointmentStatuses.APPOINTMENT_CANCELLED);
                        done();
                    });
                });
        });
        it('it should send an error that the appointment doesnt exists', (done) => {
            chai.request(server)
                .put('/api/appointments/serviceProvider/cancel/appointmentId/2')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.APPOINTMENT_NOT_FOUND);

                    done();
                });
        });

        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            deleteSchedAppointment(schedAppointmentTest)
                                .then(
                                    done()
                                )
                        )
                );
        });
    });

    //GET appointments details of serviceProvider
    describe('/GET appointments details of serviceProvider', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createAppointmentDetail(appointmentDetailTest)
                                .then(
                                    createSchedAppointment(schedAppointmentTest)
                                        .then(
                                            done()
                                        )
                                )
                        )
                );

        });

        it('it should GET all the appointmentsDetails of the serviceProvider', (done) => {
            chai.request(server)
                .get('/api/appointments/serviceProvider/serviceProviderId/123456789')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
        it('it should send an error that the service provider not found', (done) => {
            chai.request(server)
                .get('/api/appointments/serviceProvider/serviceProviderId/123456781')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            deleteSchedAppointment(schedAppointmentTest)
                                .then(
                                    deleteAppointmentDetail(appointmentDetailTest)
                                        .then(
                                            done()
                                        )
                                )
                        )
                );
        });
    });

});

function createUser(userTest) {
    return Users.create({
        userId: userTest.userId,
        fullname: userTest.fullname,
        password: userTest.password,
        email: userTest.email,
        mailbox: userTest.mailbox,
        cellphone: userTest.cellphone,
        phone: userTest.phone,
        bornDate: new Date(userTest.bornDate),
        active: true,
    });
}

function createScheduledAppointment(appointmentTest) {
    return AppointmentDetails.create({
        appointmentId: 2,
        clientId: appointmentTest.userId,
        role: appointmentTest.role,
        serviceProviderId: appointmentTest.serviceProviderId,
        subject: appointmentTest.subject
    })
        .then(() => {
            return ScheduledAppointments.create({
                appointmentId: 2,
                startDateAndTime: new Date(appointmentTest.date + "T" + appointmentTest.startHour),
                endDateAndTime: new Date(appointmentTest.date + "T" + appointmentTest.endHour),
                remarks: appointmentTest.notes,
                status: "set",
            });
        })
}

function deleteUser(userTest) {
    return Users.destroy({
        where: {
            userId: userTest.userId
        }
    });
}

function loginAuthenticateUser(userTest) {
    return chai.request(server)
        .post('/api/users/login/authenticate')
        .send({
            "userId": userTest.userId,
            "password": userTest.password
        })
        .then((res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.success.should.be.true;
            res.body.should.have.property('message');
            res.body.message.should.equal(constants.general.SUCCESSFUL_TOKEN,);
            res.body.should.have.property('token');
            return res.body.token;
        })
        .catch((err) => {
            throw err;
        });
}


function createServiceProvider(serviceProviderTest) {
    return ServiceProviders.create({
        serviceProviderId: serviceProviderTest.serviceProviderId,
        role: serviceProviderTest.role,
        userId: serviceProviderTest.userId,
        operationTime: serviceProviderTest.operationTime,
        phoneNumber: serviceProviderTest.phoneNumber,
        appointmentWayType: serviceProviderTest.appointmentWayType,
    });
}

function deleteServiceProvider(serviceProviderTest) {
    return ServiceProviders.destroy({
        where: {
            serviceProviderId: serviceProviderTest.serviceProviderId
        }
    });
}

function createSchedAppointment(schedAppointment) {
    return ScheduledAppointments.create({
        appointmentId: schedAppointment.appointmentId,
        startDateAndTime: schedAppointment.startDateAndTime,
        endDateAndTime: schedAppointment.endDateAndTime,
        remarks: schedAppointment.remarks,
        status: schedAppointment.status,
    });
}

function deleteSchedAppointment(schedAppointment) {
    return ScheduledAppointments.destroy({
        where: {
            appointmentId: schedAppointment.appointmentId
        }
    });
}

function createAppointmentDetail(appointmentDetail) {
    return AppointmentDetails.create({
        appointmentId: appointmentDetail.appointmentId,
        clientId: appointmentDetail.clientId,
        serviceProviderId: appointmentDetail.serviceProviderId,
        role: appointmentDetail.role,
        subject: appointmentDetail.subject,
    });
}

function deleteAppointmentDetail(appointmentDetail) {
    return AppointmentDetails.destroy({
        where: {
            appointmentId: appointmentDetail.appointmentId,
            clientId: appointmentDetail.clientId,
            serviceProviderId: appointmentDetail.serviceProviderId,
        }
    });
}
