var User = require('../models/user');
var request = require('request');
var EmailTemplate = require('email-templates');
var aws = require('aws-sdk');

// Users API
module.exports = function(apiRouter, passport,userupload,transporter) {
    // upload user image to bucket
    apiRouter.post('/users/upload',userupload.array('file',3), function(req, res, next) {
         res.send(req.files[0]);
     });
    // get all vendortypes
    apiRouter.get('/users', function(req, res){
        User.find({}, function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
                
        });
    });
    // Phone Number Exists
    apiRouter.post('/users/PhoneExists', function (req, res, next) {
        User.findOne({ 'phone': req.body.phone }, function (err, users) {
            if(err){
                return res.json({ status: false, message: err});
            } else {
               // console.log(users)
                if(users){
                    return res.json({ status: false,message:'Phone number is already registered with DOST.' });
                }else{
                    return res.json({ status: true,message:'Proceed' });
                }
                
            }  
                
        });
    });
    //login API
    apiRouter.post('/users/login', function (req, res, next) {
        User.findOne({ 'phone': req.body.phone }, function (err, users) {
            passport.authenticate('local', function (err, user, info) {
                req.logIn(user, function(err1) {
                    if (err1) {
                        return res.json({ status: false, message: info.message});
                    } else {
                        return res.json({ status: true,message:'LoggedIn successfully', data: user });
                    }  
                });
            })(req, res, next);
        });
    });
    // send otp to new phone
    apiRouter.post('/users/get_otp', function (req, res) {
        /*var dataString = '/API/V1/6c4c22a0-109d-11e8-a895-0200cd936042/SMS/'+ req.body.phone +'/AUTOGEN';
        var options = {url: 'https://2factor.in'+dataString, method: 'POST'};
        function callback(error, response, body) {
           if (!error) {
               if (JSON.parse(body).Status == 'Success') {
                   session_id = JSON.parse(body).Details;
                   res.json({ 'status': true, 'message': 'An OTP has been sent to your phone number.'});
               }
           } else {
               console.log("bb");
               res.json({ 'status': false, 'message': 'Error while sending OTP!','error':error});
           }
        }
       request(options, callback);*/
       
      // console.log(req.body.phone)
        var dataString = '/API/V1/8e25a7de-a1f1-11e8-a895-0200cd936042/SMS/'+ req.body.phone +'/AUTOGEN';
        var options = {url: 'https://2factor.in'+dataString, method: 'POST'};
        function callback(error, response, body) {

//                         res.json({ 'status': true, 'response': response, data : body});

//                        return false;
           if (!error) {
              // console.log('res')
              // console.log(JSON.parse(body))
               if (JSON.parse(body).Status == 'Success') {
                   session_id = JSON.parse(body).Details;
                   res.json({ 'status': true, 'message': 'An OTP has been sent to your phone number.', data : body});
               }else{
                   res.json({ 'status': false, 'message': JSON.parse(body).Details,'error':JSON.parse(body)});
               }
           } else {
              // console.log('error')
               //console.log(error)
               res.json({ 'status': false, 'message': 'Error while sending OTP!','error':error});
           }
        }
       request(options, callback);
       
    })
    //verify code for reset password
    apiRouter.post('/users/verify_otp', function (req, res) {
         // user_id
         // 
         if(typeof req.body.session_id !='undefined'){
             session_id =req.body.session_id
         }
         // code
            var options = {
                url: 'https://2factor.in/API/V1/8e25a7de-a1f1-11e8-a895-0200cd936042/SMS/VERIFY/'+session_id+'/'+req.body.otp_code // 'https://api.authy.com/protected/json/phones/verification/check?api_key=2BdppFFx4ZU4301BQiEvCKy1jbX3VeMP&phone_number=' + user.phone + '&country_code=91&verification_code=' + req.body.code
            };
            function callback(error, response, body) {
                if (!error ) { 
                    if (JSON.parse(body).Status == 'Success') {
                         res.json({ 'status': true, 'message': 'Verified successfully.', user_id: req.body.id})
                    } else {
                        res.json({ 'status': false, 'message': 'You have entered invalid OTP', 'code': error , 'response': response});
                    }
                } else {
                    res.json({ 'status': false, 'message': 'You have entered invalid OTP', 'code': error , 'response': response});
                }
            }
            request(options, callback);
    })
    // Add new User
    apiRouter.post('/users', function(req, res) {
        User.findOne({'phone': req.body.phone },function(err,user){
            if(user){
                res.json({'status':false,'message':"Phone number already registered with us."}); 
            }else{
                User.register(new User({
                    title:req.body.title,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    phone : req.body.phone,
                    dob : req.body.dob,
                    location : req.body.location,
                    email : req.body.email,
                    //loc : { type: "Point", coordinates: [ -73.97, 40.77 ] },
                    role: req.body.role,
                    status: true
                    }), req.body.password, function(err, user) {
                        if (err) {
                            //console.error(err.message);
                            res.json({'status':false,'message': err.message});
                        } else {
//                                var test=user._id+user.name;
//                                console.log(test.substr(13, 4));
//                                user.invitecode= test.substr(13, 4);
                            user.save(function(err1) {
                                if (err1){
                                    res.send({'status':false,'message':err1});
                                }else{
                                    // Send Email to newly registerd user
                                    var toEmail = req.body.email;
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
                                template: 'new_user',
                                options:{
                                    send:true
                                },
                                message: {
                                  to: toEmail,
                                  subject:"Welcoming a newly registered member to DOST",
                                  //content:'Demo Content'
                                },
                                locals: {
                                  name: req.body.firstname,
                                  link:'http://yourshaadidost.com/'
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
                                    
                                    // Send SMS to new User
                                    var dataString = '/API/V1/52b2dcc5-bbf9-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS/';
                                      var options = {
                                          url: 'https://2factor.in'+dataString,
                                          method: 'POST',
                                          body:{
                                              From:'DOSTPV',
                                              To:req.body.phone,
                                              TemplateName:'Welcoming a newly registered member to DOST',
                                              VAR1:req.body.firstname,
                                              VAR2: 'http://yourshaadidost.com/', // Home Page Link
                                          },
                                          json: true
                                      };
                                      request(options, function (error, response, body) {
                                          if (error) throw new Error(error);

                                          console.log(body);
                                      });
                                    res.json({'status':true,'message':"You have successfully registered.",'data':user});
                                }
                           });
                        }
                    }
                )
            }
        });
    });
    // send otp to existing phone
    apiRouter.post('/users/get_otp_existing_phone', function (req, res) {
       // console.log(req.body)
        User.findOne({ 'phone': req.body.phone }, function (err, sanitizedUser) {
            if(!err){
                if(sanitizedUser){
                   // console.log(sanitizedUser)
                    var dataString = '/API/V1/8e25a7de-a1f1-11e8-a895-0200cd936042/SMS/'+ req.body.phone +'/AUTOGEN';
                    var options = {url: 'https://2factor.in'+dataString, method: 'POST'};
                    function callback(error, response, body) {
                        if(JSON.parse(response.body).Status=='Error'){
                            res.json({ 'status': false, 'message': JSON.parse(response.body).Details,'error':JSON.parse(response.body).Details});
                        }else{
                            if (!error) {
                                if (JSON.parse(body).Status == 'Success') {
                                    session_id = JSON.parse(body).Details;
                                    res.json({ 'status': true, 'message': 'An OTP has been sent to your phone number.', data : sanitizedUser,session_id:session_id});
                                }
                            } else {
                                res.json({ 'status': false, 'message': 'Error while sending OTP!','error':error});
                            }
                        }
                        //console.log(error)
                       // console.log(JSON.parse(response.body))
//                        console.log(body)
                        
//                         res.json({ 'status': true, 'response': response, data : body});
                          
//                        return false;
                       
                    }
                   request(options, callback);
                } else {
                    res.json({status : false, message : "Phone number is not registered with us."})
                }
            }
        })
    });
    // update password after validating with otp
    apiRouter.post('/users/resetpassword', function (req, res) {
//        console.log(req.body)
        //      User.findOne({'_id': req.body.id}, function(err, sanitizedUser) {  
        User.findOne({ 'phone': req.body.phone }, function (err, sanitizedUser) {
            // console.log(sanitizedUser);
            if (sanitizedUser) {
                sanitizedUser.setPassword(req.body.password, function () {
                    var result = sanitizedUser.save();
                   // console.log(result)
                    if(result){
                        res.send({ 'status': true, message: 'Password has been updated successfully!' });
                    }else{
                        res.send({ 'status': false, message: 'Password has been updated successfully!' });
                    }
                    
                });
            } else {
                res.send({ 'status': false, message: 'User does not exist' });
            }
        });
    });
    // Find user by id
    apiRouter.post('/users/findById',function(req,res){
         User.findById(req.body.id,function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Removed successfully!', data: data});
            }
        })
    })
    // edit a user
    apiRouter.post('/users/updateById', function(req, res){
        User.findById(req.body._id,function(err,servicedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                User.findOne({_id:{$ne:req.body._id},phone: req.body.phone},function(err2,data){
                    if(err2){
                        res.json({'status':false,'message':err2});
                    }else{
                        if(data){
                            res.json({'status':false,'message':'User with this phone already exists!'});
                        }else{
                            
                            servicedata.title=req.body.title;
                            servicedata.firstname= req.body.firstname;
                            servicedata.lastname= req.body.lastname;
                            servicedata.phone = req.body.phone;
                            servicedata.dob = req.body.dob;
                            servicedata.location = req.body.location;
                            servicedata.email = req.body.email;
                            servicedata.image = req.body.image;
                            servicedata.role= req.body.role;
                            servicedata.status= req.body.status;
                            servicedata.save(function(err1) {
                                if (err1){
                                    res.json({'status':false,'message':'Unable to save data. Please try again later',error:err1});
                                }else{
                                    res.json({'status':true,'message':'User updated!',data:servicedata});
                                }
                            })
                        }
                    }
                })
            }
        })
    });
    /*
     * Remove VendorType based on id
     */
    apiRouter.delete('/users/removebyId/:id', function(req, res) {
        User.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing user.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
    /*
     * Send contact email
     */
    apiRouter.post('/users/contact',function(req,res){
        // Send Email 
                var toEmail = 'dostindia@spectrainvestmentgroup.com'; //dostindia@spectrainvestmentgroup.com
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
                    template: 'contact',
                        options: {
                            send: true
                        },
                        message: {
                            to: toEmail,
                            subject: 'DOST: Contact',
                                //content:'Demo Content'
                        },
                        locals: {
                        name: req.body.name,
                        phone:req.body.phone,
                        email:req.body.email,
                        city:req.body.city,
                        message:req.body.message
                        }
                    }).then(function (response) {
                        transporter.sendMail(response.originalMessage, function (error, info) {
                            if (error) {
                                //console.log(error)
                                res.json({ status: false, message: 'Error while sending email.', err: error });
                            } else {
                                    //console.log(info)
                                    res.json({ status: true, message: 'Email sent successfully.', info: info });
                            }
                        })
                    })
                    .catch(function (erroroccured) {
                        //console.log(console.error)
                            res.json({ status: false, message: 'Unable to send email', error: erroroccured })
                    })
                }
    })
    /*
     * Upload user image from app
     */
     
    apiRouter.post('/users/upload_user_image_app', function(req, res) {
        if (req.body.user_id == null) {
            res.json({'message': "No user available", 'status': false});
            return false;
        }
        var user_id = req.body.user_id;
        var pic = req.body.image;
        buflic = new Buffer(pic.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        
        var data = {
            Body: buflic,
            ContentEncoding: 'base64',
            ContentType: 'image/png'
        };
        var dateNow = Date.now()
        var randomInteger = dateNow + '_' +  Math.floor((Math.random() * 1000000) + 1) + '.png';

        var base64img = new aws.S3({
            endpoint: 'https://s3.eu-central-1.amazonaws.com',
            region: 'us-east-1',
            signatureVersion: 'v4',
            ACL: 'public-read',
            ContentType: "image/png",
            ContentEncoding: "base64",
            params: {
                Bucket: 'dostbucket',
                Key: 'users/' + randomInteger 
            }
        });

        base64img.putObject(data, function(err, data) {
            var pro_pic = "https://dostbucket.s3.us-east-2.amazonaws.com/users/" + randomInteger;
            if (err) {
                    res.json({'message': "Upload Error", 'status': false, 'message': err.message});
                    return false;
            }else{
                User.findById(user_id, function(error, user) {
                    user.image = pro_pic;
                    if (error) {
                        res.json({'message': "Upload Error", 'status': false, 'message': error.message});
                        return false;
                    }
                    user.save(function(err) {
                        res.json({'message': "Profile image updated.", 'status': true, 'data': user});
                    });
                })
            }
        });
    });
    /*
     * Send Message to another user's Phone
     * 2Factor: Open Template API
     */
    apiRouter.post('/users/sendMsgToPhn',function(req,res){
        User.findById(req.body.vendor_id,function(err,userdata){
            if(err){
                //User Not Found
                res.json({'status':false,'message':"Vendor details not found"});
            }else{
                // Send SMS to User
                 var dataString = '/API/V1/52b2dcc5-bbf9-11e8-a895-0200cd936042/ADDON_SERVICES/SEND/TSMS/';
                   var options = {
                       url: 'https://2factor.in'+dataString,
                       method: 'POST',
                       body:{
                            From:'DOSTPV',
                            To:userdata.phone,
                            TemplateName:'Open Msg',
                            VAR1:req.body.message,
                            VAR2: req.body.job_link, 
                       },
                       json: true
                   };
                   request(options, function (error, response, body) {
                       if (error){
                           console.log('error');
                           throw new Error(error);
                       }
                       /*if(JSON.parse(response.body).Status=='Error'){
                            res.json({ 'status': false, 'message': JSON.parse(response.body).Details,'error':JSON.parse(response.body).Details});
                        }else{
                            if (!error) {
                                if (JSON.parse(body).Status == 'Success') {
                                    res.json({'status':true,'message':"Message sent successfully."});
                                }
                            } else {
                                throw new Error(error);
                               // res.json({ 'status': false, 'message': 'Error while sending OTP!','error':error});
                            }
                        }*/
                       console.log('body'+typeof body)
                       console.log(body);
                       if(body.Status=='Error'){
                           res.json({'status':false,'message':body.Details});
                       }else{
                           res.json({'status':true,'message':"Message sent successfully."});
                       }
                       
                   });
                 
            }
        })
       
                                
    })
};