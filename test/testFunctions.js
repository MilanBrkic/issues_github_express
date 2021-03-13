const IssueModel = require('../db/model');
const fsExtra = require('fs-extra')
const testUploads = './test/uploads';
const path = require('path');
const fs = require('fs');

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

function addIssueWithFile() {
    var pic = 'test-pic.jpg';
    let issue = {
        title: "de ti titula get",
        text: "de ti tekst",
        user: "de ti user",
        closed: false,
        file: new Array(pic),
        comment: new Array()
    }

    const pathToFile = path.join(__dirname,"test-pic.jpg")
    const pathToNewDestination = path.join(__dirname, "uploads", "test-pic.jpg")

    fs.copyFile(pathToFile, pathToNewDestination, function (err) {
        if (err) {
            throw err
        } else {
            console.log("Successfully copied and moved the file!")
        }
    })

    return addIssueToDb(issue);
}

function addIssueWithFiles() {
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

module.exports = { deleteAll, addIssue, addIssueWithFile, addIssueWithFiles }