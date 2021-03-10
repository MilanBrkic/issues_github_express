const IssueModel = require('../db/model');
const testUploads = './uploads';
const fs = require('fs');
const path = require('path');


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