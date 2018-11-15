var Service = require('../models/service');

module.exports = function(apiRouter,serviceupload) {
    
     // add a vendortype
    apiRouter.post('/services/add', function(req, res){
        var post = new Service();
        post.title = req.body.title;
        post.vendortype_id = req.body.vendortype_id;
        if(req.body.image){
            post.image = req.body.image;
        }
       
        Service.find({'title':post.title},function(error,post_value){
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

     // upload image to bucket
     apiRouter.post('/services/upload',serviceupload.array('file',3), function(req, res, next) {
        res.send(req.files[0]);
    });

    // get all services
    apiRouter.get('/services', function(req, res){
        // Service.find({}, function(err, posts){
        //     if (err) {
        //         res.json({status:false, message:'Unable to get data!', err: err})
        //     }else{
        //         res.json({status:true, data: posts});
        //     }
                
        // });
        Service.aggregate([ 
            {
                "$lookup":{
                    "from":"vendortypes",
                    "localField": "vendortype_id",
                    "foreignField": "_id",
                    "as": "vendortype_detail" 
                }
            },
            {   "$unwind": {
                    "path":"$vendortype_detail", "preserveNullAndEmptyArrays":true 
                }
            },
        ],function(err,posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
        })
        });
    /*
     * Remove VendorType based on id
     */
    apiRouter.delete('/services/removebyId/:id', function(req, res) {
        Service.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing service.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
    // Find VendorType by id
    apiRouter.post('/services/findById',function(req,res){
         Service.findById(req.body.id,function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Removed successfully!', data: data});
            }
        })
    })
    // edit a vendortype
    apiRouter.post('/services/updateById', function(req, res){
        Service.findById(req.body._id,function(err,servicedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Service.findOne({_id:{$ne:req.body._id},title: req.body.title},function(err2,data){
                    if(err2){
                        res.json({'status':false,'message':err2});
                    }else{
                        if(data){
                            res.json({'status':false,'message':'Service with this name already exists!'});
                        }else{
                            servicedata.title = req.body.title;
                            servicedata.image = req.body.image;
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
    apiRouter.post('/services/findByVendorType',function(req,res){
         Service.find({vendortype_id:req.body.vendortype_id},function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Data fetched successfully!', data: data});
            }
        })
    })
}