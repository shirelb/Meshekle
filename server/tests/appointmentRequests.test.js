process.dbMode = 'dev';
var expect = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

const db = require('../DBorm/DBorm');
const {sequelize, Users, AppointmentRequests, AppointmentDetails, ScheduledAppointments, Events} = require('../DBorm/DBorm');

let server = require('../app');

var constants = require('../routes/shared/constants');

chai.use(chaiHttp);


describe('appointmentRequests route', function () {
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
        optionalTimes: [
            {
                "date": "12-06-2019",
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
                "date": "13-06-2019",
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
        subject: "paint",
        status: "requested",
    };

    let appointmentApproveTest = {
        userId: userTest.userId,
        appointmentRequestId: 1,
    };


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
                .post('/api/appointmentRequests/user/request')
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

            it('it should not PUT an appointment reject without existing request ', (done) => {
                chai.request(server)
                    .put('/api/appointmentRequests/user/reject')
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

            it('it should PUT an appointment reject of user ', (done) => {
                chai.request(server)
                    .put('/api/appointmentRequests/user/reject')
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

            it('it should not PUT an appointment approve without existing request ', (done) => {
                chai.request(server)
                    .put('/api/appointmentRequests/user/approve')
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

            it('it should PUT an appointment approve of user ', (done) => {
                chai.request(server)
                    .put('/api/appointmentRequests/user/approve')
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

function createAppointmentRequest(appointmentRequestTest) {
    return AppointmentDetails.create({
        appointmentId: 1,
        clientId: appointmentRequestTest.userId,
        role: appointmentRequestTest.role,
        serviceProviderId: appointmentRequestTest.serviceProviderId,
        subject: appointmentRequestTest.subject
    })
        .then(() => {
            return AppointmentRequests.create(JSON.stringify(appointmentRequestTest))
                .then((res) => {
                    return res;
                })
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
