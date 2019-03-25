process.dbMode='dev';
var constants = require('../routes/shared/constants');
var validiation = require('../routes/shared/validations');
var announcementsRoute = constants.announcementsRoute;
let server = require('../app');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);
const {Users, ServiceProviders, Announcements,AnnouncementSubscriptions,Categories} = require('../DBorm/DBorm');

describe('service providers route', function () {
    this.timeout(20000);

    before((done) => {
        setTimeout(function () {
            done();
        }, 5000);
    });

    var tokenTest = null;

    let userTest = {
        userId: "111111111",
        fullname: "Amit mazuz",
        password: "123456789",
        email: "amit@gmail.com",
        mailbox: 444,
        cellphone: "0777007024",
        phone: "012365948",
        bornDate: "1992-05-20"
    };

    let userTest1 = {
        userId: "222222222",
        fullname: "roy elia",
        password: "123456789",
        email: "amit@gmail.com",
        mailbox: 444,
        cellphone: "0777007024",
        phone: "012365948",
        bornDate: "1992-05-20"
    };
    let operationTimeTest = {
        operationTime: "[\n" +
            "    {\n" +
            "      \"day\": \"Sunday\",\n" +
            "      \"hours\": [\n" +
            "        {\n" +
            "          \"startHour\": \"10:30\",\n" +
            "          \"endHour\": \"12:00\"\n" +
            "        },\n" +
            "        {\n" +
            "          \"startHour\": \"15:30\",\n" +
            "          \"endHour\": \"20:00\"\n" +
            "        }\n" +
            "      ]\n" +
            "    },\n" +
            "    {\n" +
            "      \"day\": \"Monday\",\n" +
            "      \"hours\": [\n" +
            "        {\n" +
            "          \"startHour\": \"10:30\",\n" +
            "          \"endHour\": \"12:00\"\n" +
            "        },\n" +
            "        {\n" +
            "          \"startHour\": \"15:30\",\n" +
            "          \"endHour\": \"20:00\"\n" +
            "        }\n" +
            "      ]\n" +
            "    }\n" +
            "  ]"
    };

    let serviceProviderTest = {
        serviceProviderId: '123456789',
        role: 'Dentist',
        userId: '111111111',
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

    let announcementTest1 ={
        announcementId: 1,
        serviceProviderId: '123456789',
        userId: '111111111',
        categoryId: 1,
        creationTime: "2018-05-20",
        title: "example1",
        content: "announcement example",
        expirationTime: "2019-06-22",
        image: "",
        //dateOfEvent: "",
        status:constants.statueses.REQUEST_STATUS,
    };
    let announcementTest2 ={
        announcementId: 2,
        serviceProviderId: '123456789',
        userId: '111111111',
        categoryId: 1,
        creationTime: "2018-05-20",
        title: "example2",
        content: "announcement example",
        expirationTime: "2019-06-22",
        image: "",
        //dateOfEvent: "",
        status:constants.statueses.ON_AIR_STATUS,
    };
    let expiredAnnouncement ={
        announcementId: 3,
        serviceProviderId: '123456789',
        userId: '111111111',
        categoryId: 1,
        creationTime: "2018-05-20",
        title: "example3",
        content: "announcement example",
        expirationTime: "2019-01-22",
        image: "",
        //dateOfEvent: "",
        status:constants.statueses.EXPIRED_STATUS,
    };
    let announcementTest4 ={
        announcementId: 4,
        serviceProviderId: '123456789',
        userId: '111111111',
        categoryId: 1,
        creationTime: "2018-05-20",
        title: "example4",
        content: "announcement example",
        expirationTime: "2019-06-22",
        image: "",
        //dateOfEvent: "",
        status:constants.statueses.CANCELLED_STATUS,
    };
    let subscriptionTest1 ={
        categoryId:1,
        userId:"111111111"
    };
    let subscriptionTest2 ={
        categoryId:1,
        userId:"222222222"
    };
    let categoryTest1 ={
        categoryId: 1,
        categoryName:constants.categories.CULTURE_CATEGORY,
        serviceProviderId: '123456789'
    };
    let categoryTest2 ={
        categoryId: 2,
        categoryName:constants.categories.DINNING_ROOM_CATEGORY,
        serviceProviderId: '123456789'
    };
    let categoryTest3 ={
        categoryId: 3,
        categoryName:constants.categories.GYM_CATEGORY,
        serviceProviderId: '123456789'
    };



//Service provider login by userId and password
    describe('/POST Service provider login by userId and password ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createUser(userTest1)
                                .then(
                                    done()
                                )
                        )
                );

        });
        it('it should log in the service provider to the system', (done) => {
            chai.request(server)
                .post('/api/serviceProviders/login/authenticate')
                .send({userId: '111111111', password: '123456789'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(constants.general.SUCCESSFUL_TOKEN);
                    res.body.success.should.be.eql(true);
                    res.body.should.have.property('token');
                    tokenTest = `Bearer ${res.body.token}`;
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            deleteUser(userTest1)
                                .then(
                                    done()
                                )
                        )
                );
        });
    });



//GET all announcements
    describe('/GET all announcements ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    createAnnouncement(announcementTest1)
                                        .then(
                                            createAnnouncement(announcementTest2)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );

        });
        it('it should GET all announcements ', (done) => {
            chai.request(server)
                .get('/api/announcements')
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
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            deleteAnnouncements(announcementTest2)
                                .then(
                                    deleteAnnouncements(announcementTest1)
                                        .then(
                                            deleteCategory(categoryTest1)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );
        });
    });





//GET all announcements categories that a specific service provider responsible for
    describe('/GET announcements categories that a specific service provider responsible for ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    createCategory(categoryTest2)
                                        .then(
                                            done()
                                        )
                                )
                        )
                );

        });
        it('it should GET all announcements categories that a specific service provider responsible for', (done) => {
            chai.request(server)
                .get('/api/announcements/categories/serviceProviderId/123456789')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                });
        });
        it('it should return an error that the service proivder not found', (done) => {
            chai.request(server)
                .get('/api/announcements/categories/serviceProviderId/123123123')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.SERVICE_PROVIDER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            deleteCategory(categoryTest1)
                                .then(
                                    deleteCategory(categoryTest2)
                                        .then(
                                            done()
                                        )
                                )
                        )
                );
        });
    });




