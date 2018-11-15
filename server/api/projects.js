var Project = require('../models/project');
var JobPost = require('../models/jobpost');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
// email template
var EmailTemplate = require('email-templates');
var request = require('request');

module.exports = function(apiRouter,transporter) {
    
     // add a vendortype
    apiRouter.post('/projects/add', function(req, res){
        
        var post = new Project();
        post.name = req.body.name;
        post.user_id = req.body.user_id;
        post.client={name : req.body.client.name};
        post.no_of_events = req.body.no_of_events;
        post.start_date=req.body.start_date;
        post.end_date=req.body.end_date;
        post.groom=req.body.groom;
        post.bride=req.body.bride;
        if(typeof req.body.event!='undefined'){
            Object.keys(req.body.event).map(function(objectKey, index) {
                var value = req.body.event[objectKey];
                post.events.push(value)
            });
        }
        
        if(typeof req.body.team!='undefined'){
            Object.keys(req.body.team).map(function(objectKey, index) {
                var value = req.body.team[objectKey];
                post.team.push(value)
            });
        }
        
        post.status=req.body.status;
        var draft={
            name: req.body.name,
            user_id : req.body.user_id,
            client:{name : req.body.client.name},
            no_of_events :req.body.no_of_events,
            start_date:req.body.start_date,
            end_date:req.body.end_date,
            groom:req.body.groom,
            bride:req.body.bride,
            events:[],
            team:[],
            status:req.body.status
        };
        //console.log(typeof draft);
        if(typeof req.body.event!='undefined'){
            Object.keys(req.body.event).map(function(objectKey, index) {
                if(typeof req.body.event[objectKey].end_date=='undefined'){
                    var duration_arr = req.body.event[objectKey].duration.split(" ");
                    if(typeof req.body.event[objectKey].start_date !='undefined'){
                        var startDate = new Date(req.body.event[objectKey].start_date)
                        req.body.event[objectKey].end_date = new Date(
                                        startDate.getFullYear(),
                                        startDate.getMonth(),
                                        startDate.getDate() + parseInt(duration_arr[0]),
                                        startDate.getHours(),
                                        startDate.getMinutes(),
                                        startDate.getSeconds());
                    }
                }
                var value = req.body.event[objectKey];
              //  console.log(value)
                draft.events.push(value)
            });
        }
        
        if(typeof req.body.team!='undefined'){
            Object.keys(req.body.team).map(function(objectKey, index) {
                var value = req.body.team[objectKey];
                draft.team.push(value)
            });
        }
        post.draft=draft;
        Project.find({'name':post.name},function(error,post_value){
            if(error){
                res.json({status:false,message:'Error while saving data! Please try again!',err:error});
            }else{
                if(post_value.length >0){
                    res.json({status:false,message:'Project Name already used! Please try another one!'});
                }else{
                    post.save(function(err, postdata){
                        if(err){ 
                            res.json({status:false,message:'Error while saving data! Please try another one!',err:err});
                        }else{
                            // Send Email Invitation too
                            if(typeof req.body.team!='undefined'){
                                for (var i = 0; i < Object.keys(req.body.team).length; i++) {
                                    var toEmail = req.body.team[i].email;
                                    if(toEmail){
                            var email = new EmailTemplate({
                                        message: {
                                          from: 'Dostindia@yourshaadidost.com',
                                        },
                                        // uncomment below to send emails in development/test env:
                                        send: true,
                                        preview:false,
                                        transport: {
                                          jsonTransport: true
                                        },
                                        views: {
                                          options: {
                                            extension: 'ejs' // <---- HERE
                                          }
                                        }
                                      });
                            email.send({
                                template: 'team_invitation',
                                options:{
                                    send:true
                                },
                                message: {
                                  to: toEmail,
                                  subject:"You're invited to plan a wedding on DOST!",
                                  //content:'Demo Content'
                                },
                                locals: {
                                  name: req.body.team[i].name,
                                  project_name:post.name,
                                  link: 'http://yourshaadidost.com/'
                                }
                              }).then(function(response){
                                  transporter.sendMail(response.originalMessage,function (error, info) {
                                      if (error) {
                                          console.log(error)
                                          res.json({status: false, message: 'Error while sending invitation.', err: error});
                                      } else {
                                          console.log(info)
                                          if(Object.keys(req.body.team).length==i){
                                              res.json({status: true, message: 'Saved successfully!', data: info});
                                          }
                                      }
                                  })
                              })
                              .catch(function(erroroccured){
                                  console.log(console.error)
                                  res.json({status:false, message: 'Unable to send email',error:erroroccured})
                              })
                        }else{
//                            console.log('else worked'+Object.keys(req.body.team).length+" "+i)
                            if(Object.keys(req.body.team).length-1==i){
                                res.json({status: true, message: 'Saved successfully!'});
                            }
                        }
                                    
                                }
                                    
                                }else{
                                    res.json({status:true,message:'Saved successfully!'});
                                }
                            }
                            
                    })
                }

            }
        })
    });
    // get all projects
    apiRouter.get('/projects', function(req, res){
        Project.find({}, function(err, posts){
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
    apiRouter.delete('/projects/removebyId/:id', function(req, res) {
        Project.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing Project.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
    // Find Project by id
    apiRouter.post('/projects/findById',function(req,res){
        Project.aggregate([
            {"$match":{"_id":ObjectId(req.body.id)}},
            // Find Event detail based on event_id
//            {"$unwind":"$events"}, // now
            {"$unwind":{"path":"$events", "preserveNullAndEmptyArrays":true }},
            {"$lookup":{
              "from": "events", //name of the foreign collection not model or schema name
              "localField": "events.event_id",
              "foreignField": "_id",
              "as": "events.detail"
            }},
            {"$unwind":{"path":"$events.detail", "preserveNullAndEmptyArrays":true }}, // Keep non matching events
            {"$group":{
              "_id": "$_id",
              "events": { "$push": "$events" },
              "data": { "$first": "$$ROOT" } // $$ROOT to keep the entire data
            }},
            {"$addFields":{"data.events":"$events", "events":0}}, // Replace the events  with grouped events.
            {"$replaceRoot":{"newRoot":"$data"}}, 
            
            // find team members by phone
//            {"$unwind":"$team"}, // now
            {"$unwind":{"path":"$team", "preserveNullAndEmptyArrays":true }},
            {"$lookup":{
              "from": "users", //name of the foreign collection not model or schema name
              "localField": "team.phone",
              "foreignField": "phone",
              "as": "team.detail"
            }},
            {"$unwind":{"path":"$team.detail", "preserveNullAndEmptyArrays":true }}, // Keep non matching events
            {"$group":{
              "_id": "$_id",
              "team": { "$push": "$team" },
              "data": { "$first": "$$ROOT" } // $$ROOT to keep the entire data
            }},
            {"$addFields":{"data.team":"$team", "events":0}}, // Replace the events  with grouped events.
            {"$replaceRoot":{"newRoot":"$data"}},
            
        ],function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: data[0]});
            }
        })
    })
    
    apiRouter.post('/projects/findByIdDemo',function(req,res){
        
        Project.aggregate([
            // Find Event detail based on event_id
            {"$unwind":"$events"},
            {"$lookup":{
              "from": "events", //name of the foreign collection not model or schema name
              "localField": "events.event_id",
              "foreignField": "_id",
              "as": "events.detail"
            }},
            {"$unwind":{"path":"$events.detail", "preserveNullAndEmptyArrays":true }}, // Keep non matching events
            {"$group":{
              "_id": "$_id",
              "events": { "$push": "$events" },
              "data": { "$first": "$$ROOT" } // $$ROOT to keep the entire data
            }},
            {"$addFields":{"data.events":"$events", "events":0}}, // Replace the events  with grouped events.
            {"$replaceRoot":{"newRoot":"$data"}},
            
            // find team members by phone
            {"$unwind":"$team"},
            {"$lookup":{
              "from": "users", //name of the foreign collection not model or schema name
              "localField": "team.phone",
              "foreignField": "phone",
              "as": "team.detail"
            }},
            {"$unwind":{"path":"$team.detail", "preserveNullAndEmptyArrays":true }}, // Keep non matching events
            {"$group":{
              "_id": "$_id",
              "team": { "$push": "$team" },
              "data": { "$first": "$$ROOT" } // $$ROOT to keep the entire data
            }},
            {"$addFields":{"data.team":"$team", "events":0}}, // Replace the events  with grouped events.
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
     * Find By User Id
     */
    // Find Project by id
    apiRouter.post('/projects/findByUserId',function(req,res){
         Project.find({user_id:req.body.user_id},null,{sort: '-updated_at'},function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: data});
            }
        })
    })
    /*
     * Find Assigned Projects by Projects ID
     */
    apiRouter.post('/projects/fetchDetails',function(req,res){
        Project.find({_id:{$in:req.body.project_id}},function(err,data){
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
    apiRouter.post('/projects/addTeamMember',function(req,res){
        // Send SMS to new User
       /* var dataString = '/API/V1/52b2dcc5-bbf9-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS/';
          var options = {
              url: 'https://2factor.in'+dataString,
              method: 'POST',
              body:{
                  From:'DOSTPV',
                  To:req.body.team.phone,
                  TemplateName:'Adding a team member to a project',
                  VAR1:req.body.name,
                  VAR2: 'Royal Wedding',
                  VAR3: 'http://yourshaadidost.com/', // Home Page Link
              },
              json: true
          };
          request(options, function (error, response, body) {
              if (error) throw new Error(error);

              console.log(body);
          });
        var email = new EmailTemplate({
                                        message: {
                                          from: 'simerjit@avainfotech.com',
                                        },
                                        // uncomment below to send emails in development/test env:
                                        send: true,
                                        preview:false,
                                        transport: {
                                          jsonTransport: true
                                        },
                                        views: {
                                          options: {
                                            extension: 'ejs' // <---- HERE
                                          }
                                        }
                                      });
                            email.send({
                                template: 'general',
                                options:{
                                    send:true
                                },
                                message: {
                                  to: req.body.team.email, //req.body.team.email
                                  subject:'DOST: Team Invitationn',
                                  //content:'Demo Content'
                                },
                                locals: {
                                  name: 'Elon'
                                }
                              }).then(function(response){
                                  transporter.sendMail(response.originalMessage,function (error, info) {
                                      if (error) {
                                          console.log(error)
                                          res.json({status: false, message: 'Error while sending invitation.', err: error});
                                      } else {
                                          console.log('success')
                                          console.log(info)
                                      }
                                  })
                              })
        
        console.log(req.body.team); console.log(req.body.team.email); 
        return false;*/
        Project.findById(req.body.project_id,function(err,data){
            if(err){
                res.json({status: false, message: 'Invalid Project. Please select project first.', error: err});
            }else{
                data.team = data.team.concat([req.body.team]); //this uses $set so no problems
               // data.team.push(req.body.team)
                data.save(function(err, post){
                    if(err){
                        res.json({status:false,message:'Error while saving!', error:err });
                    }else{
                        // Send SMS to new User
                        var dataString = '/API/V1/52b2dcc5-bbf9-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS/';
                          var options = {
                              url: 'https://2factor.in'+dataString,
                              method: 'POST',
                              body:{
                                  From:'DOSTPV',
                                  To:req.body.team.phone,
                                  TemplateName:'Adding a team member to a project',
                                  VAR1:req.body.team.name,
                                  VAR2: data.name,
                                  VAR3: 'http://yourshaadidost.com/', // Home Page Link
                              },
                              json: true
                          };
                          request(options, function (error, response, body) {
                              if (error) throw new Error(error);

                              console.log(body);
                          });
                        // Send Invitation Mail
                        if(req.body.team.email){
                            var email = new EmailTemplate({
                                        message: {
                                          from: 'Dostindia@yourshaadidost.com',
                                        },
                                        // uncomment below to send emails in development/test env:
                                        send: true,
                                        preview:false,
                                        transport: {
                                          jsonTransport: true
                                        },
                                        views: {
                                          options: {
                                            extension: 'ejs' // <---- HERE
                                          }
                                        }
                                      });
                            email.send({
                                template: 'general',
                                options:{
                                    send:true
                                },
                                message: {
                                  to: req.body.team.email, //req.body.team.email
                                  subject:"You're invited to plan a wedding on DOST!",
                                  //content:'Demo Content'
                                },
                                locals: {
                                  name: req.body.team.name,
                                  project_name:data.name,
                                  link: 'http://yourshaadidost.com/'
                                }
                              }).then(function(response){
                                  transporter.sendMail(response.originalMessage,function (error, info) {
                                      if (error) {
                                          console.log(error)
                                          res.json({status: false, message: 'Error while sending invitation.', err: error});
                                      } else {
                                          console.log(info)
                                          
                                          res.json({status: true, message: 'Invitation sent successfully!', data: info});
                                      }
                                  })
                              })
                              .catch(function(erroroccured){
                                  console.log(console.error)
                                  res.json({status:false, message: 'Unable to send email',error:erroroccured})
                              })
                        }
                        
                       // res.json({status:true,message:'Saved successfully!'});
                    }
                })
            }
        })
    })
    /*
     * Update a Project
     */
    apiRouter.post('/projects/updateById', function(req, res){
        Project.findById(req.body._id,function(err,servicedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Project.findOne({_id:{$ne:req.body._id},name: req.body.name},function(err2,data){
                    if(err2){
                        res.json({'status':false,'message':err2});
                    }else{
                        if(data){
                            res.json({'status':false,'message':'Project with this name already exists!'});
                        }else{
                            var conditions={
                                _id:req.body._id
                            }
                            var updateData = {
                                name:req.body.name,
                                start_date:req.body.start_date,
                                end_date:req.body.end_date,
                                groom:req.body.groom,
                                bride:req.body.bride,
                                client:req.body.client
                            }
                            Project.update(conditions,updateData,{multi:true},callback);
                            
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
     * Update a Project in Draft Mode
     */
    apiRouter.post('/projects/updateDraftById', function(req, res){
        Project.findById(req.body._id,function(err,servicedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Project.findOne({_id:{$ne:req.body._id},name: req.body.name},function(err2,data){
                    if(err2){
                        res.json({'status':false,'message':err2});
                    }else{
                        if(data){
                            res.json({'status':false,'message':'Project with this name already exists!'});
                        }else{
                            var conditions={
                                _id:req.body._id
                            }
                            var updateData = {
                                draft:req.body.draft
                            }
                            Project.update(conditions,updateData,{multi:true},callback);
                            
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
     * Push Project Draft information to live
     * If any jobPost is in Draft section, put that also live
     */
    apiRouter.post('/projects/PushLive', function(req, res){
        Project.findById(req.body._id,function(err,projectdata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                if(projectdata.draft.length == 0){
                    res.json({status:false, message:'Draft is empty so nothing to update.',error:err})
                }else{
                    var conditions={
                        _id:req.body._id
                    }
                    var updateData = {
                        name:projectdata.draft[0].name,
                        start_date:projectdata.draft[0].start_date,
                        end_date:projectdata.draft[0].end_date,
                        groom:projectdata.draft[0].groom,
                        bride:projectdata.draft[0].bride,
                        client:projectdata.draft[0].client,
                        budget:projectdata.draft[0].budget,
                        events:projectdata.draft[0].events,
                        team: projectdata.team,
                        draft:[]
                    }
                    Project.update(conditions,updateData,{multi:true},callback);

                    function callback(err, numAffected){
                        if(err){ 
                            res.json({status:false, message:'Error while saving data',error:err})
                        }else{
                            res.json({status:true,message:'Data has been pushed successfully on Live mode!',numAffected:numAffected});
                        }
                    }
                }
                
            }
        })
    });
    //Rename Project by Id
    apiRouter.post('/projects/renameProject',function(req,res){
        Project.findById(req.body._id,function(err,servicedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Project.findOne({_id:{$ne:req.body._id},name: req.body.name},function(err2,data){
                    if(err2){
                        res.json({'status':false,'message':err2});
                    }else{
                        if(data){
                            res.json({'status':false,'message':'Project with this name already exists!'});
                        }else{
                            var conditions={
                                _id:req.body._id
                            }
                            var updateData = {
                                name:req.body.name
                            }
                            Project.update(conditions,updateData,{multi:true},callback);
                            
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
    })
    /* 
     * Update Budget in Draft of an event
     * @params: event_id, project_id, budget
     */
    apiRouter.post('/projects/updateEventBudget',function(req,res){
        //console.log(req.body)
        /*Project.aggregate([
            {"$unwind":"$draft.events"},
            {"$match":{
                    $and: [
                        {"draft.events._id":ObjectId(req.body.event_id)},
                        {"_id":ObjectId(req.body.project_id)},
                    ]
                }
            }],function(err,project_data){
                console.log(project_data)
            })*/
            
            Project.update(
                { "draft.events._id": ObjectId(req.body.event_id) }, 
                { "$set": { "draft.events.$.budget": req.body.budget} },{multi:true},callback);
                function callback(err, numAffected){
                    if(err){ 
                        res.json({status:false, message:'Error while saving data',error:err})
                    }else{
                        res.json({status:true,message:'Saved successfully!',numAffected:numAffected});
                    }
                }
            
    })
    /*
     * Remove Team Member from particular project
     */
    apiRouter.post('/projects/removeTeamMember',function(req,res){
        Project.update( 
                { _id: req.body.project_id,'team._id':ObjectId(req.body.team_id ) },
                { $pull: { 'team': {_id:ObjectId(req.body.team_id) }} },
                {getAutoValues: false} ,callback);
        function callback(err, numAffected){
            if(err){ 
                res.json({status:false, message:'Error while saving data',error:err})
            }else{
                res.json({status:true,message:'Saved successfully!',numAffected:numAffected});
            }
        }
    });
}