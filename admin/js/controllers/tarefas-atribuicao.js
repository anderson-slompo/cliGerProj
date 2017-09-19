appGerProjAdmin.controller("TarefaAtribuicaoController", function ($q, $scope, $stateParams, $state, TarefaAtribuicaoService, toaster) {
    $scope.service = TarefaAtribuicaoService;

    $scope.page_title = "Atribuir Tarefa #"+$stateParams.id;
    $scope.tar_codigo = $stateParams.id;
    $scope.submit_action = "Realizar atribuição";
    $scope.atrib = {};
    $scope.atrib.funcionarios = [];

    TarefaAtribuicaoService.getTarefa($stateParams.id, function(data){
        $scope.atrib.tarefa_nome = data.tarefa_nome;
        $scope.atrib.projeto_nome = data.projeto_nome;
        $scope.atrib.status_nome = data.status_nome;
        $scope.atrib.funcionarios = data.funcionarios;
        $scope.atrib.id_tarefa = $stateParams.id;
    }, function (err) {
        toaster.pop({
            type: 'error',
            body: err.data.error
        });
        $state.go("tarefa-list");
    });

    $scope.save = function () {
        $scope.service.createAtribuicao($scope.atrib).then(function(){
            $state.go("tarefa-list");
        });
    };
});

appGerProjAdmin.service('TarefaAtribuicaoService', function (TarefaAtribuicao, Tarefa, $q, toaster) {
    var self = {
        getTarefa: function (id, fncOK, fncErr) {
            return TarefaAtribuicao.getTarefa(id, fncOK, fncErr);
        },
        isLoading: false,
        isSaving: false,
        createAtribuicao: function (atrib) {
            var d = $q.defer();
            self.isSaving = true;
            TarefaAtribuicao.save(atrib, function (data) {
                self.isSaving = false;
                toaster.pop('success', data.message.message);
                d.resolve(data.message.id);
            }, function (error) {
                toaster.pop({
                    type: 'error',
                    body: 'Erro ao atribuir tarefa:<br/>' + error.data.error.nl2br(),
                    bodyOutputType: 'trustedHtml'
                });
            });
            return d.promise;
        }
    };
    return self;
});
