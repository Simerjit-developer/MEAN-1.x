var postsModule = angular.module('dost.livejobs', []);

postsModule.service('LiveJobs', function($http){

	return {
		/*all: function(){
			return $http.get('/api/livejobs').then(function(postList){
				return postList.data;
			});
		},*/
                all: function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/livejobs/all',
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
		add: function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/livejobs/add',
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
                            url: '/api/livejobs/findById',
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
                myJobs: function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/livejobs/myjobs',
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
                myfinalizedjobs:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/livejobs/myfinalizedjobs',
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
                myjobsdetail:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/livejobs/myjobsdetail',
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
                findByParams:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/livejobs/findByParams',
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
                job_proposaldetail:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/livejobs/job_proposaldetail',
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
                getServiceByEventId:function(id){
                        return $http({
                                method: 'post',
                                url: '/api/livejobs/getServiceByEventId',
                                data: id
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