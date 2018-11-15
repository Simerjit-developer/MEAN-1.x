var Proposal = require('../models/proposal');
var JobMilestone = require('../models/jobMilestones');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// Posts API
module.exports = function(apiRouter){
    /*
     * Add to marketplace
     */
    apiRouter.post('/proposals/add', function(req, res){
        var post = new Proposal();
        post.bid_by=req.body.bid_by;
        post.job_id=req.body.job_id;
        post.description=req.body.description;
        post.budget=req.body.budget;
        if(typeof req.body.milestones!='undefined'){
            Object.keys(req.body.milestones).map(function(objectKey, index) {
                var value = req.body.milestones[objectKey];
                post.milestones.push(value)
            });
        }

        post.save(function(err, post){
            if(err){
                res.json({status:false, message:'Error while saving data',error:err})
            }else{
                res.json({status:true, message:'Bid posted successfully.',data:post})
            }
        })
    });
    /*
     * Update status of a Proposal
     * 1=shortlisted, 2= finalized, 3= completed, 4 = declined
     */
    apiRouter.post('/proposals/updateStatus',function(req,res){
        Proposal.findById(req.body._id,function(err,data){
            if(err){
                res.json({status: false, message: err});
            }else{
                Proposal.update({_id:req.body._id},{$set:{"status":req.body.status,"read":true}},function(err1,data1){
                    if(err1){
                        res.json({status: false, message: 'Unable to update data!', error: err1});
                    }else{
                        if(req.body.status==5){
                            //Set status bit of the Job
                            JobMilestone.update({_id:data.job_id},{$set:{"status":true}},function(job_err,job_data){
                                if(job_err){
                                    console.log(job_err)
                                }else{
                                    console.log(job_data)
                                }
                            })
                            //decline all other proposals for the same job
                            Proposal.update({job_id:data.job_id,_id:{$ne:data._id}},{$set:{"status":4}},function(err2,numeffected){
                                if(err2){
                                    res.json({status: true, message: 'Data updated successfully!',error:err2});
                                }else{
                                    
                                    res.json({status: true, message: 'Data updated successfully!'});
                                }
                            })
                        }else{
                            res.json({status: true, message: 'Data updated successfully!'});
                        }
                        
                    }
                })
            }
        })
    })
    /*
     * Find jobs that are assigned to me
     */
    apiRouter.post('/proposals/myfinalizedjobs',function(req,res){
        Proposal.aggregate([
            {
                $match:{
                    bid_by:ObjectId(req.body.user_id),
                    status:2
                }
            },
            {"$lookup":{
              "from": "livejobs", //name of the foreign collection not model or schema name
              "localField": "job_id",
              "foreignField": "_id",
              "as": "livejob"
            }},
            {"$unwind":{"path":"$livejob", "preserveNullAndEmptyArrays":true }},
            {"$lookup":{
              "from": "users", //name of the foreign collection not model or schema name
              "localField": "livejob.posted_by",
              "foreignField": "_id",
              "as": "user_detail"
            }},
        {
          $lookup: {
             from: "favourites",
             let: {
                jobid: "$job_id", //local table id and assign it to a variable
//                userid: "$user_id" // In case, need more variables
             },
             pipeline: [
                {
                   $match: {
                      $expr: {
                         $and: [
                            {
                               $eq: [
                                  "$job_id", // favourites table field
                                  "$$jobid" // variable defined above
                               ]
                            },
                            {
                               $eq: [
                                   "$user_id",
                                  ObjectId(req.body.user_id),
//                                  "$$userid"
                               ]
                            }
                         ]
                      }
                   }
                }
             ],
             as: "favourites"
          }
       },
       {
           $project:{
               "_id":1,
               "job_id":1,
               "budget":1,
               "livejob":1,
               "user_detail.firstname":1,
               "user_detail.lastname":1,
               "favourites":1,
            }
        }
            
        ],function(err,data){
                if(err){
                    res.json({status: false, message: 'Unable to update data!', error: err});
                }else{
                    res.json({status: true, message: 'fetched successfully!',data:data});
                }
            })
    })
    /*
     * My Bids
     */
    apiRouter.post('/proposals/mybids',function(req,res){
        Proposal.aggregate([
            {
                $match:{
                    bid_by:ObjectId(req.body.user_id),
                    display_status:{$ne:true}
                }
            },
            {"$lookup":{
              "from": "livejobs", //name of the foreign collection not model or schema name
              "localField": "job_id",
              "foreignField": "_id",
              "as": "livejob"
            }},
            {"$unwind":{"path":"$livejob", "preserveNullAndEmptyArrays":true }},
            {"$lookup":{
              "from": "users", //name of the foreign collection not model or schema name
              "localField": "livejob.posted_by",
              "foreignField": "_id",
              "as": "user_detail"
            }},
       {
           $project:{
               "_id":1,
                "status":1,
               "created_at":1,
               "job_id":1,
               "budget":1,
               "livejob":1,
               "user_detail.firstname":1,
               "user_detail.lastname":1,
            }
        }
            
        ],function(err,data){
                if(err){
                    res.json({status: false, message: 'Unable to update data!', error: err});
                }else{
                    res.json({status: true, message: 'fetched successfully!',data:data});
                }
            })
    })
    /*
     * Mark proposal as deleted so that it should not display on vendor end
     */
    apiRouter.post('/proposals/markAsDelete',function(req,res){
        Proposal.findById(req.body._id,function(err,data){
            if(err){
                res.json({status: false, message: err});
            }else{
                Proposal.update({_id:req.body._id},{$set:{"display_status":1}},function(err1,data1){
                    if(err1){
                        res.json({status: false, message: 'Unable to update data!', error: err1});
                    }else{
                        res.json({status: true, message: 'Removed successfully!'});
                    }
                })
            }
        })
    })
    
}