var Favourite = require('../models/favourite');

module.exports = function(apiRouter) {
     // add a vendortype
    apiRouter.post('/favourites/add', function(req, res){
        var post = new Favourite();
        post.job_id = req.body.job_id;
        post.user_id = req.body.user_id;
        Favourite.find({'job_id':req.body.job_id,user_id:req.body.user_id},function(error,post_value){
            if(error){
                return res.send(error)
            }else{
                if(post_value.length >0){
                    Favourite.findByIdAndRemove(post_value[0]._id, function(err, todo) {
                        if (err) {
                            res.send({status: false, message: 'Error while removing.', error: err});
                        } else {
                            res.json({status: true, message: 'Marked as unfavourite!', data: todo});
                        }
                    })
                   // res.json({status:false,message:'Already marked as favourite!'});
                }else{
                    post.save(function(err, post){
                        if(err){ res.send(err);}else{
                            res.json({status:true,message:'Marked as favourite successfully!'});
                        }
                    })
                }

            }
        })
    });
}