appGerProjAdmin.controller("ChangePasswordController", function ($scope, $rootScope, $stateParams, $state, ChangePassword, toaster) {
    
    $scope.page_title = "Alteração de senha";
    
    $scope.data = {};

    $scope.save = function(){
        ChangePassword.change($scope.data, function(data){
            toaster.pop('success', data.message);
            $rootScope.logout();
        }, function(error){
            toaster.pop({
                type: 'error',
                body: 'Erro:' + error.error.nl2br(),
                bodyOutputType: 'trustedHtml'
            });
            $state.go('home');
        });
    };
});