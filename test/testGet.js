process.env.NODE_ENV = 'test'
const app = require('../server');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();

chai.use(chaiHttp);

const funcs = require('./testFunctions')
const deleteAll = funcs.deleteAll;
const addIssue = funcs.addIssue;
const addIssueWithComment = funcs.addIssueWithComment;

describe('GET routes', function () {

    beforeEach(() => {
        deleteAll();
    });


    after(() => {
        deleteAll();
    })

    describe('GET /api/issues', () => {
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

    describe("GET /api/issues/:id", () => {
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

        
        describe("Wrong id", () => {
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

    describe('GET /api/issues/:id/comment', ()=>{
        describe('Return comments from specific issue', ()=>{
            it('status code 200, array of comments', (done)=>{
                var result = addIssueWithComment();
                var comment = result.comment;
                console.log();
                chai.request(app)
                    .get('/api/issues/' + result._id+"/comment")
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('array');
                        var com = res.body;
                        com.length.should.be.eql(2);
                        com[0].should.have.property('_id').and.to.be.eql(comment[0]._id+'');
                        com[0].should.have.property('user').and.to.be.eql(comment[0].user);
                        com[0].should.have.property('text').and.to.be.eql(comment[0].text);
                        com[1].should.have.property('_id').and.to.be.eql(comment[1]._id+'');
                        com[1].should.have.property('user').and.to.be.eql(comment[1].user);
                        com[1].should.have.property('text').and.to.be.eql(comment[1].text);
                        done();
                    })
            })
        })

        describe("Wrong id", () => {
            it("status code 400 and object with property err", (done) => {
                var result = addIssue();
                chai.request(app)
                    .get('/api/issues/1234/comment')
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