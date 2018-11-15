app.controller('LoginCtrl', function ($scope,Users,$state,$rootScope,toastr,Cities,$window) {
    $scope.user={};
    // If err exists, show toast messsage
     
    if($window.location.search.substring(1)=='err'){
        toastr.error('Invalid credentials!','Alert!');
    }
    $scope.login = function(){
        Users.login($scope.user).then(function(res){
            //console.log(res)
            if(res.status==true){
                toastr.success(res.message,'Success!');
                //$rootScope.currentUser = res.data;
                $state.go('selectActivity');
            }else{
                toastr.error(res.message,'Alert!');
            }
            
        })
    }
    $scope.showpwd=function(){
        var x = document.getElementById("eye");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }
    // Fetch Cities
    Cities.all().then(function(res){
        if(res.status==true){
            $scope.cities = res.data
        }
    })
    //Fill contact Form and send msg to DOST@spectra
    $scope.data={}
    $scope.button = 'Submit'
    $scope.contact = function(){
//        console.log($scope.data);
$scope.button='Submitting'
        if($scope.data.phone!='undefined'){
            Users.contact($scope.data).then(function(res){
                if(res.status==true){
                    $scope.button='Sent'
                    var element = angular.element('#contactus');
                    element.modal('hide');
                    toastr.success(res.message,'Success!');
                    $scope.data={}
                    $scope.button='Submit'
                }else{
                    toastr.error(res.message,'Alert!');
                }

            })
        }else{
            toastr.error('Enter valid phone number','Alert!');
        }
        
    }
    /*
     * Youtube video stop on close
     */
    $scope.stopVideo = function(){
        $('iframe').attr('src', $('iframe').attr('src'));
        var element = angular.element('#myModalcheckout');
        element.modal('hide');

    }
    /*$('.stop-video').click(function(){
        console.log('abc')
	$('.youtube-video')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        
        var element = angular.element('#myModalcheckout');
        element.modal('hide');
});*/
});
app.controller('SignupCtrl', function ($scope,Users,$state, $rootScope,toastr,Cities) {
    $scope.user=$rootScope.CurrentUser;
    $scope.titleSelected=true;
    // Fetch Cities
    Cities.all().then(function(res){
        if(res.status==true){
            $scope.cities = res.data
        }
    })
    /*
     * Get OTP
     * @params phone
     */
    $scope.getOTP = function(){
        console.log('me works')
        Users.getOtp({phone:$rootScope.CurrentUser.phone}).then(function(res){
            console.log(res)
            if(res.status==true){
                $scope.nextPrev(1);
            }else{
                toastr.error(res.message, 'Alert!')
                console.log(res.message)
                // err section
            }
        })
    }
    $scope.otpInput={
            size:6,
            type:"text",
            onDone: function(value){
                console.log(value);
                $scope.user.otp_code =value;
            },
            onChange: function(value){
                console.log(value);
            }
        };
    /*
     * Validate OTP
     * @params otp_code
     */
    $scope.verifyOTP = function(){
        
        $scope.data={"otp_code":$scope.otpInput.value}
        console.log($scope.user.otp_code)
        Users.verifyOtp($scope.data).then(function(res){
            if(res.status==true){
                $scope.nextPrev(1);
            }else{
                toastr.error(res.message, 'Alert!')
                console.log('err');
            }
        })
    }
    /*
     * set Password & create New User
     * Autologin
     */
    $scope.setPassword=function(){
        console.log($scope.user)
        $rootScope.CurrentUser.password=$scope.user.password;
        Users.add($rootScope.CurrentUser).then(function(res){
            if(res.status==true){
                Users.login({'phone':$rootScope.CurrentUser.phone,'password':$rootScope.CurrentUser.password}).then(function(loginres){
                    if(loginres.status==true){
                        // navigate to select activity page
                        $state.go('selectActivity');
                    }else{
                        toastr.error(res.message, 'Alert!')
                        console.log('err');
                    }
                })
            }
        })
        
    }
    /*
     * Tabs to navigate the form in steps
     */
    $scope.currentTab = 0; // Current tab is set to be the first tab (0)
    
    $scope.validateForm=function() {
        // This function deals with validation of the form fields
        var x, y, i, valid = true;
        x = document.getElementsByClassName("tab");
        y = x[$scope.currentTab].getElementsByTagName("input");
        // A loop that checks every input field in the current tab:
        for (i = 0; i < y.length; i++) {
            // If a field is empty...
            if (y[i].value == "") {
                // add an "invalid" class to the field:
                y[i].className += " invalid";
                // and set the current valid status to false
                valid = false;
            }
        }
        // If the valid status is true, mark the step as finished and valid:
        if (valid) {
            document.getElementsByClassName("step")[$scope.currentTab].className += " finish";
        }
        return valid; // return the valid status
    }

    $scope.fixStepIndicator=function(n) {
        // This function removes the "active" class of all steps...
        var i, x = document.getElementsByClassName("step");
        for (i = 0; i < x.length; i++) {
            x[i].className = x[i].className.replace(" active", "");
        }
        //... and adds the "active" class on the current step:
        x[n].className += " active";
    }
    
    $scope.showTab = function(n) {
        // This function will display the specified tab of the form...
        var x = document.getElementsByClassName("tab");
        x[n].style.display = "block";
        //... and fix the Previous/Next buttons:
        if (n == 0) {
            document.getElementById("prevBtn").style.display = "inline";
        } else {
            document.getElementById("prevBtn").style.display = "inline";
        }
        if (n == (x.length - 1)) {
            document.getElementById("nextBtn").innerHTML = "Submit";
        } else {
            document.getElementById("nextBtn").innerHTML = "continue";
        }
        //... and run a function that will display the correct step indicator:
        $scope.fixStepIndicator(n)
    }
    $scope.showTab($scope.currentTab); // Display the crurrent tab
    $scope.nextPrev=function(n) {
        console.log('abc')
        // This function will figure out which tab to display
        var x = document.getElementsByClassName("tab");
        // Exit the function if any field in the current tab is invalid:
        if (n == 1 && !$scope.validateForm())
            return false;
        // Hide the current tab:
        x[$scope.currentTab].style.display = "none";
        console.log(x[$scope.currentTab])
        // Increase or decrease the current tab by 1:
        $scope.currentTab = $scope.currentTab + n;
        // if you have reached the end of the form...
        if ($scope.currentTab >= x.length) {
            // ... the form gets submitted:
            document.getElementById("regForm").submit();
            return false;
        }
        // Otherwise, display the correct tab:
        $scope.showTab($scope.currentTab);
    }

    
});
app.controller('selectActivityCtrl', function ($scope,Users,$state,Projects,$rootScope, $window) {
    if(!$rootScope.currentUser._id){
        var my_url = "http://"+$window.location.host;
        $window.location = my_url
    }
    $scope.user={}
    Projects.all().then(function(res){
        if(res.status==true){
            $scope.projects = res.data;
            $scope.project=res.data[0]
        }else{
            //toastr.error(res.message,'Alert!');
        }
    })
    $scope.navigateTo=function(){
        console.log($scope.user)
        // navigate to the selected activity
        $state.go($scope.user.selectactivity)
    }
});
app.controller('onBoardingCtrl',function($scope,Users,$state,$rootScope,$location,$window,toastr){
    console.log('onBoardingCtrl');
    $scope.user = {};
    $scope.PhoneAlreadyExists=function(){
        Users.PhoneExists({'phone':$scope.user.phone}).then(function(res){
            if(res.status==true){
               // $rootScope.phone=$scope.user.phone;
                $rootScope.CurrentUser=$scope.user;
                // navigate to next screen
                $state.go('register');
            }else{
                //show error
                toastr.error(res.message, 'Alert!')
            }
        })
    }
});
app.controller('forgotPasswordCtrl', function ($scope,Users,$state,$rootScope,toastr) {
    $scope.showpwd=function(){
        var x = document.getElementById("eye");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }
    $scope.user={}
    $rootScope.CurrentUser={}
    $scope.getOTP=function(){
        console.log('abc')
        if($scope.user.phone){
            $rootScope.CurrentUser.phone=$scope.user.phone;
        }
        
        Users.getOtpOnExistingMobile($scope.user).then(function(res){
            if(res.status==true){
                $scope.nextPrev(1);
            }else{
                toastr.error(res.message, 'Alert!')
                // err section
            }
        })
    }
     $scope.otpInput={
            size:6,
            type:"text",
            onDone: function(value){
                console.log(value);
              //  $scope.user.otp_code =value;
            },
            onChange: function(value){
                console.log(value);
            }
        };
    /*
     * Validate OTP
     * @params otp_code
     */
    $scope.verifyOTP = function(){
        $scope.data={"otp_code":$scope.otpInput.value}
        Users.verifyOtp($scope.data).then(function(res){
            if(res.status==true){
                $scope.nextPrev(1);
            }else{
                toastr.error(res.message, 'Alert!')
                console.log('err');
            }
        })
    }
    /*
     * set Password & create New User
     * Autologin
     */
    $scope.setPassword=function(){
        if($scope.user.password != $scope.user.re_password){
            toastr.error('New Password and Re-enter does not match', 'Alert!')
        }else{
            $rootScope.CurrentUser.password=$scope.user.password;
            Users.updatePassword($rootScope.CurrentUser).then(function(res){
                if(res.status==true){
                    $state.go('passwordSuccess');
                }
            })
        }
        
        
    }
    /*
     * Tabs Section
     */
    $scope.currentTab = 0; // Current tab is set to be the first tab (0)

    $scope.showTab=function(n) {
      // This function will display the specified tab of the form...
      var x = document.getElementsByClassName("tab");
      x[n].style.display = "block";
      //... and fix the Previous/Next buttons:
//      if (n == 0) {
//        document.getElementById("prevBtn").style.display = "inline";
//      } else {
//        document.getElementById("prevBtn").style.display = "inline";
//      }
      if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
      } else {
        document.getElementById("nextBtn").innerHTML = "Sent Otp";
      }
      //... and run a function that will display the correct step indicator:
      $scope.fixStepIndicator(n)
    }

    $scope.nextPrev=function(n) {
  // This function will figure out which tab to display
        var x = document.getElementsByClassName("tab");
        // Exit the function if any field in the current tab is invalid:
        if (n == 1 && !$scope.validateForm()) return false;
        // Hide the current tab:
        x[$scope.currentTab].style.display = "none";
        // Increase or decrease the current tab by 1:
        $scope.currentTab = $scope.currentTab + n;
        // if you have reached the end of the form...
        if ($scope.currentTab >= x.length) {
          // ... the form gets submitted:
          document.getElementById("regForm").submit();
          return false;
        }
        // Otherwise, display the correct tab:
        $scope.showTab($scope.currentTab);
      }

    $scope.validateForm=function() {
        // This function deals with validation of the form fields
        var x, y, i, valid = true;
        x = document.getElementsByClassName("tab");
        y = x[$scope.currentTab].getElementsByTagName("input");
        // A loop that checks every input field in the current tab:
        for (i = 0; i < y.length; i++) {
          // If a field is empty...
          if (y[i].value == "") {
            // add an "invalid" class to the field:
            y[i].className += " invalid";
            // and set the current valid status to false
            valid = false;
          }
        }
        // If the valid status is true, mark the step as finished and valid:
        if (valid) {
          document.getElementsByClassName("step")[$scope.currentTab].className += " finish";
        }
        return valid; // return the valid status
      }

    $scope.fixStepIndicator=function(n) {
        // This function removes the "active" class of all steps...
        var i, x = document.getElementsByClassName("step");
        for (i = 0; i < x.length; i++) {
          x[i].className = x[i].className.replace(" active", "");
        }
        //... and adds the "active" class on the current step:
        x[n].className += " active";
      }
      
    $scope.showTab($scope.currentTab); // Display the crurrent tab
});
app.controller('editUserCtrl',function($scope,$rootScope,Users,toastr, Cities){
//    console.log($rootScope.currentUser)
    Users.findById({'id':$rootScope.currentUser._id}).then(function(res){
        if(res.status==true){
            console.log(res)
            $scope.user = res.data
            $scope.user.dob=new Date($scope.user.dob);
        }else{
            toastr.error('Unable to get data!', 'Alert!')
        }
    })
    // Fetch Cities
    Cities.all().then(function(res){
        if(res.status==true){
            $scope.cities = res.data
        }
    })
    // upload image
    $scope.uploadFile = function(input) {
        $scope.loading = true;
        Users.uploadImage(input.files[0]).then(function(res) {
            $scope.loading = false;
            if (res) {                
                $scope.imgshow = res.location;
                $scope.user.image=$scope.imgshow;
            } 
        });
    };
    
    $scope.updateUser=function(){
        if($scope.imgshow){
            $scope.user.image = $scope.imgshow;
        }
        console.log($scope.user);
        Users.updateById($scope.user).then(function(res){
            if(res.status==true){
                toastr.success(res.message, 'Success!')
            }else{
                toastr.error('Unable to get data!', 'Alert!')
            }
        })
    }
    $scope.changePassword =function(){
        $scope.postdata={
            phone:$rootScope.currentUser.phone,
            password:$scope.user.password
        }
        Users.updatePassword($scope.postdata).then(function(res){
            if(res.status==true){
                toastr.success(res.message, 'Success!')
            }else{
                toastr.error(res.message, 'Alert!')
            }
        })
    }
    /*
     * Crop Image section starts here
     */
    $scope.myImage='';
    $scope.myCroppedImage='';
    $scope.uploading_button='Upload';
    
    var handleFileSelect=function(evt) {
        var element = angular.element('#crop_profile');
        element.modal('show');
        
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.myImage=evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    
    $scope.uploadProfileImage = function(){
        $scope.uploading_button='Uploading'
        Users.uploadBlob({user_id:$scope.user._id,image:$scope.myCroppedImage}).then(function(res){
//            console.log(res)
            if(res.status==true){
                $scope.uploading_button='Uploaded';
                var element = angular.element('#crop_profile');
                element.modal('hide');
                $scope.user.image=res.data.image;
                $scope.uploading_button='Upload';
            }else{
                toastr.error(res.message, 'Alert!')
            }
        })
    }
    
})