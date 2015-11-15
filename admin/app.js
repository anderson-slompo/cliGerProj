String.prototype.nl2br = function()
{
    return this.replace(/\n/g, "<br />");
}
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
            .state('home', {
                url: "/",
                views: {
                    'main': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeController'
                    }
                }
            })
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
            })
            .state('funcionario-list', {
                url: "/funcionario/list",
                views: {
                    'main': {
                        templateUrl: 'templates/funcionario-list.html',
                        controller: 'FuncionarioListController'
                    }
                }
            })
            .state('funcionario-show', {
                url: "/funcionario/show/:id",
                views: {
                    'main': {
                        templateUrl: 'templates/funcionario-show.html',
                        controller: 'FuncionarioShowController'
                    }
                }
            })
            .state('funcionario-edit', {
                url: "/funcionario/edit/:id",
                views: {
                    'main': {
                        templateUrl: 'templates/funcionario-edit.html',
                        controller: 'FuncionarioEditController'
                    }
                }
            })
            .state('funcionario-create', {
                url: "/funcionario/create",
                views: {
                    'main': {
                        templateUrl: 'templates/funcionario-edit.html',
                        controller: 'FuncionarioCreateController'
                    }
                }
            });

    $urlRouterProvider.otherwise("/");
});

appGerProjAdmin.config(function ($resourceProvider, laddaProvider /*, $datepickerProvider */) {
    $resourceProvider.defaults.stripTrailingSlashes = true;
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