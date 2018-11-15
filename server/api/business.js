var Business = require('../models/business');

module.exports = function(apiRouter) {
    
     // add a business
    apiRouter.post('/business/add', function(req, res){
        var post = new Business();
        post.user_id = req.body.user_id;
        post.vendortype_id = req.body.vendortype_id;
        post.company_name = req.body.company_name;
        post.established_in = req.body.established_in;
        post.company_phone = req.body.company_phone;
        post.starting_price = req.body.starting_price;
        post.services = req.body.services;
        post.highlights = req.body.highlights;
        post.primary_email = req.body.primary_email;
        post.address = req.body.address;
        post.city = req.body.city;
        post.state = req.body.state;
        post.country = req.body.country;
        post.pincode = req.body.pincode;
        post.award = req.body.award;
        
        Business.find({'company_name':post.company_name},function(error,post_value){
            if(error){
                return res.send(error)
            }else{
                if(post_value.length >0){
                    res.json({status:false,message:'Title already used! Please try another one!'});
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
    // get all businesses
    apiRouter.get('/business', function(req, res){
        Business.find({}, function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
                
        });
    });
    /*
     * Remove VendorType based on id
     */
    apiRouter.delete('/business/removebyId/:id', function(req, res) {
        Business.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing service.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
    // Find Business by id
    apiRouter.post('/business/findById',function(req,res){
         Business.findById(req.body.id,function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Removed successfully!', data: data});
            }
        })
    })
    // edit a business
    apiRouter.post('/business/updateById', function(req, res){
        Business.findById(req.body._id,function(err,servicedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Business.findOne({_id:{$ne:req.body._id},title: req.body.title},function(err2,data){
                    if(err2){
                        res.json({'status':false,'message':err2});
                    }else{
                        if(data){
                            res.json({'status':false,'message':'Service with this name already exists!'});
                        }else{
                            servicedata.user_id = req.body.user_id;
                            servicedata.vendortype_id = req.body.vendortype_id;
                            servicedata.company_name = req.body.company_name;
                            servicedata.established_in = req.body.established_in;
                            servicedata.company_phone = req.body.company_phone;
                            servicedata.starting_price = req.body.starting_price;
                            servicedata.services = req.body.services;
                            servicedata.highlights = req.body.highlights;
                            servicedata.primary_email = req.body.primary_email;
                            servicedata.address = req.body.address;
                            servicedata.city = req.body.city;
                            servicedata.state = req.body.state;
                            servicedata.country = req.body.country;
                            servicedata.pincode = req.body.pincode;
                            servicedata.award = req.body.award;
                            servicedata.save(function(err1) {
                                if (err1){
                                    res.json({'status':false,'message':'Unable to save data. Please try again later',error:err1});
                                }else{
                                    res.json({'status':true,'message':'Service updated!'});
                                }
                            })
                        }
                    }
                })
            }
        })
    });
    // Find by vendor type ID @params: vendortype_id
    apiRouter.post('/business/findByVendorType',function(req,res){
         Business.find({vendortype_id:req.body.vendortype_id},function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Data fetched successfully!', data: data});
            }
        })
    })
    // update status Verified -> Unverified / Unverfified -> Verified
    apiRouter.post('/business/updateStatus', function(req, res){
        Business.findById(req.body._id,function(err,businessdata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Business.update({_id:req.body.id},{$set:{"status":req.body.status}},function(err1,data1){
                    if(err1){
                        res.json({status: false, message: 'Unable to update data!', error: err1});
                    }else{
                        res.json({status: true, message: 'Data updated successfully!'});
                    }
                })
            }
        })
    })
    // Find Business by status i.e. status ==true/false
    apiRouter.post('/business/findByStatus',function(req,res){
         Business.find({status:req.body.status},function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: data});
            }
        })
    })
    /*
     * Filter API
     * @params : vendortype_id
     */
    apiRouter.post('/business/filter',function(req,res){
         Business.find(req.body,function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: data});
            }
        })
    })
}