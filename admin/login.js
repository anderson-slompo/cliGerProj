var wsHost = "http://localhost.wspromind/admin/";

angular.module('gerProjAdminLogin', [
    'toaster',
    'ngAnimate'
]).factory("Login", function ($http) {
    var self = {
        logar: function (form, fncOk, fncErr) {
            $http.post(wsHost + 'auth/', form).success(fncOk).error(fncErr);
        }
    };
    return self;
}).controller("LoginController", function ($scope, Login, toaster) {

    $scope.service = Login;
    $scope.login = {login: '', senha: ''};

    $scope.logar = function () {
        if ($scope.login.login !== '' && $scope.login.senha !== '') {
            Login.logar($scope.login, function (data) {
                console.log(data);
                localStorage.setItem("gerProjAdminAccesToken", data.token);
                localStorage.setItem("gerProjAdminUserLogin", data.usuario.login);
                localStorage.setItem("gerProjAdminUserName", data.usuario.nome);
                localStorage.setItem("gerProjIsGerente", data.usuario.isGerente);
                localStorage.setItem("gerProjIsDesenvolvedor", data.usuario.isDesenvolvedor);
                localStorage.setItem("gerProjIsTester", data.usuario.isTester);
                localStorage.setItem("gerProjIsImplantador", data.usuario.isImplantador);
                
                document.location.href = 'index.html';
            }, function (err) {
                toaster.pop({
                    type: 'error',
                    body: err.error
                });
            });
        } else {
            toaster.pop({
                type: 'error',
                body: "Favor informar usuário e senha para efetuar o login"
            });
        }
    };
});
