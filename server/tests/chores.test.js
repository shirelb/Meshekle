var expect = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

const db = require('../DBorm/DBorm');
const UsersChores = db.UsersChores;
const Users = db.Users;
const ChoreTypes = db.ChoreTypes;

let server = require('../app');

chai.use(chaiHttp);

describe('chores route', function () {
    before(() => {
        return UsersChores.sync() // also tried with {force: true}
        let userTest = {
            userId: "436547125",
            fullname: "test test",
            password: "tset22",
            email: "test@gmail.com",
            mailbox: 444,
            mobile: "1234567896",
            phone: "012365948",
            bornDate: "1992-05-20"
        };

        describe('/GET users by name', () => {
            before((done) => {
                Users.create(userTest);
                UsersChores.create(userTest);
                ///continue prepare the before test (create chore type...define choretype object like in userTest...blabla)
                done();
            });
    
            it('it should GET all the user with name dafna', (done) => {
                chai.request(server)
                    .get('/api/users/name/test')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(1);
                        done();
                    });
            });
    
            after((done) => {
                Users.destroy({
                    where: {
                        userId: userTest.userId
                    }
                });
                done();
            });
        });



        //
    });


});