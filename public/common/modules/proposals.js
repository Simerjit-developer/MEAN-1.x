var postsModule = angular.module('dost.proposals', []);

postsModule.service('Proposals', function($http){

	return {
		all: function(){
			return $http.get('/api/proposals').then(function(postList){
				return postList.data;
			});
		},
		add: function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/proposals/add',
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
                findById: function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/proposals/findById',
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
                updateStatus:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/proposals/updateStatus',
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
                myFinalisedJobs:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/proposals/myfinalizedjobs',
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
                myBids:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/proposals/mybids',
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
                markAsDelete:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/proposals/markAsDelete',
                            data: newPost
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