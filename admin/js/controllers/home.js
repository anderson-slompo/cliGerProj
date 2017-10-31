appGerProjAdmin.controller('HomeController',function($scope, $rootScope, TarefaAtribuicao, toaster){
    $scope.page_title = "Dashboard";
    $scope.atribuicoes = {};

    $scope.DEPARTAMENTO_DEV   = 1;
    $scope.DEPARTAMENTO_TESTE = 2;
    $scope.DEPARTAMENTO_IMPL  = 3;
    $scope.DEPARTAMENTO_GEREN = 4;


    TarefaAtribuicao.getAtribuicoes(function(data){
        $scope.atribuicoes = data;
        
    }, function(data){
        toaster.pop({
            type: 'error',
            body: "Erro ao carregar tarefas"
        });
    });

});