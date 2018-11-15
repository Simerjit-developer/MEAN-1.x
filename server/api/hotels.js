var Hotel = require('../models/hotels');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var perPage = 2;
module.exports = function (apiRouter) {

    // add an entry
    apiRouter.post('/hotels/add', function (req, res) {
        var post = new Hotel();
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

    // get all hotels based on project id
    apiRouter.post('/hotels/findByProjectId', function(req, res){
        Hotel.find({'project_id': req.body.project_id}, function(err, posts){
            if (err) {
                res.json({status:false, message:'Unable to get data!', err: err})
            }else{
                res.json({status:true, data: posts});
            }
                
        });
    });
    
}