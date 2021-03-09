process.env.NODE_ENV = 'test'
const app = require('../server');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const IssueModel = require('../db/model');

chai.use(chaiHttp);

function deleteAll(){
    //delete all issues
    IssueModel.deleteMany({}, (err) => err);
}

describe('hooks', function () {
    
    beforeEach(() => {
        deleteAll();
     });

     
    describe('GET api/issues', ()=>{
        
        it('GET zero', (done) => {
            chai.request(app)
                .get('/api/issues')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        })


        it('GET one', (done) => {
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

            chai.request(app)
                .get('/api/issues')
                .end((err, res) => {
                    res.should.have.status(200);
                    console.log(res.body);
                    done();
                });
        })
    })
})