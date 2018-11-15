var servicesModule = angular.module('dost.services', []);

servicesModule.service('Services', function($http) {

    return {
        add: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/services/add',
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
                return $http.get('/api/services').then(function(postList){
                        return postList.data;
                });
        },
        removebyId: function(event_id){
            return $http.delete('/api/services/removebyId/'+event_id).then(function(postList){
                        return postList.data;
                });
        },
        findById:function(editData){
            return $http({
                method: 'post',
                url: '/api/services/findById',
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
                url: '/api/services/updateById',
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
                url: '/api/services/findByVendorType',
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
        uploadImage:function(imagedata){
            var fd = new FormData();
            //Take the first selected file
            fd.append("file", imagedata);
            return $http({
                method: 'post',
                url: '/api/services/upload',
                data: fd,
                withCredentials: true,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong uploading the picture!');
                console.error(err);
                return err;
            });
        }
    }
});