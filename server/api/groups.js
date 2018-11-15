var Group = require('../models/group');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(apiRouter) {
    
     // add a vendortype
    apiRouter.post('/groups/add', function(req, res){
        var post = new Group();
        post.title = req.body.title;
        post.status = req.body.status;
        Group.find({'title':post.title},function(error,post_value){
            if(error){
                return res.send(error)
            }else{
                if(post_value.length >0){
                    res.json({status:false,message:'Group already exist! Please try another one!'});
                }else{
                    post.save(function(err, post){
                        if(err){ res.send(err);}else{
                            res.json({status:true,message:'Saved successfully!'});
                        }
                    })
                }

            }
        })
    });
    // get all vendortypes
    apiRouter.get('/groups', function(req, res){
        Group.find({}, function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
                
        });
    });
    /*
     * Remove VendorType based on id
     */
    apiRouter.delete('/groups/removebyId/:id', function(req, res) {
        Group.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing Group.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
    // Find VendorType by id
    apiRouter.post('/groups/findById',function(req,res){
         Group.findById(req.body.id,function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Removed successfully!', data: data});
            }
        })
    })
    // edit a vendortype
    apiRouter.post('/groups/updateById', function(req, res){
        Group.findById(req.body._id,function(err,vendortypedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Group.findOne({_id:{$ne:req.body._id},title: req.body.title},function(err2,data){
                    if(err2){
                        res.json({'status':false,'message':err2});
                    }else{
                        if(data){
                            res.json({'status':false,'message':'Group with this name already exists!'});
                        }else{
                            vendortypedata.title = req.body.title;
                            vendortypedata.save(function(err1) {
                                if (err1){
                                    res.json({'status':false,'message':'Unable to save data. Please try again later',error:err1});
                                }else{
                                    res.json({'status':true,'message':'Group updated!'});
                                }
                            })
                        }
                    }
                })
            }
        })
    });
    /*
     * Add New Group for particular project
     */
    apiRouter.post('/groups/addNew', function(req, res){
        var post = new Group();
        post.title = req.body.title;
        post.status = req.body.status;
        post.project_id=req.body.project_id;
        post.added_by=req.body.added_by;
        post.side= req.body.side;
        Group.find({'title':post.title,'project_id':post.project_id},function(error,post_value){
            if(error){
                return res.send(error)
            }else{
                if(post_value.length >0){
                    res.json({status:false,message:'Group already exist! Please try another one!'});
                }else{
                    post.save(function(err, post){
                        if(err){ res.send(err);}else{
                            res.json({status:true,message:'Saved successfully!'});
                        }
                    })
                }
            }
        })
    });
    // Fetch my groups
    apiRouter.post('/groups/my', function(req, res){
        Group.find({added_by:req.body.added_by}, function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
                
        });
    });
    
}