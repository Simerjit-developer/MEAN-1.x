var vendortypesModule = angular.module('dost.vendortypes', []);

vendortypesModule.service('VendorTypes', function($http) {

    return {
        add: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/vendortypes/add',
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
        uploadImage:function(imagedata){
            var fd = new FormData();
            //Take the first selected file
            fd.append("file", imagedata);
            return $http({
                method: 'post',
                url: '/api/vendortypes/upload',
                data: fd,
                withCredentials: true,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
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
                return $http.get('/api/vendortypes').then(function(postList){
                        return postList.data;
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
        },
        updateById:function(editData){
            return $http({
                method: 'post',
                url: '/api/vendortypes/updateById',
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
        
        vendortypesWithServices:function(){
            return $http.get('/api/vendortypes/vendortypesWithServices').then(function(postList){
                        return postList.data;
                });
        },
    }
});