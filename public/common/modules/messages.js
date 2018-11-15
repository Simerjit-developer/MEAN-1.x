var postsModule = angular.module('dost.messages', []);

postsModule.service('Messages', function($http){

	return {
		add: function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/messages/add',
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
                messageThread: function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/messages/messageThread',
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