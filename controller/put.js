const IssueModel = require('../db/model');
const mongoose = require('mongoose')
const joi = require('../joi/joi');

/**
 * @summary checks if the body of the request is valid
 * @param {Requst} req the request of the update api call
 * @throws {Error} throws an error if invalid
 * @returns {*} nothing if valid
 */
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
/**
 * @summary checks if the id of params of the request is valid and that it exists
 * @param {Requst} req the request of the update api call
 * @throws {Error} throws an error if invalid
 * @returns {*} nothing if valid
 */
async function validateIdAndClosed(req) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw { err: "Invalid id" };

    var iss = await IssueModel.findById(req.params.id);
    if (iss == null) throw { err: "Id does not exist" }
    if (iss.closed == true) throw { err: 'Issue is closed. Can not be modified' };

}
/**
 * PUT /api/issues/:id
 * @summary Updates the issue, but only title, text and user attributes
 * @param {Request} req the request should have attribues title, text or user, and id in params
 * @returns {Response} returns the edited issue in the database
 * @throws {Error} throws an error if the non title, text, user attributes are entered.
 * @throws {Error} throws an error if id is invalid
 */
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

/**
 * PUT /api/issues/:id/close
 * @summary Closes the issue
 * @param {Request} req id in params of the request
 * @returns {Response} returns the closed issue in the database
 * @throws {Error} throws an error if id is invalid
 */
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
/**
 * PUT /api/issues/:id/comment
 * @summary Adds the comment to the issue
 * @param {Request} req id in params of the request, comment with attributes text and user in the body
 * @returns {Response} returns the edited issue in the database
 * @throws {Error} throws an error if id is invalid
 */
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
/**
 * PUT /api/issues/:id/file
 * @summary Adds the file to the issue
 * @param {Request} req id in params of the request, file in the body as a form-data
 * @returns {Response} returns the edited issue in the database
 * @throws {Error} throws an error if id is invalid
 */
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