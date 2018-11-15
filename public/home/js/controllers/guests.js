//Guests page controller
app.controller('GuestsCtrl', function ($scope, $location,Projects,$rootScope, $state, Guests, $stateParams, toastr,Invitations,Hotels) {
    if($stateParams.id){
        /*
        * Get Current Project Detail
        */
       Projects.findById({'id':$stateParams.id}).then(function(res){
           if(res.status==true){
               $scope.project = res.data
               $scope.project.start_date=new Date($scope.project.start_date)
               $scope.project.end_date=new Date($scope.project.end_date)
           }
       })
    }
    //$scope.accommodation={}
    /*
     * Fetch List of Guests
     */
    $scope.data = {
        'from': 'Groom',
        'group': 'Family'
    }
    var query_data = {
        'id': $stateParams.id,
        'from': 'Groom',
        'group': 'Family',
        'event_id':$scope.event_id
    }
    Guests.findguestsbyProjectId(query_data).then(function (res) {
        console.log(res);
        if (res.status == true) {
            $scope.Guests = res.data;
            $scope.GuestsCount = res.data.length;
            $scope.group_name = query_data.group;
            $scope.events=res.event_data[0].events;
            $scope.event_id = $scope.events[0]._id;
            $scope.dataAccomodation.event_name = $scope.events[0].name;
            $scope.dataAccomodation.event_id =$scope.event_id;
            $scope.food.event_id =$scope.event_id;
            console.log($scope.Guests);
        }
    });
    $scope.GetValue = function () {
        $scope.Guests = [];
        $scope.guests_array = [];
        var group = $( "#myselect1" ).val();
        var query_data = {
            'id': $stateParams.id,
            'from': $scope.data.from,
            'group': $scope.data.group,
            'event_id':$scope.event_id
        };
        Guests.findguestsbyProjectId(query_data).then(function (res) {
            if (res.status == true) {
                console.log($scope.event_id)
                $scope.Guests = res.data;
                console.log($scope.Guests)
                $scope.v =false;
                setTimeout(
                    function() {
                        $scope.Guests.forEach(element => {
                            elem_exists = document.getElementById(element._id);
                            if(elem_exists){
                                document.getElementById(element._id).checked = false;
                            }
                            
                        });
                        if($scope.Guests.invited != 0){
                            console.log('invited');
                           $(".invite_not_sent").attr("disabled", true);
                        }else{
                            console.log('not_invited');
                          $(".invite_sent").attr("disabled", true);
                        }
                    }, 1000);
                $scope.GuestsCount = res.data.length;
                $scope.group_name = group;
                if($scope.guests_array.length != 0){
                    setTimeout(
                        function() {
                            $scope.guests_array.forEach(element => {
                                if(angular.element('#'+element._id).length){
                                    document.getElementById(element._id).checked = true;
                                   }     
                            });
                        }, 2000);
                }
            }
        });
    }
    /*
     * Fetch Accomodation details
     */
    $scope.dataAccomodation  = {
        'from': 'Groom',
        'group': 'Family'
    }
    $scope.accommodations={}
    $scope.GetAccomodation = function () {
        $scope.Guests = [];
        $scope.guests_array = [];
        var group = $( "#myselect1" ).val();
        var query_data = {
            'id': $stateParams.id,
            'from': $scope.dataAccomodation.from,
            'group': $scope.dataAccomodation.group,
            'event_id':$scope.dataAccomodation.event_id
        };
        Guests.findguestsbyProjectId(query_data).then(function (res) {
            if (res.status == true) {
//                console.log($scope.event_id)
                $scope.Guests = res.data;
                console.log($scope.Guests)
                $scope.v =false;
//                setTimeout(
//                    function() {
//                        $scope.Guests.forEach(element => {
//                            elem_exists = document.getElementById(element._id);
//                            if(elem_exists){
//                                document.getElementById(element._id).checked = false;
//                            }
//                            
//                        });
//                        if($scope.Guests.invited != 0){
//                            console.log('invited');
//                           $(".invite_not_sent").attr("disabled", true);
//                        }else{
//                            console.log('not_invited');
//                          $(".invite_sent").attr("disabled", true);
//                        }
//                    }, 1000);
                $scope.GuestsCount = res.data.length;
                $scope.group_name = group;
//                if($scope.guests_array.length != 0){
//                    setTimeout(
//                        function() {
//                            $scope.guests_array.forEach(element => {
//                                if(angular.element('#'+element._id).length){
//                                    document.getElementById(element._id).checked = true;
//                                   }     
//                            });
//                        }, 2000);
//                }
            }
        });
    }
    /*
     * Send Request msg/email for Accomodation
     */
    $scope.SendAccomodationRequest = function(){
        var myArray=[];
        for (var key in $scope.accommodations.check) {
            if($scope.accommodations.check[key] === false) {
                delete $scope.accommodations.check[key];
            } else {
                console.log(key)
                var arr = key.split("_");
                console.log(arr)
                myArray.push(arr[1]);
            }
        }
        var updated_data =[]
        Object.keys($scope.Guests).map(function(objectKey, index) {
            var value = $scope.Guests[objectKey];
            var n = myArray.includes(value.phone);
            if(myArray.includes(value.phone)){
                updated_data.push(value)
            }
        });
        $scope.dataAccomodation.request_to = myArray;
        $scope.dataAccomodation.data_to_send = updated_data;
        $scope.dataAccomodation.project_id = $stateParams.id
        $scope.dataAccomodation.project = {
                    'name':$scope.project.name,
                    'bride_name':$scope.project.bride.name,
                    'groom_name':$scope.project.groom.name
                }
        $scope.dataAccomodation.username=$rootScope.currentUser.firstname
        $scope.dataAccomodation.event_name = $( "#accselect option:selected" ).text();
//        console.log($scope.dataAccomodation);
//        return false;
        Invitations.SendAccomodationRequest($scope.dataAccomodation).then(function(res){
            console.log(res)
            if(res.status==true){
                toastr.success(res.message, 'Success!');
            }else{
                toastr.error(res.message, 'Alert!');
            }
        })
          
    }
    /*
     * Fetch hote details
     */
    $scope.getHotels = function(){
        Hotels.findByProjectId({
            project_id : $stateParams.id
        }).then(function(res){
            console.log(res);
            $scope.accommodation = {   }
            $scope.allHotels = res.data;
            $scope.accommodation.hotel = $scope.allHotels[0]._id
        })
    }

    $scope.getHotels();
    $scope.selectHotel = function(_id){
        console.log(_id)
        var hotels = $scope.allHotels;
        for(let i in hotels){
            if(_id == hotels[i]._id){
                $scope.accommodation.address = hotels[i].address;
                console.log($scope.accommodation.address);
            }
        }
    }
     /*
     * end hotels
     */


    /*
     * Fetch FoodRestrictions
     */
    $scope.food ={
        'from': 'Groom',
        'group': 'Family'
    }
    $scope.GetRestriction = function () {
        $scope.Guests = [];
        $scope.guests_array = [];
        var group = $( "#myselect1" ).val();
        var query_data = {
            'id': $stateParams.id,
            'from': $scope.food.from,
            'group': $scope.food.group,
            'event_id':$scope.food.event_id
        };
        Guests.findguestsbyProjectId(query_data).then(function (res) {
            if (res.status == true) {
//                console.log($scope.event_id)
                $scope.Guests = res.data;
                console.log($scope.Guests)
                $scope.v =false;
                $scope.GuestsCount = res.data.length;
                $scope.group_name = group;
            }
        });
    }
    /*
     * Send Request msg/email for Accomodation
     */
    $scope.SendFoodRestrictionsRequest = function(){
        var myArray=[];
        for (var key in $scope.food.check) {
            if($scope.food.check[key] === false) {
                delete $scope.food.check[key];
            } else {
                var arr = key.split("_");
                myArray.push(arr[1]);
            }
        }
        var updated_data =[]
        Object.keys($scope.Guests).map(function(objectKey, index) {
            var value = $scope.Guests[objectKey];
            var n = myArray.includes(value.phone);
            if(myArray.includes(value.phone)){
                updated_data.push(value)
            }
        });
        $scope.food.request_to = myArray;
        $scope.food.data_to_send = updated_data;
        $scope.food.project_id = $stateParams.id
        $scope.food.project = {
                    'name':$scope.project.name,
                    'bride_name':$scope.project.bride.name,
                    'groom_name':$scope.project.groom.name
                }
        $scope.food.username=$rootScope.currentUser.firstname
        $scope.food.event_name = $( "#foodselect option:selected" ).text();
       // console.log($scope.food); return false;
        Invitations.SendFoodRestrictionsRequest($scope.food).then(function(res){
            console.log(res)
            if(res.status==true){
                toastr.success(res.message, 'Success!');
            }else{
                toastr.error(res.message, 'Alert!');
            }
        })
          
    }
    /*$scope.GetGroupValue = function () {
        $scope.Guests = [];
        var from = $( "#myselect" ).val();
        var query_data = {
            'id': $stateParams.id,
            'from': $scope.data.from,
            'group': $scope.data.group,
            'event_id':$scope.event_id
        };
        Guests.findguestsbyProjectId(query_data).then(function (res) {
            if (res.status == true) {
                

                $scope.Guests = res.data;
                $scope.v =false;
                setTimeout(
                    function() {
                        $scope.Guests.forEach(element => {
                            document.getElementById(element._id).checked = false;
                            if($scope.Guests.invited != 0){
                                console.log('invited');
                               $(".invite_not_sent").attr("disabled", true);
                            }else{
                                console.log('not_invited');
                              $(".invite_sent").attr("disabled", true);
                            }
                        });
                    }, 1000);
                $scope.GuestsCount = res.data.length;
                $scope.group_name = $scope.data.group;
                if($scope.guests_array.length != 0){
                    setTimeout(
                        function() {
                            $scope.guests_array.forEach(element => {
                               if(angular.element('#'+element._id).length){
                                document.getElementById(element._id).checked = true;
                               }
                            });
                        }, 2000);
                }
            }
        });
        
    }*/
    $scope.guests_array = [];
    var counter = 0;
    $scope.getGuest = function (Guest, event) {
       
        
        console.log(Guest);
        if(Guest.invited != 0){
            console.log('invited');
           $(".invite_not_sent").attr("disabled", true);
        }else{
            console.log('not_invited');
          $(".invite_sent").attr("disabled", true);
        }
       
        if (event.target.checked == true) {
            $scope.guests_array.push(Guest);
            /*if ($scope.guests_array[counter - 1] == undefined) {
                $scope.guests_array.push(Guest);
                counter++;
            } else {
                if ($scope.guests_array[$scope.guests_array.length - 1].invited == Guest.invited.length) {
                    $scope.guests_array.push(Guest);
                    counter++;
                } else {
                    toastr.error('You can either send invitation or reminder', 'Alert!');
                }

            }*/

        } else {
            $scope.guests_array.splice($scope.guests_array.findIndex(function (i) {
                return i.email === Guest.email;
            }), 1);

        }
        if($scope.guests_array.length == 0){
            $(".invite_sent").attr("disabled", false); 
            $(".invite_not_sent").attr("disabled", false);
        }
         console.log($scope.guests_array);
    }
    $scope.sendInvitation = function(data){
        
        var myArray = []
        var updated_data = []
        $.each($("#group_1 input[type='checkbox']:checked"), function(){
            var key = $(this).attr('id')
            var arr = key.split("_");
            myArray.push(arr[1]);
        });
        Object.keys($scope.Guests).map(function(objectKey, index) {
            var value = $scope.Guests[objectKey];
            var n = myArray.includes(value.phone);
            if(myArray.includes(value.phone)){
                updated_data.push(value)
            }
        });
        
        if($scope.event_id == undefined){
            toastr.error('Please select the event first', 'Alert!');
        }else{
            var d = new Date($scope.project.start_date)
            
            var data_to_send = {
                'data_to_send':updated_data,
                'event_id':$scope.event_id,
                'project':{
                    'name':$scope.project.name,
                    'bride_name':$scope.project.bride.name,
                    'groom_name':$scope.project.groom.name,
                    'start_date':d.getDate()+"."+d.getMonth()+"."+d.getFullYear()
                },
                'username':$rootScope.currentUser.firstname,
                'event_name':$( "#invitationSelect option:selected" ).text()
            };
            if($("#invitationSelect").val()=='all'){
                $scope.all_events = []
                console.log($scope.events);
                console.log($scope.events.length);
                angular.forEach($scope.events,function(value,key){
                    $scope.all_events.push(value._id)
                })
                console.log($scope.all_events)
                data_to_send.event_id=$scope.all_events;
            }
            console.log(data_to_send)
            Invitations.sendInvitation(data_to_send).then(function (res) {
                
                if(res.status==true){
                    $scope.Guests = res.data;
                    toastr.success(res.message,'Success!');
                    document.getElementsByClassName("checked_will_be_unckecked").checked = false;
                }else{
                    toastr.error(res.message,'Alert!');
                }
            });
        }
    }
    /*
     * Send Reminder
     */
    $scope.sendReminder = function(data){
        var myArray = []
        var updated_data = []
        $.each($("#group_1 input[type='checkbox']:checked"), function(){
            var key = $(this).attr('id')
            var arr = key.split("_");
            myArray.push(arr[1]);
        });
        Object.keys($scope.Guests).map(function(objectKey, index) {
            var value = $scope.Guests[objectKey];
            var n = myArray.includes(value.phone);
            if(myArray.includes(value.phone)){
                updated_data.push(value)
            }
        });
        
        if($scope.event_id == undefined){
            toastr.error('Please select the event first', 'Alert!');
        }else{
            var d = new Date($scope.project.start_date)
            var data_to_send = {
                'data_to_send':updated_data,
                'event_id':$scope.event_id,
                'project':{
                    'name':$scope.project.name,
                    'bride_name':$scope.project.bride.name,
                    'groom_name':$scope.project.groom.name,
                    'start_date':d.getDate()+"."+d.getMonth()+"."+d.getFullYear()
                },
                'username':$rootScope.currentUser.firstname,
                'event_name':$( "#invitationSelect option:selected" ).text()
            };
            Invitations.sendReminder(data_to_send).then(function (res) {
                
                if(res.status==true){
                    $scope.Guests = res.data;
                    toastr.success(res.message,'Success!');
                    document.getElementsByClassName("checked_will_be_unckecked").checked = false;
                }else{
                    toastr.error(res.message,'Alert!');
                }
            });
        }
    }
    /*
     * Select all checkboxes in Invitation tab
     */
    $scope.invitation_all_value = function(invitation_all){
        if(invitation_all == true){
            console.log($("#group_1 input[type='checkbox']"))
            $("#group_1 input[type='checkbox']").prop('checked', true);
        }else{
            $("#group_1 input[type='checkbox']").prop('checked', false);
        }
        console.log($scope.Guests)
    }
    /*
     * Update Hotel and driver details
     */
    //
    $scope.updateHotelDetails = function(invitation_id,accommodation){
        console.log($scope.dataAccomodation.event_id)
        //console.log(accommodation)
        accommodation.locked_details=false;
        Invitations.AccommodationDetails({_id:invitation_id,event_id: $scope.dataAccomodation.event_id,accommodation:accommodation}).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
                var element = angular.element('#accommodationModal');
                element.modal('hide');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Notify Guest
     */
    $scope.NotifyGuest = function(invitation_id,accommodation){
        console.log($scope.dataAccomodation.event_id)
        //console.log(accommodation)
        accommodation.locked_details=true;
        Invitations.AccommodationDetails({_id:invitation_id,event_id: $scope.dataAccomodation.event_id,accommodation:accommodation}).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
                var element = angular.element('#accommodationModal');
                element.modal('hide');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
});
/*
 *  My Invitations Page in Guest View
 */
app.controller('MyInvitationsCtrl', function ($scope, $state, Invitations, $rootScope, toastr) {
        $scope.userphone = $rootScope.currentUser.phone;
        Invitations.myInvitations({phone:$scope.userphone}).then(function(res){
            if(res.status==true){
                $scope.myInvitations = res.data;
                console.log($scope.myInvitations)
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
        
        //Fetch Invitations 
        $scope.myallInvitations = function(){
            Invitations.myInvitations({phone:$scope.userphone}).then(function(res){
                if(res.status==true){
                    $scope.myInvitations = res.data;
                    console.log($scope.myInvitations)
                }else{
                    //toastr.error(res.message,'Alert!');
                }
            })
        }
        
        $scope.response = function(invitation_id,invitation_response){
            Invitations.response({_id:invitation_id,status:invitation_response}).then(function(res){
                if(res.status==true){
                    var element = angular.element('#myModal'+invitation_id);
                    element.modal('hide');
                    toastr.success(res.message,'Alert!');
                    $scope.myallInvitations();
                }else{
                    toastr.error(res.message,'Alert!');
                    $scope.myallInvitations();
                }
            })
        }
})
app.controller('InvitationDetailCtrl',function($scope,$stateParams,Invitations,toastr,$rootScope,Guests,Cities,filterFilter, FoodRestrictions){
    //console.log('fvh')
    $scope.invitation_id= $stateParams.id;
    $scope.accommodation={};
    $scope.allRestrictions = []
    $scope.data = {}
    Invitations.findById({id:$scope.invitation_id,event_id:$stateParams.event_id}).then(function(res){
        console.log(res)
        if(res.status==true){
            $scope.invitation = res.data
             $scope.data.type={}
            $scope.invitation.eventsInvited[0].guest_response.food_restrictions.forEach(function(element) {
                $scope.data.type[element]=true
              });
            $scope.project_id = $scope.invitation._id.project_id
            console.log($scope.invitation)
            $scope.fetchGuests();
            $scope.getRestrictions();
        }else{
            toastr.error(res.message,'Alert!');
        }
    })
    /*
     * RSVP from guest
     */
    $scope.attending=3
    $scope.response = function(){
        console.log($scope.attending); //return false;
        Invitations.response({invitation_id:$stateParams.id,event_id:$stateParams.event_id, attending_status:$scope.attending}).then(function(res){
            console.log(res)
            if(res.status==true){
                //var element = angular.element('#myModal'+invitation_id);
               // element.modal('hide');
                toastr.success(res.message,'Alert!');
               // $scope.myallInvitations();
            }else{
                toastr.error(res.message,'Alert!');
              //  $scope.myallInvitations();
            }
        })
    }
    /*
     * Add Accommodation Details
     */
    $scope.addAccommodationDetails=function(){
        console.log($scope.accommodation); //return false;
        Invitations.AccommodationDetails({_id:$scope.invitation_id,event_id: $stateParams.event_id,accommodation:$scope.accommodation}).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
                var element = angular.element('#accommodationModal');
                element.modal('hide');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }


    ///// fetch food restrictions


    $scope.allRestrictions = [];
    $scope.getRestrictions = function(){
        console.log($scope.project_id);
        FoodRestrictions.findByProjectId({
            project_id :$scope.project_id
        }).then(function(res){ 
            console.log()
            $scope.allRestrictions = res.data;
            var data = res.data;
            for(let i in data){
                console.log(data[i])
                $scope.data.type[data[i].name] = true;
            }

            console.log($scope.data);
        })
    }
    

    /*
     * Add food Restrictions
     */
//    $scope.data = {
//        //type:[],
//        //'meals':'1 Meal'
//    }
    $scope.showAddArea = false;
    $scope.addRestriction = function(){
        console.log($scope.data.type);
        var myArray=[];
        for (var key in $scope.data.type) {
            if($scope.data.type[key] === false) {
                delete $scope.data.type[key];
            } else {
//                console.log(key)
                    myArray.push(key);
            }
          }
          
          console.log(myArray); 
          
//        return false;
        Invitations.AddFoodRestrictions({_id:$scope.invitation_id,event_id: $stateParams.event_id,food_restrictions:myArray}).then(function(res){
            console.log(res)
            if(res.status==true){
                toastr.success(res.message,'Success!');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Remove Food Restriction
     */
    $scope.removeFoodRestriction = function(){
//        console.log(restriction_id)
        Invitations.RemoveFoodRestriction({_id:$scope.invitation_id,event_id: $stateParams.event_id}).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Update Food Restriction
     */
    $scope.updateFoodRestriction = function(restriction_id, meals){
        Invitations.updateFoodRestriction({_id:$scope.invitation_id,restriction_id:restriction_id,meals:meals}).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Guests Part
     * add new guests here
     */
     // Fetch Cities
    Cities.all().then(function(res){
        if(res.status==true){
            $scope.cities = res.data
        }
    })
    $scope.guest={'from':'Groom','group':'Family','location':'Chandigarh'}
    
    $scope.fetchGuests = function(){
        console.log('fgh'+$scope.project_id)
        if(typeof $scope.project_id!='undefined'){
            Guests.addedByMe({project_id:$scope.project_id,user_id: $rootScope.currentUser._id}).then(function(response){
                if(response.status==true){
                    $scope.allguests=response.data
                }
            })
        }
    }
    
    $scope.addGuestMe=function(){
        
        $scope.guest.posted_by_label='Guest';
        $scope.guest.project_id=$scope.project_id;
        $scope.guest.posted_by=$rootScope.currentUser._id;
        //console.log($scope.guest); return false;
        Guests.add($scope.guest).then(function(res){
            console.log(res)
            if(res.status==true){
                toastr.success(res.message,'Success!');
                $scope.guest={'from':'Groom'}
                /*
                * Fetch all guests using project id and posted_by
                */
                $scope.fetchGuests();
                var element = angular.element('#addGuestModal');
                element.modal('hide');
                
                // Send Invitation to Guest
                $scope.invitation_data={
                    posted_by: $rootScope.currentUser._id,
                    project_id: $scope.project_id,
                    event_id:$scope.invitation.eventsInvited[0].event._id,
                    guest_id: res.data._id,
                    phone: res.data.phone,
                    email: res.data.email,
                    name:res.data.name,
                    event_name:$scope.invitation.eventsInvited[0].event.name,
                    project: {
                        name:$scope.invitation._id.project_name,
                        bride_name:$scope.invitation._id.bride_name,
                        groom_name:$scope.invitation._id.groom_name
                    },
                    user_name:$rootScope.currentUser.firstname+' '+$rootScope.currentUser.lastname
                }
                Invitations.sendInvitationToSingleGuest($scope.invitation_data).then(function(res_invitation){
                    console.log(res_invitation)
                    if(res_invitation.status==true){
                        toastr.success(res_invitation.message,'Success!');
                    }else{
                        toastr.error(res_invitation.message,'Alert!');
                    }
                })
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    
})
/*
 * Guest View Controller
 * @params: phone, project_id, invitation_code, project_id, invitation_id
 * @url : /project_id/phone/invitation_id
 */
app.controller('GuestViewCtrl',function($scope,$location,Invitations,$stateParams,$state,toastr){
    console.log('asdf'+window.location.protocol+"//"+window.location.hostname+'dost#/guestViewDetails/project_id/phone/invitation_id')
//    console.log($location.search().phone);
    $scope.data ={};
    $scope.verifyCode = function(){
        if(typeof $stateParams.phone != 'undefined'){
            // Verify code with invitation using phone number
            Invitations.fetchByCode({phone:$stateParams.phone,project_id: $stateParams.project_id,invitation_id:$stateParams.invitation_id, invitation_code: $scope.data.invitation_code}).then(function(res){
                console.log(res)
                if(res.status==true){
                    $state.go('guestViewDetails',{id:$stateParams.invitation_id})
                }else{
                    toastr.error(res.message,'Alert!')
                }
            })
        }
    }
    
})

/*
 * 
 */
app.controller('EventsCtrl',function($scope,$rootScope,Invitations){
    $scope.userphone = $rootScope.currentUser.phone;
    Invitations.myInvitations({phone:$scope.userphone}).then(function(res){
        if(res.status==true){
            $scope.myInvitations = res.data;
            console.log($scope.myInvitations)
            $scope.today = new Date();
            $scope.allEvents =[]
            $scope.onGoingEvents =[]
            $scope.upComingEvents =[]
            
            $scope.myInvitations.forEach(element => {
                element.eventsInvited.forEach(eachEvent=>{
                    eachEvent.project_details = element._id
                    var start_date = new Date(eachEvent.event.start_date);
                    var end_date = new Date(eachEvent.event.end_date);
                    if($scope.today>=start_date && $scope.today <=end_date){
                        $scope.onGoingEvents.push(eachEvent)
                    }else if($scope.today<end_date){
                        $scope.upComingEvents.push(eachEvent)
                    }else if($scope.today<start_date){
                        $scope.upComingEvents.push(eachEvent)
                    }
                    $scope.allEvents.push(eachEvent)
                })
            });
            console.log($scope.allEvents)
            console.log($scope.onGoingEvents)
            console.log($scope.upComingEvents)
        }else{
            toastr.error(res.message,'Alert!');
        }
    })
})
