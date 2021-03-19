const IssueModel = require('../db/model');
const path = require('path');

/**
 * GET /api/issues
 * @summary Gets back all issues in the database
 * @returns {Response} returns an array of issues 
 */
exports.getAllIssues= async (req,res)=>{
    try {
        var issues = await IssueModel.find();
        res.send(issues);
    } catch (error) {
        res.send(error)
    }
}
/**
 * GET /api/issues/:id
 * @summary Gets back the specific issue
 * @param {string} id - id of the specific issue
 * @returns {Response} returns an array of issues 
 */
exports.getOneIssue = async(req,res)=>{
    try {
        var result = await IssueModel.findById(req.params.id);
        res.send(result);
    } catch (error) {
        res.status(400).send({msg:"id does not exist",err:error});
    }
}
/**
 * GET /api/issues/uploads/download/:link
 * @summary Downloads the file
 * @param {string} link - file name of the file we want to download
 * @returns {Response} downloads the file 
 */
exports.downloadFile = async(req,res)=>{
    try {
        res.download("./uploads/"+req.params.link);
    } catch (error) {
        res.send(error);
    }
}
/**
 * GET /api/issues/uploads/:link
 * @summary View the file
 * @param {string} link - file name of the file we want to view
 * @returns {Response} returns the file 
 */
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
/**
 * GET /api/issues/:id/comment
 * @summary View comments of the specific issue
 * @param {string} id - id of the specifi issue
 * @returns {Response} returns the array of comments
 */
exports.viewComments = async(req,res)=>{
    try {
        var result = await IssueModel.findById(req.params.id);
        res.send(result.comment);
    } catch (error) {
        res.status(400).send({msg:"id does not exist",err:error});
    }
}