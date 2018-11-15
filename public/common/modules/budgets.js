var budgetsModule = angular.module('dost.budgets', []);

budgetsModule.service('Budgets', function ($http) {

    return {
        add: function (newItem) {
            return $http({
                method: 'post',
                url: '/api/budgets/add',
                data: newItem
            }).then(function (res) {
                // return the new post
                return res.data;
            }).catch(function (err) {
                console.error('Something went wrong adding the user!');
                console.error(err);
                return err;
            });
        },
        findByProjectId: function (id) {
            return $http({
                method: 'post',
                url: '/api/budgets/findByProjectId',
                data: id
            }).then(function (res) {
                // return the new post
                return res.data;
            }).catch(function (err) {
                console.error('Something went wrong adding the user!');
                console.error(err);
                return err;
            });
        },
        findByEvent_or_service: function (data) {
            return $http({
                method: 'post',
                url: '/api/budgets/findByEvent_or_service',
                data: data
            }).then(function (res) {
                // return the new post
                return res.data;
            }).catch(function (err) {
                console.error('Something went wrong adding the user!');
                console.error(err);
                return err;
            });
        },
        uploadInvoice: function (filedata) {
            var fd = new FormData();
            //Take the first selected file
            fd.append("file", filedata);
            return $http({
                method: 'post',
                url: '/api/budgets/uploadInvoice',
                data: fd,
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            }).then(function (res) {
                // return the new post
                return res.data;
            }).catch(function (err) {
                console.error('Something went wrong adding the user!');
                console.error(err);
                return err;
            });
        },
        addInvoice: function (data) {
            return $http({
                method: 'post',
                url: '/api/budgets/addInvoice',
                data: data
            }).then(function (res) {
                // return the new post
                return res.data;
            }).catch(function (err) {
                console.error('Something went wrong adding the user!');
                console.error(err);
                return err;
            });
        },
        findByDate: function (data) {
            return $http({
                method: 'post',
                url: '/api/budgets/findByDate',
                data: data
            }).then(function (res) {
                // return the new post
                return res.data;
            }).catch(function (err) {
                console.error('Something went wrong adding the user!');
                console.error(err);
                return err;
            });
        },
        findByVendor_and_Service: function (data) {
            return $http({
                method: 'post',
                url: '/api/budgets/findByVendor_and_Service',
                data: data
            }).then(function (res) {
                // return the new post
                return res.data;
            }).catch(function (err) {
                console.error('Something went wrong adding the user!');
                console.error(err);
                return err;
            });
        },
        removebyId: function (id) {
            return $http.delete('/api/budgets/removebyId/' + id).then(function (postList) {
                return postList.data;
            });
        },

    }
});