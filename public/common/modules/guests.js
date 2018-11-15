var guestsModule = angular.module('dost.guests', []);

guestsModule.service('Guests', function($http) {

    return {
        add: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/guests/add',
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
                return $http.get('/api/guests').then(function(postList){
                        return postList.data;
                });
        },
        removebyId: function(event_id){
            return $http.delete('/api/guests/removebyId/'+event_id).then(function(postList){
                        return postList.data;
                });
        },
        findById:function(editData){
            return $http({
                method: 'post',
                url: '/api/guests/findById',
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
        findByProject:function(id){
            return $http({
                method: 'post',
                url: '/api/guests/findbyProjectId',
                data: id
            }).then(function(res){
                return res.data;
            }).catch(function(err){
                console.error('Something went wrong adding the user!');
                console.error(err);
                return err;
            });
        },
        updateById:function(editData){
            return $http({
                method: 'post',
                url: '/api/guests/updateById',
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
        removeMultipleGuests:function(editData){
            return $http({
                method: 'post',
                url: '/api/guests/removeMultiple',
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
        findguestsbyProjectId:function(editData){
            return $http({
                method: 'post',
                url: '/api/guests/findguestsbyProjectId',
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
        uploadcsv:function(imagedata){
            var fd = new FormData();
            //Take the first selected file
            fd.append("file", imagedata.UserFile);
            fd.append("ProjectId", imagedata.ProjectId);
            fd.append("PostedBy",imagedata.PostedBy);   
            fd.append("PostedByLabel",imagedata.PostedByLabel);   
            return $http({
                method: 'post',
                url: '/api/guests/UploadCsv',
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
        addedByMe:function(Data){
            return $http({
                method: 'post',
                url: '/api/guests/addedByMe',
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
    }
});