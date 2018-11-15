var Task = require('../models/task');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(apiRouter) {
    
     // add a vendortype
    apiRouter.post('/tasks/add', function(req, res){
        var post = new Task();
        post.content = req.body.content;
        post.user_id = req.body.user_id;
        post.project_id = req.body.project_id;
        post.team_member_id = req.body.team_member_id;
        post.date = req.body.date;
        post.status=req.body.status;
        Task.find({'content':post.content},function(error,post_value){
            if(error){
                return res.send(error)
            }else{
                if(post_value.length >0){
                    res.json({status:false,message:'Task already created! Please try another one!'});
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
    // get all projects
    apiRouter.get('/tasks', function(req, res){
        Task.find({}, function(err, posts){
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
    apiRouter.delete('/tasks/removebyId/:id', function(req, res) {
        Task.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing Task.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
    // Find Task by id
    apiRouter.post('/tasks/findById',function(req,res){
         Task.findById(req.body.id,function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Removed successfully!', data: data});
            }
        })
    })
    // Find tasks by project_id
    apiRouter.post('/tasks/findByProjectId',function(req,res){
        /*Task.aggregate([
            {"$match":{"project_id":ObjectId(req.body.id)}},
            // Find Event detail based on event_id
            {"$lookup":{
              "from": "projects.team", //name of the foreign collection not model or schema name
              "localField": "team_member_id",
              "foreignField": "projects.team._id",
              "as": "detail"
            }},
//            {"$unwind":{"path":"$detail", "preserveNullAndEmptyArrays":true }}, // Keep non matching events
//            {"$group":{
//              "_id": "$_id",
//              "events": { "$push": "$events" },
//              "data": { "$first": "$$ROOT" } // $$ROOT to keep the entire data
//            }},
//            {"$addFields":{"data.events":"$events", "events":0}}, // Replace the events  with grouped events.
//            {"$replaceRoot":{"newRoot":"$data"}},
//            
            
        ],function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: data});
            }
        })*/
        Task.find({project_id:req.body.id},function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: data});
            }
        })
    })
    /*
     * Add team Member
     * @params: project_id, newTeam Object
     */
    apiRouter.post('/tasks/updateStatus',function(req,res){
        Task.findById(req.body.id,function(err,taskdata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Task.update({_id:req.body.id},{$set:{"status":req.body.status}},function(err1,data1){
                    if(err1){
                        res.json({status: false, message: 'Unable to update data!', error: err1});
                    }else{
                        res.json({status: true, message: 'Status has been updated Successfully!'});
                    }
                })
            }
        })
    })
}