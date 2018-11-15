/*
 * Add new Business 
 */
adminApp.controller('addGroupCtrl', function($scope,$rootScope,Groups,toastr, $state){
    $scope.post={}
    // add event
    $scope.add = function(newPost){
        newPost.status=true;
        newPost.type='default';
        Groups.add(newPost).then(function(res){
            if(res.status==true){
                $scope.post = {};
                toastr.success(res.message,'Success!');
                $state.go('listGroups');
            }else{
                toastr.error(res.message,'Alert!');
            }
        });
    };
});
/*
 * List all vendorTypes
 */
adminApp.controller('listGroupsCtrl', function($scope,Groups,toastr,$ngConfirm,$sce){
    Groups.all().then(function(res){
        if(res.status==true){
            $scope.groups = res.data;
        }
    })
    // Delete Milestone
    $scope.deletePost = function(title, id){
        $scope.hey = title;
        console.log(id)
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
                        Groups.removebyId(id).then(function(response){
                            if(response.status == true){
                                toastr.success(response.message);
                                Groups.all().then(function(res){
                                    if(res.status==true){
                                        $scope.groups = res.data;
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
 * Edit vendortype
 */
adminApp.controller('editGroupCtrl', function($scope,Groups,toastr,$state,$stateParams){
    //console.log($stateParams)
    $scope.post={}
    
    Groups.findById({id:$stateParams.id}).then(function(res){
        if(res.status==true){
            $scope.post = res.data
            if($scope.post.status==true){
                $scope.post.status='true';
            }else{
                $scope.post.status='false';
            }
        }else{
            toastr.error('Unable to get data!', 'Alert!')
        }
    });
    //update vendor information @params: title, image, id
    $scope.updateGroup= function(){
        Groups.updateById($scope.post).then(function(res){
            if(res.status==true){
                toastr.success(res.message, 'Success!')
            }else{
                toastr.error(res.message, 'Alert!')
            }
        })
    }
})