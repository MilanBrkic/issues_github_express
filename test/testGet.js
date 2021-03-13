process.env.NODE_ENV = 'test'
const app = require('../server');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const IssueModel = require('../db/model');

chai.use(chaiHttp);

function deleteAll() {
    //delete all issues
    IssueModel.deleteMany({}, (err) => err);
}

function addIssue() {
    let issue = {
        title: "de ti titula get",
        text: "de ti tekst",
        user: "de ti user",
        closed: false,
        file: new Array(),
        comment: new Array()
    }

    const model = new IssueModel(issue);
    model.save()
        .then(result => {

        })
        .catch(err => {
            throw err
        });
    return model;
}

describe('routes', function () {

    beforeEach(() => {
        deleteAll();
    });


    after(() => {
        deleteAll();
    })

    describe('GET api/issues', () => {
        describe('Return zero issues', () => {
            it('status code 200 and empty array', (done) => {
                chai.request(app)
                    .get('/api/issues')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(0);
                        done();
                    });
            })
        })

        describe('Return one issue', (done) => {
            it('status code 200 and array length 1', (done) => {
                addIssue();

                chai.request(app)
                    .get('/api/issues')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(1);
                        done();
                    });
            })
        })

        describe('Check properties', (done) => {
            it('status code 200 and array length 1', (done) => {
                addIssue();

                chai.request(app)
                    .get('/api/issues')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(1);
                        var arr = res.body[0];
                        arr.should.have.property('file').and.to.be.an('array');
                        arr.should.have.property('comment').and.to.be.an('array');
                        arr.should.have.property('_id').and.to.be.a('string');
                        arr.should.have.property('title').and.to.be.a('string');
                        arr.should.have.property('text').and.to.be.a('string');
                        arr.should.have.property('user').and.to.be.a('string');
                        arr.should.have.property('closed').and.to.be.a('boolean');
                        done();
                    });
            })
        })
    })

    describe("GET api/issues/:id", () => {
        describe("Specific issue", (done) => {
            it("status code 200 and returns id specified issue", (done) => {
                var result = addIssue();
                chai.request(app)
                    .get('/api/issues/' + result._id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('file').and.to.be.an('array');
                        res.body.should.have.property('comment').and.to.be.an('array');
                        res.body.should.have.property('title').and.to.be.eql(result.title);
                        res.body.should.have.property('text').and.to.be.eql(result.text);
                        res.body.should.have.property('user').and.to.be.eql(result.user);
                        res.body.should.have.property('closed').and.to.be.eql(result.closed);
                        done();

                    })
            })
        })

        
        describe("Wrong id", (done) => {
            it("status code 400 and object with property err", (done) => {
                var result = addIssue();
                chai.request(app)
                    .get('/api/issues/1234')
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('err');
                        done();
                    })
            })
        })
    })
})