var adminApp = angular.module('dost.admin', [
	'ui.router',
        'toastr', // to show toasts
        'cp.ngConfirm', // Confirmation Boxes
	'btford.markdown',
	'dost.users',
        'dost.vendortypes',
        'dost.services',
        'dost.highlights',
        'dost.business',
        'dost.cities',
        'dost.events',
        'dost.milestones',
        'dost.fields',
        'dost.groups'
]);

adminApp.config(function($stateProvider, $urlRouterProvider,toastrConfig){

	$urlRouterProvider.otherwise('/');
        // Toastr Settings
	angular.extend(toastrConfig, {
           /* autoDismiss: false,
            containerId: 'toast-container',
            maxOpened: 0,    
            newestOnTop: true,
            positionClass: 'toast-top-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            target: 'body',*/
            progressBar: true
          });
	$stateProvider
                .state('home', {
			url: '/',
			templateUrl: '/admin/templates/vendorTypes/allVendorTypes.html',
			controller: 'listVendorTypeCtrl'
		})
		.state('allUsers', {
			url: '/allUsers',
			templateUrl: '/admin/templates/users/allUsers.html',
			controller: 'AllUsersCtrl'
		})
                .state('editUser', {
			url: '/editUser/:id',
			templateUrl: '/admin/templates/users/editUser.html',
			controller: 'editUserCtrl'
		})
		.state('addUser', {
			url: '/addUser',
			templateUrl: '/admin/templates/users/addUser.html',
			controller: 'addUserCtrl'
		})
                .state('addVendorType', {
			url: '/addVendorType',
			templateUrl: '/admin/templates/vendorTypes/addVendorType.html',
			controller: 'addVendorTypeCtrl'
		})
                .state('editVendorType', {
			url: '/editVendorType/:id',
			templateUrl: '/admin/templates/vendorTypes/editVendorType.html',
			controller: 'editVendorTypeCtrl'
		})
                .state('listVendorTypes', {
			url: '/listVendorTypes',
			templateUrl: '/admin/templates/vendorTypes/allVendorTypes.html',
//                        resolve: {
//				vendortypesList: function(vendorTypes){
//					return vendorTypes.all().then(function(data){
//						return data;
//					});
//				}
//			},
			controller: 'listVendorTypeCtrl'
		})
                .state('inputFields', {
			url: '/inputFields',
			templateUrl: '/admin/templates/vendorTypes/inputFields.html',
			controller: 'inputFieldsCtrl'
		})
                .state('addService', {
			url: '/addService',
			templateUrl: '/admin/templates/Services/addService.html',
			controller: 'addServiceCtrl'
		})
                .state('listServices', {
			url: '/listServices',
			templateUrl: '/admin/templates/Services/listServices.html',
//                        resolve: {
//				vendortypesList: function(vendorTypes){
//					return vendorTypes.all().then(function(data){
//						return data;
//					});
//				}
//			},
			controller: 'listServicesCtrl'
		})
                .state('editService', {
			url: '/editService/:id',
			templateUrl: '/admin/templates/Services/editService.html',
			controller: 'editServiceCtrl'
		})
                .state('addHighlights', {
			url: '/addHighlights',
			templateUrl: '/admin/templates/Highlights/addHighlights.html',
			controller: 'addHighlightsCtrl'
		})
                .state('listHighlights', {
			url: '/listHighlights',
			templateUrl: '/admin/templates/Highlights/listHighlights.html',
			controller: 'listHighlightsCtrl'
		})
                .state('editHighlights', {
			url: '/editHighlights/:id',
			templateUrl: '/admin/templates/Highlights/editHighlights.html',
			controller: 'editHighlightsCtrl'
		})
                .state('addBusiness', {
			url: '/addBusiness',
			templateUrl: '/admin/templates/Business/addBusiness.html',
			controller: 'addBusinessCtrl'
		})
                .state('listBusiness', {
			url: '/listBusiness',
			templateUrl: '/admin/templates/Business/listBusiness.html',
			controller: 'listBusinessCtrl'
		})
                .state('editBusiness', {
			url: '/editBusiness/:id',
			templateUrl: '/admin/templates/Business/editBusiness.html',
			controller: 'editBusinessCtrl'
		})
                .state('addCity', {
			url: '/addCity',
			templateUrl: '/admin/templates/Cities/addCity.html',
			controller: 'addCityCtrl'
		})
                .state('listCities', {
			url: '/listCities',
			templateUrl: '/admin/templates/Cities/allCities.html',
			controller: 'listCitiesCtrl'
		})
                .state('editCity', {
			url: '/editCity/:id',
			templateUrl: '/admin/templates/Cities/editCity.html',
			controller: 'editCityCtrl'
		})
                .state('addEvent', {
			url: '/addEvent',
			templateUrl: '/admin/templates/Events/addEvent.html',
			controller: 'addEventCtrl'
		})
                .state('listEvents', {
			url: '/listEvents',
			templateUrl: '/admin/templates/Events/allEvents.html',
			controller: 'listEventsCtrl'
		})
                .state('editEvent', {
			url: '/editEvent/:id',
			templateUrl: '/admin/templates/Events/editEvent.html',
			controller: 'editEventCtrl'
		})
                .state('addMilestone', {
			url: '/addMilestone',
			templateUrl: '/admin/templates/Milestones/addMilestone.html',
			controller: 'addMilestoneCtrl'
		})
                .state('listMilestones', {
			url: '/listMilestones',
			templateUrl: '/admin/templates/Milestones/allMilestones.html',
			controller: 'listMilestonesCtrl'
		})
                .state('editMilestone', {
			url: '/editMilestone/:id',
			templateUrl: '/admin/templates/Milestones/editMilestone.html',
			controller: 'editMilestoneCtrl'
		})
                .state('addGroup', {
			url: '/addGroup',
			templateUrl: '/admin/templates/Groups/addGroup.html',
			controller: 'addGroupCtrl'
		})
                .state('listGroups', {
			url: '/listGroups',
			templateUrl: '/admin/templates/Groups/allGroups.html',
			controller: 'listGroupsCtrl'
		})
                .state('editGroup', {
			url: '/editGroup/:id',
			templateUrl: '/admin/templates/Groups/editGroup.html',
			controller: 'editGroupCtrl'
		});
});

