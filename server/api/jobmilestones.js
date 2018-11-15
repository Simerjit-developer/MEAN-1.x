var JobMilestone = require('../models/jobMilestones');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(apiRouter,transporter) {
    
     // add a vendortype
    apiRouter.post('/jobmilestones/add', function(req, res){
        
        var post = new JobMilestone();
        post.job_id = req.body.job_id;
        post.posted_by = req.body.posted_by;
        post.title= req.body.title;
        post.start_date = req.body.start_date;
        post.end_date=req.body.end_date;
        post.status=req.body.status;
        if(typeof req.body.tasks!='undefined'){
            Object.keys(req.body.tasks).map(function(objectKey, index) {
                var value = req.body.tasks[objectKey];
                value.posted_by=post.posted_by;
                post.tasks.push(value)
            });
        }
        
        JobMilestone.find({'title':post.title,'job_id':post.job_id},function(error,post_value){
            if(error){
                res.json({status:false,message:'Error while saving data! Please try again!',err:error});
            }else{
                if(post_value.length >0){
                    res.json({status:false,message:'Milestone already created! Please try another one!'});
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
    // get all projects
    apiRouter.post('/jobmilestones/all', function(req, res){
        JobMilestone.find({job_id:ObjectId(req.body.job_id)}, function(err, posts){
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
    apiRouter.delete('/jobmilestones/removebyId/:id', function(req, res) {
        JobMilestone.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing Miletone.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
    // Find Project by id
    apiRouter.post('/jobmilestones/findById',function(req,res){
        JobMilestone.findById(req.body._id, function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
        });
    })
    
    
    /*
     * Add team Member
     * @params: project_id, newTeam Object
     */
    apiRouter.post('/jobmilestones/addTask',function(req,res){
        // Send SMS to new User
        JobMilestone.findById(req.body._id,function(err,data){
            if(err){
                res.json({status: false, message: 'Invalid Milestone. Please select milestone first.', error: err});
            }else{
                data.tasks = data.tasks.concat([req.body.task]); //this uses $set so no problems
               // data.team.push(req.body.team)
                data.save(function(err, post){
                    if(err){
                        res.json({status:false,message:'Error while saving!', error:err });
                    }else{
                        res.json({status:true,message:'Saved successfully!',data:data});
                    }
                })
            }
        })
    })
    /*
     * Update a Project
     */
    apiRouter.post('/jobmilestones/updateById', function(req, res){
        JobMilestone.findById(req.body._id,function(err,servicedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                JobMilestone.findOne({_id:{$ne:req.body._id},title: req.body.title},function(err2,data){
                    if(err2){
                        res.json({'status':false,'message':err2});
                    }else{
                        if(data){
                            res.json({'status':false,'message':'Milestone with this title already exists!'});
                        }else{
                            var conditions={
                                _id:req.body._id
                            }
                            var updateData = {
                                title: req.body.title,
                                start_date : req.body.start_date,
                                end_date:req.body.end_date
                            }
                            JobMilestone.update(conditions,updateData,{multi:true},callback);
                            
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
    /*
     * Remove Team Member from particular project
     */
    apiRouter.post('/jobmilestones/removeTask',function(req,res){
        JobMilestone.update( 
                { _id: req.body.milestone_id,'tasks._id':ObjectId(req.body.task_id ) },
                { $pull: { 'tasks': {_id:ObjectId(req.body.task_id) }} },
                {getAutoValues: false} ,callback);
        function callback(err, numAffected){
            if(err){ 
                res.json({status:false, message:'Error while saving data',error:err})
            }else{
                res.json({status:true,message:'Task removed successfully!',numAffected:numAffected});
            }
        }
    });
    /*
     * Fetch Task by Id
     */
    apiRouter.post('/jobmilestones/TaskfindById',function(req,res){
        JobMilestone.find( 
                { _id: req.body.milestone_id,'tasks._id':ObjectId(req.body.task_id ) },{ 'tasks.$': 1 ,'_id':1},callback);
        function callback(err, data){
            if(err){ 
                res.json({status:false, message:'Error while saving data',error:err})
            }else{
                res.json({status:true,message:'Task fetched successfully!',data:data[0]});
            }
        }
    });
    /*
     * Update Task by task and miletsone id
     */
    apiRouter.post('/jobmilestones/TaskupdateById',function(req,res){
        JobMilestone.update( 
                { _id: req.body.milestone_id,'tasks._id':ObjectId(req.body.task._id ) },
                { $set: { 'tasks.$.title': req.body.task.title,'tasks.$.date':req.body.task.date } },
                {upsert: true} ,callback);
        function callback(err, numAffected){
            if(err){ 
                res.json({status:false, message:'Error while saving data',error:err})
            }else{
                res.json({status:true,message:'Task updated successfully!',numAffected:numAffected});
            }
        }
    });
    /*
     * Update Task Status for complete/incomplete 
     */
    apiRouter.post('/jobmilestones/TaskUpdateStatus',function(req,res){
        JobMilestone.update( 
                { _id: req.body.milestone_id,'tasks._id':ObjectId(req.body.task_id ) },
                { $set: { 'tasks.$.status': req.body.status} },
                {upsert: true} ,callback);
        function callback(err, numAffected){
            if(err){ 
                res.json({status:false, message:'Error while saving data',error:err})
            }else{
                res.json({status:true,message:'Task updated successfully!',numAffected:numAffected});
            }
        }
    });
}