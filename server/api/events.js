var Event = require('../models/event');

module.exports = function(apiRouter,eventupload) {
    // upload event image to bucket
    apiRouter.post('/events/upload',eventupload.array('file',3), function(req, res, next) {
         res.send(req.files[0]);
     });
     // add an event
    apiRouter.post('/events/add', function(req, res){
        var post = new Event();
        post.name = req.body.name;
        post.description = req.body.description;
        post.image = req.body.image;
        post.status = req.body.status;
        
        Event.find({'name':post.name},function(error,post_value){
            if(error){
                return res.send(error)
            }else{
                if(post_value.length >0){
                    res.json({status:false,message:'Event with this title already exists! Please try another one!'});
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
    // get all events
    apiRouter.get('/events', function(req, res){
        Event.find({}, function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
                
        });
    });
    /*
     * Remove event based on id
     */
    apiRouter.delete('/events/removebyId/:id', function(req, res) {
        Event.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing event.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
    // Find event by id
    apiRouter.post('/events/findById',function(req,res){
         Event.findById(req.body.id,function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Removed successfully!', data: data});
            }
        })
    })
    // edit an event
    apiRouter.post('/events/updateById', function(req, res){
        Event.findById(req.body._id,function(err,servicedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Event.findOne({_id:{$ne:req.body._id},name: req.body.name},function(err2,data){
                    if(err2){
                        res.json({'status':false,'message':err2});
                    }else{
                        if(data){
                            res.json({'status':false,'message':'Event with this name already exists!'});
                        }else{
                            servicedata.name = req.body.name;
                            servicedata.description = req.body.description;
                            servicedata.image = req.body.image;
                            servicedata.status = req.body.status;
                            servicedata.save(function(err1) {
                                if (err1){
                                    res.json({'status':false,'message':'Unable to save data. Please try again later',error:err1});
                                }else{
                                    res.json({'status':true,'message':'Event updated!'});
                                }
                            })
                        }
                    }
                })
            }
        })
    });
    // update status Verified -> Unverified / Unverfified -> Verified
    apiRouter.post('/events/updateStatus', function(req, res){
        Event.findById(req.body._id,function(err,businessdata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Event.update({_id:req.body.id},{$set:{"status":req.body.status}},function(err1,data1){
                    if(err1){
                        res.json({status: false, message: 'Unable to update data!', error: err1});
                    }else{
                        res.json({status: true, message: 'Data updated successfully!'});
                    }
                })
            }
        })
    })
    // Find Business by status i.e. status ==true/false
    apiRouter.post('/events/findByStatus',function(req,res){
         Event.find({status:req.body.status},function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: data});
            }
        })
    })
}