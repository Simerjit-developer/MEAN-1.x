var City = require('../models/city');
var multiparty = require("multiparty");
var xlsxj = require("xlsx-to-json");

module.exports = function(apiRouter) {
    
     // add a vendortype
    apiRouter.post('/cities/add', function(req, res){
        var post = new City();
        post.name = req.body.name;
        City.find({'title':post.name},function(error,post_value){
            if(error){
                return res.send(error)
            }else{
                if(post_value.length >0){
                    res.json({status:false,message:'City already exist! Please try another one!'});
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
    apiRouter.get('/cities', function(req, res){
        City.find({}, function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
                
        }).sort([['order',1]]);
    });
    /*
     * Remove VendorType based on id
     */
    apiRouter.delete('/cities/removebyId/:id', function(req, res) {
        City.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing vendortype.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
    // Find VendorType by id
    apiRouter.post('/cities/findById',function(req,res){
         City.findById(req.body.id,function(err,data){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                res.json({status: true, message: 'Removed successfully!', data: data});
            }
        })
    })
    // edit a vendortype
    apiRouter.post('/cities/updateById', function(req, res){
        City.findById(req.body._id,function(err,vendortypedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                City.findOne({_id:{$ne:req.body._id},name: req.body.name},function(err2,data){
                    if(err2){
                        res.json({'status':false,'message':err2});
                    }else{
                        if(data){
                            res.json({'status':false,'message':'City with this name already exists!'});
                        }else{
                            vendortypedata.name = req.body.name;
                            vendortypedata.save(function(err1) {
                                if (err1){
                                    res.json({'status':false,'message':'Unable to save data. Please try again later',error:err1});
                                }else{
                                    res.json({'status':true,'message':'City updated!'});
                                }
                            })
                        }
                    }
                })
            }
        })
    });
    
    //csv upload
apiRouter.post("/cities/UploadCsv", function (req, res) {
var form = new multiparty.Form();
        form.parse(req, function (err, fields, files) {
                //console.log(ProjectId);
                // console.log( mongoose.Types.ObjectId(PostedBy));
                xlsxj({
                    input: files.file[0].path,
                    output: "output.json",
                        //lowerCaseHeaders:true //converts excel header rows into lowercase as json keys
                }, function (err, result) {
                    if (err) {
                        console.error(err);
                    } else {
                        result.forEach(function (item, key) {
                           // console.log(item); //return false;
                            City.find({ name: item.name }, function (err, asyncres) {
                                if (err) {
                                    console.log(err);
                                } else {
                                if (asyncres.length == 0) {
                                //console.log(item);
                                    var itemdata = {
                                        order:item.order,
                                        name: item.name,
                                    }
                                    City.create(itemdata, function (err, docs) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log("INSERTED");
                                        }
                            });
                } else {
                var query = { name: item.name };
                        var newvalues = {
                        $set: {
                            order:item.order,
                            name: item.name,
                        }
                        };
                        City.updateOne(query, newvalues, function (err, resposs) {
                        if (err) {
                        console.log(err);
                        } else {
                        console.log("UPDATED");
                        }
                        });
                }

                if (result.length - 1 == key) {
                res.json({
                message: "Multiple documents inserted to Collectionss!!",
                        status: true,
                });
                }
                }
                });
                });
                }
                });
        });
});
}