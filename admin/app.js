var appGerProjAdmin = angular.module('gerProjAdmin', [
    'ngResource',
    'angularSpinner',
    'jcs-autoValidate',
    'angular-ladda',
    'mgcrea.ngStrap',
    'toaster',
    'ngAnimate',
    'ui.router'
]);

var wsHost = "http://localhost.wsGerProj/admin/";

appGerProjAdmin.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
            .state('login', {
                url: "/login",
                views: {
                    'main': {
                        templateUrl: 'login.html',
                        controller: 'LoginController'
                    }
                }
            })
            .state('cliente-list', {
                url: "/cliente/list",
                views: {
                    'main': {
                        templateUrl: 'templates/cliente-list.html',
                        controller: 'ClienteListController'
                    }
                }
            })
            .state('cliente-edit', {
                url: "/cliente/edit/:id",
                views: {
                    'main': {
                        templateUrl: 'templates/cliente-edit.html',
                        controller: 'ClienteEditController'
                    }
                }
            })
            .state('cliente-create', {
                url: "/cliente/create",
                views: {
                    'main': {
                        templateUrl: 'templates/cliente-edit.html',
                        controller: 'ClienteCreateController'
                    }
                }
            });

    $urlRouterProvider.otherwise("/cliente/list");
});

appGerProjAdmin.config(function ($resourceProvider, laddaProvider /*, $datepickerProvider */) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
    laddaProvider.setOption({
        style: 'expand-right'
    });
//    angular.extend($datepickerProvider.defaults, {
//        dateFormat: 'd/M/yyyy',
//        autoclose: true
//    });
});

appGerProjAdmin.directive('ccSpinner', function () {
	return {
		'restrict': 'AE',
		'templateUrl': 'templates/spinner.html',
		'scope': {
			'isLoading': '=',
			'message': '@'
		}
	}
});