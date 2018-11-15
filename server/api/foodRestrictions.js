var foodRestriction = require('../models/foodRestriction');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var perPage = 2;
module.exports = function (apiRouter) {

    // add an entry
    apiRouter.post('/foodrestrictions/add', function (req, res) {
        var post = new foodRestriction();
        post.project_id = req.body.project_id; 
        post.name = req.body.name;
        post.address = req.body.address;
        post.location = req.body.location;
        post.no_of_rooms = req.body.no_of_rooms; 
        post.save(function (err, post) {
            if (err) {
                res.send({ status: false, message: err.message, err: err });
            } else {
                res.json({ status: true, message: 'Saved successfully!', data: post });
            }
        })

    }); 

    // get all food Restrictions based on project id
    apiRouter.post('/foodrestrictions/findByProjectId', function(req, res){
        foodRestriction.find({'project_id': req.body.project_id}, function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
                
        });
    });
     
     // food Restrictions based on
     
    apiRouter.delete('/foodrestrictions/removebyId/:id', function(req, res) {
        foodRestriction.findByIdAndRemove(req.params.id, function(err, todo) {
            if (err) {
                res.send({status: false, message: 'Error while removing this item.', error: err});
            } else {
                res.json({status: true, message: 'Removed successfully!', data: todo});
            }
        })
    });
}