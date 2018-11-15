var Guest = require('../models/guest');
var mongoose = require('mongoose');
var ObjectID = require("mongoskin").ObjectID;
var multiparty = require("multiparty");
var xlsxj = require("xlsx-to-json");
var ObjectId = mongoose.Types.ObjectId;
var User = require('../models/user');
var EmailTemplate = require('email-templates');
var Invitation = require('../models/invitation');
var Project = require('../models/project');
var request = require('request');
//var csv = require('fast-csv');

module.exports = function (apiRouter, transporter) {

        // add a vendortype
    apiRouter.post('/guests/add', function(req, res){
        var post = new Guest();
        post.project_id = req.body.project_id;
        post.posted_by = req.body.posted_by;
        post.posted_by_label = req.body.posted_by_label;
        post.name = req.body.name;
        post.email = req.body.email;
        post.phone = req.body.phone;
        post.location = req.body.location;
        post.group = req.body.group;
        post.from = req.body.from;
        post.status = req.body.status;
        Guest.find({ 'phone': post.phone, 'project_id': ObjectId(post.project_id) }, function (error, post_value) {
            if (error) {
                return res.send(error)
            } else {
                if (post_value.length > 0) {
                    res.json({ status: false, message: 'Guest already exist! Please try another one!' });
                } else {
                    post.save(function (err, post) {
                        if (err) { res.send(err); } else {
                            res.json({ status: true, message: 'Saved successfully!',data:post });
                        }
                    })
                }

            }
        })
    });
    // Add multiple Guests
    apiRouter.post('/guests/addMany', function(req, res){
        for(var i=0;i<req.body.contacts.length;i++){
            var post = new Guest();
            post.project_id = req.body.contacts[i].project_id;
            post.posted_by = req.body.contacts[i].posted_by;
            post.posted_by_label = req.body.contacts[i].posted_by_label;
            post.name = req.body.contacts[i].name;
            post.email = req.body.contacts[i].email;
            post.phone = req.body.contacts[i].phone;
            post.location = req.body.contacts[i].location;
            post.group = req.body.contacts[i].group;
            post.from = req.body.contacts[i].from;
            post.status = req.body.contacts[i].status;
            Guest.find({ 'phone': post.phone, 'project_id': ObjectId(post.project_id) }, function (error, post_value) {
                if (error) {
                    return res.send(error)
                } else {
                    if (post_value.length > 0) {
                        if(req.body.contacts.length==i){
                            res.json({ status: true, message: 'Few Guests already exists!' });
                        }
                        //res.json({ status: false, message: 'Guest already exist! Please try another one!' });
                    } else {
                        post.save(function (err, post) {
                            if (err) { res.send(err); } else {
                                if(req.body.contacts.length==i){
                                    res.json({ status: true, message: 'Saved successfully!' });
                                }
                            }
                        })
                    }

                }
            })
        }
    });
    // get all vendortypes
    apiRouter.get('/guests', function (req, res) {
        Guest.find({}, function (err, posts) {
            if (err) {
                res.json({ status: false, message: 'Unable to get data!', err: err })
            } else {
                res.json({ status: true, data: posts });
            }
        });
    });
    
/*
 * Remove VendorType based on id
 */
apiRouter.delete('/guests/removebyId/:id', function(req, res) {
    Guest.findByIdAndRemove(req.params.id, function(err, todo) {
        if (err) {
            res.send({status: false, message: 'Error while removing Group.', error: err});
        } else {
            res.json({status: true, message: 'Removed successfully!', data: todo});
        }
    })
});
// Find Guest by id
apiRouter.post('/guests/findById', function(req, res){
    Guest.findById(req.body.id, function(err, data){
        if (err){
            res.json({status: false, message: 'Unable to fetch data!', error: err});
        } else{
            res.json({status: true, message: 'Removed successfully!', data: data});
        }
    })
})
// edit a vendortype
apiRouter.post('/guests/updateById', function(req, res){
    Guest.findById(req.body._id, function(err, vendortypedata){
        if (err){
            res.json({status: false, message: 'Unable to fetch data!', error: err});
        } else{
            Guest.findOne({_id:{$ne:req.body._id}, phone: req.body.phone,project_id:req.body.project_id}, function(err2, data){
                if (err2){
                    res.json({'status':false, 'message':err2});
                } else{
                    if (data){
                        console.log(data)
                        res.json({'status':false, 'message':'Guest with this phone already exists!'});
                    } else{
                        vendortypedata.email = req.body.email;
                        vendortypedata.location = req.body.location;
                        vendortypedata.name = req.body.name;
                        vendortypedata.phone = req.body.phone;
                        vendortypedata.save(function(err1,data1) {
                            if (err1){
                                res.json({'status':false, 'message':'Unable to save data. Please try again later', error:err1});
                            } else{
                                res.json({'status':true, 'message':'Guest updated!','data1':data1});
                            }
                        })
                    }
                }
            })
        }
    })
});
/*
 * Remove multiple users at same time
 */
apiRouter.post('/guests/removeMultiple', function(req, res){
    Guest.deleteMany({_id:{$in:req.body.removeArray}}, function(err, data){
        if (err){
            res.json({'status':false, 'message':err});
        } else{
            res.json({'status':true, 'message':'Removed Successfully'});
        }
    })
})
/*
 * Find Guests by project_id
 */
apiRouter.post('/guests/findByProjectId', function(req, res){
    Guest.aggregate([
        {"$match":{"project_id":ObjectId(req.body.project_id)}},
        {
            "$lookup":{
            "from": "users", //name of the foreign collection not model or schema name
                    "localField": "phone",
                    "foreignField": "phone",
                    "as": "detail"
            }
        },
        {
            "$project": {
                "from":1,
                "project_id":1,
                "posted_by_label":1,
                "posted_by":1,
                "name":1,
                "phone":1,
                "email":1,
                "location":1,
                "group":1,
                "detail._id": 1,
                "detail.phone": 1
            }
        }
    ], function(err, data){
        if (err){
            res.json({status:false, message:err});
        } else{
            res.json({status:true, message:"Fetched Successfully", data:data})
        }
    });
})

//csv upload
apiRouter.post("/guests/UploadCsv", function (req, res) {
var form = new multiparty.Form();
        form.parse(req, function (err, fields, files) {
        var ProjectId = fields.ProjectId[0];
                var PostedBy = fields.PostedBy[0];
                var PostedByLabel = fields.PostedByLabel[0];
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
                Guest.find({ phone: item.phone, project_id: ObjectID.createFromHexString(ProjectId) }, function (err, asyncres) {
                if (err) {
                console.log(err);
                } else {
                if (asyncres.length == 0) {
                //console.log(item);
                var itemdata = {
                from: item.from,
                        project_id: ObjectID.createFromHexString(ProjectId),
                        posted_by: ObjectID.createFromHexString(PostedBy),
                        posted_by_label: PostedByLabel,
                        name: item.name,
                        email: item.email,
                        phone: item.phone,
                        location: item.location,
                        group: item.group,
                }
                Guest.create(itemdata, function (err, docs) {
                if (err) {
                console.log(err);
                } else {
                console.log("INSERTED");
                }
                });
                } else {
                var query = { phone: item.phone, project_id: ObjectID.createFromHexString(ProjectId) };
                        var newvalues = {
                        $set: {
                            posted_by: ObjectID.createFromHexString(PostedBy),
                            name: item.name,
                            email: item.email,
                            group: item.group,
                            phone: item.phone,
                            from: item.from,
                            location: item.location

                        }
                        };
                        Guest.updateOne(query, newvalues, function (err, resposs) {
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
//fetch guests lists 
apiRouter.post("/guests/findguestsbyProjectId", function (req, res) {
//console.log(req.body);
var event_id = req.body.event_id;
        var query_data = {
            from: req.body.from,
                group: req.body.group,
                project_id: ObjectId(req.body.id)
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
        {
        "$addFields": {
        "invited": {
        "$arrayElemAt": [
        {
        "$filter": {
        "input": "$invited",
                "as": "invite",
                "cond": {
                "$and":
                [
                {
                "$eq": [ "$$invite.project_id", "$project_id" ]
                },
                {
                "$eq": [ "$$invite.invitation_to", "$_id" ]
                }
                ]


                }
        }
        }, 0
        ]
        }
        }
        }

        ], function (err, data) {
        if (err) {
        res.json({ status: false, message: err });
        } else {
        Project.find({ "_id": ObjectId(req.body.id) }, function (err, event_data) {
        if (err) {
        res.json({ status: false, message: 'Unable to fetch data!', error: err });
        } else {
        res.json({ status: true, message: "Fetched Successfully", data: data, event_data: event_data });
        }
        })
        }
        });
});


// Guest Added by me
apiRouter.post('/guests/addedByMe', function(req, res){
Guest.find({project_id:ObjectID(req.body.project_id), posted_by:ObjectID(req.body.user_id)}, function(error, data){
if (error){
res.json({status:false, message:"Unable to fetch", err:error})
} else{
res.json({status:true, message:"Fetched Successfully", data:data})
}
})
})

}