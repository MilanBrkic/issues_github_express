const IssueModel = require('../db/model');
const testUploads = './uploads';
const fs = require('fs');
const path = require('path');
const mongoose  = require('mongoose')


exports.deleteAll = async (req, res) => {
    try {
        //delete all issues
        var r;
        await IssueModel.deleteMany({}, (err,result) => {
            if (err) throw err;
            
            //delete all files
            fs.readdir(testUploads, (err, files) => {
                if (err) throw err;
        
                for (const file of files) {
                    fs.unlink(path.join(testUploads, file), err => {
                        if (err) throw err;
                    });
                }
            });

            r = result;
        });
        res.send(r);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

exports.deleteOne = async(req,res) =>{
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) throw {err: "invalid id"};
        await IssueModel.findByIdAndDelete(req.params.id, (err,docs) =>{
            if (err) throw err
            if(docs==null) res.status(400).send({err:"id does not exist"});
            else res.send({deleted:docs})
        })
    } catch (err) {
        res.status(400).send(err)
    }
}