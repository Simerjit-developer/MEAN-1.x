var Highlight = require('../models/highlight');

module.exports = function(apiRouter) {
    
     // add a vendortype
    apiRouter.post('/highlights/add', function(req, res){
        var post = new Highlight();
        post.title = req.body.title;
        post.vendortype_id = req.body.vendortype_id;
        Highlight.find({'title':post.title},function(error,post_value){
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
    apiRouter.get('/highlights', function(req, res){
        Highlight.find({}, function(err, posts){
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
    apiRouter.delete('/highlights/removebyId/:id', function(req, res) {
        Highlight.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing service.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
    // Find VendorType by id
    apiRouter.post('/highlights/findById',function(req,res){
         Highlight.findById(req.body.id,function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Removed successfully!', data: data});
            }
        })
    })
    // edit a vendortype
    apiRouter.post('/highlights/updateById', function(req, res){
        Highlight.findById(req.body._id,function(err,servicedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Highlight.findOne({_id:{$ne:req.body._id},title: req.body.title},function(err2,data){
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
    apiRouter.post('/highlights/findByVendorType',function(req,res){
         Highlight.find({vendortype_id:req.body.vendortype_id},function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Data fetched successfully!', data: data});
            }
        })
    })
}