//GET all subscription of a specific user
    describe('/GET all subscription of a specific user ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    createAnnouncementSubscription(subscriptionTest1)
                                        .then(
                                            done()
                                        )
                                )
                        )
                );

        });
        it('it should GET all subscription of a specific user', (done) => {
            chai.request(server)
                .get('/api/announcements/subscription/userId/111111111')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].should.be.eql(1);
                    done();
                });
        });
        it('it should return an error that the user not found', (done) => {
            chai.request(server)
                .get('/api/announcements/subscription/userId/123123123')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.USER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            deleteAnnouncementsSubscription(subscriptionTest1)
                                .then(
                                    deleteCategory(categoryTest1)
                                        .then(
                                            done()
                                        )
                                )
                        )
                );
        });
    });





//GET all expired announcements
    describe('/GET all expired announcements ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    createAnnouncement(expiredAnnouncement)
                                        .then(
                                            createAnnouncement(announcementTest2)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );

        });
        it('it should GET all expired announcements ', (done) => {
            chai.request(server)
                .get('/api/announcements/expired')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].title.should.be.eql('example3');
                    done();
                });
        });
        after((done) => {
            deleteAnnouncements(expiredAnnouncement)
                .then(
                    deleteAnnouncements(announcementTest2)
                        .then(
                            deleteCategory(categoryTest1)
                                .then(
                                    deleteServiceProvider(serviceProviderTest)
                                        .then(
                                            deleteUser(userTest)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );
        });
    });



//GET all announcements by categoryId
    describe('/GET all announcements of a specific category', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    createAnnouncement(announcementTest1)
                                        .then(
                                            createAnnouncement(announcementTest2)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );

        });
        it('it should GET all announcement by a given category ', (done) => {
            chai.request(server)
                .get('/api/announcements/categoryId/1')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                });
        });
        it('it should GET a category not found error', (done) => {
            chai.request(server)
                .get('/api/announcements/categoryId/10')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.CATEGORY_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteAnnouncements(announcementTest1)
                .then(
                    deleteAnnouncements(announcementTest2)
                        .then(
                            deleteCategory(categoryTest1)
                                .then(
                                    deleteServiceProvider(serviceProviderTest)
                                        .then(
                                            deleteUser(userTest)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );
        });
    });


//GET all announcements by userId
    describe('/GET all announcements of a specific user', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    createAnnouncement(announcementTest1)
                                        .then(
                                            createAnnouncement(announcementTest2)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );

        });
        it('it should GET all announcement by a given user ', (done) => {
            chai.request(server)
                .get('/api/announcements/userId/111111111')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                });
        });
        it('it should GET a USER not found error', (done) => {
            chai.request(server)
                .get('/api/announcements/userId/10')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.USER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteAnnouncements(announcementTest1)
                .then(
                    deleteAnnouncements(announcementTest2)
                        .then(
                            deleteCategory(categoryTest1)
                                .then(
                                    deleteServiceProvider(serviceProviderTest)
                                        .then(
                                            deleteUser(userTest)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );
        });
    });



//GET all announcements by serviceProvideId
    describe('/GET all announcements by service provider id', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    createAnnouncement(announcementTest1)
                                        .then(
                                            createAnnouncement(announcementTest2)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );

        });
        it('it should GET all announcement by a given service provider id ', (done) => {
            chai.request(server)
                .get('/api/announcements/serviceProviderId/123456789')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                });
        });
        it('it should GET a service provider not found error', (done) => {
            chai.request(server)
                .get('/api/announcements/serviceProviderId/10')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.SERVICE_PROVIDER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteAnnouncements(announcementTest1)
                .then(
                    deleteAnnouncements(announcementTest2)
                        .then(
                            deleteCategory(categoryTest1)
                                .then(
                                    deleteServiceProvider(serviceProviderTest)
                                        .then(
                                            deleteUser(userTest)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );
        });
    });



// GET all announcements of a specific user with a specific status
    describe('/// GET all announcements of a specific user with a specific status\n', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    createAnnouncement(announcementTest1)
                                        .then(
                                            createAnnouncement(announcementTest2)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );

        });
        it('it should GET all announcements of a specific user with a specific status\n ', (done) => {
            chai.request(server)
                .get('/api/announcements/userId/111111111/status/'+constants.statueses.REQUEST_STATUS)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].status.should.be.eql(constants.statueses.REQUEST_STATUS);
                    res.body[0].userId.should.be.eql(111111111);
                    done();
                });
        });
        it('it should GET a user not found error', (done) => {
            chai.request(server)
                .get('/api/announcements/userId/10/status/' + constants.statueses.REQUEST_STATUS)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.USER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteAnnouncements(announcementTest1)
                .then(
                    deleteAnnouncements(announcementTest2)
                        .then(
                            deleteCategory(categoryTest1)
                                .then(
                                    deleteServiceProvider(serviceProviderTest)
                                        .then(
                                            deleteUser(userTest)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );
        });
    });





// GET all announcements of a specific category with a specific status
    describe('/// GET all announcements of a specific category with a specific status\n', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    createAnnouncement(announcementTest1)
                                        .then(
                                            createAnnouncement(announcementTest2)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );

        });
        it('it should GET all announcements of a specific category with a specific status\n ', (done) => {
            chai.request(server)
                .get('/api/announcements/categoryId/1/status/'+constants.statueses.REQUEST_STATUS)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
        it('it should GET a category not found error', (done) => {
            chai.request(server)
                .get('/api/announcements/categoryId/100/status/' + constants.statueses.REQUEST_STATUS)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.CATEGORY_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteAnnouncements(announcementTest1)
                .then(
                    deleteAnnouncements(announcementTest2)
                        .then(
                            deleteCategory(categoryTest1)
                                .then(
                                    deleteServiceProvider(serviceProviderTest)
                                        .then(
                                            deleteUser(userTest)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );
        });
    });



// GET announcement by announcementId
    describe('/ GET announcement by announcementId\n', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    createAnnouncement(announcementTest1)
                                        .then(
                                            createAnnouncement(announcementTest2)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );

        });
        it('it should GET announcement by announcementId\n ', (done) => {
            chai.request(server)
                .get('/api/announcements/announcementId/1')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
        it('it should GET a announcement not found error', (done) => {
            chai.request(server)
                .get('/api/announcements/announcementId/100')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.ANNOUNCEMENT_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteAnnouncements(announcementTest1)
                .then(
                    deleteAnnouncements(announcementTest2)
                        .then(
                            deleteCategory(categoryTest1)
                                .then(
                                    deleteServiceProvider(serviceProviderTest)
                                        .then(
                                            deleteUser(userTest)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );
        });
    });



// GET all users that subscribe for a specific category
    describe('/ GET all users that subscribe for a specific category\n', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createUser(userTest1)
                        .then(
                            createServiceProvider(serviceProviderTest)
                                .then(
                                    createCategory(categoryTest1)
                                        .then(
                                            createAnnouncement(announcementTest1)
                                                .then(
                                                    createAnnouncement(announcementTest2)
                                                        .then(
                                                            createAnnouncementSubscription(subscriptionTest1)
                                                                .then(
                                                                    createAnnouncementSubscription(subscriptionTest2)
                                                                        .then(
                                                                            done()
                                                                        )
                                                                )
                                                        )
                                                )
                                        )
                                )
                    )
                );

        });
        it('it should GET all users that subscribe for a specific category\n ', (done) => {
            chai.request(server)
                .get('/api/announcements/subscription/categoryId/1')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                });
        });
        it('it should GET a announcement not found error', (done) => {
            chai.request(server)
                .get('/api/announcements/subscription/categoryId/100')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.CATEGORY_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteAnnouncementsSubscription(subscriptionTest1)
                .then(
                    deleteAnnouncementsSubscription(subscriptionTest2)
                        .then(
                            deleteAnnouncements(announcementTest1)
                                .then(
                                    deleteAnnouncements(announcementTest2)
                                        .then(
                                            deleteCategory(categoryTest1)
                                                .then(
                                                    deleteServiceProvider(serviceProviderTest)
                                                        .then(
                                                            deleteUser(userTest)
                                                                .then(
                                                                    deleteUser(userTest1)
                                                                        .then(
                                                                            done()
                                                                        )
                                                                )
                                                        )
                                                )
                                        )
                                )
                        )
                )

        });
    });


    // GET all requests that relevant for a specific service provider
    describe('/ GET all requests that relevant for a specific service provider\n', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    createAnnouncement(announcementTest1)
                                        .then(
                                            createAnnouncement(announcementTest2)
                                                .then(
                                                    done()
                                                )
                                        )
                                )

                        )
                );

        });
        it('it should GET all requests that relevant for a specific service provider\n ', (done) => {
            chai.request(server)
                .get('/api/announcements/requests/serviceProviderId/123456789')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
        it('it should GET a service provider not found error', (done) => {
            chai.request(server)
                .get('/api/announcements/requests/serviceProviderId/123')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.SERVICE_PROVIDER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            deleteCategory(categoryTest1)
                                .then(
                                    deleteAnnouncements(announcementTest1)
                                        .then(
                                            deleteAnnouncements(announcementTest2)
                                                .then(
                                                    done()
                                                )
                                        )
                                )

                        )
                );

        });
    });







