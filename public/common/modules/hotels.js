var hotelsModule = angular.module('dost.hotels', []);

hotelsModule.service('Hotels', function($http) {

    return {
        add: function(newItem) {
            return $http({
                method: 'post',
                url: '/api/hotels/add',
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
                url: '/api/hotels/findByProjectId',
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
 
    }
});