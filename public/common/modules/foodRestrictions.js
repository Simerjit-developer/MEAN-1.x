var foodRestrictionModule = angular.module('dost.foodRestrictions', []);

foodRestrictionModule.service('FoodRestrictions', function($http) {

    return {
        add: function(newItem) {
            return $http({
                method: 'post',
                url: '/api/foodrestrictions/add',
                data: newItem
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the hotel!');
                console.error(err);
                return err;
            });
        },
        findByProjectId:function(editData){
            return $http({
                method: 'post',
                url: '/api/foodrestrictions/findByProjectId',
                data: editData
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went fetching the hotels!');
                console.error(err);
                return err;
            });
        }, 
        removebyId: function(id){
            return $http.delete('/api/foodrestrictions/removebyId/'+id).then(function(postList){
                        return postList.data;
                });
        },
 
    }
});