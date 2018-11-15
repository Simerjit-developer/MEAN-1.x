/*
 * Add new Vendor Types
 */
adminApp.controller('addServiceCtrl', function($scope,Services,toastr, $state,VendorTypes,$sce){
    $scope.post={}
    $scope.loader = { } ;
    $scope.imgshow = ''
    VendorTypes.all().then(function(res){
        //console.log(res)
        if(res.status==true){
            $scope.vendorTypes = res.data;
        }
    })
    // add blog
    $scope.add = function(newPost){
        if($scope.imgshow){
            newPost.image = $scope.imgshow;
        }
        Services.add(newPost).then(function(res){
            if(res.status==true){
                $scope.post = {};
                $scope.imgshow={};
                toastr.success(res.message,'Success!');
                $state.go('listServices');
            }else{
                toastr.error(res.message,'Alert!');
            }
        });
    };

    $scope.uploadFile = function(input) { 
       $scope.loader = {
            loading : true
        } ; 
        // return false;
        Services.uploadImage(input.files[0]).then(function(res) {
            $scope.loader = { } ; 
            console.log(res);
            if (res) {                
                $scope.imgshow = res.location; 
                $scope.post.image=$scope.imgshow;
            } 
});
    };
    $scope.trustUrl=function(image){
        return $sce.trustAsResourceUrl(image);
    }
});
/*
 * List all vendorTypes
 */
adminApp.controller('listServicesCtrl', function($scope,Services,toastr,$ngConfirm,$sce){
    Services.all().then(function(res){
        if(res.status==true){
            $scope.services = res.data;
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
    $scope.trustUrl=function(image){
        return $sce.trustAsResourceUrl(image);
    }
});
/*
 * Edit vendortype
 */
adminApp.controller('editServiceCtrl', function($scope,Services,toastr,$state,$stateParams,VendorTypes,$sce){
   
    $scope.loader = { } ;
    $scope.imgshow = ''
    
    //console.log($stateParams)
    VendorTypes.all().then(function(res){
        //console.log(res)
        if(res.status==true){
            $scope.vendorTypes = res.data;
        }
    })
    Services.findById({id:$stateParams.id}).then(function(res){
        if(res.status==true){
            $scope.post = res.data;
            if($scope.post.image){
                $scope.imgshow = $scope.post.image
            }
            
        }else{
            toastr.error('Unable to get data!', 'Alert!')
        }
    })
    //update vendor information @params: title, image, id
    $scope.updateService= function(){
        Services.updateById($scope.post).then(function(res){
            if(res.status==true){
                toastr.success(res.message, 'Success!')
            }else{
                toastr.error(res.message, 'Alert!')
            }
        })
    }

    $scope.uploadFile = function(input) { 
        $scope.loader = {
             loading : true
         } ; 
         // return false;
         Services.uploadImage(input.files[0]).then(function(res) {
             $scope.loader = { } ; 
             console.log(res);
             if (res) {                
                 $scope.imgshow = res.location; 
                 $scope.post.image=$scope.imgshow;
             } 
         });
     };
     $scope.trustUrl=function(image){
         return $sce.trustAsResourceUrl(image);
     }
})