// DELETE announcement by announcementId.
    describe('/ Delete announcement by announcementId\n', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    createAnnouncement(announcementTest1)
                                        .then(
                                            createAnnouncement(announcementTest2)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );

        });
        it('it should DELETE the announcement by announcementId', (done) => {
            chai.request(server)
                .put('/api/announcements/delete/announcementId/1')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(announcementsRoute.ANNOUNCEMENT_DELETED_SUCC);
                    res.body.result.should.be.eql(1);
                    validiation.getAnnouncementByAnnounceIdPromise('1').then(announcements => {
                        announcements.length.should.be.eql(0);
                        done();
                    });
                });
        });
        it('it should GET a announcement not found error', (done) => {
            chai.request(server)
                .put('/api/announcements/delete/announcementId/11')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.ANNOUNCEMENT_NOT_FOUND);
                    done();
                });
        });

        after((done) => {
                    deleteAnnouncements(announcementTest2)
                        .then(
                            deleteCategory(categoryTest1)
                                .then(
                                    deleteServiceProvider(serviceProviderTest)
                                        .then(
                                            deleteUser(userTest)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
        });
    });




//UPDATE announcement by announcementId.
    describe('/Put announcement new values ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    createAnnouncement(announcementTest1)
                                        .then(
                                            done()
                                        )
                                )
                        )
                );

        });
        it('it should update the announcement according to the new given values', (done) => {
            chai.request(server)
                .put('/api/announcements/update/announcementId/1')
                .set('Authorization', tokenTest)
                .send({userId: '222222222',content:"The test worked"})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(announcementsRoute.ANNOUNCEMENT_UPDATE_SUCCESS);
                    res.body.result.should.be.eql(1);
                    validiation.getAnnouncementByAnnounceIdPromise('1').then(announcements => {
                        announcements[0].dataValues.userId.should.be.eql(222222222);
                        announcements[0].dataValues.content.should.be.eql('The test worked');
                        done();
                    });
                });
        });

        it('it should send an error that the expiration date is not valid', (done) => {
            chai.request(server)
                .put('/api/announcements/update/announcementId/1')
                .set('Authorization', tokenTest)
                .send({expirationTime: "02-20-2019"})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.INVALID_EXP_TIME_INPUT);
                    done();
                });
        });

        it('it should send an error that the announcement not found', (done) => {
            chai.request(server)
                .put('/api/announcements/update/announcementId/10')
                .set('Authorization', tokenTest)
                .send({userId: '222222222',content:"The test worked"})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.ANNOUNCEMENT_NOT_FOUND);
                    done();
                });
        });

        after((done) => {
            deleteAnnouncements(announcementTest1)
                .then(
                    deleteCategory(categoryTest1)
                        .then(
                            deleteServiceProvider(serviceProviderTest)
                                .then(
                                    deleteUser(userTest)
                                        .then(
                                            done()
                                        )
                                )
                        )
                )
        });
    });



// UPDATE announcement status by announcementId.
    describe('/Update status to announcement ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    createAnnouncement(announcementTest1)
                                        .then(
                                            done()
                                        )
                                )
                        )
                );

        });
        it('it should update the announcement status', (done) => {
            chai.request(server)
                .put('/api/announcements/update/announcementId/1/status/'+constants.statueses.ON_AIR_STATUS)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(announcementsRoute.ANNOUNCEMENT_STATUS_UPDATE_SUCCESS);
                    res.body.result.should.be.eql(1);
                    validiation.getAnnouncementByAnnounceIdPromise('1').then(announcements => {
                        announcements[0].dataValues.status.should.be.eql(constants.statueses.ON_AIR_STATUS);
                        done();
                    });
                });
        });

        it('it should send an error that the status does not exists', (done) => {
            chai.request(server)
                .put('/api/announcements/update/announcementId/1/status/notExistsStatus')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.STATUS_DOESNT_EXISTS);
                    done();
                });
        });

        it('it should send an error that the announcement not found', (done) => {
            chai.request(server)
                .put('/api/announcements/update/announcementId/10/status/'+constants.statueses.ON_AIR_STATUS)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.ANNOUNCEMENT_NOT_FOUND);
                    done();
                });
        });

        after((done) => {
            deleteAnnouncements(announcementTest1)
                .then(
                    deleteCategory(categoryTest1)
                        .then(
                            deleteServiceProvider(serviceProviderTest)
                                .then(
                                    deleteUser(userTest)
                                        .then(
                                            done()
                                        )
                                )
                        )
                )
        });
    });




