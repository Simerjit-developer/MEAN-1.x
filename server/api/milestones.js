var Milestone = require('../models/milestone');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(apiRouter) {
    
     // add a vendortype
    apiRouter.post('/milestones/add', function(req, res){
        var post = new Milestone();
        post.title = req.body.title;
        post.sort_order = req.body.sort_order;
        post.status = req.body.status;
        post.date = req.body.date;
        post.posted_by=req.body.posted_by;
        post.project_id=req.body.project_id;
        post.event_id=req.body.event_id;
        post.type=req.body.type;
        post.status=req.body.status;
        post.type=req.body.type;
        Milestone.find({'title':post.title},function(error,post_value){
            if(error){
                return res.send(error)
            }else{
                if(post_value.length >0){
                    res.json({status:false,message:'Milestone already exist! Please try another one!'});
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
    /*
     * Add a Vendor in Draft Mode
     */
    apiRouter.post('/milestones/saveToDraft', function(req, res){
        var post = new Milestone();
        post.draft = req.body.draft;
        post.save(function(err, post){
            if(err){
                res.json({status:false, message:'Error while saving data',error:err})
            }else{
                res.json({status:true, message:'Milestones successfully saved to Draft mode.',data:post})
            }
        })
    });
    // get all vendortypes
    apiRouter.get('/milestones', function(req, res){
        Milestone.find({}, function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
                
        });
    });
    // get all vendortypes
    apiRouter.get('/milestones/defaultmilestones', function(req, res){
        Milestone.find({'type':'default'}, function(err, posts){
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
    apiRouter.delete('/milestones/removebyId/:id', function(req, res) {
        Milestone.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing Milestone.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
    // Find VendorType by id
    apiRouter.post('/milestones/findById',function(req,res){
         Milestone.findById(req.body.id,function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: data});
            }
        })
    })
    // edit a vendortype
    apiRouter.post('/milestones/updateById', function(req, res){
        Milestone.findById(req.body._id,function(err,vendortypedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Milestone.findOne({_id:{$ne:req.body._id},title: req.body.title},function(err2,data){
                    if(err2){
                        res.json({'status':false,'message':err2});
                    }else{
                        if(data){
                            res.json({'status':false,'message':'Milestone with this name already exists!'});
                        }else{
                            vendortypedata.title = req.body.title;
                            vendortypedata.sort_order = req.body.sort_order;
                            vendortypedata.status = req.body.status;
                            vendortypedata.assigned_to = req.body.assigned_to;
                            vendortypedata.save(function(err1) {
                                if (err1){
                                    res.json({'status':false,'message':'Unable to save data. Please try again later',error:err1});
                                }else{
                                    res.json({'status':true,'message':'Milestone updated!'});
                                }
                            })
                        }
                    }
                })
            }
        })
    });
    /*
     * Fetch Milestones by event_id
     */
    apiRouter.post('/milestones/miletsonesByEvent',function(req,res){
        Milestone.aggregate([
            {"$match":{
                    $and: [
                        {"draft.event_id":ObjectId(req.body.event_id)},
                        {"draft.project_id":ObjectId(req.body.project_id)},
                    ]
                }
            }
        ],function(err,data){
            if(err){
                res.json({status:false,message:'Error while fetching data',err:err});
            }else{
                res.json({status:true,data:data});
            }
            
        })
    })
    /*
     * Save Dafault Milestones as My project milestones
     * 
     */
    apiRouter.post('/milestones/addDefaultAsMy',function(req,res){
        Milestone.find({'type':'default'}, function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                var dataToPush = []
                for (var i = 0, len = posts.length; i < len; i++) {
                    var myData ={
                        event_id:req.body.req,
                        project_id:req.body.project_id,
                        posted_by:req.body.posted_by,
                        title:posts[i].title,
                        date:new Date(),
                        status:true,
                        sort_order:posts[i].sort_order
                    }
                    dataToPush.push(myData)
                }
                
                Milestone.insertMany(dataToPush,function(err2,data2){
                    if (err2) {
                        res.json({status:false, message:'Unable to get data err2!', err: err2})
                    }else{
                        res.json({status:true, message: 'Saved Successfully',data:data2});
                    }
                })
            }  
        });
    })
    /*
     * Fetch Milestones by event_id, service_id, vendor_id, project_id
     */
    apiRouter.post('/milestones/miletsonesByService',function(req,res){
        if(req.body.service_id){
            var conditions =[
                        {"event_id":ObjectId(req.body.event_id)},
                        {"project_id":ObjectId(req.body.project_id)},
                        {"service_id":ObjectId(req.body.service_id)},
                    ] 
        }else if(req.body.vendortype_id){
             var conditions =[
                        {"event_id":ObjectId(req.body.event_id)},
                        {"project_id":ObjectId(req.body.project_id)},
                        {"vendortype_id":ObjectId(req.body.vendortype_id)},
                    ] 
        }else{
             var conditions =[
                        {"event_id":ObjectId(req.body.event_id)},
                        {"project_id":ObjectId(req.body.project_id)}
                    ] 
        }
        
        Milestone.aggregate([
            {"$match":{
                    $and: conditions
                }
            }
        ],function(err,data){
            if(err){
                res.json({status:false,message:'Error while fetching data',err:err});
            }else{
                res.json({status:true,data:data});
            }
            
        })
    })
    /*
     * Find by project Id and push them to live mode
     */
    apiRouter.post('/milestones/pushLiveMiletsonesByProject',function(req,res){
        Milestone.aggregate([
            {"$match":{
                    $and: [
                        {"draft.project_id":ObjectId(req.body._id)},
                    ]
                }
            }
        ],function(err,data){
            if(err){
                res.json({status:false,message:'Error while fetching data',err:err});
            }else{
                for(var i=0; i< data.length; i++){
                    var conditions={
                        _id:data[i]._id
                    }
                    var updateData = {
                        posted_by:data[i].draft[0].posted_by,
                        event_id:data[i].draft[0].event_id,
                        project_id:data[i].draft[0].project_id,
                        title:data[i].draft[0].title,
                        date:data[i].draft[0].date,
                        status:data[i].draft[0].status,
                        draft:[]
                    }
                    if(i==(data.length-1)){
                        Milestone.update(conditions,updateData,{multi:true},callback);
                    }else{
                        Milestone.update(conditions,updateData,{multi:true});
                    }
                }
                function callback(err, numAffected){
                    if(err){ 
                        res.json({status:false, message:'Error while saving data',error:err})
                    }else{
                        res.json({status:true,message:'Data has been pushed successfully on Live mode!',numAffected:numAffected});
                    }
                }
            }
            
        })
    })
    /*
     * Fetch Milestones by Project
     */
    apiRouter.post('/milestones/MiletsonesByProject',function(req,res){
        Milestone.find({project_id:req.body.project_id}, function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
                
        });
    })
    
}