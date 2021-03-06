process.env.NODE_ENV = 'test'
const IssueModel = require('../db/model');
const fsExtra = require('fs-extra')
const testUploads = './uploads';
const path = require('path');
const fs = require('fs');
let chai = require('chai');

const { assert } = require('chai');
/**
 * @summary deletes all entries in the database and files in the local
 */
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
/**
 * @summary adds a issue to test in the database
 * @param {Object} issue Issue object
 * @returns {Object}Issue object
 */
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
/**
 * @summary adds a issue to test in the database
 * @returns {Object}Issue object
 */
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

/**
 * @summary adds a issue that is closed to test in the database
 * @returns {Object}Issue object
 */
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
/**
 * @summary adds a issue that has comments to test in the database
 * @returns {Object}Issue object
 */
function addIssueWithComment() {
    let issue = {
        title: "de ti titula get",
        text: "de ti tekst",
        user: "de ti user",
        closed: true,
        file: new Array(),
        comment: new Array({ user: 'Milan', text: 'Dobar issue' }, { user: 'Katarina', text: 'Vidjala sam bolje' })
    }

    return addIssueToDb(issue);
}

describe('test help functions', () => {
    beforeEach(() => {
        deleteAll();
    })

    describe('addIssue', () => {
        it('issue should be added to the database', async () => {
            var result = addIssue();
            var docs = await IssueModel.findById(result.id);
            docs.should.have.property('_id').and.to.be.eql(result._id);
            docs.should.have.property('title').and.to.be.eql(result.title);
            docs.should.have.property('user').and.to.be.eql(result.user);
            docs.should.have.property('text').and.to.be.eql(result.text);
        })
    })
})

module.exports = { deleteAll, addIssue, addClosedIssue, addIssueWithComment }