//Add announcement
    describe('/POST add announcement', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    done()
                                )
                        )
                );

        });
        it('it should ADD the announcement', (done) => {
            chai.request(server)
                .post('/api/announcements/add')
                .set('Authorization', tokenTest)
                .send(announcementTest1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(announcementsRoute.ANNOUNCEMENT_ADDED_SUCC);
                    //TODO: check for solution
                    // Announcements.findAll({
                    //     where: {
                    //         announcementId: announcementTest1.announcementId
                    //     }
                    // }).then(announcements => {
                    //     announcements.length.should.be.eql(1);
                    // });
                    done()
                });
        });

        it('it should send an error that the expiration time is illegal', (done) => {
            announcementTest1.expirationTime = "123";
            chai.request(server)
                .post('/api/announcements/add')
                .set('Authorization', tokenTest)
                .send(announcementTest1)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.ILLEGAL_EXP_TIME_INPUT);
                    announcementTest1.expirationTime= "2019-06-22"
                    done();
                });
        });
        it('it should send an error that the expiration time is invalid', (done) => {
            announcementTest1.expirationTime = "2019-02-25";
            chai.request(server)
                .post('/api/announcements/add')
                .set('Authorization', tokenTest)
                .send(announcementTest1)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.INVALID_EXP_TIME_INPUT);
                    announcementTest1.expirationTime= "2019-06-22"
                    done();
                });
        });
        it('it should send an error that the status not found', (done) => {
            announcementTest1.status = "not exists status";
            chai.request(server)
                .post('/api/announcements/add')
                .set('Authorization', tokenTest)
                .send(announcementTest1)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.STATUS_DOESNT_EXISTS);
                    announcementTest1.status = constants.statueses.REQUEST_STATUS;
                    done();
                });
        });


        after((done) => {
            deleteAnnouncements(announcementTest1)
                .then(
                    deleteCategory(categoryTest1)
                        .then(
                            deleteServiceProvider(serviceProviderTest)
                                .then(
                                    deleteUser(userTest)
                                        .then(
                                            done()
                                        )
                                )
                        )
                )
        });
    });



//Add category subscription
    describe('/POST add category subscription', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createUser(userTest1)
                        .then(
                            createServiceProvider(serviceProviderTest)
                                .then(
                                    createCategory(categoryTest1)
                                        .then(
                                            createAnnouncementSubscription(subscriptionTest2)
                                                .then(
                                                    done()
                                                )
                                        )
                                )
                        )
                );
        });
        it('it should ADD the category subscription ', (done) => {
            chai.request(server)
                .post('/api/announcements/subscription/add')
                .set('Authorization', tokenTest)
                .send(subscriptionTest1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(announcementsRoute.SUB_ADDED_SUCC);
                    AnnouncementSubscriptions.findAll({
                        where: subscriptionTest1
                    }).then(subs => {
                        subs.length.should.be.eql(1);
                        subs[0].userId.should.be.eql(subscriptionTest1.userId);
                        subs[0].categoryId.should.be.eql(subscriptionTest1.categoryId);
                    });
                    done()
                });
        });

        it('it should send an error that the user not found', (done) => {
            subscriptionTest1.userId = "123";
            chai.request(server)
                .post('/api/announcements/subscription/add')
                .set('Authorization', tokenTest)
                .send(subscriptionTest1)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.USER_NOT_FOUND);
                    subscriptionTest1.userId = "111111111";
                    done();
                });
        });
        it('it should send an error that the category not found', (done) => {
            subscriptionTest1.categoryId = "123";
            chai.request(server)
                .post('/api/announcements/subscription/add')
                .set('Authorization', tokenTest)
                .send(subscriptionTest1)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.CATEGORY_NOT_FOUND);
                    subscriptionTest1.categoryId = "1";
                    done();
                });
        });
        it('it should send an error that the category subscription is already exists', (done) => {
            chai.request(server)
                .post('/api/announcements/subscription/add')
                .set('Authorization', tokenTest)
                .send(subscriptionTest2)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.SUB_ALREADY_EXISTS);
                    done();
                });
        });


        after((done) => {
            deleteAnnouncementsSubscription(subscriptionTest1)
                .then(
                    deleteAnnouncementsSubscription(subscriptionTest2)
                        .then(
                            deleteCategory(categoryTest1)
                                .then(
                                    deleteServiceProvider(serviceProviderTest)
                                        .then(
                                            deleteUser(userTest)
                                                .then(
                                                    deleteUser(userTest1)
                                                        .then(
                                                            done()
                                                        )
                                                )
                                        )
                                )
                        )
                )
        });
    });





// DELETE category subscriptions.
    describe('/ Delete category subscription\n', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    createAnnouncementSubscription(subscriptionTest1)
                                        .then(
                                            done()
                                        )
                                )
                        )
                );

        });
        it('it should DELETE the category subscription', (done) => {
            chai.request(server)
                .put('/api/announcements/subscription/delete')
                .set('Authorization', tokenTest)
                .send(subscriptionTest1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(announcementsRoute.SUB_DELETED_SUCC);
                    res.body.result.should.be.eql(1);
                    AnnouncementSubscriptions.findAll({
                        where: subscriptionTest1
                    })
                        .then(subs => {
                            subs.length.should.be.eql(0);
                            done();
                        });
                });
        });
        it('it should GET a subscription not found error', (done) => {
            chai.request(server)
                .put('/api/announcements/subscription/delete')
                .set('Authorization', tokenTest)
                .send(subscriptionTest2)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.SUB_NOT_FOUND);
                    done();
                });
        });

        after((done) => {
                deleteCategory(categoryTest1)
                    .then(
                        deleteServiceProvider(serviceProviderTest)
                            .then(
                                deleteUser(userTest)
                                    .then(
                                        done()
                                    )
                            )
                    )

        });
    });























