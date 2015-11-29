var wsHost = "http://localhost.wsGerProj/admin/";

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
                localStorage.gerProjAdminAccesToken = data.token;
                localStorage.gerProjAdminUserLogin = data.usuario.login;
                localStorage.gerProjAdminUserName = data.usuario.nome;
                
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