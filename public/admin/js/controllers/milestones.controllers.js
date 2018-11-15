/*
 * Add new Business 
 */
adminApp.controller('addMilestoneCtrl', function($scope,$rootScope,Milestones,toastr, $state){
    $scope.post={}
    // add event
    $scope.add = function(newPost){
        newPost.status=true;
        newPost.type='default';
        Milestones.add(newPost).then(function(res){
            if(res.status==true){
                $scope.post = {};
                toastr.success(res.message,'Success!');
                $state.go('listMilestones');
            }else{
                toastr.error(res.message,'Alert!');
            }
        });
    };
});
/*
 * List all vendorTypes
 */
adminApp.controller('listMilestonesCtrl', function($scope,Milestones,toastr,$ngConfirm,$sce){
    Milestones.defaultMilestones().then(function(res){
        if(res.status==true){
            $scope.milestones = res.data;
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
                        Milestones.removebyId(id).then(function(response){
                            if(response.status == true){
                                toastr.success(response.message);
                                Milestones.all().then(function(res){
                                    if(res.status==true){
                                        $scope.milestones = res.data;
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
    /*
     * Delete by ID
     */
    $scope.deleteById=function(id){
        Milestones.removebyId(id).then(function(res){
            console.log(res)
            return res;
        })
    }
    /*
     * Update status of a business
     */
    $scope.updateStatus =function(status,id){
        $scope.postdata={id:id}
        if(status==true){
            $scope.postdata.status=false;
        }else{
            $scope.postdata.status=true;
        }
        Milestones.updateStatus($scope.postdata).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Alert!');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
});
/*
 * Edit vendortype
 */
adminApp.controller('editMilestoneCtrl', function($scope,Milestones,toastr,$state,$stateParams){
    //console.log($stateParams)
    $scope.post={}
    
    Milestones.findById({id:$stateParams.id}).then(function(res){
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
    $scope.updateMilestone= function(){
        Milestones.updateById($scope.post).then(function(res){
            if(res.status==true){
                toastr.success(res.message, 'Success!')
            }else{
                toastr.error(res.message, 'Alert!')
            }
        })
    }
})