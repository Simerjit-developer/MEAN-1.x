var VendorType = require('../models/vendortype');

module.exports = function(apiRouter,vendortypeupload) {
    // upload image to bucket
    apiRouter.post('/vendortypes/upload',vendortypeupload.array('file',3), function(req, res, next) {
         res.send(req.files[0]);
     });
     
     // add a vendortype
    apiRouter.post('/vendortypes/add', function(req, res){
        var post = new VendorType();
        post.title = req.body.title;
        post.image = req.body.image;
        VendorType.find({'title':post.title},function(error,post_value){
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
    // get all vendortypes
    apiRouter.get('/vendortypes', function(req, res){
        VendorType.find({}, function(err, posts){
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
    apiRouter.delete('/vendortypes/removebyId/:id', function(req, res) {
        VendorType.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing vendortype.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
    // Find VendorType by id
    apiRouter.post('/vendortypes/findById',function(req,res){
         VendorType.findById(req.body.id,function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Removed successfully!', data: data});
            }
        })
    })
    // edit a vendortype
    apiRouter.post('/vendortypes/updateById', function(req, res){
        VendorType.findById(req.body._id,function(err,vendortypedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                VendorType.findOne({_id:{$ne:req.body._id},title: req.body.title},function(err2,data){
                    if(err2){
                        res.json({'status':false,'message':err2});
                    }else{
                        if(data){
                            res.json({'status':false,'message':'Vendor Type with this name already exists!'});
                        }else{
                            vendortypedata.title = req.body.title;
                            vendortypedata.image = req.body.image;
                            vendortypedata.save(function(err1) {
                                if (err1){
                                    res.json({'status':false,'message':'Unable to save data. Please try again later',error:err1});
                                }else{
                                    res.json({'status':true,'message':'VendorType updated!'});
                                }
                            })
                        }
                    }
                })
            }
        })
    });
    /*
     * Get VendorTypes along with Services
     */
    
    apiRouter.get('/vendortypes/vendortypesWithServices', function(req, res){
        VendorType.aggregate([
            {
                "$lookup":{
                    "from":"services",
                    "localField":"_id",
                    "foreignField":"vendortype_id",
                    "as":'allServices'
                }
            }   
        ],function(err,posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
        })
    });
}