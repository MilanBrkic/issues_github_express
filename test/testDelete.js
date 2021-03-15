process.env.NODE_ENV = 'test'
const app = require('../server');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const IssueModel = require('../db/model');


const funcs = require('./testFunctions');
const { assert } = require('chai');
const deleteAll = funcs.deleteAll;
const addIssue = funcs.addIssue;



describe('routes', function () {
    beforeEach(() => {
        deleteAll();
    });

    afterEach(() => {
        deleteAll();
    })

    describe("DELETE /api/issues/delete/all", () => {
        describe("One issue", () => {
            it("status code 200, issue deleted", async () => {
                await addIssue();
                chai.request(app)
                    .delete('/api/issues/delete/all')
                    .end(async(err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('ok').and.to.be.eql(1);
                        res.body.should.have.property('n').and.to.be.eql(1);
                        res.body.should.have.property('deletedCount').and.to.be.eql(1);
                        var docs = await IssueModel.find();
                        docs.should.be.an('array');
                        docs.length.should.be.eql(0);
                    })
            })
        })

        describe("Three issues", () => {
            it("status code 200, issues deleted", async() => {
                var n = 3;
                for (var i = 0; i < n; i++) await addIssue();
                chai.request(app)
                    .delete('/api/issues/delete/all')
                    .end(async(err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('ok').and.to.be.eql(1);
                        res.body.should.have.property('n').and.to.be.eql(n);
                        res.body.should.have.property('deletedCount').and.to.be.eql(n);
                        var docs = await IssueModel.find();
                        docs.should.be.an('array');
                        docs.length.should.be.eql(0);
                    })
            })
        })

        describe("Delete all but no issues in db", () => {
            it('status code 200, no issues deleted', async() => {
                chai.request(app)
                    .delete('/api/issues/delete/all')
                    .end(async(err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('ok').and.to.be.eql(1);
                        res.body.should.have.property('n').and.to.be.eql(0);
                        res.body.should.have.property('deletedCount').and.to.be.eql(0);
                        var docs = await IssueModel.find();
                        docs.should.be.an('array');
                        docs.length.should.be.eql(0);
                    })
            })
        })
    })

    describe("DELETE /api/issues/:id", () => {
        describe("One issue", () => {
            it('status code 200, issue deleted', async() => {
                var n = 1;
                var result = addIssue();
                chai.request(app)
                    .delete('/api/issues/' + result._id)
                    .end(async(err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('deleted').and.to.be.an('object');
                        var deleted = res.body.deleted;
                        deleted.should.have.property('title').and.to.be.eql(result.title);
                        deleted.should.have.property('user').and.to.be.eql(result.user);
                        deleted.should.have.property('text').and.to.be.eql(result.text);
                        deleted.should.have.property('closed').and.to.be.eql(result.closed);
                        var docs = await IssueModel.findById(result.id);
                        assert(docs,null);
                    })
            })
        })

        describe("Id is in invalid format", () => {
            it('status 400, error: Id does not exist', (done) => {
                chai.request(app)
                    .delete('/api/issues/604')
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.an('object');
                        res.body.should.have.property('err').and.to.be.eql('Invalid id');
                        done();
                    })
            })
        })

        describe("Id does not exist in db", () => {
            it('status 400, error: Id does not exist', (done) => {
                chai.request(app)
                    .delete('/api/issues/604e929c61c1b217ccba6441')
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.an('object');
                        res.body.should.have.property('err').and.to.be.eql('Id does not exist');
                        done();
                    })
            })
        })
    })
})