//Add announcement category
    describe('/POST add announcement category', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    done()
                                )
                        )
                );
        });
        it('it should ADD the announcement category ', (done) => {
            chai.request(server)
                .post('/api/announcements/categories/add')
                .set('Authorization', tokenTest)
                .send(categoryTest2)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(announcementsRoute.CATEGORY_ADDED_SUCC);
                    Categories.findAll({
                        where: categoryTest2
                    }).then(categories => {
                        categories.length.should.be.eql(1);
                        categories[0].categoryId.should.be.eql(categoryTest2.categoryId);
                        categories[0].serviceProviderId.should.be.eql(categoryTest2.serviceProviderId);
                        categories[0].categoryName.should.be.eql(categoryTest2.categoryName);
                    });
                    done()
                });
        });

        it('it should send an error that the category doesnt exists', (done) => {
            categoryTest1.categoryName = "doesnt exists name";
            chai.request(server)
                .post('/api/announcements/categories/add')
                .set('Authorization', tokenTest)
                .send(categoryTest1)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.CATEGORY_DOESNT_EXISTS);
                    categoryTest1.categoryName = constants.categories.CULTURE_CATEGORY;
                    done();
                });
        });
        it('it should send an error that the service provider not found', (done) => {
            categoryTest1.serviceProviderId = "123";
            chai.request(server)
                .post('/api/announcements/categories/add')
                .set('Authorization', tokenTest)
                .send(categoryTest1)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.SERVICE_PROVIDER_NOT_FOUND);
                    categoryTest1.serviceProviderId = "123456789";
                    done();
                });
        });
        it('it should send an error that the announcement category is already exists', (done) => {
            chai.request(server)
                .post('/api/announcements/categories/add')
                .set('Authorization', tokenTest)
                .send(categoryTest1)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.CATEGORY_ALREADY_EXISTS);
                    done();
                });
        });


        after((done) => {
            deleteAnnouncementsSubscription(subscriptionTest1)
                .then(
                    deleteAnnouncementsSubscription(subscriptionTest2)
                        .then(
                            deleteCategory(categoryTest1)
                                .then(
                                    deleteServiceProvider(serviceProviderTest)
                                        .then(
                                            deleteUser(userTest)
                                                .then(
                                                    deleteUser(userTest1)
                                                        .then(
                                                            done()
                                                        )
                                                )
                                        )
                                )
                        )
                )
        });
    });








// DELETE announcement category.
    describe('/ Delete announcement category.\n', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createCategory(categoryTest1)
                                .then(
                                    done()
                                )
                        )
                );

        });
        it('it should DELETE the announcement category', (done) => {
            chai.request(server)
                .put('/api/announcements/categories/delete/categoryId/1/serviceProviderId/123456789')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(announcementsRoute.CATEGORY_DELETED_SUCC);
                    res.body.result.should.be.eql(1);
                    Categories.findAll({
                        where: categoryTest1
                    })
                        .then(categories => {
                            categories.length.should.be.eql(0);
                            done();
                        });
                });
        });
        it('it should GET a category not found error', (done) => {
            chai.request(server)
                .put('/api/announcements/categories/delete/categoryId/1/serviceProviderId/123456789')
                .set('Authorization', tokenTest)
                .send(subscriptionTest2)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.CATEGORY_NOT_FOUND);
                    done();
                });
        });

        after((done) => {
                deleteServiceProvider(serviceProviderTest)
                    .then(
                        deleteUser(userTest)
                            .then(
                                done()
                            )
                    )
        });
    });
















