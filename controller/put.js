const IssueModel = require('../db/model');


function basicPutValidation(req){
    var attr = ['title', 'text', 'user'];
    var badAttr = ['file', 'comment', 'closed']
    var err = new Array();
    for(var key in req.body){
        if(badAttr.includes(key)) {
            if(key =='closed') key = 'close';
            err.push({attribute:key, msg:'Use PUT /api/issues/:id/'+key+' instead'})
        }
        else if(!attr.includes(key)) err.push({attribute:key,msg:'Attribute does not exist'});
    }
    if(err.length!=0) throw {error: err};
}

exports.updateIssue = async(req,res) =>{
    try {
        var iss = await IssueModel.findById(req.params.id);
        if(iss.closed==true) throw {err:'Issue is closed. Can not be modified'};
        
        
        basicPutValidation(req);

        IssueModel.findByIdAndUpdate(req.params.id,req.body, {new:true, useFindAndModify:false})
                  .then((issue)=>{
                        res.send(issue);
                  })
                  .catch((err)=>{throw err})
    } catch (error) {
        res.status(400).send(error);
    }
        
}

