appGerProjAdmin.controller("TarefaInteracaoController", function ($q, $scope, $stateParams, $state, toaster, TarefaAtribuicao) {
    $scope.page_title = "Interção com a tarefa"
    $scope.atribuicao = {};

    TarefaAtribuicao.get($stateParams.id,function(data){
        $scope.atribuicao = data;
    }, function(error){
        toaster.pop({
            type: 'error',
            body: 'Erro:' + error.error.nl2br(),
            bodyOutputType: 'trustedHtml'
        });
        $state.go('home');
    });
});