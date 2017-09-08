String.prototype.nl2br = function ()
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
    'ui.router',
    'ui.utils.masks',
    'file-model'
]).run([
    'defaultErrorMessageResolver',
    function (defaultErrorMessageResolver) {
        defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
            errorMessages["defaultMsg"] = "Por favor adicione mensagem de erro para {0}";
            errorMessages["email"] = "Por favor digite um endereço de email válido";
            errorMessages["minlength"] = "Por favor digite pelo menos {0} caracteres";
            errorMessages["maxlength"] = "Você digitou mais do que o máximo de {0} caracteres";
            errorMessages["min"] = "Por favor digite o número maior que {0}";
            errorMessages["max"] = "Por favor digite o número menor que {0}";
            errorMessages["required"] = "Este campo é obrigatório";
            errorMessages["date"] = "Por favor digite uma data válida";
            errorMessages["pattern"] = "Por favor certifique-se que a informação digitada segue o padrão {0}";
            errorMessages["number"] = "Por favor digite um número válido";
            errorMessages["url"] = "Por favor digite uma URL válida no formato http(s)://www.google.com";
            errorMessages["brPhoneNumber"] = "Favor informar um telefone válido";
        });
    }
]);

var wsHost = "http://localhost.wspromind/admin/";
var downHost = "http://localhost.wspromind/download/";

appGerProjAdmin.directive('preventEnter', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.bind('keydown keypress keyup', function (event) {
                if (event.keyCode == 13 && !event.shiftKey) {
                    event.preventDefault();
                }
            });
        }
    };
});

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
                        controller: 'FuncionarioCrudController'
                    }
                }
            })
            .state('funcionario-create', {
                url: "/funcionario/create",
                views: {
                    'main': {
                        templateUrl: 'templates/funcionario-edit.html',
                        controller: 'FuncionarioCrudController'
                    }
                }
            })
            .state('projeto-list', {
                url: "/projeto/list",
                views: {
                    'main': {
                        templateUrl: 'templates/projeto-list.html',
                        controller: 'ProjetoListController'
                    }
                }
            })
            .state('projeto-show', {
                url: "/projeto/show/:id",
                views: {
                    'main': {
                        templateUrl: 'templates/projeto-show.html',
                        controller: 'ProjetoShowController'
                    }
                }
            })
            .state('projeto-edit', {
                url: "/projeto/edit/:id",
                views: {
                    'main': {
                        templateUrl: 'templates/projeto-form.html',
                        controller: 'ProjetoCrudController'
                    }
                }
            })
            .state('projeto-create', {
                url: "/projeto/create",
                views: {
                    'main': {
                        templateUrl: 'templates/projeto-form.html',
                        controller: 'ProjetoCrudController'
                    }
                }
            })
            .state('tarefa-list', {
                url: "/tarefa/list",
                views: {
                    'main': {
                        templateUrl: 'templates/tarefa-list.html',
                        controller: 'TarefaListController'
                    }
                }
            })
            .state('tarefa-show', {
                url: "/tarefa/show/:id",
                views: {
                    'main': {
                        templateUrl: 'templates/tarefa-show.html',
                        controller: 'TarefaShowController'
                    }
                }
            })
            .state('tarefa-edit', {
                url: "/tarefa/edit/:id",
                views: {
                    'main': {
                        templateUrl: 'templates/tarefa-form.html',
                        controller: 'TarefaCrudController'
                    }
                }
            })
            .state('tarefa-create', {
                url: "/tarefa/create",
                views: {
                    'main': {
                        templateUrl: 'templates/tarefa-form.html',
                        controller: 'TarefaCrudController'
                    }
                }
            });

    $urlRouterProvider.otherwise("/");


}).run(['$state', '$rootScope', '$http', function ($state, $rootScope, $http) {
        $rootScope.$on("$stateChangeStart", function (e, toState, toParams, fromState, fromParams) {
            if (!localStorage.gerProjAdminAccesToken) {
                e.preventDefault();
                document.location.href = 'login.html';
            }
        });
        if(localStorage.gerProjAdminAccesToken)
            $http.defaults.headers.common.Authorization = 'Digest token='+localStorage.gerProjAdminAccesToken;
    }]);

appGerProjAdmin.config(function ($resourceProvider, laddaProvider, $datepickerProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = true;
    laddaProvider.setOption({
        style: 'expand-right'
    });
    angular.extend($datepickerProvider.defaults, {
        dateFormat: 'dd/MM/yyyy',
        modelDateFormat: 'yyyy-MM-dd',
        timezone: 'UTC',
        autoclose: true,
        trigger: 'click'
    });
});

appGerProjAdmin.factory('verifySessionExpired', ['$q', '$injector', function($q, $injector) {  
    var verifySessionExpired = {
        responseError: function(response) {
            if (response.status == 401){
                localStorage.removeItem('gerProjAdminAccesToken');
                localStorage.removeItem('gerProjAdminUserLogin');
                localStorage.removeItem('gerProjAdminUserName');
                localStorage.removeItem('gerProjUser');
                document.location.href = 'login.html';
            }
            return $q.reject(response);
        }
    };
    return verifySessionExpired;
}]);
appGerProjAdmin.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('verifySessionExpired');
}]);


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
