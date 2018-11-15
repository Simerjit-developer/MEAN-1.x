app.controller('registerBusinessCtrl', function ($scope,$sce,VendorTypes,Cities,$state,$rootScope,toastr,Services,Highlights,Business) {
    // get all vendor types
    $scope.post={}
    //console.log($rootScope.currentUser)
    VendorTypes.all().then(function(res){
        if(res.status==true){
            $scope.vendortypes = res.data
        }
    })
    Cities.all().then(function(res){
        if(res.status==true){
            $scope.cities = res.data
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
    
    // Make insecure url to secure
    $scope.trustUrl=function(image){
        return $sce.trustAsResourceUrl(image);
    }
    
    
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
    $scope.awardcount = 1;
    $scope.registerBusiness = function(){
        $scope.post.user_id=$rootScope.currentUser._id;
        angular.forEach($scope.post.services, function(value_object, key) {
            angular.forEach(value_object, function(inner_val, inner_key){
                if(inner_val == false){
                    delete $scope.post.services[key];
                }
            })
        });
        angular.forEach($scope.post.highlights, function(value_object, key) {
            angular.forEach(value_object, function(inner_val, inner_key){
                if(inner_val == false){
                    delete $scope.post.services[key];
                }
            })
        });
        Business.add($scope.post).then(function(res){
//            console.log(res)
            if(res.status==true){
                $state.go('registerBusinessSuccess')
            }
        })
        //return false;
        
    }
    $scope.activebutton=1;
    $scope.currentActiveButton=1;
    $scope.moveback=function(state,step){
        $scope.currentActiveButton=step;
        $state.go(state)
    }
    $scope.movetocost=function(){
        $scope.activebutton=2;
        $scope.currentActiveButton=2;
        $state.go('registerBusiness.serviceandcost')
    }
    $scope.movetocontact=function(){
        $scope.activebutton=3;
        $scope.currentActiveButton=3;
        $state.go('registerBusiness.contact')
    }
    $scope.movetoawards=function(){
        $scope.activebutton=4;
        $scope.currentActiveButton=4;
        $state.go('registerBusiness.awards')
    }
});
app.controller('marketPlaceCtrl',function($scope,$state,Business,VendorTypes,Cities,$rootScope){
    $rootScope.activePage={
        marketplace:true
    }
    console.log($rootScope.activePage)
    // list all vendor types
    VendorTypes.all().then(function(res){
        if(res.status==true){
            $scope.VendorTypes = res.data
        }
    })
    // list all cities
    Cities.all().then(function(res){
        if(res.status==true){
            $scope.cities = res.data
        }
    })
    // List all business
    Business.findByStatus({status:true}).then(function(res){
        if(res.status==true){
            $scope.businesses = res.data
        }
    })
    $scope.filter={};
    $scope.updateFilter = function(){
        $scope.filter.status=true;
        if($scope.filter.vendortype_id ==''){
            delete $scope.filter.vendortype_id;
        }
        Business.filter($scope.filter).then(function(res){
            if(res.status==true){
                $scope.businesses = res.data
            }
        })
    }
})

app.controller('vendorProfileCtrl',function($scope,$stateParams,Business){
    Business.findById({'id':$stateParams.id}).then(function(res){
        if(res.status==true){
            $scope.business = res.data
        }
    })
})