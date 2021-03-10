process.env.NODE_ENV = 'test'
const app = require('../server');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const IssueModel = require('../db/model');
chai.use(chaiHttp);

const testUploads = './test/uploads';
const fs = require('fs');
const path = require('path');

const fsExtra = require('fs-extra')



function deleteAll() {
    
    //delete all issues
    try {
        IssueModel.deleteMany({}, (err) => {
            if(err) throw err
    
            fsExtra.emptyDirSync(testUploads)
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}


describe('hooks', function () {

    beforeEach(() => {
        deleteAll();
    });


    after(() => {
        deleteAll();
    })

    describe('POST /api/issues/add', () => {
        it('Post basic test', (done) => {
            chai.request(app)
                .post('/api/issues/add')
                .set('content-type', 'multipart/form-data')
                .field('title', "de ti titula")
                .field('text', "de ti tekst")
                .field('user', "de ti user")
                .attach('file', fs.readFileSync('./test/test-pic.jpg'), 'test-pic.jpg')
                .end( (err, res) => {
                    if(err) console.log(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('file');
                    var file = res.body.file;
                    file.should.be.an('array');
                    file.length.should.be.eql(1);

                    res.body.should.have.property('comment')
                    var comment = res.body.comment;
                    comment.should.be.an('array');
                    comment.length.should.be.eql(0);

                    res.body.should.have.property('_id').and.to.be.a('string');
                    res.body.should.have.property('title').and.to.be.a('string');
                    res.body.should.have.property('text').and.to.be.a('string');
                    res.body.should.have.property('user').and.to.be.a('string');
                    res.body.should.have.property('closed').and.to.be.a('boolean')
                                                           .and.to.be.eql(false);
                    
                    done();
                })
        })

        it('Post basic test without file', (done) => {
            chai.request(app)
                .post('/api/issues/add')
                .set('content-type', 'multipart/form-data')
                .field('title', "de ti titula")
                .field('text', "de ti tekst")
                .field('user', "de ti user")
                .end( (err, res) => {
                    if(err) console.log(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('file');
                    var file = res.body.file;
                    file.should.be.an('array');
                    file.length.should.be.eql(0);

                    res.body.should.have.property('comment')
                    var comment = res.body.comment;
                    comment.should.be.an('array');
                    comment.length.should.be.eql(0);

                    res.body.should.have.property('_id').and.to.be.a('string');
                    res.body.should.have.property('title').and.to.be.a('string');
                    res.body.should.have.property('text').and.to.be.a('string');
                    res.body.should.have.property('user').and.to.be.a('string');
                    res.body.should.have.property('closed').and.to.be.a('boolean')
                                                           .and.to.be.eql(false);
                    
                    done();
                })
        })

        it('Post without title', (done)=>{
            chai.request(app)
                .post('/api/issues/add')
                .set('content-type', 'multipart/form-data')
                .field('text', "de ti tekst")
                .field('user', "de ti user")
                .attach('file', fs.readFileSync('./test/test-pic.jpg'), 'test-pic.jpg')
                .end( (err, res) => {
                    if(err) console.log(err);
                    res.should.have.status(400);
                    res.body.should.be.a('object');

                    res.body.should.have.property('details');
                    var details = res.body.details[0];
                    details.should.have.property('message').and.to.be.eql("\"title\" is required");
                    
                    done()
                    
                })
        })

        it('Post without text', (done)=>{
            chai.request(app)
                .post('/api/issues/add')
                .set('content-type', 'multipart/form-data')
                .field('title', "de ti titula")
                .field('user', "de ti user")
                .attach('file', fs.readFileSync('./test/test-pic.jpg'), 'test-pic.jpg')
                .end( (err, res) => {
                    if(err) console.log(err);
                    res.should.have.status(400);
                    res.body.should.be.a('object');

                    res.body.should.have.property('details');
                    var details = res.body.details[0];
                    details.should.have.property('message').and.to.be.eql("\"text\" is required");
                    
                    done()
                    
                })
        })

        it('Post without text', (done)=>{
            chai.request(app)
                .post('/api/issues/add')
                .set('content-type', 'multipart/form-data')
                .field('title', "de ti titula")
                .field('text', "de ti tekst")
                .attach('file', fs.readFileSync('./test/test-pic.jpg'), 'test-pic.jpg')
                .end( (err, res) => {
                    if(err) console.log(err);
                    res.should.have.status(400);
                    res.body.should.be.a('object');

                    res.body.should.have.property('details');
                    var details = res.body.details[0];
                    details.should.have.property('message').and.to.be.eql("\"user\" is required");
                    
                    done()
                    
                })
        })

        it('Post file too large ', (done)=>{
            chai.request(app)
                .post('/api/issues/add')
                .set('content-type', 'multipart/form-data')
                .field('title', "de ti titula")
                .field('text', "de ti tekst")
                .field('user', 'de ti user')
                .attach('file', fs.readFileSync('./test/test-large-file.pptx'), 'test-large-file.pptx')
                .end( (err, res) => {
                    if(err) console.log(err);
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

        it('Post two files', (done)=>{
            chai.request(app)
                .post('/api/issues/add')
                .set('content-type', 'multipart/form-data')
                .field('title', "de ti titula")
                .field('text', "de ti tekst")
                .field('user', 'de ti user')
                .attach('file', fs.readFileSync('./test/test-pic.jpg'), 'test-pic.jpg')
                .attach('file', fs.readFileSync('./test/test-pic.jpg'), 'test-pic.jpg')
                .end( (err, res) => {
                    if(err) console.log(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('file').and.to.be.an('array');
                    res.body.file.length.should.be.eql(2);
                    done()
                    
                })
        })

        it('Post more than 10 files', (done)=>{
            const file = fs.readFileSync('./test/test-pic.jpg')
            chai.request(app)
                .post('/api/issues/add')
                .set('content-type', 'multipart/form-data')
                .field('title', "de ti titula")
                .field('text', "de ti tekst")
                .field('user', 'de ti user')
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
                .end( (err, res) => {
                    if(err) console.log(err);
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