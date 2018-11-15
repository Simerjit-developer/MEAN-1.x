var Invitation = require('../models/invitation');
var Guest = require('../models/guest');
var Project = require('../models/project');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var request = require('request');
var EmailTemplate = require('email-templates');

module.exports = function(apiRouter,transporter) {
    
     // send an invitation to a guest
    apiRouter.post('/invitations/add', function(req, res){
        var post = new Invitation();
       // console.log(req.body); return false;
        post.project_id = req.body.project_id;
        post.event_id = req.body.event_id;
        post.invitation_to = req.body.invitation_to; // guest _id
        post.posted_by = req.body.posted_by;
        post.status = req.body.status;
        Invitation.find({'invitation_to':ObjectId(post.invitation_to),'project_id':ObjectId(post.project_id),'event_id':ObjectId(post.event_id)},function(error,post_value){
            if(error){
                return res.send(error)
            }else{
                if(post_value.length >0){
                    res.json({status:false,message:'Invitation already sent! Please try another one!'});
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
    // get my invitations
    apiRouter.post('/invitations/my', function(req, res){
        //Get _id from phone number from Guests table // req.body.phone '+919888521241'
        Guest.find({'phone':req.body.phone},function(error,data){
            if (error) {
                res.json({status:false, message:'Unable to get data!', err: error})
            }else{
                var guests=[];
                for(var i=0;i<data.length;i++){
                    guests.push(ObjectId(data[i]._id))
                }
                console.log(guests)
                Invitation.aggregate([
                {"$match":{
                        "invitation_to":{
                            "$in":guests
                        }
                    }},
                {
                    "$lookup":{
                        "from":"users",
                        "localField":"posted_by",
                        "foreignField":"_id",
                        "as":"user_detail"
                    }
                },
                {"$lookup":{
                    "from": "projects", //name of the foreign collection not model or schema name
                    "localField": "project_id",
                    "foreignField": "_id",
                    "as": "project_detail"
                    }
                },
                {$unwind:'$project_detail'},
            {$project:
                {
                    "project_detail.events":1,
                    "project_detail.name":1,
                    "project_detail.bride.name":1,
                    "project_detail.groom.name":1,
                    "project_detail.start_date":1,
                    "_id":1,
                    "events":1,
                   //"event_id":1,
                    "project_id":1,
                    "title":1,
                    "description":1,
                    "budget":1,
                    'created_at':1,
                    'posted_by':1,
                    'status':1,
                    'user_detail.title':1,
                    'user_detail.firstname':1,
                    'user_detail.lastname':1
                }
            },
            {$unwind:'$project_detail.events'},
            {$unwind:'$events'},
           {
                $redact: {
                    $cond: [{
                            $ne: ["$project_detail.events._id", "$events.event_id"]
                        },
                        "$$PRUNE",
                        "$$KEEP"
                    ]
                }
            },
            {
                $group:
                  {
                    _id: { project_id: "$project_id", project_name: "$project_detail.name",bride_name:"$project_detail.bride.name",groom_name:"$project_detail.groom.name",project_start_date:"$project_detail.start_date" },
                    eventsInvited: {
                        $push:  {
                            event: "$project_detail.events",
                            event_data:"$events",
                            invited_on: "$created_at",
                            invitation_id:"$_id",
                            invitation_status:"$status",
                            invited_by:{_id:"$posted_by",user_detail:"$user_detail"}} 
                        }
                  }
            }
            ],function(err,mydata){
                if(err){
                    res.json({status:false, message: 'Unable to fetch invitations',err:err});
                }else{
                    res.json({status:true, data: mydata,mydata:data});
                }
            })
                
                
            }
        }).select({"_id":1,"phone":1});
    });
    // Invitation Response i.e. accepted/declined
    apiRouter.post('/invitations/response',function(req,res){
        var conditions={
            _id:req.body.invitation_id,
            events:{
                event_id:req.body.event_id
            }
        }
        var updateData = {
            guest_response:req.body.attending_status,
        }
        Invitation.update({"events.event_id":req.body.event_id,"_id":req.body.invitation_id}, { "$set": { "events.$.guest_response": parseInt(req.body.attending_status) } },{multi:true},callback);
        function callback(err, numAffected){
            if(err){ 
                res.json({status:false, message:'Error while saving data',error:err})
            }else{
                res.json({status:true,message:'Response has been sent!',numAffected:numAffected});
            }
        }
                    
    })
    // Invitation Detail
    apiRouter.post('/invitations/findById', function(req, res){
        console.log(req.body.id)
        Invitation.aggregate([
                //{"$unwind": "$events"},
                {"$match":{
                        "_id":ObjectId(req.body.id)
                    }
                },
                {
                    "$lookup":{
                        "from":"users",
                        "localField":"posted_by",
                        "foreignField":"_id",
                        "as":"user_detail"
                    }
                },
                {"$lookup":{
                    "from": "projects", //name of the foreign collection not model or schema name
                    "localField": "project_id",
                    "foreignField": "_id",
                    "as": "project_detail"
                    }
                },
                {$unwind:'$project_detail'},
            {$project:
                {
                    "project_detail.events":1,
                    "project_detail.name":1,
                    "project_detail.bride.name":1,
                    "project_detail.groom.name":1,
                    "_id":1,
                    "events":1,
                    "project_id":1,
                    "title":1,
                    "description":1,
                    "budget":1,
                    'created_at':1,
                    'posted_by':1,
                    'status':1,
                    'accomodation':1,
                    'food_restrictions':1,
                    'user_detail.title':1,
                    'user_detail.firstname':1,
                    'user_detail.lastname':1
                }
            },
            {$unwind:'$project_detail.events'},
           {
                $redact: {
                    $cond: [{
                            $ne: ["$project_detail.events._id", ObjectId(req.body.event_id)]
                        },
                        "$$PRUNE",
                        "$$KEEP"
                    ]
                }
            },
            {$unwind:'$events'},
           {
                $redact: {
                    $cond: [{
                            $ne: ["$events.event_id", ObjectId(req.body.event_id)]
                        },
                        "$$PRUNE",
                        "$$KEEP"
                    ]
                }
            },
            {
                $group:
                  {
                    _id: { project_id: "$project_id", project_name: "$project_detail.name",bride_name:"$project_detail.bride.name",groom_name:"$project_detail.groom.name" },
                    eventsInvited: {
                        $push:  {
                            event: "$project_detail.events",
                            guest_response:"$events",
                            invited_on: "$created_at",
                            invitation_id:"$_id",
                            invitation_status:"$status",
                            food_restrictions:"$food_restrictions",
                            accomodation:"$accomodation",
                            invited_by:{_id:"$posted_by",user_detail:"$user_detail"}} 
                        }
                  }
            }
            ],function(err,mydata){
                if(err){
                    res.json({status:false, message: 'Unable to fetch invitations',err:err});
                }else{
                    if(mydata.length>0){
                        res.json({status:true, data: mydata[0]});
                    }else{
                        res.json({status:false, message: 'No data found'});
                    }
                    
                }
            })
    });
    //Update Accomodation in Invitation
    apiRouter.post('/invitations/AccommodationDetails',function(req,res){
        Invitation.update({"events.event_id":req.body.event_id,"_id":req.body._id},
        { "$set": { "events.$.accomodation":  [req.body.accommodation] } },
        {multi:true},callback);
        function callback(err, numAffected){
            if(err){ 
                res.json({status:false, message:'Error while saving data',error:err})
            }else{
                res.json({status:true,message:'Saved successfully!',numAffected:numAffected});
            }
        }
    })
    // Add Food Restrictions
    apiRouter.post('/invitations/AddFoodRestrictions',function(req,res){
        Invitation.update({"events.event_id":req.body.event_id,"_id":req.body._id},
        { "$set": { "events.$.food_restrictions":  req.body.food_restrictions } },
        {multi:true},callback);
        function callback(err, numAffected){
            if(err){ 
                res.json({status:false, message:'Error while saving data',error:err})
            }else{
                res.json({status:true,message:'Saved successfully!',numAffected:numAffected});
            }
        }
    })
    /*
     * Remove Food Restrictions
     * @params: _id(invitation_id), restriction_id (embedded document id)
     */ 
    apiRouter.post('/invitations/RemoveFoodRestriction',function(req,res){
        Invitation.update({"events.event_id":req.body.event_id,"_id":req.body._id},
        { "$set": { "events.$.food_restrictions":  [] } },
        {multi:true},callback);
        function callback(err, numAffected){
            if(err){ 
                res.json({status:false, message:'Error while saving data',error:err})
            }else{
                res.json({status:true,message:'Removed successfully!',numAffected:numAffected});
            }
        }
    })
    /*
     * Update Food Restrictions
     * @params: _id(invitation_id), meal_id (nested object id), meals 
     */
    apiRouter.post('/invitations/updateFoodRestriction',function(req,res){
        Invitation.update(
            { 'food_restrictions._id': req.body.restriction_id,'_id':req.body._id },
            { $set:  { 'food_restrictions.$.meals': parseInt(req.body.meals) }},
            (err, result) => {
              if (err) {
                res.status(200).json({status:false,message:err});
              } else {
                res.status(200).json({status:true,message:'Saved successfully!','data2':result});
              }
           }
          );
    })
    /*
     * Send request for accomodation to multiple guests using mobile number
     * Update accomodation status
     */
    apiRouter.post('/invitations/SendAccomodationRequest',function(req,res){
        for (let index = 0; index < req.body.data_to_send.length; index++) {
            // Send SMS 
            var dataString = '/API/V1/52b2dcc5-bbf9-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS/';
            var options = {
                url: 'https://2factor.in'+dataString,
                method: 'POST',
                body:{
                    From:'DOSTPV',
                    To:req.body.data_to_send[index].invited.phone,
                    TemplateName:'Requesting a guest to enter accommodation needs and pick-up and drop-off information',
                    VAR1:req.body.data_to_send[index].name,
                    VAR2: 'http://yourshaadidost.com/', // RSVP Link
                    VAR3:req.body.project.bride_name,
                    VAR4: req.body.project.groom_name,
                    VAR5:req.body.data_to_send[index].invited.invitation_code, // 6 digit code 

                },
                json: true
            };
            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                console.log(body);
            });
            // Send Email
            var toEmail = req.body.data_to_send[index].invited.email;
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
                    template: 'guest_invitation',
                    options:{
                        send:true
                    },
                    message: {
                      to: toEmail,
                      subject:req.body.data_to_send[index].name+", we need some information from you - "+req.body.project.bride_name+" & "+req.body.project.groom_name,
                      //content:'Demo Content'
                    },
                    locals: {
                        name: req.body.data_to_send[index].name,
                        link:'http://yourshaadidost.com/',
                        bride_name:req.body.project.bride_name,
                        groom_name: req.body.project.groom_name,
                        code:req.body.data_to_send[index].invited.invitation_code, // 6 digit code
                    }
                }).then(function(response){
                    transporter.sendMail(response.originalMessage,function (error, info) {
                        if (error) {
                            console.log(error)
                          //  res.json({status: false, message: 'Error while sending invitation.', err: error});
                        } else {
                            console.log(info)
//                            if(Object.keys(req.body.team).length==i){
//                                res.json({status: true, message: 'Saved successfully!', data: info});
//                            }
                        }
                    })
                })
                .catch(function(erroroccured){
                    console.log(console.error)
                    //res.json({status:false, message: 'Unable to send email',error:erroroccured})
                })
            }
        }
        Invitation.update(
            { 
                'phone':{$in:req.body.request_to},
                'project_id':req.body.project_id,
                "events.event_id":req.body.event_id
            },
            { $set:  { 'events.$.accomodation_request': true }},
            {multi:true},
            (err, result) => {
              if (err) {
                res.status(200).json({status:false,message:err});
              } else {
                  
                res.status(200).json({status:true,message:'Saved successfully!','data2':result});
              }
           }
          );
    })
    /*
     * Send request for food dietry restrictions to multiple guests using mobile number
     * Update food_restriction status
     */
    apiRouter.post('/invitations/SendFoodRestrictionsRequest',function(req,res){
        for (let index = 0; index < req.body.data_to_send.length; index++) {
            // Send SMS 
            var dataString = '/API/V1/52b2dcc5-bbf9-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS/';
            var options = {
                url: 'https://2factor.in'+dataString,
                method: 'POST',
                body:{
                    From:'DOSTPV',
                    To:req.body.data_to_send[index].invited.phone,
                    TemplateName:'Requesting a guest to enter dietary restrictions',
                    VAR1:req.body.data_to_send[index].name,
                    VAR2: 'http://yourshaadidost.com/', // RSVP Link
                    VAR3:req.body.project.bride_name,
                    VAR4: req.body.project.groom_name,
                    VAR5:req.body.data_to_send[index].invited.invitation_code, // 6 digit code 

                },
                json: true
            };
            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                console.log(body);
            });
            
            // Send Email
            var toEmail = req.body.data_to_send[index].invited.email;
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
                    template: 'guest_invitation',
                    options:{
                        send:true
                    },
                    message: {
                      to: toEmail,
                      subject:req.body.data_to_send[index].name+", help us with your dietary restrictions - "+req.body.project.bride_name+" & "+req.body.project.groom_name,
                      //content:'Demo Content'
                    },
                    locals: {
                        name: req.body.data_to_send[index].name,
                        link:'http://yourshaadidost.com/',
                        bride_name:req.body.project.bride_name,
                        groom_name: req.body.project.groom_name,
                        code:req.body.data_to_send[index].invited.invitation_code, // 6 digit code
                    }
                }).then(function(response){
                    transporter.sendMail(response.originalMessage,function (error, info) {
                        if (error) {
                            console.log(error)
                          //  res.json({status: false, message: 'Error while sending invitation.', err: error});
                        } else {
                            console.log(info)
//                            if(Object.keys(req.body.team).length==i){
//                                res.json({status: true, message: 'Saved successfully!', data: info});
//                            }
                        }
                    })
                })
                .catch(function(erroroccured){
                    console.log(console.error)
                    //res.json({status:false, message: 'Unable to send email',error:erroroccured})
                })
            }
        }
        //console.log(req.body);
        Invitation.update(
            { 
                'phone':{$in:req.body.request_to},
                'project_id':req.body.project_id,
                "events.event_id":req.body.event_id
            },
            { $set:  { 'events.$.food_restrictions_request': true }},
            {multi:true},
            (err, result) => {
              if (err) {
                res.status(200).json({status:false,message:err});
              } else {
                res.status(200).json({status:true,message:'Saved successfully!','data2':result});
              }
           }
          );
    })
    /*
     * Fetch Invitations corresponding to Group, From Project and event
     * @params: from, group, project_id, event_id
     */
    apiRouter.get('/invitations/byFromGroupEventProject',function(req,res){
        Guest.find({from:req.body.from, group:req.body.group, project_id:ObjectId(req.body.project_id)},function(guest_err,guest_data){
            if(guest_err){
                res.status(500).json({status:false,message:'Unable to fetch guests!','err':guest_err});
            }else{
                if(guest_data.length >0){
                    Invitation.find({project_id:ObjectId(req.body.project_id),event_id:ObjectId(req.body.event_id),invitation_to:{$in:guest_data}},function(err,data){
                       if(err){
                           res.status(200).json({status:true,message:'Saved successfully!','data2':result});
                       }else{
                           if(data.length==0){
                               res.status(200).json({status:true,message:'No Invitation sent yet!'});
                           }else{
                               res.status(200).json({status:true,message:'Fetched successfully!','data':data});
                           }
                       }
                    })
                }else{
                    res.status(200).json({status:true,message:'No Guest Found!'});
                }
            }
            
        }).project({
            _id:1
        }).toArray();
        
    })
    /*
     * Fetch Invitation using phone number and invitation_code
     */
    apiRouter.post('/invitations/fetchByCode',function(req,res){
        
        Invitation.aggregate([
            {"$match":{
                    "project_id":ObjectId(req.body.project_id),
                    "_id":ObjectId(req.body.invitation_id),
                    "phone":req.body.phone,
                    'invitation_code':req.body.invitation_code
//                                "invitation_to":{
//                                    $in:guest_data
//                                }

                }
            },
            {
                "$lookup":{
                    "from":"users",
                    "localField":"posted_by",
                    "foreignField":"_id",
                    "as":"user_detail"
                }
            },
            {"$lookup":{
                "from": "projects", //name of the foreign collection not model or schema name
                "localField": "project_id",
                "foreignField": "_id",
                "as": "project_detail"
                }
            },
            {$unwind:'$project_detail'},
            {$project:
                {
                    "project_detail.events":1,
                    "project_detail.name":1,
                    "project_detail.bride.name":1,
                    "project_detail.groom.name":1,
                    "_id":1,
                    "event_id":1,
                    "project_id":1,
                    "title":1,
                    "description":1,
                    "budget":1,
                    'created_at':1,
                    'posted_by':1,
                    'status':1,
                    'accomodation':1,
                    'food_restrictions':1,
                    'user_detail.title':1,
                    'user_detail.firstname':1,
                    'user_detail.lastname':1
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
                $group:
                  {
                    _id: { project_id: "$project_id", project_name: "$project_detail.name",bride_name:"$project_detail.bride.name",groom_name:"$project_detail.groom.name" },
                    eventsInvited: {
                        $push:  {
                            event: "$project_detail.events",
                            invited_on: "$created_at",
                            invitation_id:"$_id",
                            invitation_status:"$status",
                            food_restrictions:"$food_restrictions",
                            accomodation:"$accomodation",
                            invited_by:{_id:"$posted_by",user_detail:"$user_detail"}} 
                        }
                  }
            }
        ],function(err,mydata){
            if(err){
                res.json({status:false, message: 'Unable to fetch invitation',err:err});
            }else{
                if(mydata.length>0){
                    res.json({status:true, data: mydata[0]});
                }else{
                    res.json({status:false, message: 'Invalid Invitation Code/Url'});
                }
            }
        })
    })
    /*
     * RSVP
     * @params: status: 2=Declined, 3= Accepted, no_of_guests, 
     */
    apiRouter.post('/invitations/RSVP',function(req,res){
        
    })
    //send invitation
apiRouter.post("/invitations/sendInvitation", function (req, res) {
    
//    if (!req.body.data_to_send[0].invited) {
        for (let index = 0; index < req.body.data_to_send.length; index++) {
            var random_number = Math.floor(Math.random() * 900000) + 10000;
            Invitation.find({'phone':req.body.data_to_send[index].phone,'project_id':req.body.data_to_send[index].project_id},function(myerr, invitation_exists){
                if(myerr){
                    console.log(myerr);
                    if (Object.keys(req.body.data_to_send.length).length == index) {
                            res.json({ status: false, message: 'Error Occured. Kindly login again',err:myerr  });
                    }
                }else{
                    //console.log(invitation_exists)
                    if(invitation_exists.length == 0){
                        var invitation = new Invitation();
                        invitation.project_id = req.body.data_to_send[index].project_id;
                        invitation.invitation_to = req.body.data_to_send[index]._id;
                        invitation.phone = req.body.data_to_send[index].phone;
                        // guest _id
                        invitation.posted_by = req.body.data_to_send[index].posted_by;
                        invitation.status = 1;
                        invitation.invitation_code =random_number
                    }else{
                        var invitation = invitation_exists[0];
                    }
                    
                    if(typeof invitation.events=='undefined'){
                        invitation.events=[]
                    }
                    // Check whether event_id is an array or variable
                    if(req.body.event_id.constructor === Array){
                        Object.keys(req.body.event_id).map(function(objectKey, index) {
                            console.log(req.body.event_id[objectKey])
                            var value = invitation.events.some(function(element) {
                                return element.event_id.equals(req.body.event_id[objectKey])
                            });
                            if(value){
                                // Already Added
                            }else{
                                invitation.events.push({event_id:req.body.event_id[objectKey]})
                            }
                        });
                    }else{
                        // Check if event_id already exists in events Nested schema
                        var even = function(element) {
                            return element.event_id.equals(req.body.event_id)
                        };
                        var event_exists = invitation.events.some(even);
                        if(event_exists){
                            // ALready Invited
                            if (Object.keys(req.body.data_to_send.length).length == index) {
                                res.json({ status: false, message: 'Already Invited.'  });
                            }
                        }else{
                            invitation.events.push({event_id:req.body.event_id})
                        }
                    }
                        invitation.save(function (err, invitation) {
                            if (err) {
                            res.json({ status: false, message: 'Error while sending invitation.', err: error });
                            } else {
                                // Guest Respond on first sent SMS or not
                                var guest_repond = function(element) {
                                    // checks whether an element is even
                                    return element.guest_response > 1
                                };
                                if(invitation.events.some(guest_repond)){
                                    console.log('Guest already repond atleast on one event')
                                }else{
                                    // Send SMS
                                    var dataString = '/API/V1/52b2dcc5-bbf9-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS/';
                                    var options = {
                                        url: 'https://2factor.in'+dataString,
                                        method: 'POST',
                                        body:{
                                            From:'DOSTPV',
                                            To:invitation.phone,
                                            TemplateName:'Inviting a guest to a wedding',
                                            VAR1:req.body.data_to_send[index].name, // user first name
                                            VAR2: 'http://yourshaadidost.com/', // RSVP Link
                                            VAR3:req.body.project.bride_name,
                                            VAR4: req.body.project.groom_name,
                                            VAR5:invitation.invitation_code, // 6 digit code 
                                            //VAR5: invitation.invitation_code+" using link http://yourshaadidost.com/"
                                        },
                                        json: true
                                    };
                                    request(options, function (error, response, body) {
                                        if (error) throw new Error(error);

                                        console.log(body);
                                    });
                                    
                                    // Send Email
                                    var toEmail = req.body.data_to_send[index].email;
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
                                            template: 'guest_invitation',
                                            options:{
                                                send:true
                                            },
                                            message: {
                                              to: toEmail,
                                              subject:"Save the Date - "+req.body.project.start_date+" - "+req.body.project.bride_name+" & "+req.body.project.groom_name,
                                              //content:'Demo Content'
                                            },
                                            locals: {
                                                name: req.body.data_to_send[index].name,
                                                link:'http://yourshaadidost.com/',
                                                bride_name:req.body.project.bride_name,
                                                groom_name: req.body.project.groom_name,
                                                code:invitation.invitation_code, // 6 digit code
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
                                    }
                                }
                                

                                if (Object.keys(req.body.data_to_send.length).length == index) {
                                //console.log(invitation);
                                    var query_data = {
                                    from: "Bride",
                                            group: "Family",
                                            project_id: ObjectId(req.body.data_to_send[index].project_id)
                                    };
                                    Guest.aggregate([
                                        { "$match": query_data },
                                        {
                                        "$lookup": {
                                            "from": "invitations",
                                            "localField": "phone",
                                            "foreignField": "phone",
                                            "as": "invited"
                                        },
                                        },
                                    ], function (err, data_info) {
                                        if (err) {
                                            res.json({ status: false, message: err });
                                        } else {
                                            res.json({ status: true, message: 'Invitation sent successfully!', data: data_info });
                                        }
                                    });
                                }
                            }
                        })
                }
            })
        }
});
    // Send Reminder
apiRouter.post('/invitations/sendReminder',function(req,res){
    for (let index = 0; index < req.body.data_to_send.length; index++) {
            User.find({ 'email': req.body.data_to_send[index].email }, function (error, user_data) {
                if (error) {
                    res.json({ status: false, message: error });
                } else {
                    ///
                    var toEmail = req.body.data_to_send[index].email;
                    if (toEmail) {
                        var email = new EmailTemplate({
                            message: {
                            from: 'Dostindia@yourshaadidost.com',
                            },
                            // uncomment below to send emails in development/test env:
                            send: true,
                            preview: false,
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
                    template: 'guest_rsvp',
                            options: {
                            send: true
                            },
                            message: {
                            to: toEmail,
                                    subject: "Reminder from "+req.body.project.bride_name+" & "+req.body.project.groom_name,
                                    //content:'Demo Content'
                            },
                            locals: {
                                name: req.body.data_to_send[index].name,
                                link:'http://yourshaadidost.com/',
                                bride_name:req.body.project.bride_name,
                                groom_name: req.body.project.groom_name,
                                code:invitation.invitation_code, // 6 digit code
                            }
                    }).then(function (response) {
                        transporter.sendMail(response.originalMessage, function (error, info) {
                        if (error) {
                        console.log(error)
                                res.json({ status: false, message: 'Error while sending invitation.', err: error });
                        } else {
                            // Send SMS for Reminder
                            var dataString = '/API/V1/52b2dcc5-bbf9-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS/';
                            var options = {
                                url: 'https://2factor.in'+dataString,
                                method: 'POST',
                                body:{
                                    From:'DOSTPV',
                                    To:invitation.phone,
                                    TemplateName:'Reminder to a guest to RSVP for a wedding',
                                    VAR1:req.body.data_to_send[index].name, // user first name
                                    VAR2: 'http://yourshaadidost.com/', // RSVP Link
                                    VAR3:req.body.project.bride_name,
                                    VAR4: req.body.project.groom_name,
                                    VAR5:req.body.data_to_send[index].invitation_code, // 6 digit code 
                                    //VAR5: invitation.invitation_code+" using link http://yourshaadidost.com/"
                                },
                                json: true
                            };
                            request(options, function (error, response, body) {
                                if (error) throw new Error(error);

                                console.log(body);
                            });
                            
                            
                        console.log(info)
                                if (Object.keys(req.body.data_to_send.length).length == index) {
                        var query_data = {
                        from: "Bride",
                                group: "Family",
                                project_id: ObjectId(req.body.data_to_send[index].project_id)
                        };
                                Guest.aggregate([
                                { "$match": query_data },
                                {
                                "$lookup": {
                                "from": "invitations",
                                        "localField": "phone",
                                        "foreignField": "phone",
                                        "as": "invited"
                                },
                                },
                                ], function (err, data_info) {
                                if (err) {
                                res.json({ status: false, message: err });
                                } else {
                                res.json({ status: true, message: 'Reminder sent successfully!', data: data_info });
                                }
                                });
                        }

                        }
                        })
                    })
                    .catch(function (erroroccured) {
                    console.log(console.error)
                            res.json({ status: false, message: 'Unable to send email', error: erroroccured })
                    })
                            }


                        }
            });
        }
})
/*
 * Send Invitation to the Guest added by Guest 
 * @param email, phone, guest_id, project_id, event_id, posted_by, invitation_code (generate in api)
 */
    apiRouter.post("/invitations/sendInvitationToSingleGuest", function (req, res) {
        var random_number = Math.floor(Math.random() * 900000) + 10000;
            Invitation.find({'phone':req.body.phone,'project_id':req.body.project_id},function(myerr, invitation_exists){
                if(myerr){
                    console.log(myerr);
                    res.json({ status: false, message: 'Error Occured. Kindly login again',err:myerr  });
                    
                }else{
                    console.log(invitation_exists)
                    if(invitation_exists.length == 0){
                        var invitation = new Invitation();
                        invitation.project_id = req.body.project_id;
                        invitation.invitation_to = req.body._id;
                        invitation.phone = req.body.phone;
                        // guest _id
                        invitation.posted_by = req.body.posted_by;
                        invitation.status = 1;
                        invitation.invitation_code =random_number
                    }else{
                        var invitation = invitation_exists[0];
                    }
                    
                    if(typeof invitation.events=='undefined'){
                        invitation.events=[]
                    }
                    
                    // Check if event_id already exists in events Nested schema
                    var even = function(element) {
                        return element.event_id.equals(req.body.event_id)
                    };
                    var event_exists = invitation.events.some(even);
                    console.log(event_exists); //return false;
                    if(event_exists){
                        // ALready Invited
                        res.json({ status: false, message: 'Already Invited.'  });
                        
                    }else{
                        invitation.events.push({event_id:req.body.event_id})
                    }
                    
                    invitation.save(function (err, invitation) {
                        if (err) {
                            res.json({ status: false, message: 'Error while sending invitation.', err: error });
                        } else {
                                // Guest Respond on first sent SMS or not
                                var guest_repond = function(element) {
                                    // checks whether an element is even
                                    return element.guest_response > 1
                                };
                                if(invitation.events.some(guest_repond)){
                                    console.log('Guest already repond atleast on one event')
                                }else{
                                    //Send Email
                                    // Send Email
                                    var toEmail = invitation.email;
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
                                            template: 'guest_invitation',
                                            options:{
                                                send:true
                                            },
                                            message: {
                                              to: toEmail,
                                              subject:"Save the Date - "+req.body.project.start_date+" - "+req.body.project.bride_name+" & "+req.body.project.groom_name,
                                              //content:'Demo Content'
                                            },
                                            locals: {
                                                name: invitation.name,
                                                link:'http://yourshaadidost.com/',
                                                bride_name:req.body.project.bride_name,
                                                groom_name: req.body.project.groom_name,
                                                code:invitation.invitation_code, // 6 digit code
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
                                    }
                                    //Send SMS
                                    var dataString = '/API/V1/52b2dcc5-bbf9-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS/';
                                    var options = {
                                        url: 'https://2factor.in'+dataString,
                                        method: 'POST',
                                        body:{
                                            From:'DOSTPV',
                                            To:invitation.phone,
                                            TemplateName:'Inviting a guest to a wedding',
                                            VAR1:req.body.name, // user first name
                                            VAR2: 'http://yourshaadidost.com/', // RSVP Link
                                            VAR3:req.body.project.bride_name,
                                            VAR4: req.body.project.groom_name,
                                            VAR5:invitation.invitation_code, // 6 digit code 
                                            //VAR5: invitation.invitation_code+" using link http://yourshaadidost.com/"
                                        },
                                        json: true
                                    };
                                    request(options, function (error, response, body) {
                                        if (error) throw new Error(error);

                                        console.log(body);
                                        res.json({ status: true, message: 'Invitation sent successfully!'});
                                    });
                                }
                               
                            }
                        })
                }
            })
        /*var random_number = Math.floor(Math.random() * 900000) + 100000;
            // console.log(req.body.data_to_send);
    //        return false;
        User.find({ 'phone': req.body.phone }, function (error, user_data) {
            if (error) {
                res.json({ status: false, message: error });
            } else {
                var toEmail = req.body.email;
                if (toEmail) {
                    var email = new EmailTemplate({
                        message: {
                        from: 'simerjit@avainfotech.com',
                        },
                        // uncomment below to send emails in development/test env:
                        send: true,
                        preview: false,
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
                        options: {
                            send: true
                        },
                        message: {
                            to: toEmail,
                            subject: 'DOST: Team Invitation',
                            //content:'Demo Content'
                        },
                        locals: {
                            name: 'Elon'
                        }
                    }).then(function (response) {
                        transporter.sendMail(response.originalMessage, function (error, info) {
                            if (error) {
                                //console.log(error)
                                res.json({ status: false, message: 'Error while sending invitation.', err: error });
                            } else {
                                //console.log("first time invitation")
                                var invitation = new Invitation();
                                invitation.project_id = req.body.project_id;
                                // guest _id
                                invitation.phone = req.body.phone;
                                invitation.invitation_to = req.body.guest_id; // from guests table
                                invitation.event_id = req.body.event_id;
                                invitation.posted_by = req.body.posted_by;
                                invitation.status = 1;
                                invitation.invitation_code = random_number;
                                invitation.save(function (err, invitation) {
                                    if (err) {
                                        res.json({ status: false, message: 'Error while sending invitation.', err: error });
                                    } else {
                                        var url = "http://"+req.headers.host+':3001/dost#/guestViewCode/'+req.body.project_id+'/'+req.body.phone+'/'+invitation._id;
                                        //console.log(invitation);
                                        var dataString = '/API/V1/52b2dcc5-bbf9-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS/';
                                        var options = {
                                            url: 'https://2factor.in'+dataString,
                                            method: 'POST',
                                            body:{
                                                From:'DOSTPV',
                                                To:req.body.phone,
                                                TemplateName:'Wedding Invitation',
                                                VAR1:req.body.name,
                                                VAR2:req.body.project_name,
                                                VAR3: req.body.event_name,
                                                VAR4:req.body.user_name ,
                                                VAR5: invitation.invitation_code+" using link "+url
                                            },
                                            json: true
                                        };
                                        request(options, function (error, response, body) {
                                            if (error) throw new Error(error);

                                            console.log(body);
                                        });
                                        res.json({ status: true, message: 'Invited Successfully.', data: invitation });
                                    }
                                })
                            }
                        })
                    })
                    .catch(function (erroroccured) {
                        //console.log(erroroccured)
                        res.json({ status: false, message: 'Unable to send email', error: erroroccured })
                    })
                }
            }
        })*/
    });
}