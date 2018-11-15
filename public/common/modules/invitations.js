var postsModule = angular.module('dost.invitations', []);

postsModule.service('Invitations', function($http){

	return {
		all: function(){
			return $http.get('/api/invitations').then(function(postList){
				return postList.data;
			});
		},
		
                myInvitations: function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/invitations/my',
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
                response:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/invitations/response',
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
                findById:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/invitations/findById',
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
                AccommodationDetails:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/invitations/AccommodationDetails',
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
                AddFoodRestrictions:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/invitations/AddFoodRestrictions',
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
                RemoveFoodRestriction:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/invitations/RemoveFoodRestriction',
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
                updateFoodRestriction:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/invitations/updateFoodRestriction',
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
                SendAccomodationRequest:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/invitations/SendAccomodationRequest',
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
                SendFoodRestrictionsRequest:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/invitations/SendFoodRestrictionsRequest',
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
                byFromGroupEventProject:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/invitations/byFromGroupEventProject',
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
                fetchByCode:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/invitations/fetchByCode',
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
                sendInvitation:function(Data){
                    return $http({
                        method: 'post',
                        url: '/api/invitations/sendInvitation',
                        data: Data
                    }).then(function(res) {
                        // return the new post
                        return res.data;
                    }).catch(function(err) {
                        console.error('Something went wrong adding the user!');
                        console.error(err);
                        return err;
                    });
                },
                sendReminder:function(newPost){
                    return $http({
                            method: 'post',
                            url: '/api/invitations/sendReminder',
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
        sendInvitationToSingleGuest: function(Data){
            return $http({
                method: 'post',
                url: '/api/invitations/sendInvitationToSingleGuest',
                data: Data
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the user!');
                console.error(err);
                return err;
            });
        }
	};
});