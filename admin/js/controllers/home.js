appGerProjAdmin.controller('HomeController',function($scope, $rootScope){
    $rootScope.logout = function(){
        localStorage.removeItem('gerProjAdminAccesToken');
        localStorage.removeItem('gerProjAdminUserLogin');
        localStorage.removeItem('gerProjAdminUserName');
        localStorage.removeItem('gerProjUser');
        document.location.href = 'login.html';
    };
    $rootScope.currentUserIsGerente = function(){
        return JSON.parse(localStorage.gerProjIsGerente);
    };
    $rootScope.currentUserIsDesenvolvedor = function(){
        return JSON.parse(localStorage.gerProjIsDesenvolvedor);
    };
    $rootScope.currentUserIsTester = function(){
        return JSON.parse(localStorage.gerProjIsTester); 
    };
    $rootScope.currentUserIsImplantador = function(){
        return JSON.parse(localStorage.gerProjIsImplantador); 
    };
});