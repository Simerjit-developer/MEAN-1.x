var Client = require('../models/client');
var User = require('../models/user');
var request = require('request');
var EmailTemplate = require('email-templates');

module.exports = function(apiRouter,transporter) {
    
     // add a client
    apiRouter.post('/clients/add', function(req, res){
        var post = new Client();
        post.name = req.body.name;
        post.email = req.body.email;
        post.phone = req.body.phone;
        post.location = req.body.location;
        post.project_id = req.body.project_id;
        post.added_by =req.body.added_by;
        User.findOne({ 'phone': req.body.phone }, function (err, users) {
            if(err){
                return res.json({ status: false, message: err});
            } else {
               // console.log(users)
                if(users){
                    post.status = 1
                }else{
                    post.status=0
                }
            }  
        });
        
        Client.find({'phone':post.phone,'project_id':post.project_id},function(error,post_value){
            if(error){
                return res.send(error)
            }else{
                if(post_value.length >0){
                    res.json({status:false,message:'Client with this phone already exists! Please try another one!'});
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
    // get all clients based on project id
    apiRouter.post('/clients/findByProjectId', function(req, res){
        Client.find({'project_id':req.body.project_id}, function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
                
        });
    });
    /*
     * Remove client based on id
     */
    apiRouter.delete('/clients/removebyId/:id', function(req, res) {
        Client.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing event.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
    // Find Client by id
    apiRouter.post('/clients/findById',function(req,res){
         Client.findById(req.body.id,function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'fetched successfully!', data: data});
            }
        })
    })
    // edit an Client
    apiRouter.post('/clients/updateById', function(req, res){
        Client.findById(req.body._id,function(err,servicedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Client.findOne({_id:{$ne:req.body._id},project_id:{$ne:req.body.project_id},phone: req.body.phone},function(err2,data){
                    if(err2){
                        res.json({'status':false,'message':err2});
                    }else{
                        if(data){
                            res.json({'status':false,'message':'Client with this phone already exists!'});
                        }else{
                            servicedata.name = req.body.name;
                            servicedata.email = req.body.email;
                            servicedata.phone = req.body.phone;
                            servicedata.location = req.body.location;
                            servicedata.status = req.body.status;
                            servicedata.save(function(err1) {
                                if (err1){
                                    res.json({'status':false,'message':'Unable to save data. Please try again later',error:err1});
                                }else{
                                    res.json({'status':true,'message':'Client updated!'});
                                }
                            })
                        }
                    }
                })
            }
        })
    });
    // update status Verified -> Unverified / Unverfified -> Verified
    apiRouter.post('/clients/allowGuestUpload', function(req, res){
        Client.findById(req.body._id,function(err,businessdata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Client.update({_id:req.body._id},{$set:{"allow_guest_upload":req.body.upload_access,"group_creation":req.body.group_creation}},function(err1,data1){
                    if(err1){
                        res.json({status: false, message: 'Unable to update data!', error: err1});
                    }else{
                        res.json({status: true, message: 'Data updated successfully!','data1':data1});
                    }
                })
            }
        })
    })
    // update status Verified -> Unverified / Unverfified -> Verified
    apiRouter.post('/clients/shareMetrics', function(req, res){
        Client.findById(req.body._id,function(err,businessdata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Client.update({_id:req.body._id},{$set:{"share_metrics":req.body.shareMetrics}},function(err1,data1){
                    if(err1){
                        res.json({status: false, message: 'Unable to update data!', error: err1});
                    }else{
                        res.json({status: true, message: 'Data updated successfully!','data1':data1});
                    }
                })
            }
        })
    })
    // get all projects based on client phone
    apiRouter.post('/clients/findByPhone', function(req, res){
        Client.find({'phone':req.body.phone}, function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
        });
    });
    // Send Request to Client to download the app
    apiRouter.post('/clients/sendRequest', function(req, res){
        Client.findById(req.body._id,function(err,businessdata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                // Send Email 
                var toEmail = req.body.email;
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
                    template: 'client_invitation',
                        options: {
                            send: true
                        },
                        message: {
                            to: toEmail,
                            subject: "You're invited to view your wedding's progress on DOST",
                                //content:'Demo Content'
                        },
                        locals: {
                        name: req.body.name,
                        bride_name:req.body.bride_name,
                        groom_name:req.body.groom_name,
                        start_date:req.body.start_date,
                        link:'http://yourshaadidost.com/'
                        }
                    }).then(function (response) {
                        transporter.sendMail(response.originalMessage, function (error, info) {
                            if (error) {
                                console.log(error)
                                res.json({ status: false, message: 'Error while sending invitation.', err: error });
                            } else {
                                    console.log(info)
                            }
                        })
                    })
                    .catch(function (erroroccured) {
                        console.log(console.error)
                            res.json({ status: false, message: 'Unable to send email', error: erroroccured })
                    })
                }
                // Send SMS
                var dataString = '/API/V1/52b2dcc5-bbf9-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS/';
                var options = {
                    url: 'https://2factor.in'+dataString,
                    method: 'POST',
                    body:{
                        From:'DOSTPV',
                        To:req.body.phone,
                        TemplateName:'Inviting a client to a project',
                        VAR1:req.body.name,
                        VAR2:req.body.bride_name,
                        VAR3: req.body.groom_name,
                        VAR4: req.body.start_date,
                        VAR5: 'http://yourshaadidost.com/', // Project Link
                    },
                    json: true
                };
                request(options, function (error, response, body) {
                    if (error) throw new Error(error);

                    console.log(body);
                });
                // Update Status in schema
                Client.update({_id:req.body._id},{$set:{"status":2}},function(err1,data1){
                    if(err1){
                        res.json({status: false, message: 'Unable to update data!', error: err1});
                    }else{
                        res.json({status: true, message: 'Data updated successfully!','data1':data1});
                    }
                })
            }
        })
    })
    // ReSend Request to Client to download the app
    apiRouter.post('/clients/resendRequest', function(req, res){
        Client.findById(req.body._id,function(err,businessdata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                // Send Email 
                var toEmail = req.body.email;
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
                    template: 'client_invitation',
                        options: {
                            send: true
                        },
                        message: {
                            to: toEmail,
                            subject: 'Reminder to view your wedding plan on DOST',
                                //content:'Demo Content'
                        },
                        locals: {
                        name: req.body.name,
                        bride_name:req.body.bride_name,
                        groom_name:req.body.groom_name,
                        start_date:req.body.start_date,
                        link:'http://yourshaadidost.com/'
                        }
                    }).then(function (response) {
                        transporter.sendMail(response.originalMessage, function (error, info) {
                            if (error) {
                                console.log(error)
                                res.json({ status: false, message: 'Error while sending invitation.', err: error });
                            } else {
                                    console.log(info)
                            }
                        })
                    })
                    .catch(function (erroroccured) {
                        console.log(console.error)
                            res.json({ status: false, message: 'Unable to send email', error: erroroccured })
                    })
                }
                // Send SMS
                var dataString = '/API/V1/52b2dcc5-bbf9-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS/';
                var options = {
                    url: 'https://2factor.in'+dataString,
                    method: 'POST',
                    body:{
                        From:'DOSTPV',
                        To:req.body.phone,
                        TemplateName:'Reminder to a client to accept invitation',
                        VAR1:req.body.name,
                        VAR2:req.body.bride_name,
                        VAR3: req.body.groom_name,
                        VAR4: 'http://yourshaadidost.com/', // Project Link
                    },
                    json: true
                };
                request(options, function (error, response, body) {
                    if (error) throw new Error(error);

                    console.log(body);
                });
                // Update Status in schema
                Client.update({_id:req.body._id},{$set:{"status":3}},function(err1,data1){
                    if(err1){
                        res.json({status: false, message: 'Unable to update data!', error: err1});
                    }else{
                        res.json({status: true, message: 'Data updated successfully!','data1':data1});
                    }
                })
            }
        })
    })
    // get client based on project id and Phone
    apiRouter.post('/clients/findByProjectIdPhone', function(req, res){
        Client.find({'project_id':req.body.project_id,'phone':req.body.phone}, function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                if(posts.length>0){
                    res.json({status:true, data: posts[0]});
                }else{
                    res.json({status:false, data: 'No match found'});
                }
                
            }
                
        });
    });
}