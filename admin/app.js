var app = angular.module('gerProjAdmin', [
    'ngResource',
    'infinite-scroll',
    'angularSpinner',
    'jcs-autoValidate',
    'angular-ladda',
    'mgcrea.ngStrap',
    'toaster',
    'ngAnimate',
    'ui.router'
]);

app.config(function ($stateProvider, $urlRouterProvider) {
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
                    },
                    'search': {
                        templateUrl: 'templates/cliente-search.html',
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
            .state('create', {
                url: "/cliente/create",
                views: {
                    'main': {
                        templateUrl: 'templates/cliente-edit.html',
                        controller: 'ClienteCreateController'
                    }
                }
            });

    $urlRouterProvider.otherwise('/cliente/list');
});

app.config(function ($resourceProvider, laddaProvider, $datepickerProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
    laddaProvider.setOption({
        style: 'expand-right'
    });
    angular.extend($datepickerProvider.defaults, {
        dateFormat: 'd/M/yyyy',
        autoclose: true
    });
});