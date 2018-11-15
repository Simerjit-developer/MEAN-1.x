/*
 * Add new Vendor Types
 */
adminApp.controller('addHighlightsCtrl', function($scope,Highlights,toastr, $state,VendorTypes){
    $scope.post={}
    VendorTypes.all().then(function(res){
        //console.log(res)
        if(res.status==true){
            $scope.vendorTypes = res.data;
        }
    })
    // add blog
    $scope.add = function(newPost){
        Highlights.add(newPost).then(function(res){
            if(res.status==true){
                $scope.post = {};
                toastr.success(res.message,'Success!');
                $state.go('listHighlights');
            }else{
                toastr.error(res.message,'Alert!');
            }
        });
    };
});
/*
 * List all vendorTypes
 */
adminApp.controller('listHighlightsCtrl', function($scope,Highlights,toastr,$ngConfirm){
    Highlights.all().then(function(res){
        if(res.status==true){
            $scope.highlights = res.data;
        }
    })
    $scope.deletePost = function(title, id){
        $scope.hey = title;
        //console.log(id)
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
                        Highlights.removebyId(id).then(function(response){
                            if(response.status == true){
                                toastr.success(response.message);
                                Highlights.all().then(function(res){
                                    if(res.status==true){
                                        $scope.highlights = res.data;
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
        Highlights.removebyId(id).then(function(res){
            return res;
        })
    }
});
/*
 * Edit vendortype
 */
adminApp.controller('editHighlightsCtrl', function($scope,Highlights,toastr,$state,$stateParams,VendorTypes){
    //console.log($stateParams)
    VendorTypes.all().then(function(res){
        //console.log(res)
        if(res.status==true){
            $scope.vendorTypes = res.data;
        }
    })
    Highlights.findById({id:$stateParams.id}).then(function(res){
        if(res.status==true){
            $scope.post = res.data
        }else{
            toastr.error('Unable to get data!', 'Alert!')
        }
    })
    //update vendor information @params: title, image, id
    $scope.updateService= function(){
        Highlights.updateById($scope.post).then(function(res){
            if(res.status==true){
                toastr.success(res.message, 'Success!')
            }else{
                toastr.error(res.message, 'Alert!')
            }
        })
    }
})