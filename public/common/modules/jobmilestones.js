var jobmilestonesModule = angular.module('dost.jobmilestones', []);

jobmilestonesModule.service('JobMilestones', function($http) {

    return {
        add: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/jobmilestones/add',
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
        all: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/jobmilestones/all',
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
        findById: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/jobmilestones/findById',
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
        updateById: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/jobmilestones/updateById',
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
        addTask: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/jobmilestones/addTask',
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
        removeTask: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/jobmilestones/removeTask',
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
            return $http.delete('/api/jobmilestones/removebyId/'+event_id).then(function(postList){
                    return postList.data;
            });
        },
        TaskfindById: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/jobmilestones/TaskfindById',
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
        TaskupdateById: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/jobmilestones/TaskupdateById',
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
        TaskUpdateStatus:function(newUser) {
            return $http({
                method: 'post',
                url: '/api/jobmilestones/TaskUpdateStatus',
                data: newUser
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