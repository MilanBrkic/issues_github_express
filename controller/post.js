const IssueModel = require('../db/model');
const joi = require('../joi/joi');

exports.issues_add = async (req, res)=>{
    try {
        var pics = new Array();
        req.files.forEach(element => {
            var path = element.path;
            path = path.replace("\\",'/');
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

        const value = await joi.joiIssueSchema.validateAsync(issue).catch(err => { throw err });

        const model = new IssueModel(issue);
        model
            .save()
            .then(result => {
                res.send(result)
            })
            .catch(err => {
                throw err
            });
    } catch (error) {
        res.send(error);
    }
}