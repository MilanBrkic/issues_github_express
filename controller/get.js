const IssueModel = require('../db/model');


exports.getAllIssues= async (req,res)=>{
    try {
        var issues = await IssueModel.find();
        res.send(issues);
    } catch (error) {
        res.send(error)
    }
}

exports.getOneIssue = async(req,res)=>{
    try {
        var result = await IssueModel.findById(req.params.id);
        res.send(result);
    } catch (error) {
        res.send(error);
    }
}

exports.downloadImage = async(req,res)=>{
    try {
        res.download("./uploads/"+req.params.link);
    } catch (error) {
        res.send(error);
    }
}


