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

describe('routes', ()=>{
    beforeEach(()=>{
        deleteAll();
    })

    describe('PUT /api/issues/:id', ()=>{
        describe('Issue update', ()=>{
            // it('status code 200, issue updated', async(done)=>{
            //     var result = await addIssue();
            //     var issue = {title: 'title',text: 'text', user:'user'};
            //     chai.request(app)
            //         .put('/api/issues/'+result._id)
            //         .send(issue)
            //         .end((err,res)=>{
            //             console.log(res.body.title);

            //             res.should.have.status(200);
            //             res.body.should.be.an('object');
            //             res.body.should.have.property('title').and.to.be.eql('title');
            //             done();
            //         })
            // })
        })
    })
})