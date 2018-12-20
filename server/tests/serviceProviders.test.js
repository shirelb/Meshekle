var expect = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

const db = require('../DBorm/DBorm');
const ServiceProviders = db.ServiceProviders;

let server = require('../app');

chai.use(chaiHttp);


describe('service providers route', function () {
    before(() => {
        return ServiceProviders.sync() // also tried with {force: true}
    });

    beforeEach((done) => {
        /*Book.remove({}, (err) => {
            done();
        });*/
        done();
    });

    /*after(() => {
        return Users.sync() // also tried with {force: true}
    });

    afterEach((done) => {
        /!*Book.remove({}, (err) => {
            done();
        });*!/
        done();
    });*/

    describe('/GET serviceProviders', () => {
        it('it should GET all the service providers', (done) => {
            chai.request(server)
                .get('/api/serviceProviders')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/GET serviceProviders by name ', () => {
        it('it should GET all the service providers with given name', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/name/Amit')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                //    if(res.body.length > 0)
                  //      res.body.forEach(item => item.should.have.name('Amit'));
                    done();
                });
        });
    });


    describe('/GET serviceProviders by role ', () => {
        it('it should GET all the service providers with given role', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/role/Dentist')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    if(res.body.length > 0)
                        res.body.forEach(item => item.should.have.role('Dentist'));
                    done();
                });
        });
    });

   /* describe('/POST users', () => {
        it('it should not POST a user without username field', (done) => {
            let userTest = {
                firstName: "Dafna",
                lastName: "Or",
                password: "dafnaor11",
                email: "dafnaor@gmail.com",
                mailbox: 1222,
                cellphone: "0545249499",
                phone: "089873645"
            };

            chai.request(server)
                .post('/api/users/add')
                .send(userTest)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors[0].path.should.equal('username');
                    done();
                });
        });

        it('it should POST a user ', (done) => {
            let userTest = {
                username: "dafnao",
                firstName: "Dafna",
                lastName: "Or",
                password: "dafnaor11",
                email: "dafnaor@gmail.com",
                mailbox: 1222,
                cellphone: "0545249499",
                phone: "089873645"
            };

            chai.request(server)
                .post('/api/users/add')
                .send(userTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User successfully added!');
                    res.body.newUser.should.have.property('username');
                    res.body.newUser.should.have.property('firstName');
                    res.body.newUser.should.have.property('lastName');
                    res.body.newUser.should.have.property('password');
                    res.body.newUser.should.have.property('email');
                    res.body.newUser.should.have.property('mailbox');
                    res.body.newUser.should.have.property('cellphone');
                    res.body.newUser.should.have.property('phone');
                    done();
                });
        });
    });

    /*it('should send back a JSON object with goodCall set to true', function () {
        request(app)
          .post('/v1/auth/signin')
          .set('Content-Type', 'application/json')
          .send({ email: 'email', password: 'password' })
          .expect('Content-Type', /json/)
          .expect(200, done);
    });*!/

    it('Should respond in English as default', function () {
        let newReq = req;
        newReq.body.name = 'Jody';

        hello(newReq, res);
        expect(res.sendCalledWith).to.equal('Hello, Jody');
    });

    it('Should return greeting for english, spanish, or german', function() {
        let newReq = req;
        newReq.body.name = 'Jody';

        newReq.body.language = 'en';
        hello(newReq, res);
        expect(res.sendCalledWith).to.equal('Hello, Jody');

        newReq.body.language = 'es';
        hello(newReq, res);
        expect(res.sendCalledWith).to.equal('Hola, Jody');

        newReq.body.language = 'de';
        hello(newReq, res);
        expect(res.sendCalledWith).to.equal('Hallo, Jody');
    });*/

});
