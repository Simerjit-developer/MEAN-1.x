/*
 * Add new Vendor Types
 */
adminApp.controller('addCityCtrl', function($scope,Cities,toastr, $state){
    $scope.post={}
    
    // add blog
    $scope.add = function(newPost){
        if($scope.imgshow){
            newPost.image = $scope.imgshow;
        }
        Cities.add(newPost).then(function(res){
            if(res.status==true){
                $scope.post = {};
                toastr.success(res.message,'Success!');
                $state.go('listCities');
            }else{
                toastr.error(res.message,'Alert!');
            }
        });
    };
    $scope.uploadCSV=function(input){
      //  console.log(input.files[0])
        $scope.loading = true;
            var DatatoUpload = {};
                DatatoUpload.UserFile = input.files[0];
       //     console.log($scope.project);
        //console.log($scope.project._id);
        Cities.uploadcsv(DatatoUpload).then(function(res) {
           // console.log(res)
            $scope.loading = false;
            if(res.status==true){
                toastr.success(res.message,'Success!');
            }else{
                toastr.error(res.message,'Alert!');
            }
        });
    }
});
/*
 * List all vendorTypes
 */
adminApp.controller('listCitiesCtrl', function($scope,Cities,toastr,$ngConfirm){
    Cities.all().then(function(res){
        if(res.status==true){
            $scope.cities = res.data;
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
                        Cities.removebyId(id).then(function(response){
                            if(response.status == true){
                                toastr.success(response.message);
                                Cities.all().then(function(res){
                                    if(res.status==true){
                                        $scope.cities = res.data;
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
        Cities.removebyId(id).then(function(res){
            console.log(res)
            return res;
        })
    }
});
/*
 * Edit vendortype
 */
adminApp.controller('editCityCtrl', function($scope,Cities,toastr,$state,$stateParams){
    //console.log($stateParams)
    Cities.findById({id:$stateParams.id}).then(function(res){
        if(res.status==true){
            $scope.post = res.data
        }else{
            toastr.error('Unable to get data!', 'Alert!')
        }
    })
    //update vendor information @params: title, image, id
    $scope.updateCity= function(){
        Cities.updateById($scope.post).then(function(res){
            if(res.status==true){
                toastr.success(res.message, 'Success!')
            }else{
                toastr.error(res.message, 'Alert!')
            }
        })
    }
})