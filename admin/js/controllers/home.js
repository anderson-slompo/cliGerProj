appGerProjAdmin.controller('HomeController',function($scope, $rootScope){
    $rootScope.logout = function(){
        localStorage.removeItem('gerProjAdminAccesToken');
        localStorage.removeItem('gerProjAdminUserLogin');
        localStorage.removeItem('gerProjAdminUserName');
        localStorage.removeItem('gerProjUser');
        document.location.href = 'login.html';
    };
    $rootScope.currentUserIsGerente = function(){
        return localStorage.gerProjIsGerente; 
    };
    $rootScope.currentUserIsDesenvolvedor = function(){
        return localStorage.gerProjIsDesenvolvedor; 
    };
    $rootScope.currentUserIsTester = function(){
        return localStorage.gerProjIsTester; 
    };
    $rootScope.currentUserIsImplantador = function(){
        return localStorage.gerProjIsImplantador; 
    };
});