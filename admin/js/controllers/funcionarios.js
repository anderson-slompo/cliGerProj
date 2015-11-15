appGerProjAdmin.factory("Funcionario", function ($resource) {
    return $resource(wsHost + "funcionarios/:id/", {id: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
});
appGerProjAdmin.controller("FuncionarioCreateController", function ($scope, $state, FuncionarioService) {

    $scope.page_title = "Novo Funcionario";
    $scope.fun_codigo = 0;
    $scope.funcionarios = FuncionarioService;
    $scope.submit_action = "Salvar";
    $scope.clientes.selectedFuncionario = {};
    
    $scope.save = function () {
        $scope.funcionarios.createFuncionario($scope.funcionarios.selectedFuncionario)
                .then(function () {
                    $state.go("funcionario-list");
                });
    };

});
appGerProjAdmin.controller("FuncionarioEditController", function ($scope, $stateParams, $state, FuncionarioService) {

    $scope.page_title = "Alterar Funcionario";
    $scope.fun_codigo = $stateParams.id;
    $scope.funcionarios = FuncionarioService;
    $scope.submit_action = "Salvar Alterações";
    
    $scope.funcionarios.selectedFuncionario = FuncionarioService.getFuncionario($stateParams.id);

    $scope.save = function () {
        $scope.funcionarios.updateFuncionario($scope.funcionarios.selectedFuncionario).then(function () {
            $state.go("funcionario-list");
        })
    };

});
appGerProjAdmin.controller("FuncionarioShowController", function ($scope, $stateParams, $state, FuncionarioService) {

    $scope.fun_codigo = $stateParams.id;
    $scope.page_title = "Detalhes do Funcionario #"+$scope.fun_codigo;
    $scope.funcionarios = FuncionarioService;
        
    $scope.funcionarios.selectedFuncionario = FuncionarioService.getFuncionario($stateParams.id);

});
appGerProjAdmin.controller('FuncionarioListController', function ($scope, FuncionarioService) {
    $scope.page_title = "Relatório de Funcionários";
    $scope.funcionarios = FuncionarioService;
    $scope.funcionarios.search_status = $scope.funcionarios.listaStatus[0];
    $scope.funcionarios.listaStatus[0].name='--Todos--';
    
    $scope.loadMore = function () {
        $scope.funcionarios.loadMore();
    };
    $scope.doSearch = function () {
        $scope.funcionarios.doSearch();
    };
    $scope.remove = function (fun) {
        if (confirm("Deseja mesmo remover o funcionário #" + fun.id + " " + fun.nome + "?")) {
            $scope.funcionarios.removeFuncionario(fun).then(function () {
                $state.go("funcionario-list");
            });
        }
    };
    $scope.funcionarios.doSearch();
});
appGerProjAdmin.service('FuncionarioService', function (Funcionario, $rootScope, $q, toaster) {
    var self = {
        getFuncionario: function (id) {
            return Funcionario.get({id: id});
        },
        listaStatus: [
            {id: null, name:'--Selecione--'},
            {id: 't', name: "Ativo"},
            {id: 'f', name: "Inativo"}
        ],
        page: 1,
        hasMore: true,
        isLoading: false,
        isSaving: false,
        selectedFuncionario: null,
        funcionarios: [],
        search_id: null,
        search_nome: null,
        search_status: null,
        ordering: 'nome',
        doSearch: function () {
            self.hasMore = true;
            self.page = 1;
            self.funcionarios = [];
            self.loadFuncionarios();
        },
        doOrder: function () {
            self.hasMore = true;
            self.page = 1;
            self.funcionarios = [];
            self.loadFuncionarios();
        },
        loadFuncionarios: function () {
            if (self.hasMore && !self.isLoading) {
                self.isLoading = true;
                
                statusSearch = self.search_status == null ? null : self.search_status.id;
                
                var params = {
                    page: self.page,
                    search_id: self.search_id,
                    search_nome: self.search_nome,
                    search_status: statusSearch,
                    order: self.ordering
                };

                Funcionario.get(params, function (data) {
                    console.log(data);
                    angular.forEach(data.results, function (fun) {
                        self.funcionarios.push(new Funcionario(fun));
                    });

                    if (!data.next) {
                        self.hasMore = false;
                    }
                    self.isLoading = false;
                });
            }

        },
        loadMore: function () {
            if (self.hasMore && !self.isLoading) {
                self.page += 1;
                self.loadFuncionarios();
            }
        },
        updateFuncionario: function (fun) {
            var d = $q.defer();
            self.isSaving = true;
            fun.$update().then(function (data) {
                self.isSaving = false;
                toaster.pop('success', data.message);
                d.resolve();
            }, function (error) {
                toaster.pop({
                    type: 'error',
                    body: 'Erro ao atualizar funcionario #' + fun.id + '<br/>' + error.data.error.nl2br(),
                    bodyOutputType: 'trustedHtml'
                });
            });
            return d.promise;
        },
        removeFuncionario: function (fun) {
            var d = $q.defer();
            self.isDeleting = true;
            fun.$remove().then(function () {
                self.isDeleting = false;
                var index = self.funcionarios.indexOf(fun);
                self.funcionarios.splice(index, 1);
                self.selectedFuncionario = null;
                toaster.pop('success', 'Funcionário removido com sucesso');
                d.resolve();
            }, function (error) {
                toaster.pop({
                    type: 'error',
                    body: 'Erro ao remover funcionario #' + fun.id + '<br/>' + error.data.error.nl2br(),
                    bodyOutputType: 'trustedHtml'
                });
            });
            return d.promise;
        },
        createFuncionario: function (fun) {
            var d = $q.defer();
            self.isSaving = true;
            Funcionario.save(fun).$promise.then(function (data) {
                self.isSaving = false;
                self.selectedFuncionario = null;
                self.hasMore = true;
                self.page = 1;
                self.funcionarios = [];
                toaster.pop('success', data.message);
                d.resolve();
            }, function (error) {
                toaster.pop({
                    type: 'error',
                    body: 'Erro ao inserir funcionário:<br/>' + error.data.error.nl2br(),
                    bodyOutputType: 'trustedHtml'
                });
            });
            return d.promise;
        }
    };
    return self;
});
