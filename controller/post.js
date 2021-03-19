const IssueModel = require('../db/model');
const fs = require('fs');
const path = require('path');
const joi = require('../joi/joi');
const upload = require('../multer/multer');

/**
 * POST /api/issues
 * @summary Adds an issue to the database
 * @param {Request} req request should have issue attributes in the body
 * @returns {Response} returns the added issue to the database
 */
exports.addIssue = async (req, res) => {
    try {
        var pics = new Array();
        req.files.forEach(element => {
            var path = element.filename;
            path = path.replace("\\", '/');
            path = path.replace(/ /g, "-");
            pics.push(path);
        });

        var issue = {
            title: req.body.title,
            text: req.body.text,
            user: req.body.user,
            closed: false,
            file: pics,
            comment: new Array()
        };
        const value = await joi.joiIssueSchema.validateAsync(issue)
                                                .catch(err => {
                                                    req.files.forEach(element => {
                                                        fs.unlink(path.join(element.path), ()=>{});
                                                    });
                                                    throw err;
                                                });

        const model = new IssueModel(issue);
        model.save()
            .then(result => {
                res.send(result)
            })
            .catch(err => {
                throw err
            });
    } catch (error) {
        res.status(400).send(error);
    }
}