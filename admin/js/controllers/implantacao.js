
appGerProjAdmin.controller("ImplantacaoCreateController", function ($scope, $state, ImplantacaoService, TarefaAtribuicao) {
    
        $scope.page_title = "Nova Implantação";
        $scope.impl_codigo = 0;
        $scope.implantacoes = ImplantacaoService;
        $scope.submit_action = "Salvar";
        $scope.implantacoes.selectedImplantacao = {nome:"",descricao:"",tarefas:[]};

        $scope.comboTarefa = {disponiveis: [], associados: []};

        TarefaAtribuicao.getDisponiveisImplantacao(function(data){
            $scope.tarefas = data;
        }, function(err){
            toaster.pop({
                type: 'error',
                body: err.data.error
            });
            $state.go("implantacao-list");
        });
    
        $scope.save = function () {
            $scope.implantacoes.createImplantacao($scope.implantacoes.selectedImplantacao)
                    .then(function () {
                        $state.go("implantacao-list");
                    })
        };

        $scope.addTarefa = function () {
            var temp = $scope.comboTarefa.disponiveis;
            $scope.comboTarefa.disponiveis = [];
            angular.forEach(temp, function (value, key) {
                $scope.implantacoes.selectedImplantacao.tarefas.push(value);
                var index = $scope.tarefas.map(function (e) {
                    return e.id;
                }).indexOf(value.id);
                $scope.tarefas.splice(index, 1);
            });
        }
        $scope.rmTarefa = function () {
            var temp = $scope.comboTarefa.associados;
            $scope.comboTarefa.associados = [];
            angular.forEach(temp, function (value, key) {
                $scope.tarefas.push(value);
                var index = $scope.implantacoes.selectedImplantacao.tarefas.map(function (e) {
                    return e.id;
                }).indexOf(value.id);
                $scope.implantacoes.selectedImplantacao.tarefas.splice(index, 1);
            });
        }
    
    });
    appGerProjAdmin.controller('ImplantacaoListController', function ($scope, $modal, ImplantacaoService) {
        $scope.page_title = "Relatório de Implantações";
        $scope.implantacoes = ImplantacaoService;
    
        $scope.id = "";
        $scope.nome = "";
        $scope.id_externo = "";
    
        $scope.loadMore = function () {
            $scope.implantacoes.loadMore();
        };
        $scope.doSearch = function () {
            $scope.implantacoes.doSearch();
        };
        $scope.remove = function (impl) {
            if(confirm("Deseja mesmo cancelar a implantacao #"+impl.id+" "+impl.nome+"?")){
                $scope.implantacoes.removeImpantacao(impl).then(function () {
                    $state.go("implantacao-list");
                });
            }
        };
        $scope.implantacoes.doSearch();
    });


    appGerProjAdmin.controller("ImplantacaoShowController", function ($scope, $stateParams, $state, ImplantacaoService, toaster) {
        
        $scope.impl_codigo = $stateParams.id;
        $scope.page_title = "Detalhes da implantação #" + $scope.impl_codigo;
        $scope.implantacoes = ImplantacaoService;
        $scope.implantacoes.selectedImplantacao = {tarefas:[]};
    
        ImplantacaoService.getImplantacao($stateParams.id, function (data) {
            $scope.implantacoes.selectedImplantacao = data;
        }, function (err) {
            toaster.pop({
                type: 'error',
                body: err.data.error
            });
            $state.go("implantacao-list");
        });
    
        
    });

    appGerProjAdmin.service('ImplantacaoService', function (Implantacao, $rootScope, $q, toaster) {
        var self = {
            'getImplantacao': function (id, fncOk, fncError) {
                return Implantacao.get({id: id}, fncOk, fncError);
            },
            'page': 1,
            'hasMore': true,
            'isLoading': false,
            'isSaving': false,
            'selectedImplantacao': null,
            'implantacoes': [],
            'search_id': null,
            'search_nome': null,
            'search_id_externo': null,
            'ordering': 'data_hora',
            'doSearch': function () {
                self.hasMore = true;
                self.page = 1;
                self.implantacoes = [];
                self.loadImplantacoes();
            },
            'doOrder': function () {
                self.hasMore = true;
                self.page = 1;
                self.implantacoes = [];
                self.loadImplantacoes();
            },
            'loadImplantacoes': function () {
                if (self.hasMore && !self.isLoading) {
                    self.isLoading = true;
    
                    var params = {
                        'page': self.page,
                        'search_id': self.search_id,
                        'search_nome': self.search_nome,
                        'search_id_externo': self.search_id_externo,
                        'order': self.ordering
                    };
    
                    Implantacao.get(params, function (data) {
                        console.log(data);
                        angular.forEach(data.results, function (impl) {
                            self.implantacoes.push(new Implantacao(impl));
                        });
    
                        if (!data.next) {
                            self.hasMore = false;
                        }
                        self.isLoading = false;
                    });
                }
    
            },
            'loadMore': function () {
                if (self.hasMore && !self.isLoading) {
                    self.page += 1;
                    self.loadImplantacoes();
                }
            },
            'updateImplantacao': function (impl) {
                var d = $q.defer();
                self.isSaving = true;
                impl.$update().then(function (data) {
                    self.isSaving = false;
                    toaster.pop('success', data.message);
                    d.resolve();
                }, function (error) {
                    toaster.pop({
                        type: 'error',
                        body: 'Erro ao atualizar implantacao #' + impl.id + '<br/>' + error.data.error.nl2br(),
                        bodyOutputType: 'trustedHtml'
                    });
                });
                return d.promise;
            },
            'removeImplantacao': function (impl) {
                var d = $q.defer();
                self.isDeleting = true;
                impl.$remove().then(function () {
                    self.isDeleting = false;
                    var index = self.implantacoes.indexOf(impl);
                    self.implantacoes.splice(index, 1);
                    self.selectedImplantacao = null;
                    toaster.pop('success', 'Implantação removida com sucesso');
                    d.resolve();
                }, function (error) {
                    toaster.pop({
                        type: 'error',
                        body: 'Erro ao remover implantacao #' + impl.id + '<br/>' + error.data.error.nl2br(),
                        bodyOutputType: 'trustedHtml'
                    });
                });
                return d.promise;
            },
            'createImplantacao': function (impl) {
                var d = $q.defer();
                self.isSaving = true;
                Implantacao.save(impl).$promise.then(function (data) {
                    self.isSaving = false;
                    self.selectedImplantacao = null;
                    self.hasMore = true;
                    self.page = 1;
                    self.implantacoes = [];
                    toaster.pop('success', data.message);
                    d.resolve();
                }, function (error) {
                    toaster.pop({
                        type: 'error',
                        body: 'Erro ao inserir implantação:<br/>' + error.data.error.nl2br(),
                        bodyOutputType: 'trustedHtml'
                    });
                });
                return d.promise;
            }
        };
        return self;
    });
    