appGerProjAdmin.controller("ErroController", function ($q, $scope, $stateParams, $state, toaster, TarefaService, Erro, TipoTarefa, StatusTarefa, Projeto, ErroService) {
    $scope.page_title = "Reportar Erro";

    $scope.erro = {};
    $scope.tarefa = {};

    TarefaService.getTarefa($stateParams.id_tarefa, function (data) {
        $scope.erro.id_tarefa = $stateParams.id_tarefa;
        $scope.erro.id_projeto = data.id_projeto;
        TipoTarefa.getID(data.tipo).then(function(tipo){
            data.tipo = tipo.nome;
            StatusTarefa.getID(data.status).then(function(status){
                data.status_nome = status.nome;
                Projeto.get({id:data.id_projeto}, function(projeto){
                    data.projeto_nome = projeto.nome;
                    $scope.tarefa = data;                    
                });
            });
        });
        
    }, function (err) {
        toaster.pop({
            type: 'error',
            body: err.data.error
        });
        $state.go("home");
    });

    $scope.save = function(){
        ErroService.create($scope.erro).then(function(){
            $state.go('home');
        });
    };
});

appGerProjAdmin.service('ErroService', function (Erro, $q, toaster) {
    var self = {
        isLoading: false,
        isSaving: false,
        create: function (erro) {
            var d = $q.defer();
            self.isSaving = true;
            Erro.save(erro, function (data) {
                self.isSaving = false;
                toaster.pop('success', data.message.message);
                d.resolve(data.message.id);
            }, function (error) {
                toaster.pop({
                    type: 'error',
                    body: 'Erro ao reportar erro:<br/>' + error.error.nl2br(),
                    bodyOutputType: 'trustedHtml'
                });
            });
            return d.promise;
        },
        fix: function(id_erro){
            var d = $q.defer();
            self.isSaving = true;
            Erro.fix(id_erro, function (data) {
                self.isSaving = false;
                toaster.pop('success', data.message.message);
                d.resolve(data.message.id);
            }, function (error) {
                toaster.pop({
                    type: 'error',
                    body: 'Erro ao corrigir erro:<br/>' + error.error.nl2br(),
                    bodyOutputType: 'trustedHtml'
                });
            });
            return d.promise;
        }
    };
    return self;
});