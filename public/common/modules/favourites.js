var favouritesModule = angular.module('dost.favourites', []);

favouritesModule.service('Favourites', function($http) {

    return {
        add: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/favourites/add',
                data: newUser
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the user!');
                console.error(err);
                return err;
            });
        },
        removebyId: function(event_id){
            return $http.delete('/api/vendortypes/removebyId/'+event_id).then(function(postList){
                        return postList.data;
                });
        },
        findById:function(editData){
            return $http({
                method: 'post',
                url: '/api/vendortypes/findById',
                data: editData
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the user!');
                console.error(err);
                return err;
            });
        }
    }
});