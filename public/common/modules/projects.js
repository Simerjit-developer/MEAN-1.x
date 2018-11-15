var projectsModule = angular.module('dost.projects', []);

projectsModule.service('Projects', function($http) {

    return {
        add: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/projects/add',
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
                return $http.get('/api/projects').then(function(postList){
                        return postList.data;
                });
        },
        removebyId: function(event_id){
            return $http.delete('/api/projects/removebyId/'+event_id).then(function(postList){
                        return postList.data;
                });
        },
        findById:function(editData){
            return $http({
                method: 'post',
                url: '/api/projects/findById',
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
        findByUserId:function(editData){
            return $http({
                method: 'post',
                url: '/api/projects/findByUserId',
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
                url: '/api/projects/updateById',
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
        updateDraftById:function(editData){
            return $http({
                method: 'post',
                url: '/api/projects/updateDraftById',
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
        PushLive:function(newdata){
            return $http({
                method: 'post',
                url: '/api/projects/PushLive',
                data: newdata
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the user!');
                console.error(err);
                return err;
            });
        },
        addTeamMember:function(editData){
            return $http({
                method: 'post',
                url: '/api/projects/addTeamMember',
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
        renameProject:function(editData){
            return $http({
                method: 'post',
                url: '/api/projects/renameProject',
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
        updateEventBudget:function(editData){
            return $http({
                method: 'post',
                url: '/api/projects/updateEventBudget',
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
        removeTeamMember: function(editData){
            return $http({
                method: 'post',
                url: '/api/projects/removeTeamMember',
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
        fetchDetails:function(editData){
            return $http({
                method: 'post',
                url: '/api/projects/fetchDetails',
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