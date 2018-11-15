var Payment = require('../models/payments');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(apiRouter,transporter) {
    
     // add a vendortype
    apiRouter.post('/payments/add', function(req, res){
        
        var post = new Payment();
        post.job_id = req.body.job_id;
        post.posted_by = req.body.posted_by;
        post.milestone_id= req.body.milestone_id;
        post.amount = req.body.amount;
        post.due_date=req.body.due_date;
        post.status=req.body.status;
        
        Payment.find({'posted_by':ObjectId(post.posted_by),'job_id':ObjectId(post.job_id),'milestone_id':ObjectId(post.milestone_id)},function(error,post_value){
            if(error){
                res.json({status:false,message:'Error while saving data! Please try again!',err:error});
            }else{
                if(post_value.length >0){
                    res.json({status:false,message:'Payment already created for this milestone! Please try another one!'});
                }else{
                    post.save(function(err, postdata){
                        if(err){ 
                            res.json({status:false,message:'Error while saving data! Please try another one!',err:err});
                        }else{
                            res.json({status:true,message:'Saved successfully!'});
                        }
                    })
                }

            }
        })
    });
    // get all payments by job id
    apiRouter.post('/payments/all', function(req, res){
        Payment.aggregate([
            {"$match":{
                    'job_id':ObjectId(req.body.job_id)
                }
            },
            {"$lookup":{
              "from": "jobmilestones", //name of the foreign collection not model or schema name
              "localField": "milestone_id",
              "foreignField": "_id",
              "as": "milestone_detail"
            }}
        ], function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
                
        });
    });
    /*
     * Remove Project based on id
     */
    apiRouter.delete('/payments/removebyId/:id', function(req, res) {
        Payment.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing Project.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
    /*
     * Find By Id
     */
    apiRouter.post('/payments/findById',function(req,res){
        Payment.findById(req.body._id,function(err,servicedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status:true,message:'fetched successfully!',data:servicedata});
            }
        })
    })
    /*
     * Update a Project
     */
    apiRouter.post('/payments/updateById', function(req, res){
        Payment.findById(req.body._id,function(err,servicedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Payment.findOne({_id:{$ne:req.body._id},job_id: req.body.job_id,milestone_id:req.body.milestone_id},function(err2,data){
                    if(err2){
                        res.json({'status':false,'message':err2});
                    }else{
                        if(data){
                            res.json({'status':false,'message':'Milestone for this job already exists!'});
                        }else{
                            var conditions={
                                _id:req.body._id
                            }
                            var updateData = {
                                job_id : req.body.job_id,
                                posted_by : req.body.posted_by,
                                milestone_id: req.body.milestone_id,
                                amount : req.body.amount,
                                due_date:req.body.due_date,
                                status:req.body.status
                            }
                            Payment.update(conditions,updateData,{multi:true},callback);
                            
                            function callback(err, numAffected){
                                if(err){ 
                                    res.json({status:false, message:'Error while saving data',error:err})
                                }else{
                                    res.json({status:true,message:'Saved successfully!',numAffected:numAffected});
                                }
                            }
                        }
                    }
                })
            }
        })
    });
    apiRouter.post('/payments/updateStatus',function(req,res){
        var conditions={
            _id:req.body._id
        }
        var updateData = {
            status:req.body.status,
        }
        Payment.update(conditions, { "$set": updateData },{multi:true},callback);
        function callback(err, numAffected){
            if(err){ 
                res.json({status:false, message:'Error while saving data',error:err})
            }else{
                res.json({status:true,message:'Response has been sent!',numAffected:numAffected});
            }
        }
                    
    })
}