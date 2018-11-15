var app = angular.module('dost.home', [
        'ngAnimate',
	'ui.router',
	'ngMaterial',
        'ngMaterialDatePicker',
        'betsol.intlTelInput',
        'dost.users',
        'dost.vendortypes',
        'dost.services',
        'dost.highlights',
        'dost.business',
        'dost.cities',
        'dost.projects',
        'dost.events',
        'dost.tasks',
        'dost.jobposts',
        'dost.milestones',
        'dost.fields',
        'dost.guests',
        'dost.livejobs',
        'dost.proposals',
        'dost.invitations',
        'dost.clients',
        'dost.budgets',
        'dost.hotels',
        'dost.foodRestrictions',
        'dost.messages',
        'dost.favourites',
        'dost.jobmilestones',
        'dost.payments',
        'otpInputDirective',
        'toastr', // to show toasts
        'cp.ngConfirm', // Confirmation Boxes
        'uiCropper' //Image cropping tool
]);

app.config(function($stateProvider, $urlRouterProvider,$locationProvider){
	$stateProvider
//		.state('home', {
//			url: "/",
//			templateUrl: "/home/templates/login.html",
//			controller: 'LoginCtrl'
//		})
                .state('home',{
                    url: "/",
                    templateUrl: "/home/templates/selectActivity.html",
                    controller: 'selectActivityCtrl'
                })
                .state('login', {
			url: "/login",
			templateUrl: "/home/templates/login.html",
			controller: 'LoginCtrl'
		})
                .state('register', {
			url: "/signup",
			templateUrl: "/home/templates/register.html",
			controller: 'SignupCtrl'
		})
                .state('editUser', {
			url: '/editUser',
			templateUrl: '/home/templates/Users/editUser.html',
			controller: 'editUserCtrl'
		})
                .state('selectActivity', {
			url: "/selectactivity",
			templateUrl: "/home/templates/selectActivity.html",
			controller: 'selectActivityCtrl'
		})
                .state('onBoarding', {
			url: "/onBoarding",
			templateUrl: "/home/templates/onBoarding.html",
			controller: 'onBoardingCtrl'
		})
                .state('forgotPassword', {
			url: "/forgotPassword",
			templateUrl: "/home/templates/Users/forgotPassword.html",
			controller: 'forgotPasswordCtrl'
		})
                .state('passwordSuccess', {
			url: "/passwordSuccess",
			templateUrl: "/home/templates/Users/passwordSuccess.html",
			controller: 'LoginCtrl'
		})
                .state('registerBusiness', {
			url: "/registerBusiness",
			templateUrl: "/home/templates/Business/registerBusiness.html",
			controller: 'registerBusinessCtrl'
		})
                .state('registerBusiness.vendortype', {
			url: "/vendortype",
			templateUrl: "/home/templates/Business/vendortype.html"
		})
                .state('registerBusiness.serviceandcost', {
			url: "/serviceandcost",
			templateUrl: "/home/templates/Business/servicesandcost.html"
		})
                .state('registerBusiness.contact', {
			url: "/contact",
			templateUrl: "/home/templates/Business/contact.html"
		})
                .state('registerBusiness.awards', {
			url: "/awards",
			templateUrl: "/home/templates/Business/awards.html"
		})
                .state('registerBusinessSuccess',{
                        url: "/registerBusinessSuccess",
			templateUrl: "/home/templates/Business/registerBusinessSuccess.html",
                        controller: 'registerBusinessCtrl'
                })
                .state('marketPlace', {
			url: "/marketPlace",
			templateUrl: "/home/templates/Business/marketplace.html",
                        controller: 'marketPlaceCtrl'
		})
                .state('vendorProfile', {
			url: "/vendorProfile/:id",
			templateUrl: "/home/templates/Business/vendorProfile.html",
                        controller: 'vendorProfileCtrl'
		})
                .state('createProject', {
			url: "/createProject",
			templateUrl: "/home/templates/Projects/createProject.html",
			controller: 'createProjectCtrl'
		})
                .state('createProject.basicinfo', {
			url: "/basicinfo",
			templateUrl: "/home/templates/Projects/basicinfo.html"
		})
                .state('createProject.brideandgroom', {
			url: "/brideandgroom",
			templateUrl: "/home/templates/Projects/brideandgroom.html"
		})
                .state('createProject.events', {
			url: "/events",
			templateUrl: "/home/templates/Projects/events.html"
		})
                .state('createProject.teams', {
			url: "/teams",
			templateUrl: "/home/templates/Projects/teams.html"
		})
                .state('projectlist',{
                        url: "/projectlist",
			templateUrl: "/home/templates/Projects/projectlist.html",
                        controller: 'projectlistCtrl'
                })
                .state('viewProject',{
                        url: "/viewProject/:id",
			templateUrl: "/home/templates/Projects/viewProject.html",
                        controller: 'viewProjectCtrl'
                })
                .state('teamList',{
                        url: "/teamList/:id",
			templateUrl: "/home/templates/Planner/teamlist.html",
                        controller: 'teamlistCtrl'
                })
                .state('taskList',{
                        url: "/taskList/:id",
			templateUrl: "/home/templates/Planner/tasklist.html",
                        controller: 'tasklistCtrl'
                })
                .state('project_input',{
                        url: "/project_input/:id?view",
			templateUrl: "/home/templates/Projects/project_input.html",
                        controller: 'projectInputCtrl'
                })
                .state('jobs',{
                        url: "/jobs/:id",
			templateUrl: "/home/templates/Planner/jobs.html",
                        controller: 'jobsCtrl'
                })
                .state('jobsDetail',{
                        url: "/jobsDetail/:id",
			templateUrl: "/home/templates/Planner/jobs_detail.html",
                        controller: 'jobsDetailCtrl'
                })
                .state('guests',{
                        url: "/guests/:id",
			templateUrl: "/home/templates/Planner/guests.html",
                        controller: 'GuestsCtrl'
                })
                .state('clients',{
                        url: "/clients/:id",
			templateUrl: "/home/templates/Planner/clients.html",
                        controller: 'ClientsCtrl'
                })
                .state('PostJob', {
			url: "/PostJob/:id",
			templateUrl: "/home/templates/Planner/postAjob/createJob.html",
			controller: 'postJobCtrl'
		})
                .state('PostJob.basicinfo', {
			url: "/basicinfo",
			templateUrl: "/home/templates/Planner/postAjob/basicinfo.html"
		})
                .state('PostJob.jobdetails', {
			url: "/jobdetails",
			templateUrl: "/home/templates/Planner/postAjob/jobdetails.html"
		})
                .state('PostJob.address', {
			url: "/address",
			templateUrl: "/home/templates/Planner/postAjob/addressandtimings.html"
		})
                .state('PostJob.budget', {
			url: "/budget",
			templateUrl: "/home/templates/Planner/postAjob/budgetandmilestones.html"
		})
                
                .state('browseJobs', {
			url: "/browseJobs",
			templateUrl: "/home/templates/Jobs/browseJobs.html",
			controller: 'browseJobsCtrl'
		})
                .state('jobDetail',{
                        url: "/jobDetail/:id",
			templateUrl: "/home/templates/Jobs/jobDetail.html",
                        controller: 'jobDetailCtrl'
                })
                .state('myInvitations',{
                        url: "/myInvitations",
			templateUrl: "/home/templates/Guests/myInvitations.html",
                        controller: 'MyInvitationsCtrl'
                })
                .state('events',{
                        url: "/events",
			templateUrl: "/home/templates/Events/events.html",
                        controller: 'EventsCtrl'
                })
                .state('eventsdetail',{
                        url: "/eventsdetail/:id/:event_id",
			templateUrl: "/home/templates/Events/eventdetail.html",
                        controller: 'InvitationDetailCtrl'
                })
                .state('guestViewCode',{
                        url: "/guestViewCode/:project_id/:phone/:invitation_id",
			templateUrl: "/home/templates/GuestView/code.html",
                        controller: 'GuestViewCtrl'
                })
                .state('guestViewDetails',{
                        url: "/guestViewDetails/:id",
			templateUrl: "/home/templates/GuestView/filldetails.html",
                        controller: 'GuestViewCtrl'
                })
                .state('vendors', {
			url: "/vendors/:id",
			templateUrl: "/home/templates/Planner/vendors.html",
			controller: 'vendorJobsCtrl'
		})
		 .state('vendors_detail',{
                        url: "/vendors_detail/:id/:userid",
			templateUrl: "/home/templates/Planner/vendors_detail.html",
                        controller: 'vendorDetailJobsCtrl'
                })
                .state('myjobs',{
                        url: "/myjobs",
			templateUrl: "/home/templates/Jobs/myjobs.html",
                        controller: 'myJobsCtrl'
                })
                .state('myjob_detail',{
                        url: "/myjob_detail/:id",
			templateUrl: "/home/templates/Jobs/myjob_detail.html",
                        controller: 'myJobDetailCtrl'
                })
                .state('mybids',{
                        url: "/mybids",
			templateUrl: "/home/templates/Jobs/mybids.html",
                        controller: 'myBidsCtrl'
                })
                .state('budget',{
                        url: "/budget/:id",
			templateUrl: "/home/templates/Planner/budget.html",
                        controller: 'budgetCtrl'
                })
                .state('api', {
			url: "/apiDost",
			templateUrl: "/home/templates/api.html",
			controller: 'LoginCtrl'
		});

	$urlRouterProvider.otherwise("/");
        
});