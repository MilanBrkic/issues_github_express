const express = require('express');
var router = express.Router();
const controllerGet = require('../controller/get');
const controllerPost = require('../controller/post');
const controllerDelete = require('../controller/delete');
const upload = require('../multer/multer');
const multer = require('multer');

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

router.get('/', controllerGet.getAllIssues);

router.get('/:id', controllerGet.getOneIssue);

router.get('/uploads/download/:link', controllerGet.downloadFile);

router.get('/uploads/:link', controllerGet.viewFile);




router.post('/add', controllerPost.addIssue);

router.delete('/delete', controllerDelete.deleteAll);

module.exports = router;