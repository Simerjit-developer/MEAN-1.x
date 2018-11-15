/*
 * Add new Business 
 */
adminApp.controller('addEventCtrl', function($scope,$rootScope,Events,toastr, $state){
    $scope.post={}
    // upload image
    $scope.uploadFile = function(input) {
        $scope.loading = true;
        Events.uploadImage(input.files[0]).then(function(res) {
            $scope.loading = false;
            if (res) {                
                $scope.imgshow = res.location;
                $scope.post.image=$scope.imgshow;
            } 
        });
    };
    // add event
    $scope.add = function(newPost){
        if($scope.imgshow){
            newPost.image = $scope.imgshow;
        }
        Events.add(newPost).then(function(res){
            if(res.status==true){
                $scope.post = {};
                toastr.success(res.message,'Success!');
                $state.go('listEvents');
            }else{
                toastr.error(res.message,'Alert!');
            }
        });
    };
});
/*
 * List all vendorTypes
 */
adminApp.controller('listEventsCtrl', function($scope,Events,toastr,$ngConfirm,$sce){
    Events.all().then(function(res){
        if(res.status==true){
            $scope.events = res.data;
        }
    })
    // Make insecure url to secure
    $scope.trustUrl=function(image){
        return $sce.trustAsResourceUrl(image);
    }
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
                        Events.removebyId(id).then(function(response){
                            if(response.status == true){
                                toastr.success(response.message);
                                Events.all().then(function(res){
                                    if(res.status==true){
                                        $scope.events = res.data;
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
        Events.removebyId(id).then(function(res){
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
        Events.updateStatus($scope.postdata).then(function(res){
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
adminApp.controller('editEventCtrl', function($scope,Events,toastr,$state,$stateParams,VendorTypes){
    //console.log($stateParams)
    $scope.post={}
    
    Events.findById({id:$stateParams.id}).then(function(res){
        if(res.status==true){
            $scope.post = res.data
        }else{
            toastr.error('Unable to get data!', 'Alert!')
        }
    })
    // upload image
    $scope.uploadFile = function(input) {
        $scope.loading = true;
        VendorTypes.uploadImage(input.files[0]).then(function(res) {
            $scope.loading = false;
            if (res) {                
                $scope.imgshow = res.location;
                $scope.post.image=$scope.imgshow;
            } 
        });
    };
    //update vendor information @params: title, image, id
    $scope.updateEvent= function(){
        Events.updateById($scope.post).then(function(res){
            if(res.status==true){
                toastr.success(res.message, 'Success!')
            }else{
                toastr.error(res.message, 'Alert!')
            }
        })
    }
})