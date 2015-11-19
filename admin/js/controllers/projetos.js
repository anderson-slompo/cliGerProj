
appGerProjAdmin.controller("ProjetoCrudController", function ($scope, $stateParams, $state, ProjetoService, toaster) {

    
});
appGerProjAdmin.controller("ProjetoShowController", function ($scope, $stateParams, $state, ProjetoService, toaster) {

    $scope.pro_codigo = $stateParams.id;
    $scope.page_title = "Detalhes do Projeto #" + $scope.fun_codigo;
    $scope.service = ProjetoService;

    ProjetoService.getProjeto($stateParams.id, function (data) {
        $scope.service.selectedProjeto = data;
    }, function (err) {
        toaster.pop({
            type: 'error',
            body: err.data.error
        });
        $state.go("projeto-list");
    });

});
appGerProjAdmin.controller('ProjetoListController', function ($scope, $state, ProjetoService) {
    $scope.page_title = "Relatório de Projetos";
    $scope.service = ProjetoService;
    
    $scope.loadMore = function () {
        $scope.service.loadMore();
    };
    $scope.doSearch = function () {
        $scope.service.doSearch();
    };
    $scope.service.doSearch();
});
appGerProjAdmin.service('ProjetoService', function (Projeto, Funcionario, Cliente, Anexo, $rootScope, $q, toaster) {
    var self = {
        getProjeto: function (id, fncOK, fncErr) {
            return Projeto.get({id: id}, fncOK, fncErr);
        },
        getClientes: function (fncOk) {
            return Cliente.get(fncOk);
        },
        getFuncionarios: function (fncOk) {
            return Funcionario.get(fncOk);
        },
        getAnexos: function (fncOk) {
            return Anexo.get(fncOk);
        },
        page: 1,
        hasMore: true,
        isLoading: false,
        isSaving: false,
        selectedProjeto: null,
        projetos: [],
        search_id: null,
        search_nome: null,
        search_descricao: null,
        ordering: 'nome',
        doSearch: function () {
            self.hasMore = true;
            self.page = 1;
            self.projetos = [];
            self.loadProjetos();
        },
        doOrder: function () {
            self.hasMore = true;
            self.page = 1;
            self.projetos = [];
            self.loadProjetos();
        },
        loadProjetos: function () {
            if (self.hasMore && !self.isLoading) {
                self.isLoading = true;

                var params = {
                    page: self.page,
                    search_id: self.search_id,
                    search_nome: self.search_nome,
                    search_descricao: self.search_descricao,
                    order: self.ordering
                };

                Projeto.get(params, function (data) {
                    angular.forEach(data.results, function (proj) {
                        self.projetos.push(new Projeto(proj));
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
                self.loadProjetos();
            }
        },
        updateProjeto: function (proj) {
            var d = $q.defer();
            self.isSaving = true;
            proj.$update().then(function (data) {
                self.isSaving = false;
                toaster.pop('success', data.message);
                d.resolve();
            }, function (error) {
                toaster.pop({
                    type: 'error',
                    body: 'Erro ao atualizar projeto #' + proj.id + '<br/>' + error.data.error.nl2br(),
                    bodyOutputType: 'trustedHtml'
                });
            });
            return d.promise;
        },
        createProjeto: function (proj) {
            var d = $q.defer();
            self.isSaving = true;
            Projeto.save(proj).$promise.then(function (data) {
                self.isSaving = false;
                self.selectedProjeto = null;
                self.hasMore = true;
                self.page = 1;
                self.projetos = [];
                toaster.pop('success', data.message);
                d.resolve();
            }, function (error) {
                toaster.pop({
                    type: 'error',
                    body: 'Erro ao inserir projeto:<br/>' + error.data.error.nl2br(),
                    bodyOutputType: 'trustedHtml'
                });
            });
            return d.promise;
        }
    };
    return self;
});
