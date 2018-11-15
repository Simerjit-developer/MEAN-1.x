var milestonesModule = angular.module('dost.milestones', []);

milestonesModule.service('Milestones', function($http) {

    return {
        add: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/milestones/add',
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
                return $http.get('/api/milestones').then(function(postList){
                        return postList.data;
                });
        },
        defaultMilestones:function(){
                return $http.get('/api/milestones/defaultmilestones').then(function(postList){
                        return postList.data;
                });
        },
        removebyId: function(event_id){
            return $http.delete('/api/milestones/removebyId/'+event_id).then(function(postList){
                        return postList.data;
                });
        },
        miletsonesByEvent:function(editData){
            return $http({
                method: 'post',
                url: '/api/milestones/miletsonesByEvent',
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
        saveMilestoneToDraft:function(editData){
            return $http({
                method: 'post',
                url: '/api/milestones/saveToDraft',
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
        findById:function(editData){
            return $http({
                method: 'post',
                url: '/api/milestones/findById',
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
                url: '/api/milestones/updateById',
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
        addDefaultAsMy:function(editData){
            return $http({
                method: 'post',
                url: '/api/milestones/addDefaultAsMy',
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
        basedonEventAndProject:function(editData){
            return $http({
                method: 'post',
                url: '/api/milestones/basedonEventAndProject',
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
        miletsonesByService:function(editData){
            return $http({
                method: 'post',
                url: '/api/milestones/miletsonesByService',
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
        pushLiveMiletsonesByProject:function(editData){
            return $http({
                method: 'post',
                url: '/api/milestones/pushLiveMiletsonesByProject',
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
        MiletsonesByProject:function(editData){
            return $http({
                method: 'post',
                url: '/api/milestones/MiletsonesByProject',
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