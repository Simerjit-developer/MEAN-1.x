/*
 * Add new Vendor Types
 */
adminApp.controller('addVendorTypeCtrl', function($scope,VendorTypes,toastr, $state){
    $scope.post={}
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
    // add blog
    $scope.add = function(newPost){
        if($scope.imgshow){
            newPost.image = $scope.imgshow;
        }
        VendorTypes.add(newPost).then(function(res){
            if(res.status==true){
                $scope.post = {};
                $scope.imgshow={};
                toastr.success(res.message,'Success!');
                $state.go('listVendorTypes');
            }else{
                toastr.error(res.message,'Alert!');
            }
        });
    };
});
/*
 * List all vendorTypes
 */
adminApp.controller('listVendorTypeCtrl', function($scope,VendorTypes,toastr,$ngConfirm,$sce){
    VendorTypes.all().then(function(res){
        if(res.status==true){
            $scope.vendorTypes = res.data;
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
                        VendorTypes.removebyId(id).then(function(response){
                            if(response.status == true){
                                toastr.success(response.message);
                                VendorTypes.all().then(function(res){
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
        VendorTypes.removebyId(id).then(function(res){
            console.log(res)
            return res;
        })
    }
});
/*
 * Edit vendortype
 */
adminApp.controller('editVendorTypeCtrl', function($scope,VendorTypes,toastr,$state,$stateParams){
    //console.log($stateParams)
    VendorTypes.findById({id:$stateParams.id}).then(function(res){
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
    $scope.updateVendor= function(){
        VendorTypes.updateById($scope.post).then(function(res){
            if(res.status==true){
                toastr.success(res.message, 'Success!')
            }else{
                toastr.error(res.message, 'Alert!')
            }
        })
    }
})
adminApp.controller('inputFieldsCtrl', function($scope,VendorTypes,Services,Fields,toastr,$state,$stateParams){
    $scope.counter = 1;
    $scope.addRow = function() {
        $scope.counter++;
    }
    //$scope.parentRowNumber=0;
    $scope.childCounter = 0;
    $scope.status='hide';
    $scope.myField={}
    $scope.addChild = function(row_number,status){
        console.log(row_number+' '+status)
        console.log($scope.childCounter)
        $scope.parentRowNumber = row_number
        $scope.childCounter++;
        $scope.status=status
        console.log($scope.parentRowNumber)
    }
    $scope.removeChild=function(parent_row, child_row){
        var class_name=parent_row+'_'+child_row;
        var result = document.getElementsByClassName(class_name);
        var wrappedResult = angular.element(result).remove();
        console.log(angular.element(result))
        $scope.childCounter--;
        //angular.element(document).find(class_name).remove()
    }
    // Fetch all Vendor Types
    VendorTypes.all().then(function(res){
        if(res.status==true){
            $scope.vendorTypes = res.data;
        }
    })
    //Fetch Services based on Vendor type
    $scope.findServices = function(vendortype_id){
        console.log(vendortype_id)
        Services.findByVendorType({vendortype_id:vendortype_id}).then(function(res){
            if(res.status==true){
                $scope.servicesall = res.data
            }
        })
    }
    /*
     * Add fields based on vendortype_id & service_id
     */
    $scope.service={}
    $scope.add=function(){
        console.log($scope.service); //return false;
        Fields.add($scope.service).then(function(res){
            if(res.status==true){
                toastr.success(res.message, 'Success!')
            }else{
                toastr.error(res.message, 'Alert!')
            }
        })
    }
})