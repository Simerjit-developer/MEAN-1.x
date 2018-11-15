var JobPost = require('../models/jobpost');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// Posts API
module.exports = function(apiRouter){
	
	// get all posts
	apiRouter.get('/jobposts', function(req, res){
		JobPost.find({}, function(err, posts){
			if (err) res.send(err);

			res.json(posts);
		});
	});

	// get a single post
	apiRouter.get('/jobposts/:id', function(req, res){
            JobPost.aggregate([
                {"$match":{
                        $and: [
                            {"_id":ObjectId(req.params.id)}
                        ]
                    }
                },
                {
                    "$lookup":{
                        "from":"services",
                        "localField": "service_id",
                        "foreignField": "_id",
                        "as": "servicedetail"
                    }
                },
                {
                    "$lookup":{
                        "from":"projects.events",
                        "localField": "event_id",
                        "foreignField": "_id",
                        "as": "eventdetail"
                    }
                },
                //{"$unwind":{"path":"$draft", "preserveNullAndEmptyArrays":true }},
                {
                    "$lookup":{
                        "from":"vendortypes",
                        "localField": "vendortype_id",
                        "foreignField": "_id",
                        "as": "vendordetail"
                    }
                }
            ],function(err,data){
                if(err){
                    res.json({status:false,message:'Error while fetching data',err:err});
                }else{
                    res.json({status:true,data:data[0]});
                }

            })
	});

	// update a post
	apiRouter.put('/jobposts/:id', function(req, res){
		JobPost.findById(req.params.id, function(err, post){
			if(err) res.send(err);

			post.title = req.body.title;
			post.body = req.body.body;

			post.save(function(err){
				if(err) res.send(err);

				res.json({ message: 'Post updated!' });
			})
		});
	});

	// delete a post
	apiRouter.delete('/jobposts/:id', function(req, res){
		JobPost.remove({
			_id: req.params.id
		}, function(err, post){
			if(err) res.send(err);

			res.json({ message: 'Post deleted!' });
		})
	});
        
        
    /*
     * Add a Vendor in Draft Mode
     */
    apiRouter.post('/jobposts/saveToDraft', function(req, res){
        var data = req.body.data;
        var i=0;
        data.forEach(function(element) {
            var post = new JobPost();
            post.event_id = element.event_id;
            post.posted_by = element.posted_by;
            post.project_id = element.project_id;
            post.service_id = element.service_id;
            post.vendortype_id = element.vendortype_id;
            post.save(function(err, post){
                i=i+1;
                if(i==data.length){
                    if(err){
                        res.json({status:false, message:'Error while saving data',error:err})
                    }else{
                        res.json({status:true, message:'Job successfully saved.',data:post})
                    }
                }
                
            })
        });
    });
    /*
     * Update in Draft Mode
     */
    apiRouter.post('/jobposts/updateDraftbyId',function(req,res){
        JobPost.findById(req.body._id,function(err,servicedata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                       
                var conditions={
                    _id:req.body._id
                }
                var updateData = {
                    draft:req.body.draft
                }
                JobPost.update(conditions,updateData,{multi:true},callback);

                function callback(err, numAffected){
                    if(err){ 
                        res.json({status:false, message:'Error while saving data',error:err})
                    }else{
                        res.json({status:true,message:'Saved successfully!',numAffected:numAffected});
                    }
                }
            }
        })
    })
    /*
     * Find JobPosts by Project Id and Push them live to be able to see in Planner > Jobs section
     */
    apiRouter.post('/jobposts/PushLive', function(req, res){
        JobPost.find({'draft.project_id':ObjectId(req.body._id)},function(err,projectdata){
            if(err){
                res.json({status: false, message: 'Unable to fetch data!', error: err});
            }else{
                if(projectdata.length ==0){
                    res.json({status:true,message:'Data has been pushed successfully on Live mode!'});
                }else{
                    
                for(var i=0; i< projectdata.length; i++){
                    var conditions={
                        _id:projectdata[i]._id
                    }
                    var updateData = {
                        posted_by:projectdata[i].draft[0].posted_by,
                        event_id:projectdata[i].draft[0].event_id,
                        project_id:projectdata[i].draft[0].project_id,
                        jobDetails:projectdata[i].draft[0].jobDetails,
                        addressDetails:projectdata[i].draft[0].addressDetails,
                        milestones:projectdata[i].draft[0].milestones,
                        draft:[]
                    }
                    if(projectdata[i].draft[0].budget){
                        updateData.budget=projectdata[i].draft[0].budget;
                    }
                    if(projectdata[i].draft[0].service_id){
                        updateData.service_id=projectdata[i].draft[0].service_id;
                    }
                    if(projectdata[i].draft[0].vendortype_id){
                        updateData.vendortype_id=projectdata[i].draft[0].vendortype_id;
                    }
                    //console.log(i+" "+projectdata.length);
                    if(i==(projectdata.length-1)){
                        JobPost.update(conditions,updateData,{multi:true},callback);
                    }else{
                        JobPost.update(conditions,updateData,{multi:true});
                    }
                }
                function callback(err, numAffected){
                    if(err){ 
                        res.json({status:false, message:'Error while saving data',error:err})
                    }else{
                        res.json({status:true,message:'Data has been pushed successfully on Live mode!',numAffected:numAffected});
                    }
                }
            }
            }
        })
    });
    /*
     * Fetch Jobs by event_id
     */
    apiRouter.post('/jobposts/vendorsByEvent',function(req,res){
       // console.log(req.body)
        JobPost.aggregate([
            {"$match":{
                    $and: [
                        {"event_id":ObjectId(req.body.event_id)},
                        {"project_id":ObjectId(req.body.project_id)},
                    ]
                }
            },
//            {"$unwind":"$draft"},
            {
                "$lookup":{
                    "from":"services",
                    "localField": "service_id",
                    "foreignField": "_id",
                    "as": "servicedetail"
                }
            },
            //{"$unwind":{"path":"$draft", "preserveNullAndEmptyArrays":true }},
            {
                "$lookup":{
                    "from":"vendortypes",
                    "localField": "vendortype_id",
                    "foreignField": "_id",
                    "as": "vendordetail"
                }
            }
        ],function(err,data){
            if(err){
                res.json({status:false,message:'Error while fetching data',err:err});
            }else{
                res.json({status:true,data:data,'demo':'demo'});
            }
            
        })
    })
    apiRouter.post('/jobposts/vendorsByEventOld',function(req,res){
       // console.log(req.body)
        JobPost.aggregate([
            {"$match":{
                    $and: [
                        {"draft.event_id":ObjectId(req.body.event_id)},
                        {"draft.project_id":ObjectId(req.body.project_id)},
                    ]
                }
            },
            {"$unwind":"$draft"},
            {
                "$lookup":{
                    "from":"services",
                    "localField": "draft.service_id",
                    "foreignField": "_id",
                    "as": "draft.servicedetail"
                }
            },
            //{"$unwind":{"path":"$draft", "preserveNullAndEmptyArrays":true }},
            {
                "$lookup":{
                    "from":"vendortypes",
                    "localField": "draft.vendortype_id",
                    "foreignField": "_id",
                    "as": "draft.vendordetail"
                }
            }
        ],function(err,data){
            if(err){
                res.json({status:false,message:'Error while fetching data',err:err});
            }else{
                res.json({status:true,data:data,'demo':'demo'});
            }
            
        })
    })
    
    /*
     * Fetch Jobs by event_id
     */
    apiRouter.post('/jobposts/livevendorsByEvent',function(req,res){
       // console.log(req.body)
        JobPost.aggregate([
            {"$match":{
                    $and: [
                        {"event_id":ObjectId(req.body.event_id)},
                        {"project_id":ObjectId(req.body.project_id)},
                    ]
                }
            },
            {
                "$lookup":{
                    "from":"services",
                    "localField": "service_id",
                    "foreignField": "_id",
                    "as": "servicedetail"
                }
            },
            //{"$unwind":{"path":"$draft", "preserveNullAndEmptyArrays":true }},
            {
                "$lookup":{
                    "from":"vendortypes",
                    "localField": "vendortype_id",
                    "foreignField": "_id",
                    "as": "vendordetail"
                }
            }
        ],function(err,data){
            if(err){
                res.json({status:false,message:'Error while fetching data',err:err});
            }else{
                res.json({status:true,data:data,'demo':'demo'});
            }
            
        })
    })
    apiRouter.post('/jobposts/addJobDetails',function(req,res){
        //console.log(req.body)
        var searchConditions=[]
        /*if(typeof req.body.project_id !='undefined' && req.body.project_id!=''){
            var projectConditions={"draft.project_id":ObjectId(req.body.project_id)}
            searchConditions.push(projectConditions)
        }
        if(typeof req.body.vendortype_id !='undefined' && req.body.vendortype_id!=''){
           var vendortypeConditions={"draft.vendortype_id":ObjectId(req.body.vendortype_id)}
           searchConditions.push(vendortypeConditions)
        }
        if(typeof req.body.service_id !='undefined' && req.body.service_id!=''){
            var serviceConditions={"draft.service_id":ObjectId(req.body.service_id)}
            searchConditions.push(serviceConditions)
        }
        if(typeof req.body.event_id !='undefined' && req.body.event_id!=''){
            var eventConditions={"draft.event_id":ObjectId(req.body.event_id)}
            searchConditions.push(eventConditions)
        }*/
        if(typeof req.body.project_id !='undefined' && req.body.project_id!=''){
            var projectConditions={"project_id":ObjectId(req.body.project_id)}
            searchConditions.push(projectConditions)
        }
        if(typeof req.body.vendortype_id !='undefined' && req.body.vendortype_id!=''){
           var vendortypeConditions={"vendortype_id":ObjectId(req.body.vendortype_id)}
           searchConditions.push(vendortypeConditions)
        }
        if(typeof req.body.service_id !='undefined' && req.body.service_id!=''){
            var serviceConditions={"service_id":ObjectId(req.body.service_id)}
            searchConditions.push(serviceConditions)
        }
        if(typeof req.body.event_id !='undefined' && req.body.event_id!=''){
            var eventConditions={"event_id":ObjectId(req.body.event_id)}
            searchConditions.push(eventConditions)
        }
//        console.log(searchConditions)
        JobPost.aggregate([
            {"$match":{
                    $and:searchConditions
                    
                }
            }],function(err,data){
                if(err){
                    res.json({status: false, message: 'Unable to fetch data!', error: err});
                }else{
                    if(data.length>0){
                        var conditions={
                            _id:data[0]._id
                        }
                        console.log(data[0]);
//                        console.log(data[0].draft)
//                        console.log(typeof data[0].draft)
//                        console.log(data[0].draft.event_id)
                            /*if(data[0].draft[0].jobDetails){
                                data[0].draft[0].addressDetails=req.body.addressDetails
                                data[0].draft[0].jobDetails =req.body.job_requirements
                                 var updateData={"draft":[data[0].draft[0]]}
                            }else{
                                var jobDetails=req.body.job_requirements
                                data[0].draft[0].addressDetails=req.body.addressDetails
                                data[0].draft[0].jobDetails=jobDetails
                                var updateData={"draft":[data[0].draft[0]]}
                            }*/
                                data[0].addressDetails=req.body.addressDetails
                                data[0].jobDetails =req.body.job_requirements
                                 var updateData={
                                    "jobDetails":data[0].jobDetails,
                                    "addressDetails": data[0].addressDetails         
                                }
                            
                            //console.log(updateData)
                        JobPost.update(conditions,{$set:updateData},{upsert:true,multi:true},callback);

                        function callback(err, numAffected){
                            if(err){ 
                                res.json({status:false, message:'Error while saving data',error:err})
                            }else{
                                res.json({status:true,message:'Saved successfully!',numAffected:numAffected});
                            }
                        }
                    }
                }
            })
    });
    /*
     * Update Budget
     */
    apiRouter.post('/jobposts/addBudget',function(req,res){
        //console.log(req.body)
        var searchConditions=[]
        /*if(typeof req.body.project_id !='undefined' && req.body.project_id!=''){
            var projectConditions={"draft.project_id":ObjectId(req.body.project_id)}
            searchConditions.push(projectConditions)
        }
        if(typeof req.body.vendortype_id !='undefined' && req.body.vendortype_id!=''){
           var vendortypeConditions={"draft.vendortype_id":ObjectId(req.body.vendortype_id)}
           searchConditions.push(vendortypeConditions)
        }
        if(typeof req.body.service_id !='undefined' && req.body.service_id!=''){
            var serviceConditions={"draft.service_id":ObjectId(req.body.service_id)}
            searchConditions.push(serviceConditions)
        }
        if(typeof req.body.event_id !='undefined' && req.body.event_id!=''){
            var eventConditions={"draft.event_id":ObjectId(req.body.event_id)}
            searchConditions.push(eventConditions)
        }*/
        
         if(typeof req.body.project_id !='undefined' && req.body.project_id!=''){
            var projectConditions={"project_id":ObjectId(req.body.project_id)}
            searchConditions.push(projectConditions)
        }
        if(typeof req.body.vendortype_id !='undefined' && req.body.vendortype_id!=''){
           var vendortypeConditions={"vendortype_id":ObjectId(req.body.vendortype_id)}
           searchConditions.push(vendortypeConditions)
        }
        if(typeof req.body.service_id !='undefined' && req.body.service_id!=''){
            var serviceConditions={"service_id":ObjectId(req.body.service_id)}
            searchConditions.push(serviceConditions)
        }
        if(typeof req.body.event_id !='undefined' && req.body.event_id!=''){
            var eventConditions={"event_id":ObjectId(req.body.event_id)}
            searchConditions.push(eventConditions)
        }
        //console.log(searchConditions)
        JobPost.aggregate([
            {"$match":{
                    $and:searchConditions
                    
                }
            }],function(err,data){
                if(err){
                    res.json({status: false, message: 'Unable to fetch data!', error: err});
                }else{
                    if(data.length>0){
                        var conditions={
                            _id:data[0]._id
                        }
//                            if(data[0].draft[0].budget){
//                                data[0].draft[0].budget=req.body.budget
//                                 var updateData={"draft":[data[0].draft[0]]}
//                                
//                            }else{
//                                data[0].draft[0].budget=req.body.budget
//                                var updateData={"draft":[data[0].draft[0]]}
//                            }
                        var updateData={"budget":req.body.budget}
                        JobPost.update(conditions,{$set:updateData},{upsert:true,multi:true},callback);

                        function callback(err, numAffected){
                            if(err){ 
                                res.json({status:false, message:'Error while saving data',error:err})
                            }else{
                                res.json({status:true,message:'Saved successfully!',numAffected:numAffected});
                            }
                        }
                    }
                }
            })
    })
    /*
     * Add Milestones 
     */
    apiRouter.post('/jobposts/addmilestones',function(req,res){
        var searchConditions=[]
        /*if(typeof req.body.project_id !='undefined' && req.body.project_id!=''){
            var projectConditions={"draft.project_id":ObjectId(req.body.project_id)}
            searchConditions.push(projectConditions)
        }
        if(typeof req.body.vendortype_id !='undefined' && req.body.vendortype_id!=''){
           var vendortypeConditions={"draft.vendortype_id":ObjectId(req.body.vendortype_id)}
           searchConditions.push(vendortypeConditions)
        }
        if(typeof req.body.service_id !='undefined' && req.body.service_id!=''){
            var serviceConditions={"draft.service_id":ObjectId(req.body.service_id)}
            searchConditions.push(serviceConditions)
        }
        if(typeof req.body.event_id !='undefined' && req.body.event_id!=''){
            var eventConditions={"draft.event_id":ObjectId(req.body.event_id)}
            searchConditions.push(eventConditions)
        }*/
        if(typeof req.body.project_id !='undefined' && req.body.project_id!=''){
            var projectConditions={"project_id":ObjectId(req.body.project_id)}
            searchConditions.push(projectConditions)
        }
        if(typeof req.body.vendortype_id !='undefined' && req.body.vendortype_id!=''){
           var vendortypeConditions={"vendortype_id":ObjectId(req.body.vendortype_id)}
           searchConditions.push(vendortypeConditions)
        }
        if(typeof req.body.service_id !='undefined' && req.body.service_id!=''){
            var serviceConditions={"service_id":ObjectId(req.body.service_id)}
            searchConditions.push(serviceConditions)
        }
        if(typeof req.body.event_id !='undefined' && req.body.event_id!=''){
            var eventConditions={"event_id":ObjectId(req.body.event_id)}
            searchConditions.push(eventConditions)
        }
        //console.log(searchConditions)
        JobPost.aggregate([
            {"$match":{
                    $and:searchConditions
                    
                }
            }],function(err,data){
                if(err){
                    res.json({status: false, message: 'Unable to fetch data!', error: err});
                }else{
                    if(data.length>0){
                        var conditions={
                            _id:data[0]._id
                        }
                        if(typeof req.body.milestones!='undefined'){
                            if(typeof data[0].milestones =='undefined'){
                                data[0].milestones = []
                            }
                            data[0].milestones.push(req.body.milestones)
                            var updateData={"milestones":[data[0].milestones]}
                        }
//                            
                      //      console.log(updateData)
                        JobPost.update(conditions,{$set:updateData},{upsert:true,multi:true},callback);

                        function callback(err, numAffected){
                            if(err){ 
                                res.json({status:false, message:'Error while saving data',error:err})
                            }else{
                                JobPost.findById(data[0]._id,function(joberr,jobdata){
                                    if(jobdata){
                                        res.json({status:true,message:'Saved successfully!',data:jobdata,numAffected:numAffected});
                                    }else{
                                        res.json({status:true,message:'Saved successfully!',numAffected:numAffected});
                                    }
                                })
                                
                            }
                        }
                    }
                }
            })
    })
    /*
     * Remove JobPost based on id
     */
    apiRouter.delete('/jobposts/removebyId/:id', function(req, res) {
        JobPost.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing Vendor.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
};