//
//     //Get all the service providers
//     describe('/GET serviceProviders', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     createServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//
//         });
//         it('it should GET all the service providers', (done) => {
//             chai.request(server)
//                 .get('/api/serviceProviders')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.a('array');
//                     res.body.length.should.be.eql(1);
//                     done();
//                 });
//         });
//         after((done) => {
//             deleteUser(userTest)
//                 .then(
//                     deleteServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//         });
//     });
//     //Get all the service providers by full name
//     describe('/GET serviceProviders by full name ', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     createServiceProvider(serviceProviderTest)
//                         .then(
//                             createUser(userTest1)
//                                 .then(
//                                     done()
//                                 )
//                         )
//                 );
//
//         });
//
//         it('it should GET all the service providers by full name', (done) => {
//             chai.request(server)
//                 .get('/api/serviceProviders/name/Amit mazuz')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.a('array');
//                     res.body.length.should.be.eql(1);
//                     validiation.getUsersByUserIdPromise(res.body[0].userId).then(users => {
//                             users[0].fullname.should.be.eql("Amit mazuz");
//                             done();
//                         }
//                     );
//                 });
//         });
//
//         it('it should send error that the user is not found', (done) => {
//             chai.request(server)
//                 .get('/api/serviceProviders/name/Amit temp')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.USER_NOT_FOUND);
//                     done();
//                 });
//         });
//
//         it('it should send error that the service provider is not found', (done) => {
//             chai.request(server)
//                 .get('/api/serviceProviders/name/roy elia')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
//                     done();
//                 });
//         });
//         after((done) => {
//             deleteUser(userTest)
//                 .then(
//                     deleteServiceProvider(serviceProviderTest)
//                         .then(
//                             deleteUser(userTest1)
//                                 .then(
//                                     done()
//                                 )
//                         )
//                 );
//         });
//     });
//
//     // Get service provider by role
//     describe('/GET serviceProviders by role ', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     createServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//
//         });
//         it('it should GET all the service providers with given role', (done) => {
//             chai.request(server)
//                 .get('/api/serviceProviders/role/' + constants.roles.DENTIST_ROLE)
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.a('array');
//                     res.body.length.should.be.eql(1);
//                     res.body[0].role.should.be.eql(constants.roles.DENTIST_ROLE);
//                     done();
//                 });
//         });
//         it('it should send error that the service provider not found', (done) => {
//             chai.request(server)
//                 .get('/api/serviceProviders/role/' + constants.roles.HAIRDRESSER_ROLE)
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
//                     done();
//                 });
//         });
//         after((done) => {
//             deleteUser(userTest)
//                 .then(
//                     deleteServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//         });
//     });
//
//     //Update service provider (in role) way of appointment
//     describe('/Put serviceProviders appointmentWayType ', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     createServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//
//         });
//         it('it should update the appointmentWayType of the service provider in role', (done) => {
//             chai.request(server)
//                 .put('/api/serviceProviders/update/serviceProviderId/123456789/role/' + constants.roles.DENTIST_ROLE)
//                 .set('Authorization', tokenTest)
//                 .send({appointmentWayType: constants.appointmentWayTypes.SLOT_WAY_TYPE})
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_UPDATE_SUCCESS);
//                     res.body.result.should.be.eql(1);
//                     validiation.getServiceProvidersByServProIdPromise('123456789').then(serviceProviders => {
//                         serviceProviders[0].dataValues.appointmentWayType.should.be.eql(constants.appointmentWayTypes.SLOT_WAY_TYPE);
//                         done();
//                     })
//
//                 });
//         });
//
//         it('it should send an error that the appoint way type doesnt exists', (done) => {
//             chai.request(server)
//                 .put('/api/serviceProviders/update/serviceProviderId/123456789/role/' + constants.roles.DENTIST_ROLE)
//                 .set('Authorization', tokenTest)
//                 .send({appointmentWayType: "invalid way type"})
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.INVALID_APP_WAY_TYPE_INPUT);
//                     done();
//                 });
//         });
//
//         it('it should send an error that the service provider not found', (done) => {
//             chai.request(server)
//                 .put('/api/serviceProviders/update/serviceProviderId/123456781/role/' + constants.roles.DENTIST_ROLE)
//                 .set('Authorization', tokenTest)
//                 .send({appointmentWayType: constants.appointmentWayTypes.SLOT_WAY_TYPE})
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
//                     done();
//                 });
//         });
//
//         after((done) => {
//             deleteUser(userTest)
//                 .then(
//                     deleteServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//         });
//     });
//
//     //Gets the appointment type by service provider id
//     describe('/GET appointmentWayType by serviceProvidersId', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     createServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//
//         });
//         it('it should GET the appointmentWayType by service provider id', (done) => {
//             chai.request(server)
//                 .get('/api/serviceProviders/serviceProviderId/123456789/appointmentWayType')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body[0].appointmentWayType.should.be.eql(constants.appointmentWayTypes.DIALOG_WAY_TYPE);
//                     done();
//                 });
//         });
//         it('it should send error that the service provider not found', (done) => {
//             chai.request(server)
//                 .get('/api/serviceProviders/serviceProviderId/123456781/appointmentWayType')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
//                     done();
//                 });
//         });
//         after((done) => {
//             deleteUser(userTest)
//                 .then(
//                     deleteServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//         });
//     });
//
//     //Add service provider
//     describe('/POST add serviceProvider', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     done()
//                 );
//
//         });
//         it('it should ADD the service provider', (done) => {
//             chai.request(server)
//                 .post('/api/serviceProviders/add')
//                 .set('Authorization', tokenTest)
//                 .send(serviceProviderTest)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_ADDED_SUCC);
//                     res.body.result.serviceProviderId.should.be.eql(serviceProviderTest.serviceProviderId);
//                     res.body.result.role.should.be.eql(serviceProviderTest.role);
//                     res.body.result.should.have.property('userId');
//                     res.body.result.should.have.property('operationTime');
//                     res.body.result.should.have.property('phoneNumber');
//                     res.body.result.should.have.property('appointmentWayType');
//                     deleteServiceProvider(serviceProviderTest).then(done());
//                 });
//         });
//         it('it should send an error that the appointment way type doesnt exists', (done) => {
//             serviceProviderTest.appointmentWayType = "Invalid appointment way type";
//             chai.request(server)
//                 .post('/api/serviceProviders/add')
//                 .set('Authorization', tokenTest)
//                 .send(serviceProviderTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.INVALID_APP_WAY_TYPE_INPUT);
//                     serviceProviderTest.appointmentWayType = constants.appointmentWayTypes.DIALOG_WAY_TYPE;
//                     done();
//                 });
//         });
//         it('it should send an error that the role doesnt exists', (done) => {
//             serviceProviderTest.role = "Invalid role";
//             chai.request(server)
//                 .post('/api/serviceProviders/add')
//                 .set('Authorization', tokenTest)
//                 .send(serviceProviderTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.INVALID_ROLE_INPUT);
//                     serviceProviderTest.role = constants.roles.DENTIST_ROLE;
//                     done();
//                 });
//         });
//         it('it should send an error that the phone number is invalid', (done) => {
//             serviceProviderTest.phoneNumber = "invalid phone number";
//             chai.request(server)
//                 .post('/api/serviceProviders/add')
//                 .set('Authorization', tokenTest)
//                 .send(serviceProviderTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.INVALID_PHONE_INPUT);
//                     serviceProviderTest.phoneNumber = "0535311303";
//                     done();
//                 });
//         });
//         it('it should send an error that the user not found', (done) => {
//             serviceProviderTest.userId = "111111112";
//             chai.request(server)
//                 .post('/api/serviceProviders/add')
//                 .set('Authorization', tokenTest)
//                 .send(serviceProviderTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.USER_NOT_FOUND);
//                     serviceProviderTest.userId = "111111111";
//                     done();
//                 });
//         });
//
//         it('it should send an error that the service provider already exists ', (done) => {
//             createServiceProvider(serviceProviderTest).then(
//                 chai.request(server)
//                     .post('/api/serviceProviders/add')
//                     .set('Authorization', tokenTest)
//                     .send(serviceProviderTest)
//                     .end((err, res) => {
//                         res.should.have.status(400);
//                         res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_ALREADY_EXISTS);
//                         done();
//                     })
//             );
//         });
//
//         after((done) => {
//             deleteUser(userTest)
//                 .then(
//                     deleteServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//         });
//     });
//
//     //Add role to a service provider
//     describe('/Put role to a serviceProvider ', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     createServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//
//         });
//         it('it should add role to the service provider', (done) => {
//             chai.request(server)
//                 .put('/api/serviceProviders/roles/addToServiceProvider')
//                 .set('Authorization', tokenTest)
//                 .send({serviceProviderId: '123456789', role: constants.roles.HAIRDRESSER_ROLE, operationTime: 'sunday'})
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_ROLE_ADDED_SUCC);
//                     res.body.result.serviceProviderId.should.be.eql(serviceProviderTest.serviceProviderId);
//                     res.body.result.role.should.be.eql(constants.roles.HAIRDRESSER_ROLE);
//                     res.body.result.should.have.property('userId');
//                     res.body.result.should.have.property('operationTime');
//                     res.body.result.should.have.property('phoneNumber');
//                     res.body.result.should.have.property('appointmentWayType');
//                     done();
//                 });
//         });
//         it('it should send error that the role doesnt exists', (done) => {
//             chai.request(server)
//                 .put('/api/serviceProviders/roles/addToServiceProvider')
//                 .set('Authorization', tokenTest)
//                 .send({serviceProviderId: '123456789', role: "invalid role", operationTime: 'sunday'})
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.INVALID_ROLE_INPUT);
//                     done();
//                 });
//         });
//         it('it should send error that the service provider doesnt exists', (done) => {
//             chai.request(server)
//                 .put('/api/serviceProviders/roles/addToServiceProvider')
//                 .set('Authorization', tokenTest)
//                 .send({serviceProviderId: '123456781', role: constants.roles.HAIRDRESSER_ROLE, operationTime: 'sunday'})
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
//                     done();
//                 });
//         });
//         it('it should send error that the service provider already exists', (done) => {
//             chai.request(server)
//                 .put('/api/serviceProviders/roles/addToServiceProvider')
//                 .set('Authorization', tokenTest)
//                 .send({serviceProviderId: '123456789', role: constants.roles.DENTIST_ROLE, operationTime: 'sunday'})
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_ALREADY_EXISTS);
//                     done();
//                 });
//         });
//         after((done) => {
//             deleteUser(userTest)
//                 .then(
//                     deleteServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//         });
//     });
//
//     //Delete role of a service provider
//     describe('/PUT delete role to a serviceProvider', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     createServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//         });
//         it('it should DELETE the given role to the given serviceProvider', (done) => {
//             chai.request(server)
//                 .put('/api/serviceProviders/roles/removeFromServiceProvider')
//                 .set('Authorization', tokenTest)
//                 .send({serviceProviderId: '123456789', role: constants.roles.DENTIST_ROLE})
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_ROLE_DEL_SUCC);
//                     res.body.result.should.be.eql(1);
//                     validiation.getServiceProvidersByServProIdPromise('123456789').then(serviceProviders => {
//                         serviceProviders.length.should.be.eql(0);
//                         done();
//                     });
//                 });
//         });
//         it('it should send error that the role doesnt exists', (done) => {
//             chai.request(server)
//                 .put('/api/serviceProviders/roles/removeFromServiceProvider')
//                 .set('Authorization', tokenTest)
//                 .send({serviceProviderId: '123456789', role: "invalid role"})
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.INVALID_ROLE_INPUT);
//                     done();
//                 });
//         });
//         it('it should send error that the service provider doesnt exists', (done) => {
//             chai.request(server)
//                 .put('/api/serviceProviders/roles/removeFromServiceProvider')
//                 .set('Authorization', tokenTest)
//                 .send({serviceProviderId: '123456781', role: constants.roles.DENTIST_ROLE})
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
//                     done();
//                 });
//         });
//         after((done) => {
//             deleteUser(userTest)
//                 .then(
//                     done()
//                 );
//         });
//     });
//
//
// //delete a service provider with a given userID
//     describe('/DELETE delete a serviceProvider by userId', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     createServiceProvider(serviceProviderTest)
//                         .then(
//                             serviceProviderTest.role = constants.roles.HAIRDRESSER_ROLE,
//                             createServiceProvider(serviceProviderTest)
//                                 .then(
//                                     done()
//                                 )
//                         )
//                 );
//         });
//         it('it should DELETE the serviceProvider by userId', (done) => {
//             chai.request(server)
//                 .delete('/api/serviceProviders/userId/111111111/delete')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_DEL_SUCC);
//                     res.body.result.should.be.eql(2);
//                     validiation.getServiceProvidersByServProIdPromise('123456789').then(serviceProviders => {
//                         serviceProviders.length.should.be.eql(0);
//                         done()
//                     });
//                 });
//         });
//         it('it should send error that the serviceProvider doesnt exists', (done) => {
//             chai.request(server)
//                 .delete('/api/serviceProviders/userId/111111119/delete')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
//                     done();
//                 });
//         });
//         after((done) => {
//             deleteUser(userTest)
//                 .then(
//                     serviceProviderTest.role = constants.roles.DENTIST_ROLE,
//                     done()
//                 );
//         });
//     });
//
//
//     //Add User
//     describe('/POST add user', () => {
//         it('it should ADD the user', (done) => {
//             chai.request(server)
//                 .post('/api/serviceProviders/users/add')
//                 .set('Authorization', tokenTest)
//                 .send(userTest)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.message.should.be.eql(serviceProvidersRoute.USER_ADDED_SUCC);
//                     res.body.result.userId.should.be.eql(userTest.userId);
//                     res.body.result.password.should.be.a('string');
//                     validiation.getUsersByUserIdPromise(userTest.userId).then(users => {
//                         users.length.should.be.eql(1);
//                         deleteUser(userTest).then(
//                             done()
//                         );
//                     });
//                 });
//         });
//         it('it should send an error that the email is invalid', (done) => {
//             userTest.email = "invalid email";
//             chai.request(server)
//                 .post('/api/serviceProviders/users/add')
//                 .set('Authorization', tokenTest)
//                 .send(userTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.INVALID_EMAIL_INPUT);
//                     userTest.email = "amit@gmail.com";
//                     done();
//                 });
//         });
//         it('it should send an error that the mail box is invalid', (done) => {
//             userTest.mailbox = "invalid mail box";
//             chai.request(server)
//                 .post('/api/serviceProviders/users/add')
//                 .set('Authorization', tokenTest)
//                 .send(userTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.INVALID_MAIL_BOX_INPUT);
//                     userTest.mailbox = 10;
//                     done();
//                 });
//         });
//         it('it should send an error that the phone is invalid', (done) => {
//             userTest.phone = "invalid phone number";
//             chai.request(server)
//                 .post('/api/serviceProviders/users/add')
//                 .set('Authorization', tokenTest)
//                 .send(userTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.INVALID_PHONE_INPUT);
//                     userTest.phone = "0535311303";
//                     done();
//                 });
//         });
//         it('it should send an error that the cellphone is invalid', (done) => {
//             userTest.cellphone = "invalid cellphone";
//             chai.request(server)
//                 .post('/api/serviceProviders/users/add')
//                 .set('Authorization', tokenTest)
//                 .send(userTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.INVALID_PHONE_INPUT);
//                     userTest.cellphone = "0777007024";
//                     done();
//                 });
//         });
//         it('it should send an error that the born date is invalid', (done) => {
//             userTest.bornDate = "2100-04-04";
//             chai.request(server)
//                 .post('/api/serviceProviders/users/add')
//                 .set('Authorization', tokenTest)
//                 .send(userTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.INVALID_BORN_DATE_INPUT);
//                     userTest.bornDate = "1992-05-20";
//                     done();
//                 });
//         });
//         it('it should send an error that the user is already exists', (done) => {
//             createUser(userTest).then(
//                 chai.request(server)
//                     .post('/api/serviceProviders/users/add')
//                     .set('Authorization', tokenTest)
//                     .send(userTest)
//                     .end((err, res) => {
//                         res.should.have.status(400);
//                         res.body.message.should.be.eql(serviceProvidersRoute.USER_ALREADY_EXISTS);
//                         done();
//                     })
//             );
//         });
//
//         after((done) => {
//             deleteUser(userTest)
//                 .then(
//                     done()
//                 );
//         });
//     });
//
//
// //delete a user with a given userID
//     describe('/DELETE delete a user by userId', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     done()
//                 );
//         });
//         it('it should DELETE the user with the given userId', (done) => {
//             chai.request(server)
//                 .delete('/api/serviceProviders/users/userId/111111111/delete')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.message.should.be.eql(serviceProvidersRoute.USER_DEL_SUCC);
//                     res.body.result.should.be.eql(1);
//                     validiation.getUsersByUserIdPromise('111111111').then(users => {
//                         users.length.should.be.eql(0);
//                         done();
//                     });
//                 });
//         });
//         it('it should send an error that the user doesnt exists', (done) => {
//             chai.request(server)
//                 .delete('/api/serviceProviders/users/userId/111111119/delete')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.USER_NOT_FOUND);
//                     done();
//                 });
//         });
//     });
//
//
//     //Update the operation time of a service provider
//     describe('/Put serviceProvider operation time ', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     createServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//         });
//         it('it should update the operation time of the service provider', (done) => {
//             chai.request(server)
//                 .put('/api/serviceProviders/update/serviceProviderId/123456789/role/' + constants.roles.DENTIST_ROLE)
//                 .set('Authorization', tokenTest)
//                 .send(operationTimeTest)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_UPDATE_SUCCESS);
//                     res.body.result.should.be.eql(1);
//                     validiation.getServiceProvidersByServProIdPromise('123456789').then(serviceProviders => {
//                         serviceProviders[0].dataValues.operationTime.should.be.eql(operationTimeTest.operationTime);
//                         done();
//                     });
//                 });
//         });
//         it('it should send an error that the role doesnt exists', (done) => {
//             chai.request(server)
//                 .put('/api/serviceProviders/update/serviceProviderId/123456789/role/invalidRole')
//                 .set('Authorization', tokenTest)
//                 .send(operationTimeTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.INVALID_ROLE_INPUT);
//                     done();
//                 });
//         });
//         it('it should send an error that the service provider doesnt exists', (done) => {
//             chai.request(server)
//                 .put('/api/serviceProviders/update/serviceProviderId/123456781/role/' + constants.roles.DENTIST_ROLE)
//                 .set('Authorization', tokenTest)
//                 .send(operationTimeTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
//                     done();
//                 });
//         });
//         after((done) => {
//             deleteUser(userTest)
//                 .then(
//                     deleteServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//         });
//     });
//
//
//     //Get the operation time of service provider with role
//     describe('/GET operation time of a service provider', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     createServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//
//         });
//         it('it should GET the operation time of the service provider', (done) => {
//             chai.request(server)
//                 .get('/api/serviceProviders/serviceProviderId/123456789/role/' + constants.roles.DENTIST_ROLE + '/operationTime')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.result.should.be.eql(serviceProviderTest.operationTime);
//                     done();
//                 });
//         });
//         it('it should send an error that the role doesnt exists', (done) => {
//             chai.request(server)
//                 .get('/api/serviceProviders/serviceProviderId/123456789/role/invalidRole/operationTime')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.INVALID_ROLE_INPUT);
//                     done();
//                 });
//         });
//         it('it should send an error that the service provider doesnt exists', (done) => {
//             chai.request(server)
//                 .get('/api/serviceProviders/serviceProviderId/123456781/role/' + constants.roles.DENTIST_ROLE + '/operationTime')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
//                     done();
//                 });
//         });
//         after((done) => {
//             deleteUser(userTest)
//                 .then(
//                     deleteServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//         });
//     });
//
//
//     // Get roles of a service provider
//     describe('/GET roles of serviceProvider ', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     createServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//
//         });
//         it('it should GET all the roles of a service provider', (done) => {
//             chai.request(server)
//                 .get('/api/serviceProviders/roles/serviceProviderId/123456789')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.a('array');
//                     res.body.length.should.be.eql(1);
//                     res.body[0].should.be.eql(constants.roles.DENTIST_ROLE);
//                     done();
//                 });
//         });
//         it('it should send an error that the service provider doesnt exists', (done) => {
//             chai.request(server)
//                 .get('/api/serviceProviders/roles/serviceProviderId/123456781')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
//                     done();
//                 });
//         });
//         after((done) => {
//             deleteUser(userTest)
//                 .then(
//                     deleteServiceProvider(serviceProviderTest)
//                         .then(
//                             done()
//                         )
//                 );
//         });
//     });
//
//     //GET permissions of serviceProvider
//     describe('/GET permissions of serviceProvider', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     createServiceProvider(serviceProviderTest)
//                         .then(
//                             createRoleModule(roleModuleTest)
//                                 .then(
//                                     createPermission(permissionTest)
//                                         .then(
//                                             done()
//                                         )
//                                 )
//                         )
//                 );
//
//         });
//         it('it should GET all the permissions of the serviceProvider', (done) => {
//             chai.request(server)
//                 .get('/api/serviceProviders/serviceProviderId/123456789/permissions')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.a('array');
//                     res.body.length.should.be.eql(1);
//                     done();
//                 });
//         });
//         it('it should send an error that the service provider doesnt exists', (done) => {
//             chai.request(server)
//                 .get('/api/serviceProviders/serviceProviderId/123456781/permissions')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
//                     done();
//                 });
//         });
//         after((done) => {
//             deleteUser(userTest)
//                 .then(
//                     deleteServiceProvider(serviceProviderTest)
//                         .then(
//                             deleteRoleModule(roleModuleTest)
//                                 .then(
//                                     deletePermission(permissionTest)
//                                         .then(
//                                             done()
//                                         )
//                                 )
//                         )
//                 );
//         });
//     });

});


function createUser(userTest) {
    return Users.create(userTest);
}

function deleteUser(userTest) {
    return Users.destroy({
        where: {
            userId: userTest.userId
        }
    });
}

function createServiceProvider(serviceProviderTest) {
    return ServiceProviders.create(serviceProviderTest);
}

function deleteServiceProvider(serviceProviderTest) {
    return ServiceProviders.destroy({
        where: {
            serviceProviderId: serviceProviderTest.serviceProviderId
        }
    });
}


function createCategory(categoryTest) {
    return Categories.create(categoryTest);
}

function deleteCategory(categoryTest) {
    return Categories.destroy({
        where: {
            serviceProviderId: categoryTest.serviceProviderId,
            categoryName: categoryTest.categoryName,
        }
    });
}


function createAnnouncement(announcementTest) {
    return Announcements.create(announcementTest);
}

function deleteAnnouncements(announcementTest) {
    return Announcements.destroy({
        where: {announcementId: announcementTest.announcementId}
    });
}


function createAnnouncementSubscription(announcementTestSub) {
    return AnnouncementSubscriptions.create(announcementTestSub);
}

function deleteAnnouncementsSubscription(announcementTestSub) {
    return AnnouncementSubscriptions.destroy({
        where: announcementTestSub
    });
}