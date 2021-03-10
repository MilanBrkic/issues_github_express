const IssueModel = require('../db/model');


exports.getAllIssues= async (req,res)=>{
    try {
        var issues = await IssueModel.find();
        res.send(issues);
    } catch (error) {
        res.send(error)
    }
}




