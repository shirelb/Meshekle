process.dbMode='dev';
var moment = require('moment');
var expect = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const db = require('../DBorm/DBorm');
const UsersChores = db.UsersChores;
const Users = db.Users;
const ChoreTypes = db.ChoreTypes;
const SwapRequests = db.SwapRequests;
const UsersChoresTypes = db.UsersChoresTypes;


let server = require('../app');

chai.use(chaiHttp);

describe('chores route', function () {
    this.timeout(20000);

    before((done) => {
        setTimeout(function () {
            done();
        }, 5000);
    });

var choreTypeTestSat = {
    choreTypeName: "satCoocking",
    serviceProviderId:"1",
    days: "שבת",
    numberOfWorkers: 2,
    frequency: 12,
    startTime: "10:00",
    endTime: "14:00",
    color: "blue"
}

var userTest = {
    userId: "436547125",
    fullname: "test test",
    password: "tset22",
    email: "test@gmail.com",
    mailbox: 444,
    cellphone: "1234567896",
    phone: "012365948",
    bornDate: "1992-05-20",
    //image:"",
    //active:true,
    //deviceRegistrationToken:"",
}

var userTest2 = {
    userId: "201449782",
    fullname: "test test",
    password: "tset22",
    email: "test@gmail.com",
    mailbox: 444,
    cellphone: "1234567896",
    phone: "012365948",
    bornDate: "1992-05-20",
    image:"",
    active:true,
    deviceRegistrationToken:"",
};

var choreTypeTestFri = {
    choreTypeName: "friCoocking",
    serviceProviderId:"1",
    days: "שישי",
    numberOfWorkers: 2,
    frequency: 12,
    startTime: "10:00",
    endTime: "14:00",
    color: "blue"
};

var choreTypeTestSun = {
    choreTypeName: "sunCoocking",
    serviceProviderId:"1",
    days: "ראשון",
    numberOfWorkers: 2,
    frequency: 12,
    startTime: "10:00",
    endTime: "14:00",
    color: "blue"
};

var userChoreTestNow = {
    userId: "436547125",
    choreTypeName: "satCoocking",
    date: "2019-12-25",//moment().format('YYYY-MM-DD hh:mm'),//Date.now(),//"2018-12-25 10:00",
    isMark: false
}
var userChoreTestFuture = {
    userId: "436547125",
    choreTypeName: "friCoocking",
    date: "2019-12-25", //new Date("2019-12-25 10:00"),
    originDate: "2019-12-25",
    isMark: false,
};
var userChoreTest1 = {
    userId: "201449782",
    choreTypeName: "friCoocking",
    date: "2019-12-27", //new Date("2019-12-25 10:00"),
    isMark: false,
};
var choreId= 0;
var choreIdPast = 0;
var tokenTest = null;

//describe('chores route', function () {
     //this.timeout(20000);

    

    //2 it's
    describe('/GET all userChores api1', () => {
        before((done) => {
            setTimeout(function () {
                Users.create(userTest)
                    .then(
                        tokenTest === null ?
                            loginAuthenticateUser(userTest)
                                .then(token => {
                                    tokenTest = `Bearer ${token}`;
                                    ChoreTypes.create(choreTypeTestSat)
                                    .then(response=>{
                        
                                         ChoreTypes.create(choreTypeTestFri);
                                         //Users.create(userTest);
                                        UsersChoresTypes.create({
                                            userId: userTest.userId,
                                            choreTypeName: choreTypeTestFri.choreTypeName
                                        });
                                        UsersChoresTypes.create({
                                            userId: userTest.userId,
                                            choreTypeName: choreTypeTestSat.choreTypeName
                                        });
                                        UsersChores.create(userChoreTestFuture);     
                                    })  
                                    done()
                                })
                            :
                            done()
                    );
            }, 5000);
        });
        it('it should GET all the users chores in future ', (done) => {
            chai.request(server)
                .get('/api/chores/usersChores/future/true')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].choreTypeName.should.be.eql(choreTypeTestFri.choreTypeName)
                    done();
                });
        });

        after((done) => {
            UsersChores.destroy({
                where:{
                    userId: userTest.userId
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: userTest.userId
                }
            });
            done();
        });
    });

//1 it
    describe('/GET all choreTypes api26', () => {
        before((done) => {          
            Users.create(userTest)
            .then(res=>{
            tokenTest === null ?
                loginAuthenticateUser(userTest)
                    .then(token => {
                        tokenTest = `Bearer ${token}`;
                        ChoreTypes.create(choreTypeTestFri)
                        .then(res=>{
                            done()
                        })
                    })
                    :
                    ChoreTypes.create(choreTypeTestFri)
                    .then(re=>{
                        done();
                    })
            })
        });

        it('it should GET all the choreTypes ', (done) => {
            chai.request(server)
            .get('/api/chores/choreTypes')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                res.body[0].choreTypeName.should.be.eql(choreTypeTestFri.choreTypeName)
                    done();
                });
            });
            
        after((done) => {
            ChoreTypes.destroy({
                where: {
                choreTypeName: choreTypeTestFri.choreTypeName
                }
            });
            Users.destroy({
                where: {
                    userId: userTest.userId
                    }
            })
                //done();
                setTimeout(function () {
                             done();
                         }, 5000);
        });
    });

   //2 it 
    describe('/POST new choreType api19', () => {
        before((done) => {      
            Users.create(userTest)
            .then(res=>{
            tokenTest === null ?
                loginAuthenticateUser(userTest)
                    .then(token => {
                        tokenTest = `Bearer ${token}`;
                        ChoreTypes.create(choreTypeTestSat)
                        .then(res=>{               
                            done()
                        })
                    })
                    :
                    ChoreTypes.create(choreTypeTestSat)
                    .then(re=>{
                        done();
                    })
            })
        });

           it('it should faild in  POST new Chore type that is allready exist yet', (done) => {
            chai.request(server)
                .post('/api/chores/add/choreType')
                .set('Authorization', tokenTest)
                .send(choreTypeTestSat)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('This choreType allready exist!');
                    done();
                });
        });



        after((done) => {
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {
                        [Op.or]: [choreTypeTestFri.choreTypeName, choreTypeTestSat.choreTypeName]
                    }
                }
            });
            Users.destroy({
                where:{
                    userId:userTest.userId
                }
            })
            done();
        });
    });

    
    describe('/POST new choreType api19', () => {
        before((done) => {
            ChoreTypes.create(choreTypeTestSat);
            done();
        });

        it('it should POST new Chore type that is not exist yet', (done) => {
            chai.request(server)
                .post('/api/chores/add/choreType')
                .set('Authorization', tokenTest)
                .send(choreTypeTestFri)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('choreType successfully added!');
                    done();
                });
        });



        after((done) => {
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {
                        [Op.or]: [choreTypeTestFri.choreTypeName, choreTypeTestSat.choreTypeName]
                    }
                }
            });
                Users.destroy({
                    where:{
                        userId:userTest.userId
                    }
                })
            done();
        });
    });
    
