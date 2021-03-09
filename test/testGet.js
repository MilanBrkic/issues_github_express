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

function addIssue(){
    let issue = {
        title: "de ti titula get",
        text: "de ti tekst",
        user: "de ti user",
        closed: false,
        file: new Array(),
        comment: new Array()
    }

    const model = new IssueModel(issue);
    model
        .save()
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            throw err
        });
}

describe('hooks', function () {

    beforeEach(() => {
        deleteAll();
    });


    after(() => {
        deleteAll();
    })

    describe('GET api/issues', () => {

        it('GET zero', (done) => {
            chai.request(app)
                .get('/api/issues')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        })


        it('GET one', (done) => {
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

        it('GET check properties', (done) => {
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