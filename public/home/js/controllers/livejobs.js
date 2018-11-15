app.controller('browseJobsCtrl', function ($scope,LiveJobs,Favourites,$rootScope) {
    LiveJobs.all({user_id:$rootScope.currentUser._id}).then(function(res){
        if(res.status==true){
            $scope.livejobs = res.data
            console.log($scope.livejobs)
        }
    })
    $scope.markasfavourite=function(job_id){
        Favourites.add({job_id:job_id,user_id:$rootScope.currentUser._id}).then(function(f_res){
            console.log(f_res);
        })
    }
});
app.controller('jobDetailCtrl',function($scope,$stateParams,LiveJobs,Proposals,$rootScope,toastr){
    // Fetch Job Detail
    if($stateParams.id){
        LiveJobs.findById({'id':$stateParams.id}).then(function(res){
            if(res.status==true){
                $scope.livejob = res.data
            }
        })
    }
    $scope.proposal={}
    // Submit Bid on a post
    $scope.submitProposal=function(){
        $scope.proposal.job_id = $stateParams.id;
        $scope.proposal.bid_by = $rootScope.currentUser._id;
        //console.log($scope.proposal);
        Proposals.add($scope.proposal).then(function(res){
            if(res.status==true){
                $scope.proposal = {}
                toastr.success(res.message,'Success!');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
})
app.controller('myJobsCtrl', function ($scope,Proposals,$rootScope) {
    Proposals.myFinalisedJobs({user_id:$rootScope.currentUser._id}).then(function(res){
        if(res.status==true){
            $scope.myjobs = res.data;
            console.log($scope.myjobs)
            $scope.today = new Date();
            $scope.onGoingJobs =[]
            $scope.upComingJobs =[]
            
            $scope.myjobs.forEach(element => {
                var start_date = new Date(element.livejob.jobDetails['Start date']);
                var end_date = new Date(element.livejob.jobDetails['End date']);
                if($scope.today>=start_date && $scope.today <=end_date){
                    $scope.onGoingJobs.push(element)
                }else if($scope.today<end_date){
                    $scope.upComingJobs.push(element)
                }else if($scope.today<start_date){
                    $scope.upComingJobs.push(element)
                }
            });
        }
        
    });
})
app.controller('myJobDetailCtrl', function ($scope,LiveJobs,$rootScope,$stateParams,Messages,toastr,JobMilestones,Payments,Favourites,$ngConfirm) {
    //Used for completed tasks
    $scope.checkbox={}
    LiveJobs.job_proposaldetail({id:$stateParams.id,user_id:$rootScope.currentUser._id}).then(function(job_res){
        console.log(job_res)
        if(job_res.status==true){
            $scope.jobDetail = job_res.data;
            $scope.threadMessages();
        }
    })
    $scope.threadMessages = function(){
        var conditions={
                job_id:$stateParams.id,
                bid_by:$rootScope.currentUser._id,
                job_by:$scope.jobDetail.posted_by
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
        if(content){
            Messages.add({bid_by:$rootScope.currentUser._id,job_id:$stateParams.id,job_by:$scope.jobDetail.posted_by,msg_by:$rootScope.currentUser._id,content:content}).then(function(res){
                if(res.status==true){
                    toastr.success(res.message,'Success!');
                    $scope.content=''
                    $scope.threadMessages();
                }
            })
        }else{
            toastr.error('Write something to send.','Alert!');
        }
        
    }
    /*
     * Milestones part starts here
     */
    $scope.taskcount=1;
    $scope.incCount=function(){
        $scope.taskcount=$scope.taskcount+1;
    }
    /*
     * Add new Milestone
     */
    $scope.newMilestone={}
    $scope.addMilestone=function(){
        console.log($scope.newMilestone)
        $scope.newMilestone.posted_by=$rootScope.currentUser._id;
        $scope.newMilestone.job_id=$stateParams.id
        JobMilestones.add($scope.newMilestone).then(function(res){
            console.log(res)
            if(res.status==true){
                toastr.success(res.message,'Success!');
                $scope.newMilestone={};
                var element = angular.element('#AddMilestone');
                element.modal('hide');
                $scope.fetchMilestones();
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    $scope.fetchMilestones = function(){
        JobMilestones.all({job_id:$stateParams.id}).then(function(res){
            if(res.status==true){
                $scope.listMilestones=res.data;
                console.log($scope.listMilestones)
                $scope.today = new Date();
                $scope.onGoingMilestones =[]
                $scope.upComingMilestones =[]
                //Milestones count
                $scope.total_milestones=$scope.listMilestones.length;
                $scope.complete_milestones = 0;
                $scope.total_tasks = 0;
                $scope.completed_tasks=0;

                $scope.listMilestones.forEach(element => {
                    console.log(element)
                    element.completed_tasks_count=0;
                    element.tasks_count=0;
                    $scope.checkbox.mystatus=[]
                    //Loop for each task in milestone
                    element.tasks.forEach(inner_element=>{
                        element.tasks_count=element.tasks_count+1;
                        $scope.total_tasks=$scope.total_tasks+1;
                        if(inner_element.status==1){
                            //completed task
                            $scope.completed_tasks=$scope.completed_tasks+1;
                            element.completed_tasks_count = element.completed_tasks_count+1;
                            $scope.checkbox.mystatus[inner_element._id]=true;
                        }else{
                            //incomplete task
                        }
                    })
                    if(element.completed_tasks_count>0){
                        element.task_completion_percentage = parseFloat((element.completed_tasks_count/element.tasks_count)*100).toFixed(2);
                    }
                    // Loop for each milestone
                    var start_date = new Date(element.start_date);
                    var end_date = new Date(element.end_date);
                    if($scope.today>=start_date && $scope.today <=end_date){
                        $scope.onGoingMilestones.push(element)
                    }else if($scope.today<end_date){
                        $scope.upComingMilestones.push(element)
                    }else if($scope.today<start_date){
                        $scope.upComingMilestones.push(element)
                    }
                    //check miletone status
                    if(element.status==true){
                        $scope.complete_milestones=$scope.complete_milestones+1;
                    }
                });
                console.log($scope.upComingMilestones);
                console.log($scope.onGoingMilestones)
                $scope.task_completion_percentage=parseFloat(($scope.completed_tasks/$scope.total_tasks)*100).toFixed(2);
            }
        })
    }
    $scope.fetchMilestones();
    
    /*
     * Fetch a Milestone
     */
    $scope.MilestonefindById=function(milestone_id){
        JobMilestones.findById({_id:milestone_id}).then(function(response){
            if(response.status==true){
                $scope.editMilestone=response.data;
                console.log($scope.editMilestone)
                var element = angular.element('#EditMilestone');
                element.modal('show');
            }else{
                toastr.error(response.message,'Alert!');
            }
        })
    }
    /*
     * Update a Milestone
     */
     $scope.MilestoneupdateById=function(){
        JobMilestones.updateById($scope.editMilestone).then(function(response){
            if(response.status==true){
                toastr.success(response.message,'Success!');
                $scope.editMilestone={}
                $scope.fetchMilestones();
                var element = angular.element('#EditMilestone');
                element.modal('hide');
            }else{
                toastr.error(response.message,'Alert!');
            }
        })
    }
    /*
     * Remove a Milestone
     */
    $scope.removeMilestone = function(milestone_id){
//        console.log(id)
        $ngConfirm({
            theme:'supervan',
            title: 'Alert!',
            content: 'Are you sure, you want to delete <strong>this milestone</strong>?',
            //contentUrl: 'template.html', // if contentUrl is provided, 'content' is ignored.
            scope: $scope,
            buttons: {   
                // long hand button definition
                ok: { 
                    text: "Yes!",
                    btnClass: 'btn-primary',
                    keys: ['enter'], // will trigger when enter is pressed
                    action: function(scope){
                        JobMilestones.removebyId(milestone_id).then(function(response){
                            if(response.status==true){
                                toastr.success(response.message,'Success!');
                                $scope.fetchPayments();
                            }else{
                                toastr.error(response.message,'Alert!');
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
     * Create Task in existing Milestone
     */
    $scope.createNewTask=function(milestone_id){
        $scope.newtask={
            milestone_id:milestone_id
        }
    }
    $scope.addTaskinMilestone=function(){
        var dataToSend={
            _id:$scope.newtask.milestone_id,
            task:$scope.newtask
        }
        JobMilestones.addTask(dataToSend).then(function(response){
            if(response.status==true){
                $scope.fetchMilestones();
                toastr.success(response.message,'Success!');
                var element = angular.element('#AddTask');
                element.modal('hide');
            }else{
                toastr.error(response.message,'Alert!');
            }
        })
    }
    /*
     * Fetch a task
     */
    $scope.TaskfindById=function(milestone_id,task_id){
        JobMilestones.TaskfindById({milestone_id:milestone_id,task_id:task_id}).then(function(response){
            if(response.status==true){
                $scope.editTask=response.data.tasks[0];
                $scope.editTask.milestone_id=response.data._id;
            }else{
                toastr.error(response.message,'Alert!');
            }
        })
    }
    /*
     * Edit a Task
     */
    $scope.TaskupdateById=function(){
        var dataToSend={
            milestone_id:$scope.editTask.milestone_id,
            task:$scope.editTask
        }
        JobMilestones.TaskupdateById(dataToSend).then(function(response){
            if(response.status==true){
                toastr.success(response.message,'Success!');
                $scope.editPayment={}
                $scope.fetchMilestones();
                var element = angular.element('#EditTask');
                element.modal('hide');
            }else{
                toastr.error(response.message,'Alert!');
            }
        })
    }
    /*
     * Remove a Task
     */
    $scope.removeTask = function(milestone_id,task_id){
         $ngConfirm({
            theme:'supervan',
            title: 'Alert!',
            content: 'Are you sure, you want to delete <strong>this task</strong>?',
            //contentUrl: 'template.html', // if contentUrl is provided, 'content' is ignored.
            scope: $scope,
            buttons: {   
                // long hand button definition
                ok: { 
                    text: "Yes!",
                    btnClass: 'btn-primary',
                    keys: ['enter'], // will trigger when enter is pressed
                    action: function(scope){
                        JobMilestones.removeTask({milestone_id:milestone_id,task_id:task_id}).then(function(response){
                            if(response.status==true){
                                toastr.success(response.message,'Success!');
                                $scope.fetchMilestones();
                            }else{
                                toastr.error(response.message,'Alert!');
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
    $scope.fetchPayments = function(){
        Payments.all({job_id:$stateParams.id}).then(function(res){
            if(res.status==true){
                $scope.listPayments=res.data;
                $scope.today = new Date();
                $scope.allPayments=[];
                //Payments count
                $scope.overdue_payment_count=0;
                
                $scope.listPayments.forEach(element=> {
                    var due_date = new Date(element.due_date);
                    if(element.status==1){
                        element.payment_status='paid';
                    }else if(due_date>$scope.today){
                        element.payment_status='pending';
                    }else{
                        element.payment_status='overdue';
                        $scope.overdue_payment_count=$scope.overdue_payment_count+1
                    }
                    $scope.allPayments.push(element)
                });
            }
        })
    }
    $scope.fetchPayments();
    /*
     * Add new Payment
     */
    $scope.newPayment={}
    $scope.addPayment=function(){
        $scope.newPayment.posted_by=$rootScope.currentUser._id;
        $scope.newPayment.job_id=$stateParams.id
        Payments.add($scope.newPayment).then(function(res){
            if(res.status==true){
                toastr.success(res.message,'Success!');
                $scope.newPayment={};
                var element = angular.element('#AddPayment');
                element.modal('hide');
            }else{
                toastr.error(res.message,'Alert!');
            }
        })
    }
    /*
     * Edit Payment
     */
    $scope.updateStatus=function(payment_id,status){
        Payments.updateStatus({_id:payment_id,status:status}).then(function(response){
            if(response.status==true){
                toastr.success(response.message,'Success!');
                $scope.fetchPayments();
            }else{
                toastr.error(response.message,'Alert!');
            }
        })
    }
    /*
     * Fetch by Id Payment
     */
    $scope.findById=function(payment_id){
        Payments.findById({_id:payment_id}).then(function(response){
            if(response.status==true){
                $scope.editPayment=response.data;
            }else{
                toastr.error(response.message,'Alert!');
            }
        })
    }
    /*
     * Update by Id
     */
    $scope.updateById=function(){
        Payments.updateById($scope.editPayment).then(function(response){
            if(response.status==true){
                toastr.success(response.message,'Success!');
                $scope.editPayment={}
                $scope.fetchPayments();
                var element = angular.element('#EditPayment');
                element.modal('hide');
            }else{
                toastr.error(response.message,'Alert!');
            }
        })
    }
    /*
     * Delete Payment
     */
    $scope.removePayment = function(payment_id){
        Payments.removebyId(payment_id).then(function(response){
            if(response.status==true){
                toastr.success(response.message,'Success!');
                $scope.fetchPayments();
            }else{
                toastr.error(response.message,'Alert!');
            }
        })
    }
    /*
     * Mark as Favourite
     */
    $scope.markasfavourite=function(job_id){
        Favourites.add({job_id:job_id,user_id:$rootScope.currentUser._id}).then(function(f_res){
            console.log(f_res);
            if(f_res.status==true){
                toastr.success(f_res.message,'Success!');
            }else{
                toastr.error(f_res.message,'Alert!');
            }
        })
    }
    /*
     * Mark Tasks as Completed/Incomplete
     */
    //$scope.checkbox={}
    $scope.updateTaskStatus=function(milestone_id,task_id){
        console.log(milestone_id+" "+task_id)
        console.log($scope.checkbox.mystatus[task_id])
        var status=$scope.checkbox.mystatus[task_id];
        JobMilestones.TaskUpdateStatus({milestone_id:milestone_id,task_id:task_id,status:status}).then(function(response){
            if(response.status==true){
                toastr.success(response.message,'Success!');
            }else{
                toastr.error(response.message,'Alert!');
            }
            console.log(response)
        })
    }
})
/*
 * My bids detail
 */
app.controller('myBidsCtrl', function ($scope,Proposals,$rootScope) {
    $scope.fetchbids = function(){
        Proposals.myBids({user_id:$rootScope.currentUser._id}).then(function(res){
            if(res.status==true){
                $scope.bids = res.data;
                console.log($scope.bids)
                $scope.myBids =[];
                $scope.myInvites=[];
                $scope.bids.forEach(element => {
                    var start_date = new Date(element.livejob.jobDetails['Start date']);
                    var end_date = new Date(element.livejob.jobDetails['End date']);
                    var timeDiff = Math.abs(end_date.getTime() - start_date.getTime());
                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
                    element.duration=diffDays;
                    $scope.myBids.push(element)
                    
                    if(element.status==2){
                        $scope.myInvites.push(element)
                    }
                    
                });
            }
        });
    }
    $scope.fetchbids();
    $scope.remove=function(proposal_id){
        Proposals.markAsDelete({_id:proposal_id}).then(function(res){
            console.log(res)
            if(res.status==true){
                $scope.fetchbids();
            }
        })
    }
    $scope.acceptInvitation=function(proposal_id){
        Proposals.updateStatus({_id:proposal_id,status:5}).then(function(res){
            console.log(res)
            if(res.status==true){
                $scope.fetchbids();
            }
        })
    }
})