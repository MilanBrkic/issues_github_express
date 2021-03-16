process.env.NODE_ENV = 'test'
const app = require('../server');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const IssueModel = require('../db/model');
const fs = require('fs');

const funcs = require('./testFunctions')
const deleteAll = funcs.deleteAll;
const addIssue = funcs.addIssue;
const addClosedIssue = funcs.addClosedIssue;

describe('routes', () => {
    beforeEach(() => {
        deleteAll();
    })

    describe('PUT /api/issues/:id', () => {
        describe('Issue update', () => {
            it('status code 200, issue updated', (done) => {
                var result = addIssue();
                var issue = { title: 'titula', text: 'text', user: 'user' };
                chai.request(app)
                    .put('/api/issues/' + result._id)
                    .send(issue)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('title').and.to.be.eql(issue.title);
                        res.body.should.have.property('text').and.to.be.eql(issue.text);
                        res.body.should.have.property('user').and.to.be.eql(issue.user);
                        IssueModel.findById(result._id).then(docs => {
                            docs.should.be.an('object');
                            docs.should.have.property('title').and.to.be.eql(issue.title);
                            docs.should.have.property('text').and.to.be.eql(issue.text);
                            docs.should.have.property('user').and.to.be.eql(issue.user);
                            done();
                        })
                    })
            })
        })

        describe('Issue update title only', () => {
            it('status code 200, title of issue updated only', (done) => {
                var result = addIssue();
                var issue = { title: 'titula' };
                chai.request(app)
                    .put('/api/issues/' + result._id)
                    .send(issue)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('title').and.to.be.eql(issue.title);
                        res.body.should.have.property('text').and.to.be.eql(result.text);
                        res.body.should.have.property('user').and.to.be.eql(result.user);
                        IssueModel.findById(result._id).then(docs => {
                            docs.should.be.an('object');
                            docs.should.have.property('title').and.to.be.eql(issue.title);
                            docs.should.have.property('text').and.to.be.eql(result.text);
                            docs.should.have.property('user').and.to.be.eql(result.user);
                            done();
                        })
                    })
            })
        })

        describe('Issue update text only', () => {
            it('status code 200, text of issue updated only', (done) => {
                var result = addIssue();
                var issue = { text: 'text' };
                chai.request(app)
                    .put('/api/issues/' + result._id)
                    .send(issue)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('title').and.to.be.eql(result.title);
                        res.body.should.have.property('text').and.to.be.eql(issue.text);
                        res.body.should.have.property('user').and.to.be.eql(result.user);
                        IssueModel.findById(result._id).then(docs => {
                            docs.should.be.an('object');
                            docs.should.have.property('title').and.to.be.eql(result.title);
                            docs.should.have.property('text').and.to.be.eql(issue.text);
                            docs.should.have.property('user').and.to.be.eql(result.user);
                            done();
                        })
                    })
            })
        })

        describe('Issue update user only', () => {
            it('status code 200, user of issue updated only', (done) => {
                var result = addIssue();
                var issue = { user: 'user' };
                chai.request(app)
                    .put('/api/issues/' + result._id)
                    .send(issue)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('title').and.to.be.eql(result.title);
                        res.body.should.have.property('text').and.to.be.eql(result.text);
                        res.body.should.have.property('user').and.to.be.eql(issue.user);
                        IssueModel.findById(result._id).then(docs => {
                            docs.should.be.an('object');
                            docs.should.have.property('title').and.to.be.eql(result.title);
                            docs.should.have.property('text').and.to.be.eql(result.text);
                            docs.should.have.property('user').and.to.be.eql(issue.user);
                            done();
                        })
                    })
            })
        })

        describe('Bad attribute in body', () => {
            it('status code 400, error object', (done) => {
                var result = addIssue();
                var issue = { titleee: 'title' };
                chai.request(app)
                    .put('/api/issues/' + result._id)
                    .send(issue)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.an('object');
                        var error = res.body.error;
                        res.body.should.have.property('error').and.to.be.an('array');
                        error.length.should.be.eql(1);
                        done();
                    })
            })
        })

        describe('Trying to update a issue that is already closed', () => {
            it('status code 400, error object', (done) => {
                var result = addClosedIssue();
                var issue = { file: 'file', comment: 'comment', closed: true };
                chai.request(app)
                    .put('/api/issues/' + result._id)
                    .send(issue)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.an('object');
                        res.body.should.have.property('err').and.to.be.eql('Issue is closed. Can not be modified');
                        done();
                    })
            })
        })

        describe("Id is in invalid format", () => {
            it('status 400, error: Invalid id', (done) => {
                chai.request(app)
                    .put('/api/issues/604')
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
                    .put('/api/issues/604e929c61c1b217ccba6441')
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.an('object');
                        res.body.should.have.property('err').and.to.be.eql('Id does not exist');
                        done();
                    })
            })
        })
    })

    describe('PUT /api/issues/:id/close', () => {
        describe('Basic issue closure', () => {
            it('status code 200, issue closed', (done) => {
                var result = addIssue();
                chai.request(app)
                    .put('/api/issues/' + result._id + '/close')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('closed');
                        const closed = res.body.closed;
                        closed.should.have.property('title').and.to.be.eql(result.title);
                        closed.should.have.property('text').and.to.be.eql(result.text);
                        closed.should.have.property('user').and.to.be.eql(result.user);
                        closed.should.have.property('closed').and.to.be.eql(true);
                        IssueModel.findById(result._id).then(docs => {
                            docs.should.be.an('object');
                            docs.should.have.property('title').and.to.be.eql(result.title);
                            docs.should.have.property('text').and.to.be.eql(result.text);
                            docs.should.have.property('user').and.to.be.eql(result.user);
                            docs.should.have.property('closed').and.to.be.eql(true);
                            done();
                        })
                    })
            })
        })

        describe('Failed closure because issue is already closed', () => {
            it('status code 400, error object', (done) => {
                var result = addClosedIssue();
                chai.request(app)
                    .put('/api/issues/' + result._id + '/close')
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.an('object');
                        res.body.should.have.property('err').and.to.be.eql('Issue is closed. Can not be modified');
                        done();
                    })
            })
        })

        describe("Id is in invalid format", () => {
            it('status 400, error: Invalid id', (done) => {
                chai.request(app)
                    .put('/api/issues/604/close')
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
                    .put('/api/issues/604e929c61c1b217ccba6441/close')
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.an('object');
                        res.body.should.have.property('err').and.to.be.eql('Id does not exist');
                        done();
                    })
            })
        })
    })

    describe('PUT /api/issues/:id/comment', () => {
        describe('Basic comment adding', () => {
            it('status code 200, comment added to issue', (done) => {
                var result = addIssue();
                const comment = { user: 'Milan', text: 'Ovo je dobar issue' };
                chai.request(app)
                    .put('/api/issues/' + result._id + '/comment')
                    .send(comment)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('comment').and.to.be.an('array');
                        var com = res.body.comment;
                        com.length.should.be.eql(1);
                        com[0].should.have.property('user').and.to.be.eql(comment.user);
                        com[0].should.have.property('text').and.to.be.eql(comment.text);
                        done();
                    })
            })
        })

        describe('Failed adding comment because issue is already closed', () => {
            it('status code 400, error object', (done) => {
                var result = addClosedIssue();
                chai.request(app)
                    .put('/api/issues/' + result._id + '/comment')
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.an('object');
                        res.body.should.have.property('err').and.to.be.eql('Issue is closed. Can not be modified');
                        done();
                    })
            })
        })

        describe("Id is in invalid format", () => {
            it('status 400, error: Invalid id', (done) => {
                chai.request(app)
                    .put('/api/issues/604/comment')
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
                    .put('/api/issues/604e929c61c1b217ccba6441/comment')
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.an('object');
                        res.body.should.have.property('err').and.to.be.eql('Id does not exist');
                        done();
                    })
            })
        })
    })

    describe('PUT /api/issues/:id/file', () => {
        describe('Basic file adding', () => {
            it('status code 200, and file added', (done) => {
                var result = addIssue();
                chai.request(app)
                    .put('/api/issues/' + result._id + '/file')
                    .set('content-type', 'multipart/form-data')
                    .attach('file', fs.readFileSync('./test/test-pic.jpg'), 'test-pic.jpg')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('file');
                        const file = res.body.file;
                        file.length.should.be.eql(1);
                        if (file[0].includes('test-pic.jpg')) done();
                        else done(new Error('the right picture was not saved'));
                    })
            })
        })

        describe('Basic two file adding', () => {
            it('status code 200, and two files added', (done) => {
                var result = addIssue();
                chai.request(app)
                    .put('/api/issues/' + result._id + '/file')
                    .set('content-type', 'multipart/form-data')
                    .attach('file', fs.readFileSync('./test/test-pic.jpg'), 'test-pic.jpg')
                    .attach('file', fs.readFileSync('./test/test-pic.jpg'), 'test-pic.jpg')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('file');
                        const file = res.body.file;
                        file.length.should.be.eql(2);
                        if (file[0].includes('test-pic.jpg') && file[1].includes('test-pic.jpg')) done();
                        else done(new Error('the right pictures were not saved'));
                    })
            })
        })


        describe('File too large ', () => {
            it('status code 400 and MulterError object', (done) => {
                var result = addIssue();
                chai.request(app)
                    .put('/api/issues/' + result._id + '/file')
                    .set('content-type', 'multipart/form-data')
                    .attach('file', fs.readFileSync('./test/test-large-file.pptx'), 'test-large-file.pptx')
                    .end((err, res) => {
                        if (err) console.log(err);
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name').and.to.be.eql('MulterError');
                        res.body.should.have.property('message').and.to.be.eql('File too large');
                        res.body.should.have.property('code').and.to.be.eql('LIMIT_FILE_SIZE');
                        res.body.should.have.property('field').and.to.be.eql('file');
                        res.body.should.have.property('storageErrors').and.to.be.an('array');
                        res.body.storageErrors.length.should.be.eql(0);
                        done()
                    })
            })
        })

        describe('More than 10 files', () => {
            it('status code 400 and MulterError object', (done) => {
                var result = addIssue();
                const file = fs.readFileSync('./test/test-pic.jpg')
                chai.request(app)
                    .put('/api/issues/' + result._id + '/file')
                    .set('content-type', 'multipart/form-data')
                    .attach('file', file, 'test-pic.jpg')
                    .attach('file', file, 'test-pic.jpg')
                    .attach('file', file, 'test-pic.jpg')
                    .attach('file', file, 'test-pic.jpg')
                    .attach('file', file, 'test-pic.jpg')
                    .attach('file', file, 'test-pic.jpg')
                    .attach('file', file, 'test-pic.jpg')
                    .attach('file', file, 'test-pic.jpg')
                    .attach('file', file, 'test-pic.jpg')
                    .attach('file', file, 'test-pic.jpg')
                    .attach('file', file, 'test-pic.jpg')
                    .end((err, res) => {
                        if (err) console.log(err);
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name').and.to.be.eql('MulterError');
                        res.body.should.have.property('message').and.to.be.eql('Unexpected field');
                        res.body.should.have.property('code').and.to.be.eql('LIMIT_UNEXPECTED_FILE');
                        res.body.should.have.property('field').and.to.be.eql('file');
                        res.body.should.have.property('storageErrors').and.to.be.an('array');
                        res.body.storageErrors.length.should.be.eql(0);
                        done()

                    })
            })
        })
    })
})