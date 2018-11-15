app.controller('teamlistCtrl', function ($scope,$state,Cities,Clients,$location,toastr,Projects,$stateParams,$rootScope) {
    /*
     * Fetch List of Projects
     */
    Projects.findByUserId({user_id:$rootScope.currentUser._id}).then(function(res){
        if(res.status==true){
            $scope.projectlist = res.data
        }
    })
    Projects.findById({'id':$stateParams.id}).then(function(res){
        if(res.status==true){
            $scope.assigned_project = false;
            $scope.project = res.data
            $scope.project.start_date=new Date($scope.project.start_date)
            $scope.project.end_date=new Date($scope.project.end_date)
            if($scope.project.user_id != $rootScope.currentUser._id){
                 $scope.assigned_project = true;
                 Clients.findByProjectIdPhone({project_id:$scope.project._id,phone:$rootScope.currentUser.phone}).then(function(client_res){
                     if(client_res.status==true){
                         $scope.project.my_permissions = {}
                         $scope.project.my_permissions.share_metrics=client_res.data.share_metrics
                         $scope.project.my_permissions.allow_guest_upload=client_res.data.allow_guest_upload
                     }
                 })
            }
        }
    })
    // Fetch Cities
    Cities.all().then(function(res){
        if(res.status==true){
            $scope.cities = res.data
        }
    })
     
    $scope.addMember=function(newData,project_id){
        $scope.data={}
        $scope.data.project_id=project_id;
        $scope.data.team=newData;
        Projects.addTeamMember($scope.data).then(function(res){
            if(res.status==true){
                var element = angular.element('#AddTeamMember');
                element.modal('hide');
                $scope.data={}
                toastr.success(res.message,'Success!');
                Projects.findById({'id':$stateParams.id}).then(function(res){
                    if(res.status==true){
                        $scope.project.draft.team = res.data
                    }
                })
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
    * 
    * @param {type} task_id
    * @returns {undefined}Remove task from db
    */
    /*
     * Remove Team Member from project
     */
    $scope.removeTeamMember = function(team_id){
        Projects.removeTeamMember({team_id:team_id,project_id:$stateParams.id}).then(function(response){
            if(response.status==true){
                Projects.findById({'id':$stateParams.id}).then(function(res){
                    if(res.status==true){
                        $scope.project = res.data
                        toastr.success(response.message,'Success!');
                    }
                })
                
            }else{
                toastr.error(response.message,'Alert!');
            }
        })
    }
    /*
     * Change Project 
     */
    $scope.changeProject = function(project_id){
        $location.path($state.current.name+'/'+project_id)
    }
    
});
app.controller('tasklistCtrl', function ($scope,$state,toastr,Projects,$location,Clients,$stateParams,Tasks,$rootScope,Milestones) {
    $scope.newTask={}
    $scope.data={
        isOpen:false,
        focus:false,
        showAddTaskArea:false
    }
    $scope.show_completed=true;
    $scope.today = new Date();
    $scope.lessThanToday = function(date){
        var newDate = new Date(date);
        if($scope.today >= newDate){
            return true
        }else{
            return false
        }
    }
    $scope.gtThanToday = function(date){
        var newDate = new Date(date);
        if($scope.today < newDate){
            return true
        }else{
            return false
        }
    }
    /*
     * Fetch List of Projects
     */
    Projects.findByUserId({user_id:$rootScope.currentUser._id}).then(function(res){
        if(res.status==true){
            $scope.projectlist = res.data
        }
    })
    if($stateParams.id){
        /*
        * Get Current Project Detail
        */
       Projects.findById({'id':$stateParams.id}).then(function(res){
           if(res.status==true){
               $scope.assigned_project = false;
               $scope.project = res.data
               $scope.project.start_date=new Date($scope.project.start_date)
               $scope.project.end_date=new Date($scope.project.end_date)
               if($scope.project.user_id != $rootScope.currentUser._id){
                    $scope.assigned_project = true;
                    Clients.findByProjectIdPhone({project_id:$scope.project._id,phone:$rootScope.currentUser.phone}).then(function(client_res){
                        if(client_res.status==true){
                            $scope.project.my_permissions = {}
                            $scope.project.my_permissions.share_metrics=client_res.data.share_metrics
                            $scope.project.my_permissions.allow_guest_upload=client_res.data.allow_guest_upload
                        }
                    })
               }
           }
       })
       /*
        * Fetch Tasks of a Project
        */
       /*Tasks.findByProjectId({'id':$stateParams.id}).then(function(res){
           if(res.status==true){
               $scope.tasks = res.data
               $scope.completed_tasks=0;
               $scope.pending_tasks=0
               angular.forEach($scope.tasks, function(value, key){
                   if(value.status==true){
                       $scope.completed_tasks = $scope.completed_tasks+1
                   }else{
                       $scope.pending_tasks=$scope.pending_tasks+1;
                   }
               })
           }
       })*/
       /*
        * Fetch Milestones of a project
        */
       Milestones.MiletsonesByProject({project_id:$stateParams.id}).then(function(res){
           if(res.status==true){
               $scope.tasks = res.data
               console.log($scope.tasks)
           }
       })
       /*
        * Edit Task
        * @returns {undefined}
        */
       $scope.editTask = function(id){
           Milestones.findById({id:id}).then(function(res){
               console.log(res)
               if(res.status==true){
                    $scope.newTask=res.data;
                    $scope.showAddTaskArea=true;
                }
           })
       }
       /*
        * Add new Task
        * @returns {undefined}
        */
       $scope.addTask=function(){
            $scope.newTask.project_id=$scope.project._id;
            $scope.newTask.user_id=$rootScope.currentUser._id;
            $scope.newTask.status=false;
            $scope.newTask.assigned_to=[]
            $scope.newTask.assigned_to.push($scope.newTask.team_member_id)
            if($scope.newTask._id){
                //Update
                Milestones.updateById($scope.newTask).then(function(res){
                    if(res.status==true){
                        $scope.newTask={}
                        toastr.success(res.message,'Success!');
                        Milestones.MiletsonesByProject({project_id:$stateParams.id}).then(function(res){
                            if(res.status==true){
                                $scope.tasks = res.data
                            }
                        })
                    }else{
                        toastr.error(res.message,'Alert!');
                    }
                })
            }else{
                //Create New
                /*Tasks.add($scope.newTask).then(function(res){
                    if(res.status==true){
                        $scope.newTask={}
                        toastr.success(res.message,'Success!');
                        Tasks.findByProjectId({'id':$stateParams.id}).then(function(res){
                            if(res.status==true){
                                $scope.tasks = res.data
                            }
                        })
                    }else{
                        toastr.error(res.message,'Alert!');
                    }
                })*/
            }
            
        }
        /*
         * Reset Add new task form
         * @returns {undefined}
         */
        $scope.reset=function(){
            $scope.newTask={}
        }
        /*
         * 
         * @param {type} task_id
         * @returns {undefined}Mark a task as complete
         */
        $scope.markAsComplete = function(task_id){
            Tasks.updateStatus({id:task_id,status:true}).then(function(res){
                if(res.status==true){
                    toastr.success(res.message,'Success!');
                }else{
                    toastr.error(res.message,'Alert!');
                }
            })
        }
        /*
         * 
         * @param {type} task_id
         * @returns {undefined}Remove task from db
         */
        $scope.removeTask = function(task_id){
            Tasks.removebyId(task_id).then(function(response){
                if(response.status==true){
                        Tasks.findByProjectId({'id':$stateParams.id}).then(function(res){
                        if(res.status==true){
                            $scope.tasks = res.data
                            $scope.completed_tasks=0;
                            $scope.pending_tasks=0
                            angular.forEach($scope.tasks, function(value, key){
                                if(value.status==true){
                                    $scope.completed_tasks = $scope.completed_tasks+1
                                }else{
                                    $scope.pending_tasks=$scope.pending_tasks+1;
                                }
                            })
                            toastr.success(response.message,'Success!');
                        }
                    })
                }else{
                    toastr.error(response.message,'Alert!');
                }
            })
        }
    }else{
        toastr.error('You need to select a project first to perform any action','Alert!');
    }
    
    /*
     * Change Project 
     */
    $scope.changeProject = function(project_id){
        $location.path($state.current.name+'/'+project_id)
    }
})
app.controller('jobsCtrl',function($scope,$location,Clients,$state,Projects,$rootScope,$stateParams,JobPosts,LiveJobs){
    $scope.selectedEvent='all';
    /*
     * Fetch List of Projects
     */
    Projects.findByUserId({user_id:$rootScope.currentUser._id}).then(function(res){
        if(res.status==true){
            $scope.projectlist = res.data
        }
    })
   /*
     * Change Project 
     */
    $scope.changeProject = function(project_id){
        $location.path($state.current.name+'/'+project_id)
    } 
    // Check if $stateParams exists
    if($stateParams.id){
        var total_vendor_required = 0;
        var jobs_in_marketplace = 0;
        var jobs_with_requirements = 0;
        /*
        * Get Current Project Detail
        */
       Projects.findById({'id':$stateParams.id}).then(function(res){
           if(res.status==true){
               $scope.project = res.data
               $scope.project.start_date=new Date($scope.project.start_date)
               $scope.project.end_date=new Date($scope.project.end_date)
               if($scope.project.user_id != $rootScope.currentUser._id){
                    $scope.assigned_project = true;
                    Clients.findByProjectIdPhone({project_id:$scope.project._id,phone:$rootScope.currentUser.phone}).then(function(client_res){
                        if(client_res.status==true){
                            $scope.project.my_permissions = {}
                            $scope.project.my_permissions.share_metrics=client_res.data.share_metrics
                            $scope.project.my_permissions.allow_guest_upload=client_res.data.allow_guest_upload
                        }
                    })
               }
               // Get events and the required vendors for the events from JobPost Model
               if($scope.project.events){
                    angular.forEach($scope.project.events,function(value,key){
                        $scope.filterdata={
                            project_id: $scope.project._id,
                            event_id:value._id
                        }
                        JobPosts.livevendorsByEvent($scope.filterdata).then(function(jobsres){
                            if(jobsres.status==true){
                                if(jobsres.data.length>0){
                                    angular.forEach(jobsres.data,function(job_value,job_key){
                                        
                                        if(job_value.jobDetails){
                                            jobs_with_requirements=jobs_with_requirements+1;
                                            $scope.jobs_with_requirements=jobs_with_requirements;
                                        }
                                        LiveJobs.findByParams({
                                            project_id:job_value.project_id,
                                            event_id:job_value.event_id,
                                            service_id:job_value.service_id,
                                            vendortype_id:job_value.vendortype_id,
                                            posted_by:job_value.posted_by
                                        }).then(function(livejobres){
                                            if(livejobres.status==true){
                                                if(livejobres.data.length>0){
                                                    jobs_in_marketplace=jobs_in_marketplace+1;
                                                    $scope.jobs_in_marketplace = jobs_in_marketplace
                                                    jobsres.data[job_key].posted_live = true
                                                }else{
                                                    jobsres.data[job_key].posted_live = false
                                                }
                                            }
                                        })
                                    })
                                    $scope.project.events[key].vendorsRequired = jobsres.data;
                                    total_vendor_required = total_vendor_required+jobsres.data.length
                                    $scope.total_vendor_required=total_vendor_required
                                }
                            }
                        })
                    })
               }
               console.log($scope.project)
           }
       })
   }
   /*
    * Fetch My Jobs
    */
   LiveJobs.myJobs({user_id:$rootScope.currentUser._id,project_id:$stateParams.id}).then(function(res){
        if(res.status==true){
            $scope.myjobs = res.data
            var jobs_with_bids = 0;
            angular.forEach($scope.myjobs,function(value,key){
                var num=0;
                var is_finalised = 0;
                var is_shortlisted =0;
                var shortlisted_count = 0;
                var proposals_count=0;
                angular.forEach(value.myproposals, function(proposal_value,proposal_key){
                    if(proposal_value._id){
                        // bid exists
                        proposals_count=proposals_count+1;
                    }
                    if(proposal_value.status==2){
                        // finalised
                        is_finalised=1;
                    }else if(proposal_value.status==1){
                        //shortlisted
                        is_shortlisted=1;
                        shortlisted_count=shortlisted_count+1;
                    }else{
                        //none
                    }
                    if(proposal_value.read==false){
                        num=num+1
                    }
                })
                
                $scope.myjobs[key].new_bids=num
                $scope.myjobs[key].is_finalised=is_finalised
                $scope.myjobs[key].is_shortlisted=is_shortlisted
                $scope.myjobs[key].shortlisted_count=shortlisted_count  
                $scope.myjobs[key].proposals_count=proposals_count
                if(proposals_count >0){
                    jobs_with_bids=jobs_with_bids+1;
                    $scope.jobs_with_bids = jobs_with_bids
                }
            })
        }
    })
})
/*
 * Job Detail Page
 */
app.controller('jobsDetailCtrl',function($scope,$state,$stateParams,$rootScope,Messages,$location,LiveJobs,toastr,Proposals){
   /*
     * Change Project 
     */
    $scope.changeProject = function(project_id){
        $location.path($state.current.name+'/'+project_id)
    } 
    // Check if $stateParams exists
    if($stateParams.id){
        LiveJobs.myjobsdetail({'id':$stateParams.id}).then(function(res){
            console.log(res)
            if(res.status==true){
                $scope.livejob = res.data;
            }
        })
    }
    
    $scope.update_status = function(proposal_id, status){
        Proposals.updateStatus({_id:proposal_id,status:status}).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Send message to a vendor
     */
    $scope.message={};
    $scope.sendMessage=function(bid_by,model_id){
        if($scope.message.content){
            console.log($scope.message.content)
            console.log(bid_by)
            console.log($rootScope.currentUser)
            var job_link="http://yourshaadidost.com/dost#/jobDetail/"+$stateParams.id;
            Users.sendMsgToPhn({vendor_id:bid_by,message:$scope.message.content,job_link:job_link}).then(function(res){
                if(res.status==true){
                    toastr.success(res.message,'Success!');
                    $scope.message={};
                    var element = angular.element('#SendMsg_'+model_id);
                    element.modal('hide');
                }else{
                    toastr.error(res.message,'Alert!');
                }
            })
            /*Messages.add({bid_by:bid_by,job_id:$stateParams.id,job_by:$rootScope.currentUser._id,msg_by:$rootScope.currentUser._id,content:$scope.message.content}).then(function(res){
                if(res.status==true){
                    toastr.success(res.message,'Success!');
                    $scope.message={};
                    var element = angular.element('#SendMsg_'+model_id);
                    element.modal('hide');
                }
            })*/
        }else{
            toastr.error('Write something to send.','Alert!');
        }
        
    }
})
/*
 * Post a Job to marketplace
 */
app.controller('postJobCtrl',function($scope,$state,JobPosts,Clients,$stateParams,Milestones,$location,LiveJobs,toastr){
    $scope.activebutton=1;
    $scope.currentActiveButton=1;
    $scope.moveback=function(state,step){
        $scope.currentActiveButton=step;
        $state.go(state)
    }
    $scope.movetonext=function(state, step){
        console.log(state)
        $scope.activebutton=step;
        $scope.currentActiveButton=step;
        $state.go(state)
    }
    $scope.jobdata={}
    /*
     * Fetch Job Data
     */
    JobPosts.findById($stateParams.id).then(function(res){
        console.log(res)
        if(res.status==true){
//            angular.forEach($scope.project.events,function(value,key){
//                if(key=='Address')
//            }
            $scope.jobdata.posted_by=res.data.posted_by
            $scope.jobdata.vendortype_id=res.data.vendortype_id
            $scope.jobdata.service_id=res.data.service_id
            $scope.jobdata.event_id=res.data.event_id
            $scope.jobdata.project_id=res.data.project_id
            $scope.jobdata.jobDetails=res.data.jobDetails
            $scope.jobdata.addressDetails=res.data.addressDetails
            $scope.jobdata.budget=res.data.budget;
            $scope.jobdata.milestones=res.data.milestones;
            
//            $scope.milestonesfilter={
//                project_id:res.data.project_id,
//                event_id: res.data.event_id,
//            }
//            if(res.data.vendortype_id){
//                $scope.milestonesfilter.vendortype_id =res.data.vendortype_id
//            }
//            if(res.data.service_id){
//                $scope.milestonesfilter.service_id =res.data.service_id
//            }
//            Milestones.miletsonesByService($scope.milestonesfilter).then(function(milestonesResponse){
//                if(milestonesResponse.status == true){
//                    $scope.jobdata.milestones=milestonesResponse.data
//                }else{
//                    
//                }
//            })
        }else{
            
        }
        console.log($scope.jobdata)
    })
    
    
    $scope.postJob=function(){
        console.log($scope.jobdata)
        LiveJobs.add($scope.jobdata).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
                $location.path('projectlist')
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    
})
/*
 * Clients Controller
 */
app.controller('ClientsCtrl',function($scope,$rootScope,Clients,$stateParams,toastr,Projects,Cities){
    /*
     * Fetch List of Projects
     */
    Projects.findByUserId({user_id:$rootScope.currentUser._id}).then(function(res){
        if(res.status==true){
            $scope.projectlist = res.data
        }
    })
    // Fetch Cities
    Cities.all().then(function(res){
        if(res.status==true){
            $scope.cities = res.data
        }
    })
    /*
     * Fetch all clients based on project_id
     */
    $scope.fetchAllClients = function(){
        Clients.findByProjectId({project_id:$stateParams.id}).then(function(res){
            if(res.status == true){
                $scope.all_clients=res.data
            }
        })
    }
    $scope.GetFormattedDate=function(date) {
        var todayTime = new Date(date);
        var month = todayTime .getMonth() + 1;
        var day = todayTime .getDate();
        var year = todayTime .getFullYear();
        return day + "/" + month + "/" + year;
    }
//    new Date('2018-07-12T18:30:00.000Z')
//    console.log($scope.GetFormattedDate('2018-07-12T18:30:00.000Z'));
    if($stateParams.id){
        /*
        * Get Current Project Detail
        */
       Projects.findById({'id':$stateParams.id}).then(function(res){
           if(res.status==true){
               $scope.assigned_project = false;
               $scope.project = res.data
               $scope.project.start_date=new Date($scope.project.start_date)
               $scope.project.end_date=new Date($scope.project.end_date)
               if($scope.project.user_id != $rootScope.currentUser._id){
                    $scope.assigned_project = true;
                    Clients.findByProjectIdPhone({project_id:$scope.project._id,phone:$rootScope.currentUser.phone}).then(function(client_res){
                        if(client_res.status==true){
                            $scope.project.my_permissions = {}
                            $scope.project.my_permissions.share_metrics=client_res.data.share_metrics
                            $scope.project.my_permissions.allow_guest_upload=client_res.data.allow_guest_upload
                        }
                    })
               }
           }
       })
        /*
         * Get Clients based on project_id
         */
        $scope.fetchAllClients();
    }
    
    $scope.data={}
    /*
     * Add a client
     */
    $scope.addClient = function(){
        $scope.data.added_by=$rootScope.currentUser._id;
        $scope.data.project_id = $stateParams.id;
        //console.log($scope.data); //return false;
        Clients.add($scope.data).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
                var element = angular.element('#addClientModal');
                element.modal('hide');
                $scope.fetchAllClients();
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Get a client by Id
     */
    $scope.findById = function(client_id){
        Clients.findById({id:client_id}).then(function(res){
            if(res.status == true){
                $scope.my_client=res.data
            }
        })
    }
    
    /*
     * Update Client
     */
    $scope.updateById = function(index_id){
        Clients.updateById($scope.my_client).then(function(res){
            if(res.status == true){
                toastr.success(res.message,'Success!');
                var element = angular.element('#editClientModal_'+index_id);
                element.modal('hide');
                $scope.fetchAllClients();
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Remove client by Id
     */
    $scope.removeById=function(client_id){
        Clients.removebyId(client_id).then(function(res){
            if(res.status == true){
                toastr.success(res.message,'Success!');
                $scope.fetchAllClients();
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Allow Guest Upload
     */
    $scope.guest_access = {}
    $scope.allowGuestUpload=function(client_id,index_id){
        $scope.guest_access._id=client_id
        $scope.guest_access.upload_access=[]
        Object.keys($scope.guest_access.upload_access_groups).map(function(objectKey, index) {
            if($scope.guest_access.upload_access_groups[objectKey]==true){
                $scope.guest_access.upload_access.push(objectKey)
            }
        });
        
        if($scope.guest_access.group_creation=='yes'){
            $scope.guest_access.group_creation=true
        }else{
            $scope.guest_access.group_creation=false;
        }
        Clients.allowGuestUpload($scope.guest_access).then(function(res){
            if(res.status == true){
                toastr.success(res.message,'Success!');
                var element = angular.element('#guestUploadModal_'+index_id);
                element.modal('hide');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Share Metrics
     */
    $scope.shareMetrics=function(client_id,index_id){
        $scope.guest_access._id=client_id
        $scope.guest_access.shareMetrics=[]
        Object.keys($scope.guest_access.share).map(function(objectKey, index) {
            if($scope.guest_access.share[objectKey]==true){
                $scope.guest_access.shareMetrics.push(objectKey)
            }
        });
        Clients.shareMetrics($scope.guest_access).then(function(res){
            if(res.status == true){
                toastr.success(res.message,'Success!');
                var element = angular.element('#shareMetricsModal_'+index_id);
                element.modal('hide');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Send Request to download the app
     */
    $scope.sendRequest=function(client){
        client.project_name=$scope.project.name;
        client.bride_name=$scope.project.bride.name;
        client.groom_name=$scope.project.groom.name;
        client.start_date=$scope.GetFormattedDate($scope.project.start_date);
        Clients.sendRequest(client).then(function(res){
            if(res.status == true){
                toastr.success(res.message,'Success!');
                $scope.fetchAllClients();
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Send Request to download the app
     */
    $scope.resendRequest=function(client){
        client.project_name=$scope.project.name;
        client.bride_name=$scope.project.bride.name;
        client.groom_name=$scope.project.groom.name;
        client.start_date=$scope.GetFormattedDate($scope.project.start_date);
        Clients.resendRequest(client).then(function(res){
            if(res.status == true){
                toastr.success(res.message,'Success!');
                $scope.fetchAllClients();
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
})

/*
 * Vendor-Jobs Controller
 */
app.controller('vendorJobsCtrl',function($scope,$rootScope,$stateParams,toastr,$sce,Projects,Clients,JobPosts,LiveJobs,$location,$state){
    /*
     * Fetch List of Projects
     */
    Projects.findByUserId({user_id:$rootScope.currentUser._id}).then(function(res){
        if(res.status==true){
            $scope.projectlist = res.data
        }
    })
       /*
     * Change Project 
     */
    $scope.changeProject = function(project_id){
        $location.path($state.current.name+'/'+project_id)
    } 
    // Check if $stateParams exists
    if($stateParams.id){
        /*
        * Get Current Project Detail
        */
       Projects.findById({'id':$stateParams.id}).then(function(res){
           if(res.status==true){
               $scope.project = res.data
               console.log($scope.project)
               $scope.project.start_date=new Date($scope.project.start_date)
               $scope.project.end_date=new Date($scope.project.end_date)
               if($scope.project.user_id != $rootScope.currentUser._id){
                    $scope.assigned_project = true;
                    Clients.findByProjectIdPhone({project_id:$scope.project._id,phone:$rootScope.currentUser.phone}).then(function(client_res){
                        if(client_res.status==true){
                            $scope.project.my_permissions = {}
                            $scope.project.my_permissions.share_metrics=client_res.data.share_metrics
                            $scope.project.my_permissions.allow_guest_upload=client_res.data.allow_guest_upload
                        }
                    })
               }
               // Get vendors for events
               angular.forEach($scope.project.events,function(value,key){
                    var event_id = value._id;
                    JobPosts.vendorsByEvent({event_id:event_id,project_id:$stateParams.id}).then(function(response){
                        if(response.status==true){
                            if(response.data.length>0){
                                $scope.project.events[key].vendors=response.data
                            }
                        }
                    })
                })
               console.log($scope.project)
           }
       })
   }
   // Make insecure url to secure
    $scope.trustUrl=function(image){
        return $sce.trustAsResourceUrl(image);
    }
   /*
    * Fetch My Jobs
    */
   LiveJobs.myfinalizedjobs({user_id:$rootScope.currentUser._id,project_id:$stateParams.id}).then(function(res){
        if(res.status==true){
            $scope.myjobs = res.data
        }
    })
    /*
     * Invite Vendor section starts here
     */
    $scope.newVendor={};
    $scope.serviceList=[];
    $scope.vendorList=[];
   
    $scope.fetchVendor = function(selected_eventId){
        var keepGoing = true;
        var arr_to_compare=[]
        $scope.project.events.forEach(function(element) {
            if(keepGoing){
                if(element._id == selected_eventId){
                    // fetch unique vendors
                    if(typeof element.vendors !='undefined'){
                        element.vendors.forEach(function(vendor_element){
                            if(vendor_element){
                                if(arr_to_compare.length==0){
                                    arr_to_compare.push(vendor_element.vendortype_id)
                                    $scope.vendorList.push(vendor_element.vendordetail[0]);
                                }else{
                                    if(arr_to_compare.includes(vendor_element.vendortype_id)){
                                        // don't push
                                    }else{
                                        //push
                                        arr_to_compare.push(vendor_element.vendortype_id)
                                        $scope.vendorList.push(vendor_element.vendordetail[0]);
                                    }
                                }

                            }
                        })
                    }else{
                        $scope.vendorList=[];
                    }
                    $scope.serviceList=[];
                    keepGoing = false;
                } 
            }
        });
    }
    $scope.fetchService = function(selected_eventId,selected_vendortypeId){
        $scope.serviceList=[];
        var keepGoing = true;
        $scope.project.events.forEach(function(element) {
            if(keepGoing){
                if(element._id == selected_eventId){
                   //loop for vendors to compare vendor type and fetch unique 
                   element.vendors.forEach(function(service_element){
                       if(service_element.vendortype_id==selected_vendortypeId){
                           if(service_element.servicedetail.length>0){
                               $scope.serviceList.push(service_element.servicedetail[0]);
                           }
                           
                       }
                   })
                    keepGoing = false;
                } 
            }
        });
        console.log($scope.serviceList)
    }
    
})

/*
 * Vendor-Jobs Detail Controller
 */
app.controller('vendorDetailJobsCtrl',function($scope,$rootScope,$location,$state,$stateParams,toastr,Clients,Messages,LiveJobs,Projects,Messages,JobMilestones,Payments){
    /*
     * Fetch List of Projects
     */
    Projects.findByUserId({user_id:$rootScope.currentUser._id}).then(function(res){
        if(res.status==true){
            $scope.projectlist = res.data
        }
    })
       /*
     * Change Project 
     */
    $scope.changeProject = function(project_id){
        $location.path($state.current.name+'/'+project_id)
    } 
    LiveJobs.job_proposaldetail({id:$stateParams.id,user_id:$stateParams.userid}).then(function(job_res){
        console.log(job_res)
        if(job_res.status==true){
            /*
             * get project detail
             */
            Projects.findById({'id':job_res.data.project_detail._id}).then(function(res){
                if(res.status==true){
                    $scope.project = res.data
                    $scope.project.start_date=new Date($scope.project.start_date)
                    $scope.project.end_date=new Date($scope.project.end_date)
                    if($scope.project.user_id != $rootScope.currentUser._id){
                         $scope.assigned_project = true;
                         Clients.findByProjectIdPhone({project_id:$scope.project._id,phone:$rootScope.currentUser.phone}).then(function(client_res){
                             if(client_res.status==true){
                                 $scope.project.my_permissions = {}
                                 $scope.project.my_permissions.share_metrics=client_res.data.share_metrics
                                 $scope.project.my_permissions.allow_guest_upload=client_res.data.allow_guest_upload
                             }
                         })
                    }
                }
            })
            
            $scope.jobDetail = job_res.data;
            /*
             * Fetch Messages
             */
            $scope.threadMessages();
            /*
             * Fetch Livejob Milestones
             */
            JobMilestones.all({job_id:$stateParams.id}).then(function(job_milestones){
                if(job_milestones.status==true){
                    $scope.jobDetail.jobMilestones = job_milestones.data;
                }
            })
            Payments.all({job_id:$stateParams.id}).then(function(payment_res){
                if(payment_res.status==true){
                    $scope.jobDetail.payments = payment_res.data;
                }
            })
            console.log($scope.jobDetail);
        }
    })
    $scope.threadMessages = function(){
        var conditions={
                job_id:$stateParams.id,
                bid_by:$stateParams.userid,
                job_by:$rootScope.currentUser._id
            }
            Messages.messageThread(conditions).then(function(msg_res){
                console.log(msg_res)
                if(msg_res.status=true){
                    $scope.jobDetail.messages = msg_res.data
                }
            })
    }
    $scope.content=''
    $scope.SendMsg=function(content){
        console.log(content)
        if(content){
            Messages.add({bid_by:$stateParams.userid,job_id:$stateParams.id,job_by:$rootScope.currentUser._id,msg_by:$rootScope.currentUser._id,content:content}).then(function(res){
                if(res.status==true){
                    toastr.success(res.message,'Success!');
                    $scope.content=''
                    $scope.threadMessages();
//                    $scope.message={};
//                    var element = angular.element('#SendMsg_'+model_id);
//                    element.modal('hide');
                }
            })
        }else{
            toastr.error('Write something to send.','Alert!');
        }
        
    }
})

/*
 * Vendor-Jobs Detail Controller
 */
app.controller('budgetCtrl',function($scope,$rootScope,$location,$state,$stateParams,toastr, Projects, Budgets,LiveJobs){
    /*
     * Fetch List of Projects
     */
    Projects.findByUserId({user_id:$rootScope.currentUser._id}).then(function(res){
        if(res.status==true){
            $scope.projectlist = res.data
        }
    })
    /*
     * Change Project 
     */
    $scope.changeProject = function(project_id){
        $location.path($state.current.name+'/'+project_id)
    } 

    /*
    * get project detail
    */
    Projects.findById({ 'id':  $stateParams.id }).then(function (res) {
        if (res.status == true) {
            $scope.project = res.data; 
            var numb = $scope.project.budget.match(/\d/g);
                numb = numb.join("");
                $scope.project.overall_budget = numb
           
            $scope.project.start_date = new Date($scope.project.start_date)
            $scope.project.end_date = new Date($scope.project.end_date)
            if ($scope.project.user_id != $rootScope.currentUser._id) {
                $scope.assigned_project = true; 
            } 
        }
    })




    // add a new record
    $scope.record = {}; 
    $scope.add_new_record = function(){ 
        $scope.record.project_id = $stateParams.id
        $scope.record.user_id = $rootScope.currentUser._id 
        Budgets.add($scope.record).then(function(res){
            if(res.status == true){
                toastr.success(res.message,'Success!');
                $scope.get_all_records($scope.perPage);
                $scope.record = {}; 
            } else {
                toastr.error(res.message,'Alert!');
            }
        })
    };

    //upload invoice  
    $scope.uploadFile = function(input) {
        $scope.loading = true;  
        Budgets.uploadInvoice(input.files[0]).then(function(res) {
            $scope.loading = false;
            if (res) {   
                $scope.record.invoice = res.location;
            } 
        });
    };

    //get services according to events
    $scope.selected_service = 0;
    $scope.getServices = function(event_id,bit){
        LiveJobs.getServiceByEventId({event_id : event_id}).then(function(res){ 
            if(bit == undefined){
                $scope.event_service_based_records();
                $scope.event_based_services = res.data; 
            } 
            $scope.event_based_services_modal = res.data; 
        })
    }

    // change event
    $scope.changeEvent = function(event_id){ 
        if(event_id == 0){
            $scope.get_all_records($scope.perPage);
        } else {
            $scope.getServices(event_id); 
        }
    }

    $scope.changeService=function(service_id){
        
        $scope.event_service_based_records();
    }

    // list basic records regardless of event
    var page = 1; 
    $scope.selected_event = 0;
    $scope.perPage = 5;  
    $scope.get_all_records = function(perPage){
        Budgets.findByProjectId({ project_id : $stateParams.id, page : page, perPage : $scope.perPage }).then(function(res){
          
            $scope.all_basic_records = res.data; 
            $scope.basic_past_records_total = 0;
            $scope.basic_coming_records_total = 0;
            for(let i in $scope.all_basic_records){
                if (new Date($scope.all_basic_records[i].due_date) < new Date()) {
                  
                    $scope.basic_past_records_total = $scope.basic_past_records_total + parseInt($scope.all_basic_records[i].cost)
                } else {
                    $scope.basic_coming_records_total = $scope.basic_coming_records_total + parseInt($scope.all_basic_records[i].cost)
                }  
            }
        })
    } 
    $scope.get_all_records($scope.perPage);

    $scope.event_service_based_records = function () {
        var postData = {
            project_id: $stateParams.id,
            event_id: $scope.selected_event,
            page: page,
            perPage: $scope.perPage
        }
        if ($scope.selected_service != 0) {
            postData.service_id = $scope.selected_service
        }
        Budgets.findByEvent_or_service(postData).then(function (res) {
            $scope.all_basic_records = res.data;
            var event_based_services = [];

            $scope.basic_past_records_total = 0;
            $scope.basic_coming_records_total = 0;
            for (let i in $scope.all_basic_records) {
                if (new Date($scope.all_basic_records[i].due_date) < new Date()) {
                    $scope.basic_past_records_total = $scope.basic_past_records_total + parseInt($scope.all_basic_records[i].cost)
                } else {
                    $scope.basic_coming_records_total = $scope.basic_coming_records_total + parseInt($scope.all_basic_records[i].cost)
                }


                for (let j in $scope.event_based_services) {
                    if ($scope.all_basic_records[i].service_id) {
                        if ($scope.event_based_services[j].service_id == $scope.all_basic_records[i].service_id) {
                            event_based_services.push($scope.event_based_services[j]);
                        }
                    }

                }
            }
            $scope.event_based_services = JSON.parse(JSON.stringify(event_based_services));

        })
    }

    // change number of results to be displayed in the last basic records section
    $scope.fetchResults = function(perPage){
        
        if($scope.selected_event == 0){ 
            $scope.get_all_records(perPage);
        } else {
           $scope.event_service_based_records();
        }
    }

    // remove record
    $scope.removeRecord = function(id,index){
        Budgets.removebyId(id).then(function(response){
            if(response.status==true){ 
                $scope.basic_records_total = $scope.basic_records_total - parseInt($scope.all_basic_records[index].cost)
                $scope.all_basic_records.splice(index,1);
                toastr.success(response.message,"Success!")
            } else {
                toastr.error(response.message,"Alert!")
            }
        })
    }


    // upcoming expenses section 
    $scope.today = new Date();
    $scope.selected_date = new Date();
    $scope.days = 30;
    $scope.get_upcoming_expenses = function(){
        var postData = {
            page : page,
            perPage : $scope.perPage,
            days : $scope.days,
            project_id : $stateParams.id
        } 
        Budgets.findByDate(postData).then(function(res){ 
           $scope.upcoming_expenses = res.data;
        })

    }
    $scope.get_upcoming_expenses();

    $scope.updateCalcs = function (input) {
        var days_format = '';
        var today = new Date();
        var second_date = new Date(input);
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds    

        var diffDays = Math.round(Math.abs((second_date.getTime() - today.getTime()) / (oneDay)));
        if (diffDays == 0) {
            console.log(0, "today");
        } else {
            if (diffDays > 7) {
                var month = new Array();
                month[0] = "January";
                month[1] = "February";
                month[2] = "March";
                month[3] = "April";
                month[4] = "May";
                month[5] = "June";
                month[6] = "July";
                month[7] = "August";
                month[8] = "September";
                month[9] = "October";
                month[10] = "November";
                month[11] = "December";
                var todayTime = new Date(input);
                days_format = month[todayTime.getMonth()] + " " + todayTime.getDate();
                //days_format =new Date(input);
            } else {
                if (today.getTime() > second_date.getTime()) {
                    //days_format = diffDays+" Day(s) ago"
                    $scope.days = diffDays

                } else {
                    //days_format = "In "+diffDays+" days"
                    $scope.days = diffDays
                }
            }
           
            $scope.get_upcoming_expenses($scope.days);
        }
    }

    $scope.total_expense_of_project = 0;
    // get vendor + event based results (middle section)
    $scope.get_by_vendor_service = function(){
        var postData = {
            project_id : $stateParams.id,
            page : page
        }
        Budgets.findByVendor_and_Service(postData).then(function(res){
            console.log(res);
            var original_data = JSON.parse(JSON.stringify(res.data));
            var all_vendors = [];
            var data_to_work = [];
            for(let i in original_data){ 

                if(all_vendors.indexOf(original_data[i].vendortype_details.title) == -1){
                    all_vendors.push(original_data[i].vendortype_details.title)
                }
                // if(data_to_work[original_data[i].vendortype_details.title] == undefined){
                    
                // }  
            }
                for(let i in all_vendors){ 
                    for(let j in original_data){
                     
                        if(original_data[j].vendortype_details.title == all_vendors[i]){
                            if(data_to_work.length > 0){
                                var index = data_to_work.findIndex(x => x.vendor == original_data[j].vendortype_details.title);
                                if(index == -1){
                                    data_to_work.push({ 
                                        vendor : original_data[j].vendortype_details.title,
                                        events : [original_data[j]] 
                                    })
                                } else {
                                    data_to_work[index].events.push(original_data[j]); 
                                } 
                            } else {
                                data_to_work.push({ 
                                    vendor : original_data[j].vendortype_details.title,
                                    events : [original_data[j]] 
                                })
                            } 
                        } 
                    } 
                }
             
            console.log(data_to_work)
            $scope.data_to_work = data_to_work; 
         
            console.log($scope.data_to_work);
        })
    }
    $scope.get_by_vendor_service();
    
    $scope.my_Function= function(item,index){
          
        var x = angular.element('#collapsetable_' + index);
        if (x.css('display') === "none") {
            x.css('display', 'table')
        } else {
            x.css('display', 'none')
        }

    }
   
    
})