//commit
    //3 it
    describe('/POST adding user to choreType .api23', () => {
        
        before((done) => {
            //setTimeout(function () {
                Users.create(userTest)
            .then(res=>{
            tokenTest === null ?
                loginAuthenticateUser(userTest)
                    .then(token => {
                        tokenTest = `Bearer ${token}`;
                        ChoreTypes.create(choreTypeTestSat)
                        .then(res=>{               
                            done()
                        })
                    })
                    :
                    ChoreTypes.create(choreTypeTestSat)
                    .then(re=>{
                        done();
                    })
            })
            //}, 5000);
            // setTimeout(function () {
            //     ChoreTypes.create(choreTypeTestSat);
            // }, 5000);
            // setTimeout(function () {
            //         done();
            //     }, 5000);
        });
   
        it('it should POST user to Chore type ', (done) => {
            chai.request(server)
                .post('/api/chores/choreType/users/add/userId')
                .set('Authorization', tokenTest)
                .send({
                    userId: userTest.userId,
                    choreTypeName: choreTypeTestSat.choreTypeName
                })
                .end((err, res) => {
                    //setTimeout(function () {
                        
                        res.body.should.have.property('message').eql('userId successfully added to choreType!');
                        res.should.have.status(200);
                        done();
                    //}, 5000);
                    //done();
                    //setTimeout(function () {
                         //}, 5000);
                });
        });

        it('it should faild in  POST user that not exist to Chore type', (done) => {           
                chai.request(server)
                    .post('/api/chores/choreType/users/add/userId')
                    .set('Authorization', tokenTest)
                    .send({
                        userId: "111111111",
                        choreTypeName: choreTypeTestSat.choreTypeName
                    })
                    .end((err, res) => {
                        setTimeout(function () {
                            res.should.have.status(400);
                            res.body.should.have.property('message').eql('userId doesn\'t exist!');
                           done();
                        }, 5000);
                        //done();
                        // setTimeout(function () {
                        //     done();
                        // }, 5000);
                    });
                   
        });

        it('it should faild in POST user to Chore type that not exist', (done) => {
            chai.request(server)
                .post('/api/chores/choreType/users/add/userId')
                .set('Authorization', tokenTest)
                .send({
                    userId: userTest.userId,
                    choreTypeName: "no_such_chore"
                })
                .end((err, res) => {
                    setTimeout(function () {
                        res.should.have.status(400);
                        res.body.should.have.property('message').eql('choreType is not exist!');
                        
                    //}, 5000);
                    //setTimeout(function () {
                        done();
                    }, 5000);
                });
        });
   
        after((done) => {
            UsersChoresTypes.destroy({
                where: {
                    userId: userTest.userId,
                    choreTypeName: choreTypeTestSat.choreTypeName
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: choreTypeTestSat.choreTypeName
                }
            });
            Users.destroy({
                where: {
                    userId: userTest.userId
                }
            });
            done();
        });
    });

    //2 it
    describe('/GET userChore by choreId api2', () => {
        before((done) => {
            Users.create(userTest);
            ChoreTypes.create(choreTypeTestSat);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestSat.choreTypeName
            })
            UsersChores.create(userChoreTestNow)
            .then(created=>{
                choreId = created.userChoreId;
                console.log("\n userchoreid that created is: "+ choreId);
                done();
            })
            //done();
        });

        it('it should GET the user Chore with id ', (done) => {
            chai.request(server)
            .get('/api/chores/userChores/userChoreId/'+choreId)
            .set('Authorization', tokenTest)
            .end((err, res) => {
                res.should.have.status(200);
                setTimeout(function () {
                    res.body.should.have.property('chore');
                    res.body.chore.should.have.property('choreTypeName').eql(choreTypeTestSat.choreTypeName);
                    res.body.chore.should.have.property('userChoreId').eql(choreId);
                        done();
                }, 5000);
                });
            });

        it('it should not GET user Chore with id that does not exist ', (done) => {
            chai.request(server)
            .get('/api/chores/userChores/userChoreId/0')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                res.should.have.status(400);
                //res.body.should.be.a('array');
                //res.body.length.should.be.eql(1);
                //console.log("\n res.bodydataValues:"+ res.body[0].choreTypeName+"\n");
                setTimeout(function () {
                    res.body.should.have.property('chore');
                    res.body.should.have.property('message');
                    res.body.message.should.equal('userChoreId does not exist');
                    //res.body.chore.should.have.property('userChoreId').eql(choreId);
                        done();
                }, 5000);
                });
        });
        
            after((done) => {
                UsersChores.destroy({
                    where: {
                    userId: userTest.userId
                    }
                });
                UsersChoresTypes.destroy({
                    where: {
                    choreTypeName: choreTypeTestSat.choreTypeName,
                    userId: userTest.userId
                    }
                });
                Users.destroy({
                    where: {
                    userId: userTest.userId
                    }
                });
                ChoreTypes.destroy({
                    where: {
                    choreTypeName: choreTypeTestSat.choreTypeName
                    }
                });

                //done();
                setTimeout(function () {
                             done();
                         }, 5000);
        });
    });

    //4 it's
    describe('/GET all userChores by userId api3', () => {
        before((done) => {
            ChoreTypes.create(choreTypeTestSat);
            Users.create(userTest);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestSat.choreTypeName
            });
            UsersChores.create(userChoreTestNow);

            done();
                    
        });

        it('it should GET all the user chores in future of the userId ', (done) => {
            chai.request(server)
                .get('/api/chores/userChores/userId/'+userTest.userId+'/future/true')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('chores');
                    res.body.chores.should.be.a('array');
                    res.body.chores.length.should.be.eql(1);
                    res.body.chores[0].choreTypeName.should.be.eql(choreTypeTestSat.choreTypeName);
                    res.body.chores[0].userId.should.be.eql(userTest.userId);
                    done();
                });
        });

       
      after((done) => {
            UsersChores.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            UsersChoresTypes.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId]}
                }
            });
            done();
        });
       });

    //3 it
    describe('/GET users that do choretype api22', () => {
        before((done) => {
            Users.create(userTest);
            Users.create(userTest2);
            ChoreTypes.create(choreTypeTestSat);
            ChoreTypes.create(choreTypeTestFri);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestSat.choreTypeName
            });
            done();
        });

        it('it should GET the users do the specific choretype ', (done) => {
            chai.request(server)
            .get('/api/chores/type/'+choreTypeTestSat.choreTypeName+'/users')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                res.should.have.status(200);
                //res.body.message.should.be.eql('bla');
                //done();
                setTimeout(function () {
                    res.body.should.have.property('usersChoreType');
                    res.body.usersChoreType.should.be.a('array');
                    res.body.usersChoreType.length.should.be.eql(1);
                    res.body.usersChoreType[0].should.have.property('choreTypeName').eql(choreTypeTestSat.choreTypeName);
                    res.body.usersChoreType[0].User.should.have.property('mailbox').eql(userTest.mailbox);
                    console.log("\n\n\nres.body.usersChoreType[0].mailbox:"+res.body.usersChoreType[0].User.mailbox+"\n\n\n")
                    done();
                }, 5000);
            });
        });

       it('it should not GET the users do the specific choretype that not exist ', (done) => {
            chai.request(server)
            .get('/api/chores/type/'+'no_such_type'+'/users')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                res.should.have.status(400);
                setTimeout(function () {
                    res.body.should.have.property('err');
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('choreType is not exist');
                    //res.body.usersChoreType.should.be.a('array');
                    //res.body.usersChoreType.length.should.be.eql(1);
                    // res.body.usersChoreType[0].should.have.property('choreTypeName').eql(choreTypeTestSat.choreTypeName);
                    // res.body.usersChoreType[0].User.should.have.property('mailbox').eql(userTest.mailbox);
                    // console.log("\n\n\nres.body.usersChoreType[0].mailbox:"+res.body.usersChoreType[0].User.mailbox+"\n\n\n")
                        done();
                }, 5000);
                });
        });

    
        after((done) => {
            UsersChoresTypes.destroy({
                where: {
                choreTypeName: choreTypeTestSat.choreTypeName,
                userId: userTest.userId
                }
            });
            UsersChoresTypes.destroy({
                where: {
                choreTypeName: choreTypeTestFri.choreTypeName,
                userId: userTest2.userId
                }
            });
            Users.destroy({
                where: {
                userId: userTest.userId
                }
            });
            Users.destroy({
                where: {
                userId: userTest2.userId
                }
            });
            ChoreTypes.destroy({
                where: {
                choreTypeName: choreTypeTestSat.choreTypeName
                }
            });
            
            ChoreTypes.destroy({
                where: {
                choreTypeName: choreTypeTestFri.choreTypeName
                }
            });

            //done();
            setTimeout(function () {
                            done();
                        }, 5000);
        });
    });

    //2 it
    describe('/GET settings of choreType by choreTypeName api20', () => {
        before((done) => {
            ChoreTypes.create(choreTypeTestSat);
            done();
        });

        it('it should GET settings specific choretype ', (done) => {
            chai.request(server)
            .get('/api/chores/type/'+choreTypeTestSat.choreTypeName+'/settings')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                res.should.have.status(200);
                setTimeout(function () {
                    res.body.should.have.property('type');
                    //res.body.usersChoreType.should.be.a('array');
                    //res.body.usersChoreType.length.should.be.eql(1);
                    res.body.should.have.property('message').eql('getting settings of choreType by choreTypeName seccussfully done');
                    res.body.type.should.have.property('choreTypeName').eql(choreTypeTestSat.choreTypeName);
                    done();
                }, 5000);
            });
        });

        it('it should not GET settings of not exist choretype ', (done) => {
            chai.request(server)
            .get('/api/chores/type/'+'no_such_type'+'/settings')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                res.should.have.status(400);
               setTimeout(function () {
                   //res.body.should.have.property('err');
                   res.body.should.have.property('message');
                   res.body.message.should.be.eql('choreType is not exist');
                   done();
                }, 5000);
            });
        });
    
    
        after((done) => {
            UsersChoresTypes.destroy({
                where: {
                choreTypeName: choreTypeTestSat.choreTypeName,
                userId: userTest.userId
                }
            });
            UsersChoresTypes.destroy({
                where: {
                choreTypeName: choreTypeTestFri.choreTypeName,
                userId: userTest2.userId
                }
            });
            Users.destroy({
                where: {
                userId: userTest.userId
                }
            });
            Users.destroy({
                where: {
                userId: userTest2.userId
                }
            });
            ChoreTypes.destroy({
                where: {
                choreTypeName: choreTypeTestSat.choreTypeName
                }
            });
            
            ChoreTypes.destroy({
                where: {
                choreTypeName: choreTypeTestFri.choreTypeName
                }
            });

            //done();
            setTimeout(function () {
                            done();
                        }, 5000);
        });
        
    });

    //5 it
    describe('/GET userChores by userId and choreTypeName api25', () => {
        before((done) => {
            ChoreTypes.create(choreTypeTestFri)
            .then(res=>{
                ChoreTypes.create(choreTypeTestSat)
                Users.create(userTest);
                Users.create(userTest2);
                UsersChoresTypes.create({
                    userId: userTest.userId,
                    choreTypeName: choreTypeTestFri.choreTypeName
                });
                UsersChoresTypes.create({
                    userId: userTest.userId,
                    choreTypeName: choreTypeTestSat.choreTypeName
                });
                //UsersChores.create(userChoreTestNow);
                UsersChores.create(userChoreTestFuture);

                done();

            })
                    
        });

        it('it should GET all the user chores of choreType in future of the userId ', (done) => {
            chai.request(server)
                .get('/api/chores/usersChores/type/'+choreTypeTestFri.choreTypeName+'/userId/'+userTest.userId+'/future/true')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('userChores');
                    res.body.userChores.should.be.a('array');
                    res.body.userChores.length.should.be.eql(1);
                    res.body.userChores[0].choreTypeName.should.be.eql(choreTypeTestFri.choreTypeName);
                    res.body.userChores[0].userId.should.be.eql(userTest.userId);
                    done();
                });
        });

        it('it should not GET user chores in future for userId is not exist', (done) => {
            chai.request(server)
                .get('/api/chores/usersChores/type/'+choreTypeTestFri.choreTypeName+'/userId/'+'111111111'+'/future/true')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('err');
                    //res.body.should.have.property('message');
                    //res.body.message.should.equal('user not exist');
                    done();
                });
        });

        it('it should not GET user chores in future for userId in type that not exist', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/type/'+'no_such_type'+'/userId/'+userTest2.userId+'/future/true')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                    res.should.have.status(400);
                    //res.body.should.have.property('userChores');
                    //res.body.userChores.should.be.a('array');
                    //res.body.userChores.length.should.be.eql(0);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('choreType not exist ');
                    done();
                });
        });

        after((done) => {
            UsersChores.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId]}
                }
            });
            done();
        });
    });

    //5 it
    describe('/GET userChores by month, userId and choreTypeName api7', () => {
        before((done) => {
            setTimeout(function () {
            ChoreTypes.create(choreTypeTestSat);
            ChoreTypes.create(choreTypeTestFri);
            Users.create(userTest);
            Users.create(userTest2);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestSat.choreTypeName
            });
            UsersChores.create(userChoreTestNow);
            UsersChores.create(userChoreTestFuture);
            done();
        }, 3000);
            
        });
    
        
        it('it should GET all the user chores of choreType in month of the userId ', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/choreType/'+choreTypeTestFri.choreTypeName+'/month/12/year/2019/userId/'+userTest.userId+'')
            .set('Authorization', tokenTest)    
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('getting users chores for userId,type and month seccussfully done');
                    res.body.should.have.property('usersChores');
                    res.body.usersChores.should.be.a('array');
                    res.body.usersChores.length.should.be.eql(1);
                    res.body.usersChores[0].choreTypeName.should.be.eql(choreTypeTestFri.choreTypeName);
                    res.body.usersChores[0].userId.should.be.eql(userTest.userId);
                    //res.body.usersChores[0].date[5].should.be.eql('1');
                    res.body.usersChores[0].date.split('-')[1].should.be.eql('12');
                    res.body.usersChores[0].date.split('-')[0].should.be.eql('2019');
                    done();
                });
        });
            

        it('it should not GET user chores of choreType and user in illegal month ', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/choreType/'+choreTypeTestFri.choreTypeName+'/month/k/year/2019/userId/'+userTest.userId+'')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.be.eql('year or month with illegal values');
                done();
            });
        });
            

        it('it should not GET user chores of choreType of not exist choretype ', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/choreType/'+'no_such_type'+'/month/12/year/2019/userId/'+userTest.userId+'')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.be.eql('choreType is not exist');
                    done();
            });
        });
        
       
        it('it should GET no user chores in this month and type for userId that have no one', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/choreType/'+choreTypeTestSat.choreTypeName+'/month/12/year/2019/userId/'+userTest2.userId)
            .set('Authorization', tokenTest)
            .end((err, res) => {
                    res.body.should.have.property('message');
                    res.body.message.should.equal('no users chores found for userId,type and month');
                    res.body.should.have.property('usersChores');
                    res.body.usersChores.should.be.a('array');
                    res.body.usersChores.length.should.be.eql(0);
                    done();
                });
        });

        it('it should not GET user chores for userId is not exist', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/choreType/'+choreTypeTestFri.choreTypeName+'/month/12/year/2019/userId/'+'111111111')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.equal("userId doesn't exist!");
                    done();
            });
        });
      

        after((done) => {
            UsersChores.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId]}
                }
            });
            done();
        });
    });

    //4 it
    describe('/GET userChores by month and choreTypeName api4', () => {
        before((done) => {
            setTimeout(function () {
            ChoreTypes.create(choreTypeTestFri);
            Users.create(userTest);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChores.create(userChoreTestFuture);
            done();
        }, 3000);
            
        });
    
        
        it('it should GET all the users chores of choreType in month ', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/type/'+choreTypeTestFri.choreTypeName+'/month/12/year/2019')
            .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('getting users chores from choreType and month seccussfully done');
                    res.body.should.have.property('usersChores');
                    res.body.usersChores.should.be.a('array');
                    res.body.usersChores.length.should.be.eql(1);
                    res.body.usersChores[0].choreTypeName.should.be.eql(choreTypeTestFri.choreTypeName);
                    res.body.usersChores[0].userId.should.be.eql(userTest.userId);
                    //res.body.usersChores[0].date[5].should.be.eql('1');
                    res.body.usersChores[0].date.split('-')[1].should.be.eql('12');
                    res.body.usersChores[0].date.split('-')[0].should.be.eql('2019');
                    done();
                });
        });

        it('it should not GET user chores of choreType and user in illegal month ', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/type/'+choreTypeTestFri.choreTypeName+'/month/t/year/2019')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.be.eql('year or month with illegal values');
                done();
                //}, 5000);
            });
        });
            

        it('it should GET user chores of choreType of not exist choretype ', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/type/'+'no_such_type'+'/month/12/year/2019')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.be.eql('choreType is not exist');
                    done();
            });
        });
        
  /*     
        it('it should GET no user chores in this month and type that have no one', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/type/'+choreTypeTestFri.choreTypeName+'/month/03/year/2019')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                //setTimeout(function () {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    //res.body.message.should.equal('no users chores found for choreType and month');
                     res.body.should.have.property('usersChores');
                     res.body.usersChores.should.be.a('array');
                     res.body.usersChores.length.should.be.eql(0);
                    done();
                    //}, 8000);
                });
        });
*/
        after((done) => {
            UsersChores.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId]}
                }
            });
            done();
        });
    });

    //4 it
    describe('/GET userChores by month, userId  api6', () => {
        before((done) => {
            setTimeout(function () {
            ChoreTypes.create(choreTypeTestSat);
            ChoreTypes.create(choreTypeTestFri);
            Users.create(userTest);
            Users.create(userTest2);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestSat.choreTypeName
            });
            //UsersChores.create(userChoreTestNow);
            UsersChores.create(userChoreTestFuture);
            done();
        }, 3000);
            
        });

        it('it should GET all the user chores of in month of the userId ', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/month/12/year/2019/userId/'+userTest.userId)
            .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('getting users chores for userId and month seccussfully done');
                    res.body.should.have.property('usersChores');
                    res.body.usersChores.should.be.a('array');
                    res.body.usersChores.length.should.be.eql(1);
                    res.body.usersChores[0].choreTypeName.should.be.eql(choreTypeTestFri.choreTypeName);
                    res.body.usersChores[0].userId.should.be.eql(userTest.userId);
                    //res.body.usersChores[0].date[5].should.be.eql('1');
                    res.body.usersChores[0].date.split('-')[1].should.be.eql('12');
                    res.body.usersChores[0].date.split('-')[0].should.be.eql('2019');
                    done();
                });
        });
            
            
        it('it should not GET user chores of user in illegal month ', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/month/u/year/2019/userId/'+userTest.userId)
            .set('Authorization', tokenTest)
            .end((err, res) => {
                //setTimeout(function () {
                res.should.have.status(400);
                //res.body.should.have.property('err');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('year or month with illegal values');
                done();
                //}, 5000);
            });
        });
        
       
        it('it should GET no user chores in this month for userId that have no one', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/month/12/year/2019/userId/'+userTest2.userId)
            .set('Authorization', tokenTest)
            .end((err, res) => {
                //setTimeout(function () {
                    //res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('no such users chores for userId and month');
                    res.body.should.have.property('usersChores');
                    res.body.usersChores.should.be.a('array');
                    res.body.usersChores.length.should.be.eql(0);
                    done();
                    //}, 8000);
                });
        });


        it('it should not GET user chores for userId is not exist', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/month/12/year/2019/userId/'+'111111111')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                //setTimeout(function () {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.eql('userId doesn\'t exist!');
                    done();
                   //}, 7000);
            });
        });
      

        after((done) => {
            UsersChores.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId]}
                }
            });
            done();
        });
    });

    //5 it
    describe('/DELETE user from choreTypeName api24', () => {
        before((done) => {
            setTimeout(function () {
            ChoreTypes.create(choreTypeTestSat);
            ChoreTypes.create(choreTypeTestFri);
            Users.create(userTest);
            Users.create(userTest2);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestSat.choreTypeName
            });
            UsersChores.create(userChoreTestFuture);

            done();
        }, 3000);
    
        });

        it('it should DELETE the user from choreType', (done) => {
            chai.request(server)
                .delete('/api/chores/type/'+choreTypeTestSat.choreTypeName+'/users/userId/'+userTest.userId)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('remove userId from choreType seccussfully done');
                    res.body.should.have.property('userChoreType');
                    res.body.userChoreType.should.have.property('userId').eql(userTest.userId);
                    res.body.userChoreType.should.have.property('choreTypeName').eql(choreTypeTestSat.choreTypeName);
                    done();
                });
        });

        it('it should not DELETE user from choreType if he has a future userchores', (done) => {
            chai.request(server)
            .delete('/api/chores/type/'+choreTypeTestFri.choreTypeName+'/users/userId/'+userTest.userId)
            .set('Authorization', tokenTest)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.be.eql('The user has a future userChores, cannot continue in removing from this choreType');
                done();
                });
        });

        it('it should not DELETE user from choreType when userId is not exist', (done) => {
            chai.request(server)
            .delete('/api/chores/type/'+choreTypeTestFri.choreTypeName+'/users/userId/'+'111111111')
            .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('err');
                    res.body.should.have.property('message');
                    res.body.message.should.equal("userId doesn't exist!");
                    done();
                });
        });
        
        it('it should not DELETE user from type when userId are not belong to', (done) => {
            chai.request(server)
            .delete('/api/chores/type/'+choreTypeTestFri.choreTypeName+'/users/userId/'+userTest2.userId)
            .set('Authorization', tokenTest)
            .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('The chore type didnt found for this user');
                    done();
                });
        });

        it('it should not DELTE user from choreType that not exist', (done) => {
            chai.request(server)
            .delete('/api/chores/type/'+'no such type'+'/users/userId/'+userTest2.userId)
            .set('Authorization', tokenTest)
            .end((err, res) => {
                    res.should.have.status(400);
                    //res.body.should.have.property('userChores');
                    //res.body.userChores.should.be.a('array');
                    //res.body.userChores.length.should.be.eql(0);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('choreType is not exist');
                    done();
                });
        });

        after((done) => {
            UsersChores.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId]}
                }
            });
            done();
        });
    });
 

    //5 it
    describe('/POST new userChore api18', () => {
        before((done) => {
            setTimeout(function () {
                ChoreTypes.create(choreTypeTestSat);
                ChoreTypes.create(choreTypeTestFri);
                Users.create(userTest);
                UsersChoresTypes.create({
                    userId: userTest.userId,
                    choreTypeName: choreTypeTestFri.choreTypeName
                });
                // UsersChores.create({
                //     userId: userChoreTestFuture.userId,
                //     choreTypeName: userChoreTestFuture.choreTypeName,
                //     date: new Date(userChoreTestFuture.date),
                //     isMark: userChoreTestFuture.isMark,
                // });
                done();
            }, 5000);

        });
    
        it('it should POST new user Chore for the user', (done) => {
            chai.request(server)
                .post('/api/chores/add/userChore')
                .set('Authorization', tokenTest)
                .send({
                    userId: userTest.userId,
                    choreTypeName: choreTypeTestFri.choreTypeName,
                    date: new Date("2019-06-30"),
                    isMark: false
                })
                .end((err, res) => {
                    //res.should.have.status(200);
                    res.body.should.have.property('message').eql('userChore successfully added!');
                    res.body.should.have.property('newUserChore');
                    res.body.newUserChore.userId.should.be.eql(userTest.userId);
                    done();
                });
        });

        it('it should faild in  POST new user Chore when the user not exist', (done) => {
            chai.request(server)
                .post('/api/chores/add/userChore')
                .set('Authorization', tokenTest)
                .send({
                    userId: '111111111',
                    choreTypeName: choreTypeTestFri.choreTypeName,
                    date: new Date("2019-06-29"),
                    isMark: false
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    //res.body.should.have.property('message').eql('userId doesn\'t exist!');
                    res.body.should.have.property('message');
                    res.body.message.should.eql("userId doesn't exist!");
                    done();
                });
        });
    
        it('it should faild in  POST new user Chore when the user not do the choreType', (done) => {
            chai.request(server)
                .post('/api/chores/add/userChore')
                .set('Authorization', tokenTest)
                .send({
                    userId: userTest.userId,
                    choreTypeName: choreTypeTestSat.choreTypeName,
                    date: new Date("2019-06-29"),
                    isMark: false
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('user not do this chore');
                    done();
                });
        });

        it('it should faild in  POST new user Chore when the date in the past', (done) => {
            chai.request(server)
                .post('/api/chores/add/userChore')
                .set('Authorization', tokenTest)
                .send({
                    userId: userTest.userId,
                    choreTypeName: choreTypeTestFri.choreTypeName,
                    date: "2016-06-29",
                    isMark: false
                })
                .end((err, res) => {
                   // res.should.have.status(400);
                    res.body.should.have.property('message').eql('Cannot schedule a user chore at a past date');
                    done();
                });
        });

        it('it should faild in  POST new user Chore when the type is not exist', (done) => {
            chai.request(server)
                .post('/api/chores/add/userChore')
                .set('Authorization', tokenTest)
                .send({
                    userId: userTest.userId,
                    choreTypeName: 'no_such_type',
                    date: "2019-06-29",
                    isMark: false
                })
                .end((err, res) => {
                   // res.should.have.status(400);
                    res.body.should.have.property('message').eql('This choreType does\'nt exist!');
                    done();
                });
        });
        
        after((done) => {
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {
                        [Op.or]: [choreTypeTestFri.choreTypeName, choreTypeTestSat.choreTypeName]
                    }
                }
            });
            Users.destroy({
                where:{
                    userId: userTest.userId
                }
            });
            UsersChoresTypes.destroy({
                where:{
                    choreTypeName: choreTypeTestFri.choreTypeName
                }
            })
            ChoreTypes.destroy({
                where:{
                    choreTypeName: choreTypeTestFri.choreTypeName
                }
            })
            UsersChores.destroy({
                where:{
                    userId: userTest.userId
                }
            })
            done();
        });
    });

 
    //4 it
    describe('/DELETE choreType by choreTypeName api28', () => {
        before((done) => {
            setTimeout(function () {
            ChoreTypes.create(choreTypeTestSat);
            ChoreTypes.create(choreTypeTestFri);
            ChoreTypes.create(choreTypeTestSun);
            Users.create(userTest);
            Users.create(userTest2);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestSat.choreTypeName
            });
            UsersChores.create(userChoreTestNow);
            UsersChores.create(userChoreTestFuture);

            done();
        }, 3000);
    
        });

        it('it should DELETE the choreType when no future userchore for it', (done) => {
            chai.request(server)
                .delete('/api/chores/type/'+choreTypeTestSat.choreTypeName+'/delete')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('The chore type removed successfully (with the userchores and from usrschoretypes)');
                    res.body.should.have.property('removedType').eql(1);
                    done();
                });
        });

        it('it should DELETE choreType even if has a future userchores', (done) => {
            chai.request(server)
            .delete('/api/chores/type/'+choreTypeTestFri.choreTypeName+'/delete')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message');
                res.body.message.should.be.eql('The chore type removed successfully (with the userchores and from usrschoretypes)');
                res.body.should.have.property('removedType').eql(1);
                done();
                });
        });
        
        it('it should DELETE choreType when no user belong to', (done) => {
            chai.request(server)
            .delete('/api/chores/type/'+choreTypeTestSun.choreTypeName+'/delete')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message');
                res.body.message.should.be.eql('The chore type removed successfully (with the userchores and from usrschoretypes)');
                res.body.should.have.property('removedType').eql(1);
                //res.body.removedType.should.have.property('choreTypeName').eql(choreTypeTestSun.choreTypeName);
                done();
                });
        });

        it('it should not DELETE user from choreType that not exist', (done) => {
            chai.request(server)
            .delete('/api/chores/type/'+'no such type'+'/delete')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                    res.should.have.status(400);
                    //res.body.should.have.property('userChores');
                    //res.body.userChores.should.be.a('array');
                    //res.body.userChores.length.should.be.eql(0);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('choreType is not exist');
                    done();
                });
        });

        after((done) => {
            UsersChores.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId]}
                }
            });
            done();
        });
    });

    //2 it
    describe('/DELETE userChore api29', () => {
        before((done) => {
            setTimeout(function () {
            ChoreTypes.create(choreTypeTestSat);
            ChoreTypes.create(choreTypeTestFri);
            ChoreTypes.create(choreTypeTestSun);
            Users.create(userTest);
            Users.create(userTest2);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestSat.choreTypeName
            });

            UsersChores.create(userChoreTestFuture)
            .then(created=>{
                choreId = created.userChoreId;
                console.log("\n\n\n1. choreId: "+choreId+"\n\n\n");    
                UsersChores.create(userChoreTestNow)
                .then(cre=>{
                    choreIdPast = cre.userChoreId;
                    console.log("\n\n\n3. choreIdpast: "+choreIdPast+"\n\n\n");    
                    done();
                }) .catch(err=>{
                    done();
                })           
            })

        }, 3000);
    
        });

        it('it should DELETE the userChore in future', (done) => {
            chai.request(server)
                .delete('/api/chores/userChoreId/'+choreId+'/delete')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    setTimeout(function () {
                    console.log("\n\n\n2. choreId: "+choreId+"\n\n\n");
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('userChore removed successfully');
                    res.body.should.have.property('deleted').eql(1);
                    done();
                }, 6000);

                });
        });

        
        it('it should not  DELETE userChore not exist', (done) => {
            chai.request(server)
            .delete('/api/chores/userChoreId/'+"0"+'/delete')
            .set('Authorization', tokenTest)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.be.eql('no such userChore in the future (cannot remove userchore that already executed)');
                res.body.should.have.property('deleted').eql(0);
                done();
                });
        });

        after((done) => {
            UsersChores.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName, choreTypeTestSun.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId]}
                }
            });
            done();
        });
    });

    describe('/GET all replacenment Requests api', () => {
        var senderOldDate;
        var receiverOldDate;
        var senderChoreId;
        var receiverChoreId;
        var userChore1 = {
            userId: userTest.userId,
            choreTypeName: choreTypeTestFri.choreTypeName,
            date: "2019-11-25",//Date.now(),//"2018-12-25 10:00",
            isMark: false
        }
        var userChore2 = {
            userId: userTest2.userId,
            choreTypeName: choreTypeTestFri.choreTypeName,
            date: "2019-12-12",//Date.now(),//"2018-12-25 10:00",
            isMark: false
        }
        before((done) => {
            ChoreTypes.create(choreTypeTestFri);
            Users.create(userTest);
            Users.create(userTest2);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChoresTypes.create({
                userId: userTest2.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChores.create(userChore1)
            .then(sender=>{
                senderOldDate = sender.dataValues.date;
                senderChoreId = sender.dataValues.userChoreId;
                UsersChores.create(userChore2)
                .then(receiver=>{
                    receiverOldDate = receiver.dataValues.date;
                    receiverChoreId = receiver.dataValues.userChoreId;
                    SwapRequests.create({
                        choreIdOfReceiver: receiverChoreId,
                        choreIdOfSender:senderChoreId,
                        status:"requested"
                    }).then(r=>{
                        done();
                    })
                })
            })
        });

        it('it should GET all the replacement requests ', (done) => {
            chai.request(server)
                .get('/api/chores/replacementRequests/status/requested')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.requests.should.be.a('array');
                    res.body.requests.length.should.be.eql(1);
                    res.body.requests[0].choreIdOfReceiver.should.be.eql(receiverChoreId);
                    res.body.requests[0].choreIdOfSender.should.be.eql(senderChoreId);
                    done();
                });
        });

        after((done) => {
            UsersChores.destroy({
                where:{
                    userId:{[Op.or]:[userTest.userId,userTest2.userId ]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: choreTypeTestFri.choreTypeName
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId ]}
                }
            });
            done();
        });
    });

    describe('/POST new specific replacenment Request api?', () => {
        var senderOldDate;
        var receiverOldDate;
        var senderChoreId;
        var receiverChoreId;
        var userChore1 = {
            userId: userTest.userId,
            choreTypeName: choreTypeTestFri.choreTypeName,
            date: "2019-11-25",//Date.now(),//"2018-12-25 10:00",
            isMark: false
        }
        var userChore2 = {
            userId: userTest2.userId,
            choreTypeName: choreTypeTestFri.choreTypeName,
            date: "2019-12-12",//Date.now(),//"2018-12-25 10:00",
            isMark: false
        }
        before((done) => {
            ChoreTypes.create(choreTypeTestFri);
            Users.create(userTest);
            Users.create(userTest2);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChoresTypes.create({
                userId: userTest2.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChores.create(userChore1)
            .then(sender=>{
                senderOldDate = sender.dataValues.date;
                senderChoreId = sender.dataValues.userChoreId;
                UsersChores.create(userChore2)
                .then(receiver=>{
                    receiverOldDate = receiver.dataValues.date;
                    receiverChoreId = receiver.dataValues.userChoreId;
                    
                        done();
                })
            })
        });

        it('it should POST new replacement request successefuly', (done) => {
            chai.request(server)
                .post('/api/chores/replacementRequests/specificRequest')
                .set('Authorization', tokenTest)
                .send({
                    choreIdOfReceiver: receiverChoreId,
                    choreIdOfSender:senderChoreId,
                    status:"requested",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    //res.body.should.have.property('message').eql('userChore successfully added!');
                    res.body.should.have.property('newRequest');
                    res.body.newRequest.choreIdOfReceiver.should.be.eql(receiverChoreId);
                    res.body.newRequest.choreIdOfSender.should.be.eql(senderChoreId);
                    done();
                });
        });

        it('it should faild in  POST new replacement request when the userchore not exist', (done) => {
            chai.request(server)
                .post('/api/chores/replacementRequests/specificRequest')
                .set('Authorization', tokenTest)
                .send({
                    choreIdOfReceiver: -3,
                    choreIdOfSender:senderChoreId,
                    status:"requested",
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    //res.body.should.have.property('message').eql('userId doesn\'t exist!');

                    done();
                });
        });

        after((done) => {
            UsersChores.destroy({
                where:{
                    userId:{[Op.or]:[userTest.userId,userTest2.userId ]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: choreTypeTestFri.choreTypeName
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId ]}
                }
            });
            done();

        });
    });

    describe('/PUT new generalRequest replacenment Request api?', () => {
        var senderOldDate;
        var receiverOldDate;
        var senderChoreId;
        var receiverChoreId;
        var userChore1 = {
            userId: userTest.userId,
            choreTypeName: choreTypeTestFri.choreTypeName,
            date: "2019-11-25",//Date.now(),//"2018-12-25 10:00",
            isMark: false
        }
        var userChore2 = {
            userId: userTest2.userId,
            choreTypeName: choreTypeTestFri.choreTypeName,
            date: "2019-12-12",//Date.now(),//"2018-12-25 10:00",
            isMark: false
        }
        before((done) => {
            ChoreTypes.create(choreTypeTestFri);
            Users.create(userTest);
            Users.create(userTest2);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChoresTypes.create({
                userId: userTest2.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChores.create(userChore1)
            .then(sender=>{
                senderOldDate = sender.dataValues.date;
                senderChoreId = sender.dataValues.userChoreId;
                UsersChores.create(userChore2)
                .then(receiver=>{
                    receiverOldDate = receiver.dataValues.date;
                    receiverChoreId = receiver.dataValues.userChoreId;
                    
                        done();
                })
            })
        });

        it('it should PUT general request successefuly', (done) => {
            chai.request(server)
                .put('/api/chores/replacementRequests/generalRequest')
                .set('Authorization', tokenTest)
                .send({
                    userChoreId:senderChoreId ,
	                isMark: true
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('newRequest');
                    res.body.newRequest.userChoreId.should.be.eql(senderChoreId);
                    res.body.newRequest.isMark.should.be.eql(true);
                    done();
                });
        });


        after((done) => {
            UsersChores.destroy({
                where:{
                    userId:{[Op.or]:[userTest.userId,userTest2.userId ]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: choreTypeTestFri.choreTypeName
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId ]}
                }
            });
            done();

        });
    });

    describe('/PUT - change status of specific replacenment Request api?', () => {
        var senderOldDate;
        var receiverOldDate;
        var senderChoreId;
        var receiverChoreId;
        var userChore1 = {
            userId: userTest.userId,
            choreTypeName: choreTypeTestFri.choreTypeName,
            date: "2019-11-25",//Date.now(),//"2018-12-25 10:00",
            isMark: false
        }
        var userChore2 = {
            userId: userTest2.userId,
            choreTypeName: choreTypeTestFri.choreTypeName,
            date: "2019-12-12",//Date.now(),//"2018-12-25 10:00",
            isMark: false
        }
        before((done) => {
            ChoreTypes.create(choreTypeTestFri);
            Users.create(userTest);
            Users.create(userTest2);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChoresTypes.create({
                userId: userTest2.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChores.create(userChore1)
            .then(sender=>{
                senderOldDate = sender.dataValues.date;
                senderChoreId = sender.dataValues.userChoreId;
                UsersChores.create(userChore2)
                .then(receiver=>{
                    receiverOldDate = receiver.dataValues.date;
                    receiverChoreId = receiver.dataValues.userChoreId;
                    SwapRequests.create({
                        choreIdOfReceiver: receiverChoreId,
                        choreIdOfSender:senderChoreId,
                        status:"requested"
                    }).then(r=>{
                        done();
                    })


                })
            })
        });

        it('it should put- change status replacement request successefuly', (done) => {
            chai.request(server)
                .put('/api/chores/replacementRequests/changeStatus')
                .set('Authorization', tokenTest)
                .send({
                    choreIdOfReceiver: receiverChoreId,
                    choreIdOfSender:senderChoreId,
                    status:"deny",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('newRequest');
                    res.body.newRequest.choreIdOfReceiver.should.be.eql(receiverChoreId);
                    res.body.newRequest.choreIdOfSender.should.be.eql(senderChoreId);
                    res.body.newRequest.status.should.be.eql("deny");
                    done();
                });
        });


        after((done) => {
            UsersChores.destroy({
                where:{
                    userId:{[Op.or]:[userTest.userId,userTest2.userId ]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: choreTypeTestFri.choreTypeName
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId ]}
                }
            });
            done();

        });
    });

    describe('/PUT - swap chores according to replacenment Request api?', () => {
        var senderOldDate;
        var receiverOldDate;
        var senderChoreId;
        var receiverChoreId;
        var userChore1 = {
            userId: userTest.userId,
            choreTypeName: choreTypeTestFri.choreTypeName,
            date: "2019-11-25",//Date.now(),//"2018-12-25 10:00",
            isMark: false
        }
        var userChore2 = {
            userId: userTest2.userId,
            choreTypeName: choreTypeTestFri.choreTypeName,
            date: "2019-12-12",//Date.now(),//"2018-12-25 10:00",
            isMark: false
        }
        before((done) => {
            ChoreTypes.create(choreTypeTestFri);
            Users.create(userTest);
            Users.create(userTest2);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChoresTypes.create({
                userId: userTest2.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChores.create(userChore1)
            .then(sender=>{
                senderOldDate = moment(sender.dataValues.date).format('YYYY-MM-DD')+'T00:00:00.000Z';
                senderChoreId = sender.dataValues.userChoreId;
                UsersChores.create(userChore2)
                .then(receiver=>{
                    receiverOldDate = moment(receiver.dataValues.date).format('YYYY-MM-DD')+'T00:00:00.000Z';
                    receiverChoreId = receiver.dataValues.userChoreId;
                    SwapRequests.create({
                        choreIdOfReceiver: receiverChoreId,
                        choreIdOfSender:senderChoreId,
                        status:"requested"
                    }).then(r=>{
                        done();
                    })


                })
            })
        });

        it('it should put- execute replacement chores successefuly done', (done) => {
            chai.request(server)
                .put('/api/chores/replacementRequests/replace')
                .set('Authorization', tokenTest)
                .send({
                    "choreIdOfReceiver": receiverChoreId,
	                "choreIdOfSender":senderChoreId
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('choreRec');
                    res.body.choreRec.userId.should.be.eql(userTest2.userId);
                    res.body.choreRec.date.should.be.eql(senderOldDate);
                    res.body.should.have.property('choreSen');
                    res.body.choreSen.userId.should.be.eql(userTest.userId);
                    res.body.choreSen.date.should.be.eql(receiverOldDate);
                    done();
                });
        });


        after((done) => {
            UsersChores.destroy({
                where:{
                    userId:{[Op.or]:[userTest.userId,userTest2.userId ]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: choreTypeTestFri.choreTypeName
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId ]}
                }
            });
            done();

        });
    });

//});

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
            //res.body.message.should.equal(constants.general.SUCCESSFUL_TOKEN,);
            res.body.should.have.property('token');
            return res.body.token;
        })
        .catch((err) => {
            throw err;
        });
}
})