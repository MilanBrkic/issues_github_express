const IssueModel = require('../db/model');
var uploads;
if(process.env.NODE_ENV === 'test')uploads = './test/uploads'
else uploads = './uploads'

const fs = require('fs');
const path = require('path');
const mongoose  = require('mongoose')

function deleteFiles(folder, files){
    files.forEach(file => {
        fs.unlink(path.join(folder, file), err => {
            if (err) throw err;
        });
    });
}

exports.deleteAll = async (req, res) => {
    try {
        //delete all issues
        var r;
        await IssueModel.deleteMany({}, (err,result) => {
            if (err) throw err;
            
            //delete all files
            fs.readdir(uploads, (err, files) => {
                if (err) throw err;
        
                deleteFiles(uploads, files)
            });

            r = result;
        });
        res.send(r);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

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