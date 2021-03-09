const joi = require('../joi/joi');
const issueModel = require('../db/model');


exports.issues_get = async (req,res)=>{
    try {
        var issues = await IssueModel.find();
        res.send(issues);
    } catch (error) {
        res.send(error)
    }
}


