var postsModule = angular.module('dost.jobposts', []);

postsModule.service('JobPosts', function($http){

	return {
		all: function(){
			return $http.get('/api/jobposts').then(function(postList){
				return postList.data;
			});
		},
                findById: function(jobpost_id){
			return $http.get('/api/jobposts/'+jobpost_id).then(function(postList){
				return postList.data;
			});
		},
                removebyId: function(jobpost_id){
                    return $http.delete('/api/jobposts/removebyId/'+jobpost_id).then(function(postList){
                                return postList.data;
                        });
                },
		saveToDraft: function(newPost){
			return $http({
				method: 'post',
				url: '/api/jobposts/saveToDraft',
				data: newPost
			}).then(function(res){
				// return the new post
				return res.data;
			}).catch(function(err){
				console.error('Something went wrong adding the post!');
				console.error(err);
				return err;
			});
		},
		vendorsByEvent: function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/jobposts/vendorsByEvent',
                            data: newPost
                    }).then(function(res){
                            // return the new post
                            return res.data;
                    }).catch(function(err){
                            console.error('Something went wrong adding the post!');
                            console.error(err);
                            return err;
                    });
		},
                livevendorsByEvent:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/jobposts/livevendorsByEvent',
                            data: newPost
                    }).then(function(res){
                            // return the new post
                            return res.data;
                    }).catch(function(err){
                            console.error('Something went wrong adding the post!');
                            console.error(err);
                            return err;
                    });
		},
		addJobDetails: function(newPost){
			return $http({
				method: 'post',
				url: '/api/jobposts/addJobDetails',
				data: newPost
			}).then(function(res){
				// return the new post
				return res.data;
			}).catch(function(err){
				console.error('Something went wrong adding the post!');
				console.error(err);
				return err;
			});
		},
                PushLive:function(updatePost){
                    return $http({
				method: 'post',
				url: '/api/jobposts/PushLive',
				data: updatePost
			}).then(function(res){
				// return the new post
				return res.data;
			}).catch(function(err){
				console.error('Something went wrong adding the post!');
				console.error(err);
				return err;
			});
                },
                addBudget:function(updatePost){
                    return $http({
				method: 'post',
				url: '/api/jobposts/addBudget',
				data: updatePost
			}).then(function(res){
				// return the new post
				return res.data;
			}).catch(function(err){
				console.error('Something went wrong adding the post!');
				console.error(err);
				return err;
			});
                },
                addmilestones:function(updatePost){
                    return $http({
				method: 'post',
				url: '/api/jobposts/addmilestones',
				data: updatePost
			}).then(function(res){
				// return the new post
				return res.data;
			}).catch(function(err){
				console.error('Something went wrong adding the post!');
				console.error(err);
				return err;
			});
                }
	};
});