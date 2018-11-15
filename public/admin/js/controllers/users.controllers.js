/*
 * fetch all users 
 */
adminApp.controller('AllUsersCtrl', function($scope, Users,$ngConfirm,toastr){
    Users.all().then(function(res){
        if(res.status==true){
            $scope.users = res.data;
        }
    })
    $scope.deletePost = function(title, id){
        $scope.hey = title;
        $ngConfirm({
            theme:'supervan',
            title: 'Alert!',
            content: 'Are you sure, you want to delete <strong>{{hey}}</strong>?',
            //contentUrl: 'template.html', // if contentUrl is provided, 'content' is ignored.
            scope: $scope,
            buttons: {   
                // long hand button definition
                ok: { 
                    text: "Yes!",
                    btnClass: 'btn-primary',
                    keys: ['enter'], // will trigger when enter is pressed
                    action: function(scope){
                        Users.removebyId(id).then(function(response){
                            if(response.status == true){
                                toastr.success(response.message);
                                Users.all().then(function(res){
                                    if(res.status==true){
                                        $scope.users = res.data;
                                    }
                                })
                            }else{
                                toastr.error('Error!', response.message);
                            }
                        })
                    }
                },
                // short hand button definition
                close:{
                    text: 'No',
                   action:function(scope){
                    //$ngConfirm('the user clicked close');
                    } 
                } 
            },
        });
    }
});
/*
 * Add new Users
 */
adminApp.controller('addUserCtrl', function($scope,Users,toastr){
    Users.add($scope.post).then(function(res){
        if(res.status==true){
            toastr.success(res.message, 'Success!')
        }else{
            toastr.error(res.message, 'Alert!')
        }
    })
});

/*
 * Add new Users
 */
adminApp.controller('editUserCtrl', function($scope, Users, $stateParams,toastr){
    Users.findById({id:$stateParams.id}).then(function(res){
        if(res.status==true){
            $scope.post = res.data
            $scope.post.dob=new Date(res.data.dob);
            if($scope.post.status==true){
                $scope.post.status='true'
            }else{
                $scope.post.status='false'
            }
        }else{
            toastr.error('Unable to get data!', 'Alert!')
        }
    })
    //update vendor information @params: title, image, id
    $scope.updateUser= function(){
        Users.updateById($scope.post).then(function(res){
            if(res.status==true){
                toastr.success(res.message, 'Success!')
            }else{
                toastr.error(res.message, 'Alert!')
            }
        })
    }
});