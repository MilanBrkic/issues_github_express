const IssueModel = require('../db/model');
const mongoose = require('mongoose')
const joi = require('../joi/joi');


function updateIssueValidation(req) {
    var attr = ['title', 'text', 'user'];
    var badAttr = ['file', 'comment', 'closed']
    var err = new Array();
    for (var key in req.body) {
        if (badAttr.includes(key)) {
            if (key == 'closed') key = 'close';
            err.push({ attribute: key, msg: 'Use PUT /api/issues/:id/' + key + ' instead' })
        }
        else if (!attr.includes(key)) err.push({ attribute: key, msg: 'Attribute does not exist' });
    }
    if (err.length != 0) throw { error: err };
}

async function validateIdAndClosed(req) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw { err: "Invalid id" };

    var iss = await IssueModel.findById(req.params.id);
    if (iss == null) throw { err: "Id does not exist" }
    if (iss.closed == true) throw { err: 'Issue is closed. Can not be modified' };

}

exports.updateIssue = async (req, res) => {
    try {
        await validateIdAndClosed(req);

        updateIssueValidation(req);

        IssueModel.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false })
            .then((issue) => {
                res.send(issue);
            })
            .catch((err) => { throw err })
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.closeIssue = async (req, res) => {
    try {
        await validateIdAndClosed(req);

        IssueModel.findByIdAndUpdate(req.params.id, { closed: true }, { new: true, useFindAndModify: false })
            .then((issue) => {
                res.send({ closed: issue });
            })
            .catch((err) => { throw err })
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.addComment = async (req, res) => {
    try {
        await validateIdAndClosed(req);
        var comment = { user: req.body.user, text: req.body.text };
        await joi.joiCommentSchema.validateAsync(comment)


        IssueModel.findByIdAndUpdate(req.params.id, { $push: { comment } }, { new: true, useFindAndModify: false })
            .then((issue) => {
                res.send(issue);
            })
            .catch((err) => { throw err })
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.addFiles = async (req, res) => {
    try {
        await validateIdAndClosed(req);
        var pics = new Array();
        req.files.forEach(element => {
            var path = element.filename;
            path = path.replace("\\", '/');
            path = path.replace(/ /g, "-");
            pics.push(path);
        });

        IssueModel.findByIdAndUpdate(req.params.id, { $push: { file: {$each: pics} } }, { new: true, useFindAndModify: false })
            .then((issue) => {
                res.send(issue);
            })
            .catch((err) => { throw err })

    } catch (error) {
        res.status(400).send(error);
    }
}