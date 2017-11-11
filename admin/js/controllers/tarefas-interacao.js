appGerProjAdmin.controller("TarefaInteracaoController", function ($q, $scope, $stateParams, $state, toaster, TarefaAtribuicao, TarefaInteracaoService) {
    $scope.page_title = "Interção com a tarefa"
    $scope.atribuicao = {};
    $scope.interacao = {};

    TarefaAtribuicao.get($stateParams.id,function(data){
        $scope.atribuicao = data;
        if($scope.atribuicao.erros instanceof Array){
            $scope.interacao.fixed_errors = {};
            for(i in $scope.atribuicao.erros){
                $scope.interacao.fixed_errors[$scope.atribuicao.erros[i].id]= false;
            }
        }
        $scope.interacao.id_tarefa = data.tarefa.id;
        $scope.interacao.id_funcionario = data.id_funcionario;
        $scope.interacao.fase = data.fase;
    }, function(error){
        toaster.pop({
            type: 'error',
            body: 'Erro:' + error.error.nl2br(),
            bodyOutputType: 'trustedHtml'
        });
        $state.go('home');
    });

    $scope.save = function(){
        $scope.interacao.conclusao = $scope.atribuicao.conclusao;
        TarefaInteracaoService.create($scope.interacao).then(function(){
            $state.go('home');
        });
    };
});

appGerProjAdmin.service('TarefaInteracaoService', function (TarefaInteracao, $q, toaster) {
    var self = {
        isLoading: false,
        isSaving: false,
        create: function (inter) {
            var d = $q.defer();
            self.isSaving = true;
            TarefaInteracao.save(inter, function (data) {
                self.isSaving = false;
                toaster.pop('success', data.message.message);
                d.resolve(data.message.id);
            }, function (error) {
                toaster.pop({
                    type: 'error',
                    body: 'Erro ao interagir com a tarefa:<br/>' + error.data.error.nl2br(),
                    bodyOutputType: 'trustedHtml'
                });
            });
            return d.promise;
        }
    };
    return self;
});
