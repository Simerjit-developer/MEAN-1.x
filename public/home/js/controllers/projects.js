app.controller('createProjectCtrl', function ($scope,$state,$rootScope,toastr,Projects,Events,Cities) {
    // get all vendor types
    $scope.post={
        team:[
            {
                email: $rootScope.currentUser.email,
                phone: $rootScope.currentUser.phone,
                name: $rootScope.currentUser.firstname+" "+$rootScope.currentUser.lastname
            }
        ]
    }
    $scope.post.start_date=new Date();
    $scope.post.min_date=new Date();
    $scope.createProject=function(){
        $scope.post.user_id=$rootScope.currentUser._id;
        Projects.add($scope.post).then(function(res){
            console.log(res)
            if(res.status==true){
                $scope.post={};
                toastr.success(res.message,'Success!');
                $state.go('projectlist');
               // $state.go('registerBusinessSuccess')
            }else{
                if(res.err){
                    toastr.error(res.err.message,'Alert!');
                }else{
                    toastr.error(res.message,'Alert!');
                }
                
            }
        })
    }
    $scope.saveAsDraft = function(){
        $scope.post.user_id=$rootScope.currentUser._id;
        $scope.post.status=0;
        Projects.add($scope.post).then(function(res){
            if(res.status==true){
                $scope.post={};
                toastr.success('Project saved to drafts','Success!');
                $state.go('projectlist');
               // $state.go('registerBusinessSuccess')
            }else{
                
                toastr.error(res.err.message,'Alert!');
            }
        })
    }
    // Fetch all events
    Events.all().then(function(res){
        $scope.events=res.data;
    })
    // Fetch Cities
    Cities.all().then(function(res){
        if(res.status==true){
            $scope.cities = res.data
            console.log($scope.cities);
        }
    })
    
    
    $scope.activebutton=1;
    $scope.currentActiveButton=1;
    $scope.moveback=function(state,step){
        $scope.currentActiveButton=step;
        $state.go(state)
    }
    $scope.movetonext=function(state, step){
       // console.log(state)
        if(typeof($scope.eventcount)){
            $scope.eventcount=$scope.post.no_of_events
        }
        if($scope.post.end_date){
            $scope.activebutton=step;
            $scope.currentActiveButton=step;
            $state.go(state)
        }else{
            toastr.error('Kindly fill end date','Alert!');
        }
        
    }
    /*
     * Add event Count
     */
    $scope.incCount=function(){
        $scope.eventcount = parseInt($scope.eventcount)+1
       // console.log($scope.eventcount)
    }
    
})
app.controller('projectlistCtrl',function($scope,Projects,toastr,$rootScope,$state,$ngConfirm,Clients){
    // Show active based on the url
    $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){ 
        $rootScope.activePage={
            home:false,
            projects:false,
            planner:false,
            marketplace:false,
            jobs: false,
            performance:false,
            innerSidebar:{},
        }
        if($state.current.name=='projectlist' || $state.current.name=='viewProject'){
            $rootScope.activePage.projects=true;
        }
        if($state.current.name=='marketPlace'){
            $rootScope.activePage.marketplace=true;
        }
        if($state.current.name=='taskList'|| $state.current.name=='teamList'|| $state.current.name=='guests'|| $state.current.name=='jobs'){
            $rootScope.activePage.planner=true;
            if($state.current.name=='taskList'){
                $rootScope.activePage.innerSidebar.taskList=true
            }else if($state.current.name=='teamList'){
                $rootScope.activePage.innerSidebar.teamList=true
            }else if($state.current.name=='guests'){
                $rootScope.activePage.innerSidebar.guests=true
            }else if($state.current.name=='jobs'){
                $rootScope.activePage.innerSidebar.jobs=true
            }
        }
    })
    $rootScope.activePage={projects:true}
    
    $scope.selected_view = 'list';
    // Rename a Project by Id
    $scope.renameproject={}
    $scope.rename=function(){
        Projects.renameProject($scope.renameproject).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
                var element = angular.element('#myModal');
                    element.modal('hide');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    // Find my Projects
    $scope.my_projects = function(){
        $scope.assigned_projects_active=false;
        $scope.projects=[]
        console.log('my_projects'); //return false;
        Projects.findByUserId({user_id:$rootScope.currentUser._id}).then(function(res){
            console.log(res)
        if(res.status==true){
            $scope.projects = res.data;
            $scope.length={
                all:res.data.length,
                active:0,
                completed:0,
                drafts:0,
            }
            //console.log($scope.projects)
            for(var i=0; i<res.data.length;i++){
                if(typeof(res.data[i].draft)!='undefined'){
                    if(res.data[i].status==0){
                        $scope.length.drafts = $scope.length.drafts+1
                    }else if(res.data[i].status==1){
                        $scope.length.active = $scope.length.active+1
                    }else if(res.data[i].status==2){
                        $scope.length.completed = $scope.length.completed+1
                    }
                }
                
            }
            console.log($scope.length)
        }else{
            toastr.error(res.message,'Alert!');
        }
    })
    }
    $scope.my_projects();
    
    // Fetch Assigned Projects
    $scope.assigned_projects = function(){
        $scope.assigned_projects_active=true;
        $scope.projects=[]
        Clients.findByPhone({phone:$rootScope.currentUser.phone}).then(function(clients_res){
            if(clients_res.status == true){
                if(clients_res.data.length ==0){
                    //No data found
                }else{
                    console.log(clients_res.data)
                    var my_assigned_ids = []
                    for(var c_i=0; c_i<clients_res.data.length;c_i++){
                        my_assigned_ids.push(clients_res.data[c_i].project_id)
                    }
                    if(my_assigned_ids.length>0){
                        //Fetch assigned project details
                        // 
                        Projects.fetchDetails({project_id:my_assigned_ids,phone:$rootScope.currentUser.phone}).then(function(projects_res){
                            if(projects_res.status == true){
                                $scope.projects = projects_res.data; 
                                $scope.length={
                                    all:projects_res.data.length,
                                    active:0,
                                    completed:0,
                                    drafts:0,
                                }
                                if(projects_res.data.length >0){
                                    for(var i=0; i<projects_res.data.length;i++){
                                        for( var j=0; j<clients_res.data.length; j++){
                                            if(clients_res.data[j].project_id == projects_res.data[i]._id){
                                                $scope.projects[i].my_permissions = {}
                                                $scope.projects[i].my_permissions.share_metrics=clients_res.data[j].share_metrics
                                                $scope.projects[i].my_permissions.allow_guest_upload=clients_res.data[j].allow_guest_upload
                                            }
                                        }
                                        if(typeof(projects_res.data[i].draft)!='undefined'){
                                            if(projects_res.data[i].status==0){
                                                $scope.length.drafts = $scope.length.drafts+1
                                            }else if(projects_res.data[i].status==1){
                                                $scope.length.active = $scope.length.active+1
                                            }else if(projects_res.data[i].status==2){
                                                $scope.length.completed = $scope.length.completed+1
                                            }
                                        }
                                    }
                                }
                                console.log($scope.projects)
                            }
                        })
                    }
                }
                
            }
        })
    }
    // Delete Project by id
    $scope.deletePost = function(title, id){
        $scope.hey = title;
//        console.log(id)
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
                        Projects.removebyId(id).then(function(response){
                            if(response.status == true){
                                toastr.success(response.message);
                                Projects.findByUserId({user_id:$rootScope.currentUser._id}).then(function(res){
                                    if(res.status==true){
                                        $scope.projects = res.data;
                                    }else{
                                        toastr.error(res.message,'Alert!');
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
})
app.controller('viewProjectCtrl',function($scope,$stateParams,Projects,toastr){
    Projects.findById({'id':$stateParams.id}).then(function(res){
        if(res.status==true){
            $scope.project = res.data
        }
    })
})
app.controller('projectInputCtrl',function($scope,$timeout,$stateParams,$sce,Cities,$ngConfirm,Projects,VendorTypes,Fields,Guests,$rootScope,$location,toastr,Events,JobPosts, Milestones, Hotels,FoodRestrictions){
     //angular.element('#pills-guests').triggerHandler('click');
    $timeout(function() {
        if($location.search().view=='guest'){
            angular.element('.nav-pills-main .nav-link').removeClass('active')
            angular.element('#pills-guests').addClass('active');
            angular.element('.tab-pane').removeClass('active show')
            angular.element('#event-guests').addClass('active show')
            
            // Hide other Tabs
            angular.element('#pills-basic-info').hide()
            angular.element('#pills-event-flow').hide()
            angular.element('#pills-team').hide()
            angular.element('#pills-event-manager').hide()
            
        }else if($location.search().view=='guest_update'){
            angular.element('.nav-pills-main .nav-link').removeClass('active')
            angular.element('#pills-guests').addClass('active');
            angular.element('.tab-pane').removeClass('active show')
            angular.element('#event-guests').addClass('active show')
        }else if($location.search().view=='eventmanager'){
            angular.element('.nav-pills-main .nav-link').removeClass('active')
            angular.element('#pills-event-manager').addClass('active');
            angular.element('.tab-pane').removeClass('active show')
            angular.element('#event-manager').addClass('active show')
        }
        console.log($location.search())
        
  });
    $scope.editable={
        project:false,
        brideandgroom:false,
        client:false,
        eventflow: false
    }
    $scope.focusInput=false;
    // Make insecure url to secure
    $scope.trustUrl=function(image){
        return $sce.trustAsResourceUrl(image);
    }
    
    // Fetch Cities
    Cities.all().then(function(res){
        if(res.status==true){
            $scope.cities = res.data
        }
    })
    
    // Fetch all events
    Events.all().then(function(res){
        $scope.events=res.data;
    })
    // Fetch all Vendortypes along with their services
    VendorTypes.vendortypesWithServices().then(function(res){
        $scope.vendorTypes = res.data;
    })
    
    $scope.newMilestone={}
    
    $scope.ctrl ={}
    $scope.ctrl.min_date = new Date();
    $scope.ctrl.max_date = new Date();
    $scope.changeToDate = function(event){
        if(typeof event.end_date=='undefined'){
            var duration_arr = event.duration.split(" ");
            if(typeof event.start_date !='undefined'){
                var startDate = new Date(event.start_date)
                event.end_date = new Date(
                                startDate.getFullYear(),
                                startDate.getMonth(),
                                startDate.getDate() + parseInt(duration_arr[0]),
                                startDate.getHours(),
                                startDate.getMinutes(),
                                startDate.getSeconds());
            }
        }
        if(typeof event!='undefined'){
           $scope.ctrl.min_date =new Date(event.start_date)
           $scope.ctrl.max_date =new Date(event.end_date)
           if(typeof $scope.newMilestone.date =='undefined'){
               $scope.newMilestone.date=$scope.ctrl.min_date
           }
        }
    }
    
    //console.log($stateParams.id)
    if($stateParams.id){
        Projects.findById({'id':$stateParams.id}).then(function(res){
           // console.log(res.data)
        if(res.status==true){
            $scope.originalProject = res.data
            $scope.project = res.data
//            console.log($scope.project)
            $scope.project.start_date = new Date($scope.project.start_date)
            $scope.project.end_date = new Date($scope.project.end_date)
            
            //console.log($scope.project)
            if(typeof $scope.project.draft == 'undefined' || $scope.project.draft.length == 0){
                $scope.project.draft = $scope.project;
            }
            if($scope.project.draft.length>0){
                $scope.project.draft=$scope.project.draft[0]
            }
            // Add vendors for each event
            angular.forEach($scope.project.draft.events,function(value,key){
                var event_id = value._id;
                JobPosts.vendorsByEvent({event_id:event_id,project_id:$stateParams.id}).then(function(response){
                    if(response.status==true){
                        if(response.data.length>0){
                            $scope.project.draft.events[key].vendors=response.data
                        }
                    }
                })
            })
            // Add milestones for each Event
            angular.forEach($scope.project.draft.events,function(value,key){
                var event_id = value._id;
                Milestones.miletsonesByEvent({event_id:event_id,project_id:$stateParams.id}).then(function(response){
                    if(response.status==true){
                        if(response.data.length>0){
                            $scope.project.draft.events[key].milestones=response.data
                        }
                    }
                })
            })
        }
        /*
         * Fetch all guests using project id
         */
       if(typeof $scope.project!='undefined'){
           //console.log('me')
           Guests.findByProject({project_id:$scope.project._id}).then(function(res){
               if(res.status==true){
                   $scope.allguests=res.data
                   $scope.familyCount =0;
                   $scope.friendsCount =0;
                   $scope.othersCount =0;
                   angular.forEach($scope.allguests,function(value,key){
                     //  console.log(value)
                       if(value.group=='Family'){
                           $scope.familyCount=$scope.familyCount+1;
                       }else if(value.group=='Friends'){
                           $scope.friendsCount=$scope.friendsCount+1;
                       }else{
                           $scope.othersCount=$scope.othersCount+1;
                       }
                   })
               }
           })
       }
       
       angular.equals($scope.originalProject.draft, $scope.project.draft)
    })
    // Fetch Vendors by Events to show in planner input section without reload
    $scope.vendorevents = function(){
        angular.forEach($scope.project.draft.events,function(value,key){
                var event_id = value._id;
                JobPosts.vendorsByEvent({event_id:event_id,project_id:$stateParams.id}).then(function(response){
                    if(response.status==true){
                        if(response.data.length>0){
                            $scope.project.draft.events[key].vendors=response.data
                        }
                    }
                })
            })
        }
    // Fetch Milestones based on events
    $scope.eventseperateMilestones =function(){
        angular.forEach($scope.project.draft.events,function(value,key){
            var event_id = value._id;
            Milestones.miletsonesByEvent({event_id:event_id,project_id:$stateParams.id}).then(function(response){
                if(response.status==true){
                    if(response.data.length>0){
                        $scope.project.draft.events[key].milestones=response.data
                    }
                }
            })
        })
    }
    //
    }
    
    /*
     * Fetch List of Projects
     */
    Projects.findByUserId({user_id:$rootScope.currentUser._id}).then(function(res){
        if(res.status==true){
            $scope.projectlist = res.data
          //  $scope.project=$scope.projectlist[0]
            //console.log($scope.project)
        }
    })
    /*
     * @function changeProject
     * @param {type} project_id
     * @returns {undefined} change the location of the path
     */
    $scope.changeProject = function(project_id){
        $scope.edit=false;
        for(var key in $scope.editable) {
            if($scope.editable[key]==true){
                $scope.edit=true;
            }
        }
        if($scope.edit == true){
            $ngConfirm({
            theme:'supervan',
            title: 'Alert!',
            content: 'Are you sure, you want to navigate? It will discard all the changes made by you in current project.',
            //contentUrl: 'template.html', // if contentUrl is provided, 'content' is ignored.
            scope: $scope,
            buttons: {   
                // long hand button definition
                ok: { 
                    text: "Yes!",
                    btnClass: 'btn-primary',
                    keys: ['enter'], // will trigger when enter is pressed
                    action: function(scope){
                        $scope.$apply(function(){
                            $location.path('project_input/'+project_id)
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
        }else{
            $location.path('project_input/'+project_id)
        }
    }
    $scope.accrodian =function (id){
        var x = document.getElementById("accoridan-one"+id);
        if (x.style.display === "block"){
            x.style.display = "none";
        }
        else{
            x.style.display = "block";
        }
    }
    $scope.accrodian2 =function (id){
        var x = document.getElementById("ven-add"+id);
        if (x.style.display === "block"){
            x.style.display = "none";
        }
        else{
            x.style.display = "block";
        }
    }
    $scope.accrodian3 = function (id){
        var x = document.getElementById("ven-sear"+id);
        if (x.style.display === "block"){
            x.style.display = "none";
        }
        else{
            x.style.display = "block";
        }
    }
    $scope.displayfun=function (){
            var x = document.getElementById("event-manager-tab");
            var y = document.getElementById("event-manager-tab-content");
            var z = document.getElementById("em-vr-id");
            x.style.display = "none";
            y.style.display = "none";
            if (z.style.display === "block"){
                    z.style.display = "none";
            }
            else{
                    z.style.display = "block";
            }
    }
    $scope.displayfuntoggle=function (){
            var x = document.getElementById("event-manager-tab");
            var y = document.getElementById("event-manager-tab-content");
            var z = document.getElementById("em-vr-id");
            z.style.display = "none"
            x.style.display = "flex";
            y.style.display = "block";
    }
    $scope.accrodian5=function(){
		var x = document.getElementById("add-ml-sec");
		if (x.style.display === "block"){
			x.style.display = "none";
		}
		else{
			x.style.display = "block";
		}
	}
//	$scope.accrodian6=function(){
//		var x = document.getElementById("auto-add-ml-sec");
//		if (x.style.display === "block"){
//			x.style.display = "none";
//		}
//		else{
//			x.style.display = "block";
//		}
//	}
    /*
     * Update draft fields for project
     */
    $scope.update=function(){
//        console.log($scope.project)
        $scope.newdata={
            _id:$scope.project._id,
            name:$scope.project.name,
            draft:$scope.project.draft
        }
        // Solution for Converting circular structure to JSON.
        var seen = []

        var json = JSON.stringify($scope.newdata, function(key, val) {
           if (typeof val == "object") {
                if (seen.indexOf(val) >= 0)
                    return
                seen.push(val)
            }
            return val
        })
        //$scope.project.user_id=$rootScope.CurrentUser._id;
        Projects.updateDraftById(json).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Push Draft information to live mode
     */
    $scope.pushLiveProject=function(){
        Projects.PushLive({_id:$scope.project._id}).then(function(res){
            if(res.status==true){
                $scope.editable={
                            project:false,
                            brideandgroom:false,
                            client:false,
                            eventflow: false
                        }
                toastr.success(res.message,'Success!');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Exit Draft Mode
     */
    $scope.exitDraftMode = function(){
//        angular.equals(obj1, obj2)
//        if($scope.edit == true){
            $ngConfirm({
            theme:'supervan',
            title: 'Alert!',
            content: 'Do you want to discard all the changes you have made?',
            //contentUrl: 'template.html', // if contentUrl is provided, 'content' is ignored.
            scope: $scope,
            buttons: {   
                // long hand button definition
                ok: { 
                    text: "Yes!",
                    btnClass: 'btn-primary',
                    keys: ['enter'], // will trigger when enter is pressed
                    action: function(scope){
                        $scope.$apply(function(){
                            $scope.editable={
                                project:false,
                                brideandgroom:false,
                                client:false,
                                eventflow: false
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
//        }else{
//           // $location.path('project_input/'+$scope.project._id)
//        }
    }
    /*
     * Add Event in draft mode
     */
    $scope.newEvent={}
    $scope.addNewEvent=function(){
       // console.log($scope.project)
        if($scope.project.draft.length==0){
            if(typeof $scope.newEvent.project_id == 'undefined'){
                $scope.newEvent.project_id=$scope.project._id
            }
            $scope.project.draft=$scope.project
            $scope.project.draft.events.push($scope.newEvent)
        }else{
            if(typeof $scope.newEvent.project_id == 'undefined'){
                $scope.newEvent.project_id=$scope.project._id
            }
            $scope.project.draft.events.push($scope.newEvent)
        }
//        console.log($scope.project)
        $scope.update();
        $scope.newEvent={}
        var element = angular.element('#AddEvent');
        element.modal('hide');
    }
    /*
     * Add Vendors in Draft
     */
    $scope.newVendor={};
    $scope.selServices=[];
    $scope.selectedServices = function(service){
        if($scope.selServices){
            if($scope.selServices.indexOf(service) !='-1'){
                var index = $scope.selServices.indexOf(service);
                $scope.selServices.splice(index, 1);
            }else{
                $scope.selServices.push(service)
            }
        }
    }
    $scope.addVendors = function(service,index){
        $scope.vendorRequirements = []
        angular.forEach(service, function(value, key){
            $scope.event_id = key;
            angular.forEach(value, function(innervalue, vendortype_id){
                angular.forEach(innervalue,function(serviceValue,serviceKey){
                    if(typeof serviceValue =='object'){
                        // service_id & vendortype_id exists
                        angular.forEach(serviceValue,function(eachValue,eachKey){
                            if(eachValue==true){
                                $scope.vendor={
                                    event_id:$scope.event_id,
                                    vendortype_id:vendortype_id,
                                    service_id:eachKey,
                                    posted_by:$rootScope.currentUser._id,
                                    project_id:$scope.project._id
                                }
                                $scope.vendorRequirements.push($scope.vendor)
                            }
                        });
                    }else{
                        // only vendortype_id exist
                        if(serviceValue==true){
                            $scope.vendor={
                                event_id:$scope.event_id,
                                vendortype_id:serviceKey,
                                posted_by:$rootScope.currentUser._id,
                                project_id:$scope.project._id
                            }
                            $scope.vendorRequirements.push($scope.vendor)
                        }
                    }
                })
            })
        })
        JobPosts.saveToDraft({data:$scope.vendorRequirements}).then(function(res){
            if(res.status==true){
                $scope.accrodian2(index)
                $scope.vendorevents();
                toastr.success(res.message,'Success!');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Reset or Cancel Vendor Selection
     */
    $scope.resetVendor =function(action,index){
        if(action=='reset'){
            $scope.newVendor={};
            $scope.selServices=[];
        }else{
            $scope.newVendor={};
            $scope.selServices=[];
            $scope.accrodian2(index)
        }
    }
    /*
     * Add Milestones
     */
    $scope.data={
        isOpen:false,
        focus:false,
        showAddMilestoneArea:false
    }
    $scope.addMilestone=function(){
        $scope.newMilestone.posted_by=$rootScope.currentUser._id;
        $scope.newMilestone.status=true;
        var newData={
            draft:$scope.newMilestone
        }
        Milestones.saveMilestoneToDraft(newData).then(function(res){
            if(res.status==true){
                $scope.eventseperateMilestones();
                $scope.newMilestone={}
                toastr.success(res.message,'Success!');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Add Job Requirements
     * 
     */
    $scope.requirements={}
    $scope.fetchFields = function(){
        //console.log($scope.requirements)
        Fields.findByVendorType($scope.requirements).then(function(res){
            if(res.status==true){
                $scope.allfields = res.data;
                //console.log($scope.allfields)
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
        // Fetch Milestones based on project_id and event_id
        Milestones.miletsonesByEvent({'project_id':$scope.project._id,'event_id':$scope.requirements.event_id}).then(function(res){
            if(res.status==true){
                $scope.eventMilestones = res.data;
            }
        })
    }
    $scope.addRequirements=function(){
        $scope.vendor={
            event_id:$scope.requirements.event_id,
            vendortype_id:$scope.requirements.vendortype_id,
            service_id:$scope.requirements.service_id,
            posted_by:$rootScope.currentUser._id,
            project_id:$scope.project._id,
            addressDetails:$scope.requirements.addressDetails,
            job_requirements:$scope.requirements.job_requirements
        }
        
//        $scope.vendor.job_requirements.Time
        JobPosts.addJobDetails($scope.vendor).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    // Add default milestones as my event Milestones
    $scope.addDefaultMilestones = function(){
        $scope.milestone = {
            event_id:$scope.requirements.event_id,
            project_id:$scope.project._id,
            posted_by:$rootScope.currentUser._id,
        }
        Milestones.addDefaultAsMy($scope.milestone).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /* 
     * Update Budget in Draft of an event
     * @params: event_id, project_id, budget
     */
    $scope.updateBudget = function(){
        if($scope.event.budget=='custom'){
            $scope.event.budget = $scope.event.custom_budget
        }
        $scope.budgetData = {
            event_id:$scope.requirements.event_id,
            project_id:$scope.project._id,
            posted_by:$rootScope.currentUser._id,
            budget:$scope.event.budget
        }
        //console.log($scope.budgetData)
        
        Projects.updateEventBudget($scope.budgetData).then(function(res){
            if(res.status==true){
                $scope.filteroptions = {
                    event_id:$scope.requirements.event_id,
                    vendortype_id:$scope.requirements.vendortype_id,
                    service_id:$scope.requirements.service_id,
                    posted_by:$rootScope.currentUser._id,
                    project_id:$scope.project._id,
                    budget:$scope.event.budget
                }
                JobPosts.addBudget($scope.filteroptions).then(function(myres){
                    if(myres.status==true){
                        toastr.success(res.message,'Success!');
                    }else{
                        toastr.error(myres.message,'Alert!');
                    }
                })
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Add Job Post Milestones
     */
    $scope.JobPostMilestonesAdd=function(){
        
        $scope.vendor={
            event_id:$scope.requirements.event_id,
            vendortype_id:$scope.requirements.vendortype_id,
            service_id:$scope.requirements.service_id,
            posted_by:$rootScope.currentUser._id,
            project_id:$scope.project._id,
            milestones:$scope.requirements.milestones
        }
        //console.log($scope.vendor);
        JobPosts.addmilestones($scope.vendor).then(function(res){
            if(res.status==true){
                $scope.jobMilestones=res.data.milestones;
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
    $scope.guest={'from':'Groom','group':'Family','location':'Chandigarh'}
    $scope.addGuestMe=function(){
        
        $scope.guest.posted_by_label='Planner';
        $scope.guest.project_id=$scope.project._id;
        $scope.guest.posted_by=$rootScope.currentUser._id;
        //console.log($scope.guest); //return false;
        Guests.add($scope.guest).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
                $scope.guest={'from':'Groom'}
                /*
                * Fetch all guests using project id
                */
                if(typeof $scope.project!='undefined'){
                    Guests.findByProject({project_id:$scope.project._id}).then(function(response){
                        if(response.status==true){
                            //console.log(response)
                            $scope.allguests=response.data
                            $scope.familyCount =0;
                            $scope.friendsCount =0;
                            $scope.othersCount =0;
                            angular.forEach($scope.allguests,function(value,key){
                                //console.log(value)
                                if(value.group=='Family'){
                                    $scope.familyCount=$scope.familyCount+1;
                                }else if(value.group=='Friends'){
                                    $scope.friendsCount=$scope.friendsCount+1;
                                }else{
                                    $scope.othersCount=$scope.othersCount+1;
                                }
                            })
                           // console.log($scope.familyCount)
                        }
                    })
                }
                var element = angular.element('#addGuestModal');
                element.modal('hide');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Edit Guest
     */
    $scope.editGuest=function(singleGuest){
        $scope.guest = singleGuest;
    }
    $scope.updateGuest = function(){
        Guests.updateById($scope.guest).then(function(res){
            if(res.status == true){
                toastr.success(res.message,'Success!');
                 $scope.guest={'from':'Groom'}
                /*
                * Fetch all guests using project id
                */
                if(typeof $scope.project!='undefined'){
                    Guests.findByProject({project_id:$scope.project._id}).then(function(response){
                        if(response.status==true){
                            //console.log(response)
                            $scope.allguests=response.data
                            $scope.familyCount =0;
                            $scope.friendsCount =0;
                            $scope.othersCount =0;
                            angular.forEach($scope.allguests,function(value,key){
                                //console.log(value)
                                if(value.group=='Family'){
                                    $scope.familyCount=$scope.familyCount+1;
                                }else if(value.group=='Friends'){
                                    $scope.friendsCount=$scope.friendsCount+1;
                                }else{
                                    $scope.othersCount=$scope.othersCount+1;
                                }
                            })
                           // console.log($scope.familyCount)
                        }
                    })
                }
                var element = angular.element('#addGuestModal');
                element.modal('hide');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * 
     * @returns {undefined}
     */
    $scope.selectedlength=0
    $scope.userchanged=function(){
        if(typeof $scope.guest.removeId =='undefined'){
            return false;
        }else{
            Object.keys($scope.guest.removeId).map(function(objectKey, index) {
                var value = $scope.guest.removeId[objectKey];
                if(value==false){
                    delete $scope.guest.removeId[objectKey];
                }
            });
            $scope.selectedlength = Object.keys($scope.guest.removeId).length;
        }
    }
    /*
     * Remove multiple guests
     */
    $scope.removeMultipleGuests=function(){
        Guests.removeMultipleGuests({removeArray:Object.keys($scope.guest.removeId)}).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
                var element = angular.element('#removeUserModal');
                element.modal('hide');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    $scope.uploadCSV=function(input){
      //  console.log(input.files[0])
        $scope.loading = true;
            var DatatoUpload = {};
            DatatoUpload.UserFile = input.files[0];
            DatatoUpload.ProjectId = $scope.project._id;
            DatatoUpload.PostedBy = $rootScope.currentUser._id;
            if($scope.project.user_id == $rootScope.currentUser._id){
                DatatoUpload.PostedByLabel = 'Planner';
            }else{
                DatatoUpload.PostedByLabel = 'Client';
            }
       //     console.log($scope.project);
        //console.log($scope.project._id);
        Guests.uploadcsv(DatatoUpload).then(function(res) {
           // console.log(res)
            $scope.loading = false;
            if(res.status==true){
                toastr.success(res.message,'Success!');
                if(typeof $scope.project!='undefined'){
                    Guests.findByProject({project_id:$scope.project._id}).then(function(response){
                        if(response.status==true){
                            //console.log(response)
                            $scope.allguests=response.data
                            $scope.familyCount =0;
                            $scope.friendsCount =0;
                            $scope.othersCount =0;
                            angular.forEach($scope.allguests,function(value,key){
                                //console.log(value)
                                if(value.group=='Family'){
                                    $scope.familyCount=$scope.familyCount+1;
                                }else if(value.group=='Friends'){
                                    $scope.friendsCount=$scope.friendsCount+1;
            }else{
                                    $scope.othersCount=$scope.othersCount+1;
                                }
                            })
                           // console.log($scope.familyCount)
                        }
                    })
                }
            }else{
                toastr.error(res.message,'Alert!');
            }
        });
    }
    /*
     * Add team member
     */
    $scope.addMember=function(newData,project_id){
        $scope.data={}
        $scope.data.project_id=project_id;
        $scope.data.team=newData;
        $scope.project.team.push(newData)
        
       // $scope.update();
//        $scope.newEvent={}
//        var element = angular.element('#AddTeamMember');
//        element.modal('hide');
        
        Projects.addTeamMember($scope.data).then(function(res){
            if(res.status==true){
                $scope.data={}
                toastr.success(res.message,'Success!');
                $scope.newEvent={}
                var element = angular.element('#AddTeamMember');
                element.modal('hide');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Remove Event based Milestones
     */
    $scope.removeMilestone=function(milestone_id){
        Milestones.removebyId(milestone_id).then(function(response){
            if(response.status==true){
                $scope.eventseperateMilestones();
                toastr.success(response.message,'Success!');
            }else{
                toastr.error(response.message,'Alert!');
            }
        })
    }
    /*
     * Remove Team Member from project
     */
    $scope.removeTeamMember = function(team_id){
        
        Projects.removeTeamMember({team_id:team_id,project_id:$stateParams.id}).then(function(response){
            if(response.status==true){
                
                // Remove from object
                angular.forEach($scope.project.team,function(value,key){
                    if(team_id == value._id){
                        $scope.project.team.splice(key, 1);
                    }
                })
                toastr.success(response.message,'Success!');
            }else{
                toastr.error(response.message,'Alert!');
            }
        })
    }
    /*
     * Remove Guest by ID 
     */
    $scope.removeGuest = function(guest_id){
        Guests.removebyId(guest_id).then(function(res){
            if(res.status==true){
                 Guests.findByProject({project_id:$scope.project._id}).then(function(response){
                        if(response.status==true){
                            //console.log(response)
                            $scope.allguests=response.data
                            $scope.familyCount =0;
                            $scope.friendsCount =0;
                            $scope.othersCount =0;
                            angular.forEach($scope.allguests,function(value,key){
                                //console.log(value)
                                if(value.group=='Family'){
                                    $scope.familyCount=$scope.familyCount+1;
                                }else if(value.group=='Friends'){
                                    $scope.friendsCount=$scope.friendsCount+1;
            }else{
                                    $scope.othersCount=$scope.othersCount+1;
                                }
                            })
                           // console.log($scope.familyCount)
                           toastr.success(res.message,'Success!');
                        }
                    })
                
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Remove Vendor from drafts 
     * @schema: jobposts
     */
    $scope.removeVendor = function(vendor_id){
        JobPosts.removebyId(vendor_id).then(function(response){
            if(response.status==true){
                $scope.vendorevents();
                toastr.success(response.message,'Success!');
            }else{
                toastr.error(response.message,'Alert!');
            }
        })
        
    }
    
    ////////////////////////// hotels honey /////////////////

    $scope.hotelDetails = {};
    $scope.allHotels = [];
    $scope.getHotels = function(){
        Hotels.findByProjectId({
            project_id : $stateParams.id
        }).then(function(res){ 
            $scope.allHotels = res.data;
})
    }
    $scope.getHotels();
    $scope.addHotel = function(){
        console.log($scope.hotelDetails); 
        $scope.hotelDetails.project_id = $stateParams.id;
        Hotels.add($scope.hotelDetails).then(function (res) {
            if(res.status == true){
                $scope.getHotels();
                toastr.success(res.message,'Success!');
            } else {
                toastr.error(res.message,'Alert!');
            }
           
        })
    }

    // Food restrictions 
    $scope.foodPost = {};
    $scope.allRestrictions = [];
    $scope.getRestrictions = function(){
        FoodRestrictions.findByProjectId({
            project_id : $stateParams.id
        }).then(function(res){ 
            $scope.allRestrictions = res.data;
        })
    }
    $scope.getRestrictions();
  
    $scope.addFood = function(){
        $scope.showInputArea = false;
        console.log($scope.showInputArea); 
        $scope.foodPost.project_id = $stateParams.id;
        if($scope.foodPost.name !=undefined && $scope.foodPost.name.trim().length > 4){
            FoodRestrictions.add($scope.foodPost).then(function (res) {
                if(res.status == true){
                    $scope.getRestrictions();
                    toastr.success(res.message,'Success!');
                } else {
                    toastr.error(res.message,'Alert!');
                }
               
            })
        } else {
            toastr.error("Please enter a valid name",'Alert!');
        }
       
    }

    $scope.removeFood= function(id){
        FoodRestrictions.removebyId(id).then(function(res){
            if(res.status == true){
                $scope.getRestrictions();
                toastr.success(res.message,'Success!');
            } else {
                toastr.error(res.message,'Alert!');
            }
        })
    }


})
app.controller('globalCtrl',function($scope,$rootScope,$window,$timeout,Cities,Events,Guests,toastr,Projects,$state){
    // Fetch Cities
    Cities.all().then(function(res){
        if(res.status==true){
            $scope.cities = res.data
        }
    })
    
    // Fetch all events
    Events.all().then(function(res){
        $scope.events=res.data;
    })
    /*
     * Guests Part
     * add new guests here
     */
    $scope.guest={'from':'Groom','group':'Family','location':'Chandigarh'}
    $scope.addGuest=function(){
        
        $scope.guest.posted_by_label='Planner';
        $scope.guest.project_id=$scope.project._id;
        $scope.guest.posted_by=$rootScope.currentUser._id;
        //console.log($scope.guest); //return false;
        Guests.add($scope.guest).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
                $scope.guest={'from':'Groom'}
                var element = angular.element('#addGuest');
                element.modal('hide');
                /*
                * Fetch all guests using project id
                */
            /*  if(typeof $scope.project!='undefined'){
                  Guests.findByProjectId({project_id:$scope.project._id}).then(function(response){
                      console.log(response)
                      if(response.status==true){
                            $rootScope.allguests=response.data;
                            $scope.familyCount =0;
                            $scope.friendsCount =0;
                            $scope.othersCount =0;
                            angular.forEach($rootScope.allguests,function(value,key){
                                //console.log(value)
                                if(value.group=='Family'){
                                    $scope.familyCount=$scope.familyCount+1;
                                }else if(value.group=='Friends'){
                                    $scope.friendsCount=$scope.friendsCount+1;
                                }else{
                                    $scope.othersCount=$scope.othersCount+1;
                                }
                            })

                          console.log($scope.friendsCount)
                      }
                  })
              }*/
                
                
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
//    $scope.$watch('allguests', function(newValue, oldValue) {
//        console.log('worked')
//        console.log(oldValue)
//        $scope.allguests=newValue
//        console.log(newValue)
//    });
    /*
     * Add Event in draft mode
     */
    $scope.newEvent={}
    $scope.addNewEvent=function(){
        if($scope.project.draft.length==0){
            $scope.project.draft=$scope.project
            $scope.project.draft.events.push($scope.newEvent)
        }else{
            if(typeof($scope.project.draft.events)==='undefined'){
                $scope.project.draft.events=[]
            }
            $scope.project.draft.events.push($scope.newEvent)
        }
        
        $scope.update();
        $scope.newEvent={}
        var element = angular.element('#AddEvent');
        element.modal('hide');
    }
    /*
     * Update draft fields for project
     */
    $scope.update=function(){
//        console.log($scope.project)
        $scope.newdata={
            _id:$scope.project._id,
            name:$scope.project.name,
            draft:$scope.project.draft
        }
        // Solution for Converting circular structure to JSON.
        var seen = []

        var json = JSON.stringify($scope.newdata, function(key, val) {
           if (typeof val == "object") {
                if (seen.indexOf(val) >= 0)
                    return
                seen.push(val)
            }
            return val
        })
        //$scope.project.user_id=$rootScope.CurrentUser._id;
        Projects.updateDraftById(json).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Fetch List of Projects
     */
    Projects.findByUserId({user_id:$rootScope.currentUser._id}).then(function(res){
        if(res.status==true){
            $scope.projectlist = res.data
//            if(typeof($scope.project) === 'undefined'){
//                $scope.project=$scope.projectlist[0]
//            }
        }
    })
    /*
     * Navigate to Planner section
     */
    $scope.navigateToPlanner=function(state_path,project_id){
        var element = angular.element('#SelectProject');
        if(element.modal('hide')){
            $timeout(function () {
                $state.go(state_path,{id:project_id});
            }, 500);
            
        }
        
    }
})