const IssueModel = require('../db/model');
const path = require('path');

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
        res.status(400).send({msg:"id does not exist",err:error});
    }
}

exports.downloadFile = async(req,res)=>{
    try {
        res.download("./uploads/"+req.params.link);
    } catch (error) {
        res.send(error);
    }
}

exports.viewFile = async(req,res)=>{
    const options = {
        root: path.join('./uploads'),
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }

    try {
        res.sendFile(req.params.link, options)
    } catch (error) {
        res.send(error);
    }
}

exports.viewComments = async(req,res)=>{
    try {
        var result = await IssueModel.findById(req.params.id);
        res.send(result.comment);
    } catch (error) {
        res.status(400).send({msg:"id does not exist",err:error});
    }
}