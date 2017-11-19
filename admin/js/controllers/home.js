appGerProjAdmin.controller('HomeController',function($scope, $state, $rootScope, TarefaAtribuicao, ErroService, DashGerente, Implantacao, ImplantacaoService, toaster){
    $scope.page_title = "Dashboard";
    $scope.atribuicoes = {};
    $scope.tarefasAguardandoAtribuicao = [];
    $scope.statusProjetos = [];
    $scope.tarefasAtrasadas = [];
    $scope.tarefasExecucao = [];
    $scope.implantacoesExecucao = [];

    $scope.DEPARTAMENTO_DEV   = 1;
    $scope.DEPARTAMENTO_TESTE = 2;
    $scope.DEPARTAMENTO_IMPL  = 3;
    $scope.DEPARTAMENTO_GEREN = 4;


    if(Utils.currentUserIsDesenvolvedor() || Utils.currentUserIsTester() || Utils.currentUserIsImplantador()){
        TarefaAtribuicao.getAtribuicoes(function(data){
            $scope.atribuicoes = data;
            
        }, function(data){
            toaster.pop({
                type: 'error',
                body: "Erro ao carregar tarefas"
            });
        });
    }

    if(Utils.currentUserIsImplantador()){
        Implantacao.dash({fake:1}, function(data){
            $scope.implantacoesExecucao = JSON.parse(angular.toJson(data));
        });

        $scope.remove = function (impl) {
            if(confirm("Deseja mesmo cancelar a implantacao #"+impl.id+" "+impl.nome+"?")){
                ImplantacaoService.removeImplantacao(impl).then(function () {
                    $state.go("home", {}, {reload:true});
                });
            }
        };
        $scope.finish = function(impl){
            if(confirm("Deseja mesmo finalizar a implantacao #"+impl.id+" "+impl.nome+"?")){
                ImplantacaoService.finishImplantacao(impl).then(function () {
                    $state.go("home", {}, {reload:true});
                });
            }
        };
    }

    if(Utils.currentUserIsGerente()){
        DashGerente.tarefasAguardandoAtribuicao(function(data){
            $scope.tarefasAguardandoAtribuicao = data;
        });
        DashGerente.statusProjetos(function(data){
            $scope.statusProjetos = data;
        });
        DashGerente.tarefasAtrasadas(function(data){
            $scope.tarefasAtrasadas = data;
        });
        DashGerente.tarefasExecucao(function(data){
            $scope.tarefasExecucao = data;
        });
    }

    $scope.fix = function(id_erro, erro_nome){
        if(confirm('Confirma a correção do erro #'+id_erro+' ['+erro_nome+']?')){
            ErroService.fix(id_erro).then(function(){
                $state.reload();
            });
        }
    };
});