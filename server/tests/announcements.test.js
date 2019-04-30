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

describe('announcements route', function () {
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
    let serviceProviderTest1 = {
        serviceProviderId: '123123123',
        role: 'Dentist',
        userId: '222222222',
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
        file: "",
        fileName: "",
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
        file: "",
        fileName: "",
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
        file: "",
        fileName: "",
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
        file: "",
        fileName: "",
        //dateOfEvent: "",
        status:constants.statueses.CANCELLED_STATUS,
    };
    let subscriptionTest1 ={
        categoryId:1,
        userId:"111111111"
    };
    let subscriptionTest3 ={
        categoryId:2,
        userId:"111111111"
    };
    let subscriptionTest2 ={
        categoryId:1,
        userId:"222222222"
    };
    let subscriptionSwitchesTest ={
        userId:1,
        categories:[{categoryId:1,switch:false},{categoryId:2,switch:true}],
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
    let newCategoryTest ={
        categoryId: 3,
        categoryName:constants.categories.GYM_CATEGORY,
        managers: [{serviceProviderId:'123456789',userId:'111111111',name:'Amit mazuz'}],
        categoryOldName:constants.categories.GYM_CATEGORY
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




// GET announcement by status
    describe('/ GET announcement by status\n', () => {
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
        it('it should GET announcement by status\n ', (done) => {
            chai.request(server)
                .get('/api/announcements/status/'+constants.statueses.ON_AIR_STATUS)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
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



// GET all categories
    describe('/ GET all categories\n', () => {
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
        it('it should GET categories\n ', (done) => {
            chai.request(server)
                .get('/api/announcements/categories')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
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

        it('it should send an error that the status does not exists', (done) => {
            chai.request(server)
                .put('/api/announcements/update/announcementId/1')
                .set('Authorization', tokenTest)
                .send({status:'notExistsStatus'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.STATUS_DOESNT_EXISTS);
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










//UPDATE category subscription
    describe('/PUT update category subscription', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createUser(userTest1)
                        .then(
                            createServiceProvider(serviceProviderTest)
                                .then(
                                    createCategory(categoryTest1)
                                        .then(
                                            createCategory(categoryTest2)
                                                .then(
                                                    createAnnouncementSubscription(subscriptionTest1)
                                                        .then(
                                                            done()
                                                        )
                                            )
                                        )
                                )
                        )
                );
        });
        it('it should Update the user category subscription ', (done) => {
            chai.request(server)
                .post('/api/announcements/subscription/update')
                .set('Authorization', tokenTest)
                .send(subscriptionSwitchesTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(announcementsRoute.SUB_UPDATED_SUCC);
                    AnnouncementSubscriptions.findAll({
                        where: {userId:subscriptionSwitchesTest.userId}
                    }).then(subs => {
                        subs.length.should.be.eql(1);
                        subs[0].userId.should.be.eql(subscriptionSwitchesTest.userId);
                        subs[0].categoryId.should.be.eql(subscriptionSwitchesTest.categories[1].categoryId);
                    });
                    done()
                });
        });

        it('it should send an error that the user not found', (done) => {
            subscriptionSwitchesTest.userId = "123";
            chai.request(server)
                .post('/api/announcements/subscription/update')
                .set('Authorization', tokenTest)
                .send(subscriptionSwitchesTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.USER_NOT_FOUND);
                    subscriptionSwitchesTest.userId = "111111111";
                    done();
                });
        });
        it('it should send an error that the category not found', (done) => {
            subscriptionSwitchesTest.categories[0].categoryId = "123";
            chai.request(server)
                .post('/api/announcements/subscription/update')
                .set('Authorization', tokenTest)
                .send(subscriptionSwitchesTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(announcementsRoute.CATEGORY_NOT_FOUND);
                    subscriptionSwitchesTest.categories[0].categoryId = "1";
                    done();
                });
        });


        after((done) => {
            deleteAnnouncementsSubscription(subscriptionTest3)
                .then(
                    deleteCategory(categoryTest2)
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








// DELETE announcement category by categoryId.
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
//
// //TODO THE REAL Add announcement category
//     describe('/POST add announcement category', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     createServiceProvider(serviceProviderTest)
//                         .then(
//                             createCategory(categoryTest1)
//                                 .then(
//                                     done()
//                                 )
//                         )
//                 );
//         });
//         it('it should ADD the announcement category ', (done) => {
//             chai.request(server)
//                 .post('/api/announcements/categories/add')
//                 .set('Authorization', tokenTest)
//                 .send(newCategoryTest)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.message.should.be.eql(announcementsRoute.CATEGORY_ADDED_SUCC);
//                     Categories.findAll({
//                         where: categoryTest3
//                     }).then(categories => {
//                         categories.length.should.be.eql(1);
//                         categories[0].categoryId.should.be.eql(categoryTest3.categoryId);
//                         categories[0].serviceProviderId.should.be.eql(categoryTest3.serviceProviderId);
//                         categories[0].categoryName.should.be.eql(categoryTest3.categoryName);
//                     });
//                     done()
//                 });
//         });
//
//         it('it should send an error that the category doesnt exists', (done) => {
//             newCategoryTest.categoryName = "doesnt exists name";
//             chai.request(server)
//                 .post('/api/announcements/categories/add')
//                 .set('Authorization', tokenTest)
//                 .send(newCategoryTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(announcementsRoute.CATEGORY_DOESNT_EXISTS);
//                     newCategoryTest.categoryName = constants.categories.GYM_CATEGORY;
//                     done();
//                 });
//         });
//         it('it should send an error that the service provider not found', (done) => {
//             newCategoryTest.managers[0].serviceProviderId = "123";
//             chai.request(server)
//                 .post('/api/announcements/categories/add')
//                 .set('Authorization', tokenTest)
//                 .send(newCategoryTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(announcementsRoute.SERVICE_PROVIDER_NOT_FOUND);
//                     newCategoryTest.managers[0].serviceProviderId = "123456789";
//                     done();
//                 });
//         });
//         it('it should send an error that the announcement category is already exists', (done) => {
//             chai.request(server)
//                 .post('/api/announcements/categories/add')
//                 .set('Authorization', tokenTest)
//                 .send(newCategoryTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(announcementsRoute.CATEGORY_ALREADY_EXISTS);
//                     done();
//                 });
//         });
//
//
//         after((done) => {
//                 deleteCategory(categoryTest3)
//                     .then(
//                         deleteCategory(categoryTest1)
//                             .then(
//                                 deleteServiceProvider(serviceProviderTest)
//                                     .then(
//                                         deleteUser(userTest)
//                                             .then(
//                                                done()
//                                             )
//                                     )
//                             )
//                     )
//         });
//     });
//
//
//
// //TODO: THE REAL Update announcement category
//     describe('/POST update announcement category', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     createServiceProvider(serviceProviderTest)
//                         .then(
//                             createServiceProvider(serviceProviderTest1)
//                                 .then(
//                                     createCategory(categoryTest3)
//                                         .then(
//                                             done()
//                                         )
//                                     )
//                         )
//                 );
//         });
//         it('it should UPDATE the announcement category ', (done) => {
//             newCategoryTest.managers[0].serviceProviderId='123123123';
//             newCategoryTest.managers[0].userId='222222222';
//             newCategoryTest.managers[0].name='roy elia';
//             categoryTest3.serviceProviderId='123123123';
//             chai.request(server)
//                 .post('/api/announcements/categories/update')
//                 .set('Authorization', tokenTest)
//                 .send(newCategoryTest)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.message.should.be.eql(announcementsRoute.CATEGORY_UPDATED_SUCC);
//                     Categories.findAll({
//                         where: categoryTest3
//                     }).then(categories => {
//                         categories.length.should.be.eql(1);
//                         categories[0].categoryId.should.be.eql(categoryTest3.categoryId);
//                         categories[0].serviceProviderId.should.be.eql(categoryTest3.serviceProviderId);
//                         categories[0].categoryName.should.be.eql(categoryTest3.categoryName);
//                         newCategoryTest.managers[0].serviceProviderId='123456789';
//                         newCategoryTest.managers[0].userId='222222222';
//                         newCategoryTest.managers[0].name='Amit mazuz';
//                         categoryTest3.serviceProviderId='123456789';
//                     });
//                     done()
//                 });
//         });
//
//         it('it should send an error that the category doesnt exists', (done) => {
//             newCategoryTest.categoryName = "doesnt exists name";
//             chai.request(server)
//                 .post('/api/announcements/categories/add')
//                 .set('Authorization', tokenTest)
//                 .send(newCategoryTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(announcementsRoute.CATEGORY_DOESNT_EXISTS);
//                     newCategoryTest.categoryName = constants.categories.GYM_CATEGORY;
//                     done();
//                 });
//         });
//         it('it should send an error that the service provider not found', (done) => {
//             newCategoryTest.managers[0].serviceProviderId = "123";
//             chai.request(server)
//                 .post('/api/announcements/categories/add')
//                 .set('Authorization', tokenTest)
//                 .send(categoryTest1)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(announcementsRoute.SERVICE_PROVIDER_NOT_FOUND);
//                     categoryTest1.managers[0].serviceProviderId = "123456789";
//                     done();
//                 });
//         });
//         it('it should send an error that the announcement category is already exists', (done) => {
//             chai.request(server)
//                 .post('/api/announcements/categories/add')
//                 .set('Authorization', tokenTest)
//                 .send(categoryTest1)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(announcementsRoute.CATEGORY_ALREADY_EXISTS);
//                     done();
//                 });
//         });
//
//
//         after((done) => {
//             deleteCategory(categoryTest3)
//                 .then(
//                     deleteCategory(categoryTest3)
//                         .then(
//                             deleteServiceProvider(serviceProviderTest)
//                                 .then(
//                                     deleteUser(userTest)
//                                         .then(
//                                             done()
//                                         )
//                                 )
//                         )
//                 )
//         });
//     });
//
//
//
//
// // THE REAL DELETE announcement category by category name.
//     describe('/ Delete announcement category.\n', () => {
//         before((done) => {
//             createUser(userTest)
//                 .then(
//                     createServiceProvider(serviceProviderTest)
//                         .then(
//                             createCategory(categoryTest1)
//                                 .then(
//                                     done()
//                                 )
//                         )
//                 );
//
//         });
//         it('it should DELETE the announcement category', (done) => {
//             chai.request(server)
//                 .put('/api/announcements/categories/delete/categoryName/'+constants.categories.CULTURE_CATEGORY)
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.message.should.be.eql(announcementsRoute.CATEGORY_DELETED_SUCC);
//                     res.body.result.should.be.eql(1);
//                     Categories.findAll({
//                         where: categoryTest1
//                     })
//                         .then(categories => {
//                             categories.length.should.be.eql(0);
//                             done();
//                         });
//                 });
//         });
//         it('it should GET a category not found error', (done) => {
//             chai.request(server)
//                 .put('/api/announcements/categories/delete/categoryName/dontExistsCategory')
//                 .set('Authorization', tokenTest)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.message.should.be.eql(announcementsRoute.CATEGORY_NOT_FOUND);
//                     done();
//                 });
//         });
//
//         after((done) => {
//             deleteServiceProvider(serviceProviderTest)
//                 .then(
//                     deleteUser(userTest)
//                         .then(
//                             done()
//                         )
//                 )
//         });
//     });
//
//




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