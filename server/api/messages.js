var Message = require('../models/message');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// Posts API
module.exports = function(apiRouter){
    /*
     * Add to marketplace
     */
    apiRouter.post('/messages/add', function(req, res){
        var post = new Message();
        post.bid_by=req.body.bid_by;
        post.job_id=req.body.job_id;
        post.job_by=req.body.job_by;
        post.msg_by=req.body.msg_by;
        post.content=req.body.content;
        post.save(function(err, post){
            if(err){
                res.json({status:false, message:'Error while saving data',error:err})
            }else{
                res.json({status:true, message:'Message sent successfully.',data:post})
            }
        })
    });
    /*
     * List messages based on job_by, bid_by and job_id
     */
    apiRouter.post('/messages/messageThread',function(req,res){
        Message.aggregate([
            {"$match":{
                    'job_by':ObjectId(req.body.job_by),
                    'bid_by':ObjectId(req.body.bid_by),
                    'job_id':ObjectId(req.body.job_id)
                }
            },
            {"$lookup":{
              "from": "users", //name of the foreign collection not model or schema name
              "localField": "job_by",
              "foreignField": "_id",
              "as": "job_by_detail"
            }},
            {"$lookup":{
              "from": "users", //name of the foreign collection not model or schema name
              "localField": "bid_by",
              "foreignField": "_id",
              "as": "bid_by_detail"
            }},
            {$project:
                {
                    "job_by_detail.firstname":1,
                    "job_by_detail.lastname":1,
                    "bid_by_detail.firstname":1,
                    "bid_by_detail.lastname":1,
                    "bid_by_detail._id":1,
                    "job_by_detail._id":1,
                    "_id":1,
                    "job_by":1,
                    "bid_by":1,
                    "msg_by":1,
                    "content":1,
                    'created_at':1
                }
            }
        ],function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: data});
            }
        })
    })
    /*
     * Update status of a Proposal
     * 1=shortlisted, 2= finalized, 3= completed, 4 = declined
     */
    apiRouter.post('/proposals/updateStatus',function(req,res){
        Message.findById(req.body._id,function(err,data){
            if(err){
                res.json({status: false, message: err});
            }else{
                Message.update({_id:req.body._id},{$set:{"status":req.body.status,"read":true}},function(err1,data1){
                    if(err1){
                        res.json({status: false, message: 'Unable to update data!', error: err1});
                    }else{
                        res.json({status: true, message: 'Data updated successfully!'});
                    }
                })
            }
        })
    })
}