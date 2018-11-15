var liveJobs = require('../models/livejobs');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var async = require("async"); // To handle async requests and responses

// Posts API
module.exports = function(apiRouter){
    /*
     * Add to marketplace
     */
    apiRouter.post('/livejobs/add', function(req, res){
        var post = new liveJobs();
        post.posted_by=req.body.posted_by;
        post.vendortype_id=req.body.vendortype_id;
        post.service_id=req.body.service_id;
        post.event_id=req.body.event_id;
        post.project_id=req.body.project_id;
        post.title = req.body.title;
        post.event_name = req.body.event_name;
        post.duration = req.body.duration;
        post.description = req.body.description;
        post.budget = req.body.budget;
        post.addressDetails = req.body.addressDetails;
        post.jobDetails = req.body.jobDetails;
        post.milestones = req.body.milestones;
        post.save(function(err, post){
            if(err){
                res.json({status:false, message:'Error while saving data',error:err})
            }else{
                res.json({status:true, message:'Job posted successfully.',data:post})
            }
        })
    });
    /*
     * Fetch all jobs
     */
    apiRouter.get('/livejobs',function(req,res){
        liveJobs.aggregate([
            // Find Event detail based on event_id
//            {"$unwind":"$events"}, // now
            {"$unwind":{"path":"$projects.events", "preserveNullAndEmptyArrays":true }},
            {"$lookup":{
              "from": "projects.events", //name of the foreign collection not model or schema name
              "localField": "event_id",
              "foreignField": "_id",
              "as": "events"
            }},
            {"$unwind":{"path":"$events", "preserveNullAndEmptyArrays":true }}, // Keep non matching events
            {"$group":{
              "_id": "$_id",
              "events": { "$push": "$events" },
              "data": { "$first": "$$ROOT" } // $$ROOT to keep the entire data
            }},
            {"$addFields":{"data.events":"$events", "events":0}}, // Replace the events  with grouped events.
            {"$replaceRoot":{"newRoot":"$data"}}, 
           // {"$replaceRoot":{"newRoot":"$data"}},
            
        ],function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: data});
            }
        })
    })
    
    /*
     * Fetch all jobs
     */
    apiRouter.post('/livejobs/all',function(req,res){
        liveJobs.aggregate([
            {"$match":{"status":{$ne:true}}},
            {
          $lookup: {
             from: "favourites",
             let: {
                jobid: "$_id", //local table id and assign it to a variable
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
            // Find Event detail based on event_id
//            {"$unwind":"$events"}, // now
            {"$unwind":{"path":"$projects.events", "preserveNullAndEmptyArrays":true }},
            {"$lookup":{
              "from": "projects.events", //name of the foreign collection not model or schema name
              "localField": "event_id",
              "foreignField": "_id",
              "as": "events"
            }},
            {"$unwind":{"path":"$events", "preserveNullAndEmptyArrays":true }}, // Keep non matching events
            {"$group":{
              "_id": "$_id",
              "events": { "$push": "$events" },
              "data": { "$first": "$$ROOT" } // $$ROOT to keep the entire data
            }},
            {"$addFields":{"data.events":"$events", "events":0}}, // Replace the events  with grouped events.
            {"$replaceRoot":{"newRoot":"$data"}}, 
        ],function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: data});
            }
        })
    })
    /*
     * Fetch Job using its ID
     */
    // Find Project by id
    apiRouter.post('/livejobs/findById',function(req,res){
        liveJobs.aggregate([
            {"$match":{"_id":ObjectId(req.body.id)}}
        ],function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                if(data[0]){
                    liveJobs.find({'vendortype_id':data[0].vendortype_id,'_id':{$ne:data[0]._id}}, function(errsimilarjobs, posts){
			if (errsimilarjobs){
                            res.json({status: true, message: 'Fetched successfully!', data: data[0],msg2:'Unable to fetch similar jobs'});
                        }else{
                           data[0].similar_jobs =posts; 
                           res.json({status: true, message: 'Fetched successfully!', data: data[0]});
                        }
                    });
                }else{
                    res.json({status: true, message: 'Fetched successfully!', data: data[0]});
                }
            }
        })
    })
    /*
     * My Jobs
     */
    apiRouter.post('/livejobs/myjobs',function(req,res){
        liveJobs.aggregate([
            {"$match":{'posted_by':ObjectId(req.body.user_id),"project_id":ObjectId(req.body.project_id)}},
            {"$lookup":{
              "from": "projects", //name of the foreign collection not model or schema name
              "localField": "project_id",
              "foreignField": "_id",
              "as": "project_detail"
            }},
            {$unwind:'$project_detail'},
            {"$lookup":{
              "from": "services", //name of the foreign collection not model or schema name
              "localField": "service_id",
              "foreignField": "_id",
              "as": "service_detail"
            }},
            {"$lookup":{
              "from": "vendortypes", //name of the foreign collection not model or schema name
              "localField": "vendortype_id",
              "foreignField": "_id",
              "as": "vendortype_detail"
            }},
            {$project:
                {
                    "project_detail.events":1,
                    "project_detail.name":1,
                    "vendortype_detail":1,
                    "service_detail":1,
                    "_id":1,
                    "event_id":1,
                    "vendortype_id":1,
                    "service_id":1,
                    "project_id":1,
                    "title":1,
                    "description":1,
                    "budget":1,
                    'created_at':1
                }
            },
            {$unwind:'$project_detail.events'},
           {
                $redact: {
                    $cond: [{
                            $ne: ["$project_detail.events._id", "$event_id"]
                        },
                        "$$PRUNE",
                        "$$KEEP"
                    ]
                }
            },
            {"$lookup":{
              "from": "proposals", //name of the foreign collection not model or schema name
              "localField": "_id",
              "foreignField": "job_id",
              "as": "myproposals"
            }},
            {$unwind:{path:'$myproposals',preserveNullAndEmptyArrays:true}},
        {"$lookup":{
              "from": "users", //name of the foreign collection not model or schema name
              "localField": "myproposals.bid_by",
              "foreignField": "_id",
              "as": "myproposals.user"
            }},
             {
                "$group": {
                    "_id": "$_id",
                    "event_id":{ "$first": "$event_id" },
                    "vendortype_id":{ "$first": "$vendortype_id" },
                    "service_id":{ "$first": "$vendortype_id" },
                    "project_id":{ "$first": "$project_id" },
                    "title":{ "$first": "$title" },
                    "description":{ "$first": "$description" },
                    "budget":{ "$first": "$budget" },
                    'created_at':{ "$first": "$created_at" },
                    "project_detail":{ "$first": "$project_detail" },
                    "vendortype_detail":{ "$first": "$vendortype_detail" },
                    "service_detail":{ "$first": "$service_detail" },
                    "myproposals": { "$push": "$myproposals" }
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
     * My Job Detail
     */
    apiRouter.post('/livejobs/myjobsdetail',function(req,res){
        liveJobs.aggregate([
            {"$match":{'_id':ObjectId(req.body.id)}},
            {"$lookup":{
              "from": "projects", //name of the foreign collection not model or schema name
              "localField": "project_id",
              "foreignField": "_id",
              "as": "project_detail"
            }},
            {$unwind:'$project_detail'},
            {"$lookup":{
              "from": "services", //name of the foreign collection not model or schema name
              "localField": "service_id",
              "foreignField": "_id",
              "as": "service_detail"
            }},
            {"$lookup":{
              "from": "vendortypes", //name of the foreign collection not model or schema name
              "localField": "vendortype_id",
              "foreignField": "_id",
              "as": "vendortype_detail"
            }},
            {$project:
                {
                    "project_detail.events":1,
                    "project_detail.name":1,
                    "project_detail._id":1,
                    "vendortype_detail":1,
                    "service_detail":1,
                    "vendortype_id":1,
                    "service_id":1,
                    "_id":1,
                    "event_id":1,
                    "project_id":1,
                    "title":1,
                    "description":1,
                    "budget":1,
                    'created_at':1
                }
            },
            {$unwind:'$project_detail.events'},
           {
                $redact: {
                    $cond: [{
                            $ne: ["$project_detail.events._id", "$event_id"]
                        },
                        "$$PRUNE",
                        "$$KEEP"
                    ]
                }
            },
            {"$lookup":{
              "from": "proposals", //name of the foreign collection not model or schema name
              "localField": "_id",
              "foreignField": "job_id",
              "as": "myproposals"
            }},
        {$unwind: '$myproposals'},
        {"$lookup":{
              "from": "users", //name of the foreign collection not model or schema name
              "localField": "myproposals.bid_by",
              "foreignField": "_id",
              "as": "myproposals.bid_details"
            }},
        {$group:
                  {
                    _id: { _id: "$_id", title: "$title",description:"$description" ,project_detail:"$project_detail",budget:"$budget",created_at:"$created_at"},
                    proposals: {
                        $push:  {
                            myproposals: "$myproposals"
                        }
                    }
                }
        }   
        ],function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: data[0]});
            }
        })
    })
    /*
     * seach live job using @params
     */
    apiRouter.post('/livejobs/findByParams',function(req,res){
        liveJobs.find({
            project_id:ObjectId(req.body.project_id),
            event_id:ObjectId(req.body.event_id),
            service_id:ObjectId(req.body.service_id),
            vendortype_id:ObjectId(req.body.vendortype_id),
            posted_by:ObjectId(req.body.posted_by)
        },function(err,posts){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: posts});
            }
        })
    })
    /*
     * My Job Detail
     */
    apiRouter.post('/livejobs/job_proposaldetail',function(req,res){
        liveJobs.aggregate([
            {"$match":{'_id':ObjectId(req.body.id)}},
            {"$lookup":{
              "from": "projects", //name of the foreign collection not model or schema name
              "localField": "project_id",
              "foreignField": "_id",
              "as": "project_detail"
            }},
            {$unwind:'$project_detail'},
            {"$lookup":{
              "from": "services", //name of the foreign collection not model or schema name
              "localField": "service_id",
              "foreignField": "_id",
              "as": "service_detail"
            }},
            {"$lookup":{
              "from": "vendortypes", //name of the foreign collection not model or schema name
              "localField": "vendortype_id",
              "foreignField": "_id",
              "as": "vendortype_detail"
            }},
            {"$lookup":{
              "from": "users", //name of the foreign collection not model or schema name
              "localField": "posted_by",
              "foreignField": "_id",
              "as": "postedBy_User"
            }},
            {$project:
                {
                    "project_detail.events":1,
                    "project_detail.name":1,
                    "project_detail._id":1,
                    "vendortype_detail":1,
                    "service_detail":1,
                    "vendortype_id":1,
                    "service_id":1,
                    "_id":1,
                    "event_id":1,
                    "project_id":1,
                    "title":1,
                    "description":1,
                    "budget":1,
                    'created_at':1,
                    "posted_by":1,
                    "postedBy_User":1
                }
            },
            {$unwind:'$project_detail.events'},
           {
                $redact: {
                    $cond: [{
                            $ne: ["$project_detail.events._id", "$event_id"]
                        },
                        "$$PRUNE",
                        "$$KEEP"
                    ]
                }
            },
            {"$lookup":{
              "from": "proposals", //name of the foreign collection not model or schema name
              "localField": "_id",
              "foreignField": "job_id",
              "as": "myproposals"
            }},
        {$unwind: '$myproposals'},
        {
            $redact: {
                $cond: [{
                        $eq: ["$myproposals.bid_by", req.body.user_id]
                    },
                    "$$PRUNE",
                    "$$KEEP"
                ]
            }
        },
        {"$lookup":{
              "from": "users", //name of the foreign collection not model or schema name
              "localField": "myproposals.bid_by",
              "foreignField": "_id",
              "as": "myproposals.bid_details"
            }},
        
        /*{$group:
                  {
                    _id: { _id: "$_id", title: "$title",description:"$description" ,project_detail:"$project_detail",budget:"$budget",created_at:"$created_at"},
                    proposals: {
                        $push:  {
                            myproposals: "$myproposals"
                        }
                    }
                }
        }  */
        ],function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: data[0]});
            }
        })
    })
    /*
     * Job with finalized vendors group by events
     */
    apiRouter.post('/livejobs/myfinalizedjobs',function(req,res){
        liveJobs.aggregate([
            {"$match":{'posted_by':ObjectId(req.body.user_id),"project_id":ObjectId(req.body.project_id)}},
            
            {"$lookup":{
              "from": "projects", //name of the foreign collection not model or schema name
              "localField": "project_id",
              "foreignField": "_id",
              "as": "project_detail"
            }},
            {$unwind:'$project_detail'},
            {"$lookup":{
              "from": "services", //name of the foreign collection not model or schema name
              "localField": "service_id",
              "foreignField": "_id",
              "as": "service_detail"
            }},
            {"$lookup":{
              "from": "vendortypes", //name of the foreign collection not model or schema name
              "localField": "vendortype_id",
              "foreignField": "_id",
              "as": "vendortype_detail"
            }},
            {$project:
                {
                    "project_detail.events":1,
                    "project_detail.name":1,
                    "vendortype_detail":1,
                    "service_detail":1,
                    "_id":1,
                    "event_id":1,
                    "vendortype_id":1,
                    "service_id":1,
                    "project_id":1,
                    "title":1,
                    "description":1,
                    "budget":1,
                    'created_at':1
                }
            },
           {$unwind:'$project_detail.events'},
           {
                $redact: {
                    $cond: [{
                            $ne: ["$project_detail.events._id", "$event_id"]
                        },
                        "$$PRUNE",
                        "$$KEEP"
                    ]
                }
            },
{
          $lookup: {
             from: "proposals",
             let: {
                jobid: "$_id", //local table id and assign it to a variable
//                userid: "$user_id" // In case, need more variables
             },
             pipeline: [
                {
                   $match: {
                      $expr: {
                         $and: [
                            {
                               $eq: [
                                  "$job_id", // proposals table field
                                  "$$jobid" // variable defined above
                               ]
                            },
                            {$or: [
                                    {
                                        $eq: [
                                            "$status",
                                           2,
                                        ]
                                     },
                                    {
                               $eq: [
                                   "$status",
                                  5,
                               ]
                            }
                                ]
                            },
//                            {
//                               $eq: [
//                                   "$status",
//                                  2,
//                               ]
//                            }
                         ]
                      }
                   }
                }
             ],
             as: "myproposals"
          }
       },
       {"$unwind":"$myproposals"},
        {"$lookup":{
              "from": "users", //name of the foreign collection not model or schema name
              "localField": "myproposals.bid_by",
              "foreignField": "_id",
              "as": "myproposals.user"
            }},
             {
                "$group":{
                    "_id":"$event_id", // group by event_id
//                    "event_id":{ "$first": "$event_id" },
                    "project_id":{ "$first": "$project_id" },
                    "project_detail":{ "$first": "$project_detail" },
                    "data_detail":{
                        $push:{
                        "livejob_id": "$_id",
                        "title": "$title" ,
                        "description": "$description" ,
                        "budget": "$budget" ,
                        "vendortype_id": "$vendortype_id" ,
                        "service_id": "$vendortype_id" ,
                        'created_at': "$created_at" ,
                        "vendortype_detail":"$vendortype_detail" ,
                        "service_detail":"$service_detail",
                        "myproposals": "$myproposals"   
                    }}
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
     * Get service by event id
     */
    apiRouter.post('/livejobs/getServiceByEventId', function (req, res) {
        // 5b2781d56ec3192fe72c8bef 
        var query = [{
            "$match": {
                "event_id": ObjectId(req.body.event_id)
            }
        },
        {
            "$lookup": {
                "from": "services", // name of the foreign collection 
                "localField": "service_id",
                "foreignField": "_id",
                "as": "service_details"
            }
        },
        { $unwind: { path: '$service_details', preserveNullAndEmptyArrays: true } },
        {
            "$lookup": {
                "from": "vendortypes", // name of the foreign collection 
                "localField": "vendortype_id",
                "foreignField": "_id",
                "as": "vendortype_details"
            }
        },
        { $unwind: { path: '$vendortype_details', preserveNullAndEmptyArrays: true } }
        ];
        console.log(query)
        liveJobs.aggregate(query, function (err, data) {
            if (err) {
                res.json({ status: false, message: 'Unable to fetch data!', error: err });
            } else {
                res.json({ status: true, message: 'Fetched successfully!', data: data });
            }
        })
    })
}