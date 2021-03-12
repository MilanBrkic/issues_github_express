const express = require('express');
var router = express.Router();
const controllerGet = require('../controller/get');
const controllerPost = require('../controller/post');
const controllerDelete = require('../controller/delete');
const upload = require('../multer/multer');
const multer = require('multer');


router.get('/', controllerGet.getAllIssues)

function uploadFile(req,res,next){
    const u = upload.array('file',10);
    
    u(req,res,(err)=>{
        if(err instanceof multer.MulterError){
            res.status(400).send(err);
        }
        else{
            next();
        }
    })
}

router.use('/add', uploadFile);

router.post('/add', controllerPost.addIssue);

router.delete('/delete', controllerDelete.deleteAll);

module.exports = router;