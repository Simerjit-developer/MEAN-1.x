var Field = require('../models/field');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(apiRouter,eventupload) {
    
     // add an field
    apiRouter.post('/fields/add', function(req, res){
        var post = new Field();
        post.vendortype_id = req.body.vendortype_id;
        post.service_id = req.body.service_id;
        Object.keys(req.body.fields).map(function(objectKey, index) {
            var value = req.body.fields[objectKey];
            post.fields.push(value)
            if(req.body.fields[objectKey].child && Object.keys(req.body.fields[objectKey].child).length>0){
               // console.log('length'+Object.keys(req.body.fields[objectKey].child).length)
                Object.keys(req.body.fields[objectKey].child).map(function(childobjectKey, childindex) {
                   // console.log(childindex)
                    var childvalue = req.body.fields[objectKey].child[childobjectKey];
                    if(typeof childvalue.title !='undefined'){
                        post.fields[objectKey].child.push(childvalue)
                    }
                })
            }
            
        });
        post.status = req.body.status;
        post.save(function(err, post){
            if(err){ 
                res.json({status:false,message:"Error while saving",err:err});
            }else{
                res.json({status:true,message:'Saved successfully!'});
            }
        })   
    });
    // get all events
    apiRouter.get('/fields', function(req, res){
        Field.find({}, function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
                
        });
    });
    /*
     * Remove event based on id
     */
    apiRouter.delete('/fields/removebyId/:id', function(req, res) {
        Field.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing field.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
    // Find fields by id
    apiRouter.post('/fields/findById',function(req,res){
         Field.findById(req.body.id,function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: data});
            }
        })
    })
    // Find fields by id
    apiRouter.post('/fields/findByVendortype',function(req,res){
        var conditions={};
        if(req.body.vendortype_id){
            conditions.vendortype_id=ObjectId(req.body.vendortype_id)
        }
        if(req.body.service_id){
            conditions.service_id=ObjectId(req.body.service_id)
        }
        
        Field.find(conditions,function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: data[0]});
            }
        })
    })
    // edit an event
    apiRouter.post('/fields/updateById', function(req, res){
        Field.findById(req.body._id,function(err,servicedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                servicedata.vendortype_id = req.body.vendortype_id;
                servicedata.service_id = req.body.service_id;
                Object.keys(req.body.fields).map(function(objectKey, index) {
                    var value = req.body.fields[objectKey];
                    servicedata.fields.push(value)
                });
                servicedata.status = req.body.status;
                servicedata.save(function(err1) {
                    if (err1){
                        res.json({'status':false,'message':'Unable to save data. Please try again later',error:err1});
                    }else{
                        res.json({'status':true,'message':'Field updated!'});
                    }
                })
            }
        })
    });
    // update status Verified -> Unverified / Unverfified -> Verified
    apiRouter.post('/fields/updateStatus', function(req, res){
        Field.findById(req.body._id,function(err,businessdata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                Field.update({_id:req.body.id},{$set:{"status":req.body.status}},function(err1,data1){
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
    apiRouter.post('/fields/findByStatus',function(req,res){
         Field.find({status:req.body.status},function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Fetched successfully!', data: data});
            }
        })
    })
}