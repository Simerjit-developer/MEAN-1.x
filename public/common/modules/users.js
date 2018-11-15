var usersModule = angular.module('dost.users', []);

usersModule.service('Users', function($http) {

    return {
        all: function(){
                return $http.get('/api/users').then(function(postList){
                        return postList.data;
                });
        },
        PhoneExists:function(newUser){
            return $http({
                method: 'post',
                url: '/api/users/PhoneExists',
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
        add: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/users',
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
        login: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/users/login',
                data: newUser
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the post!');
                console.error(err);
                return err;
            });
        },
        getOtp: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/users/get_otp',
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
        verifyOtp: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/users/verify_otp',
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
        getOtpOnExistingMobile:function(newUser) {
            return $http({
                method: 'post',
                url: '/api/users/get_otp_existing_phone',
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
        updatePassword:function(oldUser){
            return $http({
                method: 'post',
                url: '/api/users/resetpassword',
                data: oldUser
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
                url: '/api/users/findById',
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
                url: '/api/users/updateById',
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
                url: '/api/users/upload',
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
        removebyId: function(event_id){
            return $http.delete('/api/users/removebyId/'+event_id).then(function(postList){
                        return postList.data;
                });
        },
        contact:function(editData){
            return $http({
                method: 'post',
                url: '/api/users/contact',
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
        uploadBlob:function(editData){
            return $http({
                method: 'post',
                url: '/api/users/upload_user_image_app',
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
        sendMsgToPhn:function(editData){
            return $http({
                method: 'post',
                url: '/api/users/sendMsgToPhn',
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