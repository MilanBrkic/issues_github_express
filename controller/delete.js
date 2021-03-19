const IssueModel = require('../db/model');
var uploads;
if(process.env.NODE_ENV === 'test') uploads = './test/uploads'
else uploads = './uploads'
const fsExtra = require('fs-extra')
const fs = require('fs');
const path = require('path');
const mongoose  = require('mongoose')

/**
 * Deletes an array of files
 * @param {string} folder folder that contains the array of files
 * @param {Array.<string>} files array of file names
 */
function deleteFiles(folder, files){
    files.forEach(file => {
        fs.unlink(path.join(folder, file), err => {
            if (err) throw err;
        });
    });
}

/**
 * DELETE /api/issues/delete/all
 * @summary Deletes all issues in the database 
 * @tags Issue
 * @return {Response} 200 - success response - info about deleted files
 */
exports.deleteAll = async (req, res) => {
    try {
        //delete all issues
        var r;
        await IssueModel.deleteMany({}, (err,result) => {
            if (err) throw err;
            
            //delete all files
            fsExtra.emptyDirSync(uploads)
            r = result;
        });
        res.send(r);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

/**
 * DELETE /api/issues/:id
 * @summary deletes an issue
 * @tags Issue
 * @param {string} id - issue id
 * @return {Response} 200 - scucces response - deleted issue
 */
exports.deleteOne = async(req,res) =>{
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) throw {err: "Invalid id"};
        await IssueModel.findByIdAndDelete(req.params.id, (err,docs) =>{
            if (err) throw err
            if(docs==null) res.status(400).send({err:"Id does not exist"});
            else {
                var files = docs.file;
                deleteFiles(uploads, files)
                
                res.send({deleted:docs})
            }
        })
    } catch (err) {
        res.status(400).send(err)
    }
}