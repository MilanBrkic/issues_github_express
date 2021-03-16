process.env.NODE_ENV = 'test'
const IssueModel = require('../db/model');
const fsExtra = require('fs-extra')
const testUploads = './uploads';
const path = require('path');
const fs = require('fs');
let chai = require('chai');

const { assert } = require('chai');
function deleteAll() {
    //delete all issues
    try {
        IssueModel.deleteMany({}, (err) => {
            if (err) throw err

            fsExtra.emptyDirSync(testUploads)
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

function addIssueToDb(issue) {
    const model = new IssueModel(issue);
    model.save()
        .then(result => {
            return result;
        })
        .catch(err => {
            throw err
        });
    return model;
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

    return addIssueToDb(issue);
}


function addClosedIssue() {
    let issue = {
        title: "de ti titula get",
        text: "de ti tekst",
        user: "de ti user",
        closed: true,
        file: new Array(),
        comment: new Array()
    }

    return addIssueToDb(issue);
}

describe('test help functions', () => {
    beforeEach(() => {
        deleteAll();
    })

    describe('addIssue', () => {
        it('issue should be added to the database', async() => {
            var result = addIssue();
            var docs = await IssueModel.findById(result.id);
            docs.should.have.property('_id').and.to.be.eql(result._id);
            docs.should.have.property('title').and.to.be.eql(result.title);
            docs.should.have.property('user').and.to.be.eql(result.user);
            docs.should.have.property('text').and.to.be.eql(result.text);
        })
    })
})

module.exports = { deleteAll, addIssue, addClosedIssue }