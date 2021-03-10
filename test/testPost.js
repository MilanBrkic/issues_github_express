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
        it('Post osnovni test', (done) => {
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
    })
})