var highlightsModule = angular.module('dost.highlights', []);

highlightsModule.service('Highlights', function($http) {

    return {
        add: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/highlights/add',
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
        all: function(){
                return $http.get('/api/highlights').then(function(postList){
                        return postList.data;
                });
        },
        removebyId: function(event_id){
            return $http.delete('/api/highlights/removebyId/'+event_id).then(function(postList){
                        return postList.data;
                });
        },
        findById:function(editData){
            return $http({
                method: 'post',
                url: '/api/highlights/findById',
                data: editData
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the user!');
                console.error(err);
                return err;
            });
        },
        updateById:function(editData){
            return $http({
                method: 'post',
                url: '/api/highlights/updateById',
                data: editData
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the user!');
                console.error(err);
                return err;
            });
        },
        findByVendorType:function(editData){
            return $http({
                method: 'post',
                url: '/api/highlights/findByVendorType',
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