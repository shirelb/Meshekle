var expect = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

const db = require('../DBorm/DBorm');
const {sequelize, Users, AppointmentRequests, AppointmentDetails, ScheduledAppointments, Incidents, UsersChoresTypes, Events} = require('../DBorm/DBorm');

let server = require('../app');

var constants = require('../routes/shared/constants');

chai.use(chaiHttp);


describe('users route', function () {
    this.timeout(20000);

    before((done) => {
        setTimeout(function () {
            done();
        }, 5000);
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

    let appointmentRequestTest = {
        userId: userTest.userId,
        serviceProviderId: 123,
        role: "Driver",
        availableTime: [
            {
                "day": "Sunday",
                "hours": [
                    {
                        "startHour": "10:30",
                        "endHour": "12:00"
                    },
                    {
                        "startHour": "15:30",
                        "endHour": "20:00"
                    }
                ]
            },
            {
                "day": "Monday",
                "hours": [
                    {
                        "startHour": "10:30",
                        "endHour": "12:00"
                    },
                    {
                        "startHour": "15:30",
                        "endHour": "20:00"
                    }
                ]
            }
        ],
        notes: "this is a note",
        subject: "paint"
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

    let incidentTest = {
        userId: userTest.userId,
        category: "Plumbing",
        description: "this is a description"
    };

    let appointmentApproveTest = {
        userId: userTest.userId,
        appointmentRequestId: 1,
    };

    let appointmentRequestTestId;
    let appointmentTestId;
    let incidentTestId;

    describe('/POST login and authenticate a user', () => {
        beforeEach((done) => {
            setTimeout(function () {
                createUser(userTest)
                    .then(
                        done()
                    )
            }, 5000);
        });

        it('it should Login, and check token', (done) => {
            loginAuthenticateUser(userTest)
                .then(token => {
                    tokenTest = `Bearer ${token}`;
                    done()
                })
        });

        after((done) => {
            deleteUser(userTest)
                .then(
                    done()
                )
        })
    });

    describe('/GET users', () => {
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

        it('it should GET all the users', (done) => {
            chai.request(server)
                .get('/api/users')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                });
        });

        after((done) => {
            deleteUser(userTest)
                .then(
                    done()
                );
        });
    });

    describe('/GET users by name', () => {
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

        it('it should GET all the user with name test', (done) => {
            chai.request(server)
                .get('/api/users/name/test')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        after((done) => {
            deleteUser(userTest)
                .then(
                    done()
                );
        });
    });

    describe('/GET users by userId', () => {
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

        it('it should GET all the user with userId 436547125', (done) => {
            chai.request(server)
                .get('/api/users/userId/' + userTest.userId)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        after((done) => {
            deleteUser(userTest)
                .then(
                    setTimeout(function () {
                        done();
                    }, 1000)
                    // done()
                );
        });

    });

    describe('/POST appointment request of user', () => {
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

        it('it should POST an appointment request of user ', (done) => {
            chai.request(server)
                .post('/api/users/appointments/request')
                .set('Authorization', tokenTest)
                .send(appointmentRequestTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('AppointmentRequest successfully added!');
                    done();
                })

        });

        after((done) => {
            AppointmentRequests.destroy({where: {}})
                .then(AppointmentDetails.destroy({where: {}}))
                .then(Users.destroy({where: {}}))
                .then(done())
        });
    });

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
                .post('/api/users/appointments/set')
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

    describe('/POST incident of user', () => {
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

        it('it should POST an incident of user ', (done) => {
            chai.request(server)
                .post('/api/users/incidents/open')
                .set('Authorization', tokenTest)
                .send(incidentTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Incident successfully added!');
                    done();
                });
        });

        it('it should save the incident in Event table', (done) => {
            chai.request(server)
                .get('/api/users/events/userId/' + userTest.userId)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        after((done) => {
            Incidents.destroy({where: {}})
                .then(Events.destroy({where: {}}))
                .then(Users.destroy({where: {}}))
                .then(done())
        });
    });

    describe('/POST appointment user approve', () => {
        beforeEach((done) => {
            setTimeout(function () {
                tokenTest === null ?
                    loginAuthenticateUser(userTest)
                        .then(token => {
                            tokenTest = `Bearer ${token}`;
                            done()
                        })
                    :
                    done()
            }, 5000);
        });

        describe('test with non existent appointment request', () => {
            before((done) => {
                createUser(userTest)
                    .then(
                        done()
                    );
            });

            it('it should not POST an appointment approve without existing request ', (done) => {
                chai.request(server)
                    .post('/api/users/appointments/approve')
                    .set('Authorization', tokenTest)
                    .send(appointmentApproveTest)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('err');
                        res.body.should.have.property('message');
                        res.body.message.should.equal('AppointmentRequest not found!');
                        done();
                    });
            });

            after((done) => {
                Users.destroy({where: {}})
                    .then(done());
            });
        });

        describe('test with existent user and existent appointment request', () => {
            before((done) => {
                createUser(userTest)
                    .then(
                        createAppointmentRequest(appointmentRequestTest)
                    )
                    .then(
                        done()
                    );
            });

            it('it should POST an appointment approve of user ', (done) => {
                chai.request(server)
                    .post('/api/users/appointments/approve')
                    .set('Authorization', tokenTest)
                    .send(appointmentApproveTest)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('newAppointment');
                        res.body.newAppointment.should.have.property('status').eql('set');
                        res.body.should.have.property('appointmentsRequest');
                        res.body.appointmentsRequest.should.have.property('status').eql('approved');
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
                AppointmentRequests.destroy({where: {}})
                    .then(ScheduledAppointments.destroy({where: {}}))
                    .then(AppointmentDetails.destroy({where: {}}))
                    .then(Events.destroy({where: {}}))
                    .then(Users.destroy({where: {}}))
                    .then(done());
            });
        });
    });

    describe('/POST appointment user reject', () => {
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

        describe('test with non existent appointment request', () => {
            before((done) => {
                createUser(userTest)
                    .then(
                        done()
                    );
            });

            it('it should not POST an appointment reject without existing request ', (done) => {
                chai.request(server)
                    .post('/api/users/appointments/reject')
                    .set('Authorization', tokenTest)
                    .send(appointmentApproveTest)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('err');
                        res.body.should.have.property('message');
                        res.body.message.should.equal('AppointmentRequest not found!');
                        done();
                    });
            });

            after((done) => {
                Users.destroy({where: {}})
                    .then(done());
            });
        });

        describe('test with existent user and existent appointment request', () => {
            before((done) => {
                createUser(userTest)
                    .then(
                        createAppointmentRequest(appointmentRequestTest)
                    )
                    .then(
                        done()
                    );
            });

            it('it should POST an appointment reject of user ', (done) => {
                chai.request(server)
                    .post('/api/users/appointments/reject')
                    .set('Authorization', tokenTest)
                    .send(appointmentApproveTest)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('appointmentsRequest');
                        res.body.appointmentsRequest.should.have.property('status').eql('rejected');
                        res.body.should.have.property('message').eql('AppointmentsRequest successfully rejected!');
                        done();
                    });
            });

            after((done) => {
                AppointmentRequests.destroy({where: {}})
                    .then(AppointmentDetails.destroy({where: {}}))
                    .then(Users.destroy({where: {}}))
                    .then(done());
            });
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
                .get('/api/users/appointments/userId/' + userTest.userId)
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

    describe('/GET incidents of user', () => {
        before((done) => {
            setTimeout(function () {
                Incidents.destroy({where: {}})
                    .then(createUser(userTest)
                        .then(createIncident(incidentTest)
                            .then(incident => {
                                incidentTestId = incident.incidentId;
                                tokenTest === null ?
                                    loginAuthenticateUser(userTest)
                                        .then(token => {
                                            tokenTest = `Bearer ${token}`;
                                            done()
                                        })
                                    :
                                    done()
                            })));
            }, 5000);
        });

        it('it should GET all incidents of user by userId', (done) => {
            chai.request(server)
                .get('/api/users/incidents/userId/' + userTest.userId)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        after((done) => {
            Incidents.destroy({where: {}})
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
                    .put(`/api/users/appointments/cancel/userId/${userTest.userId}/appointmentId/2`)
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
                    .put(`/api/users/appointments/cancel/userId/${userTest.userId}/appointmentId/2`)
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
                    .put(`/api/users/appointments/cancel/userId/${userTest.userId}/appointmentId/2`)
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

    describe('/PUT cancel incidents of user', () => {
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

        describe('test with non existent incident', () => {
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
                }, 5000)
            });

            it('it should not cancel an incident without existing one ', (done) => {
                chai.request(server)
                    .put(`/api/users/incidents/cancel/userId/${userTest.userId}/incidentId/1`)
                    .set('Authorization', tokenTest)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                        res.body.message.should.equal('Incident not found!');
                        done();
                    });
            });

            after((done) => {
                Users.destroy({where: {}})
                    .then(done());
            });
        });

        describe('test with existent user and existent incident', () => {
            before((done) => {
                // setTimeout(function () {
                //     Incidents.destroy({where: {}})
                //         .then(
                createUser(userTest)
                    .then(createIncident(incidentTest)
                        .then(incident => {
                            incidentTestId = incident.incidentId;
                            tokenTest === null ?
                                loginAuthenticateUser(userTest)
                                    .then(token => {
                                        tokenTest = `Bearer ${token}`;
                                        done()
                                    })
                                :
                                done()
                        }));
                // }, 5000)
            });

            it('it should cancel an incident of user ', (done) => {
                chai.request(server)
                    .put(`/api/users/incidents/cancel/userId/${userTest.userId}/incidentId/${incidentTestId}`)
                    .set('Authorization', tokenTest)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('incident');
                        res.body.incident.should.have.property('status').eql('canceled');
                        res.body.should.have.property('message').eql('Incident canceled successfully!');
                        done();
                    });
            });

            it('it should not cancel a canceled incident of user ', (done) => {
                chai.request(server)
                    .put(`/api/users/incidents/cancel/userId/${userTest.userId}/incidentId/${incidentTestId}`)
                    .set('Authorization', tokenTest)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('incident');
                        res.body.incident.should.have.property('status').eql('canceled');
                        res.body.should.have.property('message').eql('Incident already canceled !');
                        done();
                    });
            });

            it('it should delete the incident from Event table', (done) => {
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
                Incidents.destroy({where: {}})
                    .then(Events.destroy({where: {}}))
                    .then(Users.destroy({where: {}}))
                    .then(done());
            });
        });
    });


    describe('/GET events of user', () => {
        before((done) => {
            setTimeout(function () {
                createUser(userTest)
                    .then(Events.create({
                        userId: appointmentTest.userId,
                        eventType: "Appointments",
                        eventId: 1
                    }))
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

        it('it should GET all events of user ', (done) => {
            chai.request(server)
                .get('/api/users/events/userId/' + userTest.userId)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        after((done) => {
            Events.destroy({where: {}})
                .then(Users.destroy({where: {}}))
                .then(done());
        });
    });

})
;

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

function createAppointmentRequest(appointmentRequestTest) {
    return AppointmentDetails.create({
        appointmentId: 1,
        clientId: appointmentRequestTest.userId,
        role: appointmentRequestTest.role,
        serviceProviderId: appointmentRequestTest.serviceProviderId,
        subject: appointmentRequestTest.subject
    })
        .then(() => {
            return AppointmentRequests.create({
                requestId: 1,
                notes: appointmentRequestTest.notes,
                optionalTimes: JSON.stringify(appointmentRequestTest.availableTime),
                status: "requested",
            });
        })
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

function createIncident(incidentTest) {
    return Incidents.create({
        userId: incidentTest.userId,
        category: incidentTest.category,
        description: incidentTest.description,
        status: "opened",
    });
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
