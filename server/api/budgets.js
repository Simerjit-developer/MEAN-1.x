var Budget = require('../models/budget');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var perPage = 5;
module.exports = function (apiRouter, invoicesupload) {

    // add a entry
    apiRouter.post('/budgets/add', function (req, res) {
        var post = new Budget();
        post.project_id = req.body.project_id;
        post.user_id = req.body.user_id;
        post.item = req.body.item;
        post.due_date = req.body.due_date;
        post.cost = req.body.cost;
        post.event_id = req.body.event_id;
        post.invoice = req.body.invoice;
        post.service_id = req.body.service_id;
        post.save(function (err, post) {
            if (err) {
                res.send({ status: false, message: err.message, err: err });
            } else {
                res.json({ status: true, message: 'Saved successfully!', data: post });
            }
        })

    });


    // get all events based records of a project
    apiRouter.post('/budgets/findByProjectId', function (req, res) {
        var page = req.body.page;
            perPage = parseInt(req.body.perPage)
        var query = [
            { "$match": { "project_id": ObjectId(req.body.project_id) } },
            {
                "$lookup": {
                    "from": "users", // name of the foreign collection 
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "added_by"
                }
            },
            { $unwind: { path: '$added_by', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "services", // name of the foreign collection 
                    "localField": "service_id",
                    "foreignField": "_id",
                    "as": "service_details"
                }
            },
            { $unwind: { path: '$service_details', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "vendortypes", // name of the foreign collection 
                    "localField": "service_details.vendortype_id",
                    "foreignField": "_id",
                    "as": "vendortype_details"
                }
            },
            { $unwind: { path: '$vendortype_details', preserveNullAndEmptyArrays: true } },

            {
                "$lookup": {
                    "from": "projects", // name of the foreign collection 
                    "localField": "project_id",
                    "foreignField": "_id",
                    "as": "project_details"
                }
            },
            { $unwind: { path: '$project_details' } },

            { $unwind: { path: '$project_details.events' } },
            {
                $redact: {
                    $cond: [{
                        $ne: ["$project_details.events._id", "$event_id"]
                    },
                        "$$PRUNE",
                        "$$KEEP"
                    ]
                }
            },
            {
                $project:
                {
                    "added_by.firstname": 1,
                    "added_by.lastname": 1,
                    "added_by._id": 1,
                    "project_details.events._id": 1,
                    "project_details.events.name": 1,
                    "service_details": 1,
                    "vendortype_details": 1,
                    "_id": 1,
                    "event_id": 1,
                    "project_id": 1,
                    "invoice" : 1,
                    // https://dostbucket.s3.us-east-2.amazonaws.com/invoices/1541153703522sample.pdf
                    "item": 1,
                    "cost": 1,
                    "due_date": 1,
                    "service_id": 1,
                    "user_id": 1,
                    "pages" : 1,
                    'created_at': 1,
                    'updated_at': 1,
                   
                }
        }];
        var count_query = [
            { "$match": { "project_id": ObjectId(req.body.project_id) } },
            { "$count":  "count" },
        ]

        Budget.aggregate(query).skip((perPage * page) - perPage).limit(perPage).exec(function (err, data) {
            if (err) {
                res.json({ status: false, message: 'Unable to fetch data!', error: err });
            } else {
                Budget.aggregate(count_query).exec(function (err, all_docs) { 
                    res.json({'count': Math.ceil(all_docs[0].count / perPage),'current':page, status: true, message: 'Fetched successfully!', data: data });
                })
            }
        })
    });



    // get records by event or service
    apiRouter.post('/budgets/findByEvent_or_service', function (req, res) {
        var match = {};
        var page = req.body.page;
            perPage = parseInt(req.body.perPage)
        if (req.body.service_id) {
            match = {
                "$match": {
                    "service_id": ObjectId(req.body.service_id),
                    "event_id": ObjectId(req.body.event_id),
                    "project_id": ObjectId(req.body.project_id)
                }
            }
        } else {
            match = {
                "$match": {
                    "event_id": ObjectId(req.body.event_id),
                    "project_id": ObjectId(req.body.project_id)
                }
            }
        }

        Budget.aggregate([match,
            {
                "$lookup": {
                    "from": "users", // name of the foreign collection 
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "added_by"
                }
            },
            { $unwind: { path: '$added_by', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "services", // name of the foreign collection 
                    "localField": "service_id",
                    "foreignField": "_id",
                    "as": "service_details"
                }
            },
            { $unwind: { path: '$service_details', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "vendortypes", // name of the foreign collection 
                    "localField": "service_details.vendortype_id",
                    "foreignField": "_id",
                    "as": "vendortype_details"
                }
            },
            { $unwind: { path: '$vendortype_details', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "projects", // name of the foreign collection 
                    "localField": "project_id",
                    "foreignField": "_id",
                    "as": "project_details"
                }
            },
            { $unwind: { path: '$project_details' } },

            { $unwind: { path: '$project_details.events' } },
            {
                $redact: {
                    $cond: [{
                        $ne: ["$project_details.events._id", "$event_id"]
                    },
                        "$$PRUNE",
                        "$$KEEP"
                    ]
                }
            },
            {
                $project:
                {
                    "added_by.firstname": 1,
                    "added_by.lastname": 1,
                    "added_by._id": 1,
                    "project_details.events._id": 1,
                    "project_details.events.name": 1,
                    "service_details": 1,
                    "vendortype_details": 1,
                    "_id": 1,
                    "event_id": 1,
                    "project_id": 1,
                    "invoice" : 1,
                    "item": 1,
                    "cost": 1,
                    "due_date": 1,
                    "service_id": 1,
                    "user_id": 1,
                    'created_at': 1,
                    'updated_at': 1
                }
            }]).skip((perPage * page) - perPage).limit(perPage).exec(function (err, data) {
                if (err) {
                    res.json({ status: false, message: 'Unable to fetch data!', error: err });
                } else {
                    res.json({ status: true, message: 'Fetched successfully!', data: data });
                }
            })
    });


    // get results by event-vendor type combination
    // 
    apiRouter.post('/budgets/findByVendor_and_Service', function (req, res) {
        var page = req.body.page;
        var query = [{
            "$match": {
                "project_id": ObjectId(req.body.project_id)
            }
        },
        {
            "$lookup": {
                "from": "livejobs", // name of the foreign collection 
                "localField": "project_id",
                "foreignField": "project_id",
                "as": "jobs"
            }
        },
        { $unwind: { path: '$jobs' } },
        {
            $redact: {
                $cond: [{
                    $ne: ["$jobs.service_id", "$service_id"]
                },
                    "$$PRUNE",
                    "$$KEEP"
                ]
            }
        },
        {
            "$lookup": {
                "from": "services", // name of the foreign collection 
                "localField": "jobs.service_id",
                "foreignField": "_id",
                "as": "service_details"
            }
        },
        { $unwind: { path: '$service_details', preserveNullAndEmptyArrays: true } },
        {
            "$lookup": {
                "from": "vendortypes", // name of the foreign collection 
                "localField": "service_details.vendortype_id",
                "foreignField": "_id",
                "as": "vendortype_details"
            }
        },
        { $unwind: { path: '$vendortype_details', preserveNullAndEmptyArrays: true } },
        {
            "$lookup": {
                "from": "proposals", // name of the foreign collection 
                "localField": "jobs._id",
                "foreignField": "job_id",
                "as": "proposal_details"
            }
        },
        { $unwind: { path: '$proposal_details' } },
        {
            $redact: {
                $cond: [{
                    $ne: ["$proposal_details.status", 5]
                },
                    "$$PRUNE",
                    "$$KEEP"
                ]
            }
        }, {
            "$lookup": {
                "from": "projects", // name of the foreign collection 
                "localField": "project_id",
                "foreignField": "_id",
                "as": "project_details"
            }
        },
        { $unwind: { path: '$project_details' } },

        { $unwind: { path: '$project_details.events' } },
        {
            $redact: {
                $cond: [{
                    $ne: ["$project_details.events._id", "$event_id"]
                },
                    "$$PRUNE",
                    "$$KEEP"
                ]
            }
        },
        {
            $project:
            {
                "service_details": 1,
                "vendortype_details": 1,
                "jobs": 1,
                "proposal_details": 1,
                "_id": 1,
                "event_id": 1,
                "project_id": 1,
                "project_details.events.name" : 1,
                "project_details.events._id" : 1,
                "invoice" : 1,
                "item": 1,
                "cost": 1,
                "due_date": 1,
                "service_id": 1,
                "user_id": 1,
                'created_at': 1,
                'updated_at': 1
            }
        }];
        var count_query = [
            { "$match": { "project_id": ObjectId(req.body.project_id) } },
            { "$count":  "count" },
        ]
       
        Budget.aggregate(query).skip((perPage * page) - perPage).limit(perPage).exec(function (err, data) {
            if (err) {
                res.json({ status: false, message: 'Unable to fetch data!', error: err });
            } else {

                // res.json({ status: true, message: 'Fetched successfully!', data: data });
                Budget.aggregate(count_query).exec(function (err, all_docs) { 
                    res.json({'count': Math.ceil(all_docs[0].count / perPage),'current':page, status: true, message: 'Fetched successfully!', data: data });
                })
            }
        })
    });


    // upload invoice/file to bucket
    apiRouter.post('/budgets/uploadInvoice', invoicesupload.array('file', 3), function (req, res, next) {
        res.send(req.files[0]);
    });

    // attach invoice later after adding the record
    apiRouter.post('/budgets/addInvoice', function (req, res) {
        var conditions = {
            _id: req.body._id
        }
        var updateData = {
            invoice: req.body.invoice
        }
        Budget.update(conditions, updateData, callback);
        function callback(err, data) {
            if (err) {
                res.json({ status: false, message: 'Error while saving data', error: err })
            } else {
                res.json({ status: true, message: 'Saved successfully!', data: data });
            }
        }
    })



    //filter by date 
    // get 
    apiRouter.post('/budgets/findByDate', function (req, res) {
        var page = parseInt(req.body.page);
        var days = parseInt(req.body.days)
            perPage = parseInt(req.body.perPage)
        var today = new Date();
        var start = new Date(today.getTime());
        var end = new Date(today.getTime() + days * 24 * 60 * 60 * 1000); 
        // console.log(req.body.project_id,days, start, end);
        var query = [
            {
                "$match": {
                    "project_id": ObjectId(req.body.project_id),
                    "due_date": { "$gte": start, "$lte": end }
                }
            }, 
            {
                "$lookup": {
                    "from": "livejobs", // name of the foreign collection 
                    "localField": "project_id",
                    "foreignField": "project_id",
                    "as": "jobs"
                }
            },
            { $unwind: { path: '$jobs', preserveNullAndEmptyArrays: true  } },
            {
                $redact: {
                    $cond: [{
                        $ne: ["$jobs.service_id", "$service_id"]
                    },
                        "$$PRUNE",
                        "$$KEEP"
                    ]
                }
            },
            {
                "$lookup": {
                    "from": "services", // name of the foreign collection 
                    "localField": "jobs.service_id",
                    "foreignField": "_id",
                    "as": "service_details"
                }
            },
            { $unwind: { path: '$service_details', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "vendortypes", // name of the foreign collection 
                    "localField": "service_details.vendortype_id",
                    "foreignField": "_id",
                    "as": "vendortype_details"
                }
            },
            { $unwind: { path: '$vendortype_details', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "proposals", // name of the foreign collection 
                    "localField": "jobs._id",
                    "foreignField": "job_id",
                    "as": "proposal_details"
                }
            },
            { $unwind: { path: '$proposal_details' } },
            {
                $redact: {
                    $cond: [{
                        $ne: ["$proposal_details.status", 5]
                    },
                        "$$PRUNE",
                        "$$KEEP"
                    ]
                }
            },
            {
                "$lookup": {
                    "from": "projects", // name of the foreign collection 
                    "localField": "project_id",
                    "foreignField": "_id",
                    "as": "project_details"
                }
            },
            { $unwind: { path: '$project_details' } },

            { $unwind: { path: '$project_details.events' } },
            {
                $redact: {
                    $cond: [{
                        $ne: ["$project_details.events._id", "$event_id"]
                    },
                        "$$PRUNE",
                        "$$KEEP"
                    ]
                }
            },
            {
                $project:
                {
                    "service_details": 1,
                    "vendortype_details": 1,
                    "jobs": 1,
                    "proposal_details": 1,
                    "project_details.events._id": 1,
                    "project_details.events.name": 1,
                    "_id": 1,
                    "event_id": 1,
                    "project_id": 1,
                    "invoice" : 1,
                    "item": 1,
                    "cost": 1,
                    "due_date": 1,
                    "service_id": 1,
                    "user_id": 1,
                    'created_at': 1,
                    'updated_at': 1
                }
            }];
            var count_query = [
                { "$match": { "project_id": ObjectId(req.body.project_id) } },
                { "$count":  "count" },
            ] 
        Budget.aggregate(query).skip((perPage * page) - perPage).limit(perPage).exec(function (err, data1) {
            if (err) {
                res.json({ status: false, message: 'Unable to fetch data!', error: err });
            } else {
              //  res.json({ status: true, message: 'Fetched successfully!', data: data });
                Budget.aggregate(count_query).exec(function (err, all_docs) { 
                    res.json({'count': Math.ceil(all_docs[0].count / perPage),'current':page, status: true, message: 'Fetched successfully!', data: data1 });
                })
            }
        })
    });


         
    apiRouter.delete('/budgets/removebyId/:id', function(req, res) {
        Budget.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing this item.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
}