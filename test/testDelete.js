process.env.NODE_ENV = 'test'
const app = require('../server');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const IssueModel = require('../db/model');

chai.use(chaiHttp);

const funcs = require('./testFunctions')
const deleteAll = funcs.deleteAll;
const addIssue = funcs.addIssue;
const addIssueWithFile = funcs.addIssueWithFile;


describe('routes', function () {

    beforeEach(() => {
        deleteAll();
    });


    describe("DELETE /api/issues/delete/all", () => {
        describe("One issue no files", () => {
            it("status code 200, issue deleted", (done) => {
                addIssue();
                chai.request(app)
                    .delete('/api/issues/delete/all')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('ok').and.to.be.eql(1);
                        res.body.should.have.property('n').and.to.be.eql(1);
                        res.body.should.have.property('deletedCount').and.to.be.eql(1);
                        done();
                    })
            })
        })

        describe("One issue one file", () => {
            it("status code 200, issue deleted, file deleted", (done) => {
                addIssueWithFile();
                done();
                // chai.request(app)
                //     .delete('/api/issues/delete/all')
                //     .end((err, res) => {
                //         res.should.have.status(200);
                //         res.body.should.be.an('object');
                //         res.body.should.have.property('ok').and.to.be.eql(1);
                //         res.body.should.have.property('n').and.to.be.eql(1);
                //         res.body.should.have.property('deletedCount').and.to.be.eql(1);
                //         done();
                //     })
            })
        })

        describe("One issue more file", () => {

        })

        describe("Three issues no files", () => {

        })

        describe("Three issues with files", () => {

        })

        describe("Delete all but no issues in db", () => {

        })
    })

    describe("DELETE /api/issues/:id", () => {
        describe("One issue no files", () => {
            it('status code 200, issue deleted', (done) => {
                var result = addIssue();
                chai.request(app)
                    .delete('/api/issues/'+result._id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('deleted').and.to.be.an('object');
                        var deleted =res.body.deleted;
                        deleted.should.have.property('file').and.to.be.an('array');
                        deleted.should.have.property('comment').and.to.be.an('array');
                        deleted.should.have.property('title').and.to.be.eql(result.title);
                        deleted.should.have.property('text').and.to.be.eql(result.text);
                        deleted.should.have.property('user').and.to.be.eql(result.user);
                        deleted.should.have.property('closed').and.to.be.eql(false);
                        done();
                    })
            })
        })

        describe("One issue one file", () => {

        })

        describe("One issue more file", () => {

        })

        describe("Id is in invalid format", () => {

        })

        describe("Id does not exist in db", () => {

        })
    })
})