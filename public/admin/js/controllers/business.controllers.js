/*
 * Add new Business 
 */
adminApp.controller('addBusinessCtrl', function($scope,$rootScope,Business,Services,Highlights,toastr, $state,VendorTypes){
    $scope.post={}
    $scope.awardcount=1;
    VendorTypes.all().then(function(res){
        //console.log(res)
        if(res.status==true){
            $scope.vendorTypes = res.data;
        }
    })
    if(typeof($scope.post.vendortype_id) != 'undefined'){
        Services.findByVendorType({'vendortype_id':$scope.post.vendortype_id}).then(function(res){
            if(res.status==true){
                $scope.services = res.data
            }
        })
        Highlights.findByVendorType({'vendortype_id':$scope.post.vendortype_id}).then(function(res){
            if(res.status==true){
                $scope.highlights = res.data
            }
        })
    }else{
        Services.all().then(function(res){
            if(res.status==true){
                $scope.services = res.data
            }
        })
        Highlights.all().then(function(res){
            if(res.status==true){
                $scope.highlights = res.data
            }
        })
    }
    // Vendor Type Changed
    $scope.vendortypeChanged = function(vendortype_id){
        Services.findByVendorType({'vendortype_id':vendortype_id}).then(function(res){
            if(res.status==true){
                $scope.services = res.data
            }
        })
        Highlights.findByVendorType({'vendortype_id':vendortype_id}).then(function(res){
            if(res.status==true){
                $scope.highlights = res.data
            }
        })
    }
    // add blog
    $scope.add = function(newPost){
        newPost.user_id = $rootScope.currentUser._id
        Business.add(newPost).then(function(res){
            if(res.status==true){
                $scope.post = {};
                toastr.success(res.message,'Success!');
                //$state.go('listServices');
            }else{
                toastr.error(res.message,'Alert!');
            }
        });
    };
});
/*
 * List all vendorTypes
 */
adminApp.controller('listBusinessCtrl', function($scope,Business,Services,toastr,$ngConfirm){
    Business.all().then(function(res){
        if(res.status==true){
            $scope.businesses = res.data;
        }
    })
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
                        Services.removebyId(id).then(function(response){
                            if(response.status == true){
                                toastr.success(response.message);
                                Services.all().then(function(res){
                                    if(res.status==true){
                                        $scope.vendorTypes = res.data;
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
        Services.removebyId(id).then(function(res){
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
        Business.updateStatus($scope.postdata).then(function(res){
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
adminApp.controller('editBusinessCtrl', function($scope,Services,Highlights,Business,toastr,$state,$stateParams,VendorTypes){
    //console.log($stateParams)
    $scope.post={}
    $scope.awardcount=1;
    VendorTypes.all().then(function(res){
        //console.log(res)
        if(res.status==true){
            $scope.vendorTypes = res.data;
        }
    })
    if(typeof($scope.post.vendortype_id) != 'undefined'){
        Services.findByVendorType({'vendortype_id':$scope.post.vendortype_id}).then(function(res){
            if(res.status==true){
                $scope.services = res.data
            }
        })
        Highlights.findByVendorType({'vendortype_id':$scope.post.vendortype_id}).then(function(res){
            if(res.status==true){
                $scope.highlights = res.data
            }
        })
    }else{
        Services.all().then(function(res){
            if(res.status==true){
                $scope.services = res.data
            }
        })
        Highlights.all().then(function(res){
            if(res.status==true){
                $scope.highlights = res.data
            }
        })
    }
    // Vendor Type Changed
    $scope.vendortypeChanged = function(vendortype_id){
        Services.findByVendorType({'vendortype_id':vendortype_id}).then(function(res){
            if(res.status==true){
                $scope.services = res.data
            }
        })
        Highlights.findByVendorType({'vendortype_id':vendortype_id}).then(function(res){
            if(res.status==true){
                $scope.highlights = res.data
            }
        })
    }
    Business.findById({id:$stateParams.id}).then(function(res){
        if(res.status==true){
            $scope.post = res.data
            console.log($scope.post.award)
            $scope.awardcount=Object.keys($scope.post.award).length;
        }else{
            toastr.error('Unable to get data!', 'Alert!')
        }
    })
    //update vendor information @params: title, image, id
    $scope.updateBusiness= function(){
        Business.updateById($scope.post).then(function(res){
            if(res.status==true){
                toastr.success(res.message, 'Success!')
            }else{
                toastr.error(res.message, 'Alert!')
            }
        })
    }
})