
appGerProjAdmin.controller("ProjetoCrudController", function ($scope, $stateParams, $state, ProjetoService, ProjetoAnexosService, Funcionario, Cliente, AnexosProjeto, toaster) {

    $scope.service = ProjetoService;
    $scope.serviceAnexos = ProjetoAnexosService;
    $scope.funcionarios = null;
    $scope.clientes = null;
    $scope.comboFuncionario = {disponiveis: [], associados: []};
    $scope.comboCliente = {disponiveis: [], associados: []};

    $scope.serviceAnexos.zerar();

    $scope.loadFuncionarios = function () {
        Funcionario.get({skip_page: true}, function (data) {
            var temp_funcionarios = data.results;
            for (var i in $scope.service.selectedProjeto.funcionarios) {
                var busca = $scope.service.selectedProjeto.funcionarios[i];
                var index = temp_funcionarios.map(function (e) {
                    return e.id;
                }).indexOf(busca.id);
                temp_funcionarios.splice(index, 1);
            }
            $scope.funcionarios = temp_funcionarios;
        });
    };
    $scope.loadClientes = function () {
        Cliente.get({skip_page: true}, function (data) {
            var temp_clientes = data.results;
            for (var i in $scope.service.selectedProjeto.clientes) {
                var busca = $scope.service.selectedProjeto.clientes[i];
                var index = temp_clientes.map(function (e) {
                    return e.id;
                }).indexOf(busca.id);
                temp_clientes.splice(index, 1);
            }
            $scope.clientes = temp_clientes;
        });
    };

    if ($state.$current.name == 'projeto-create') {
        $scope.page_title = "Novo Projeto";
        $scope.pro_codigo = 0;
        $scope.submit_action = "Salvar";

        $scope.service.selectedProjeto = {
            nome: null,
            descricao: null,
            clientes: [],
            funcionarios: [],
            anexos: []
        };

        $scope.loadClientes();
        $scope.loadFuncionarios();

        $scope.save = function () {
            $scope.service.createProjeto($scope.service.selectedProjeto).then(function (projeto_id) {
                $scope.serviceAnexos.saveAnexos(projeto_id).then(function () {
                    $scope.serviceAnexos.deleteAnexos(projeto_id).then(function () {
                        $state.go("projeto-list");
                    });
                });
            });
        };

    } else {
        $scope.page_title = "Alterar Projeto";
        $scope.pro_codigo = $stateParams.id;
        $scope.submit_action = "Salvar Alterações";

        ProjetoService.getProjeto($stateParams.id, function (data) {
            data.status = data.status ? 't' : 'f';
            $scope.service.selectedProjeto = data;

            $scope.loadClientes();
            $scope.loadFuncionarios();

        }, function (err) {
            toaster.pop({
                type: 'error',
                body: err.data.error
            });
            $state.go("projeto-list");
        });

        $scope.save = function () {
            $scope.service.updateProjeto($scope.service.selectedProjeto).then(function () {
                $scope.serviceAnexos.saveAnexos($scope.pro_codigo).then(function () {
                    $scope.serviceAnexos.deleteAnexos($scope.pro_codigo).then(function () {
                        $state.go("projeto-list");
                    });
                });
            });
        };
    }

    $scope.addCliente = function () {

        var temp = $scope.comboCliente.disponiveis;
        $scope.comboCliente.disponiveis = [];
        angular.forEach(temp, function (value, key) {
            $scope.service.selectedProjeto.clientes.push(value);
            var index = $scope.clientes.map(function (e) {
                return e.id;
            }).indexOf(value.id);
            $scope.clientes.splice(index, 1);
        });
    };
    $scope.rmCliente = function () {
        var temp = $scope.comboCliente.associados;
        $scope.comboCliente.associados = [];
        angular.forEach(temp, function (value, key) {
            $scope.clientes.push(value);
            var index = $scope.service.selectedProjeto.clientes.map(function (e) {
                return e.id;
            }).indexOf(value.id);
            $scope.service.selectedProjeto.clientes.splice(index, 1);
        });
    };

    $scope.addFuncionario = function () {
        var temp = $scope.comboFuncionario.disponiveis;
        $scope.comboFuncionario.disponiveis = [];
        angular.forEach(temp, function (value, key) {
            $scope.service.selectedProjeto.funcionarios.push(value);
            var index = $scope.funcionarios.map(function (e) {
                return e.id;
            }).indexOf(value.id);
            $scope.funcionarios.splice(index, 1);
        });
    };
    $scope.rmFuncionario = function () {
        var temp = $scope.comboFuncionario.associados;
        $scope.comboFuncionario.associados = [];
        angular.forEach(temp, function (value, key) {
            $scope.funcionarios.push(value);
            var index = $scope.service.selectedProjeto.funcionarios.map(function (e) {
                return e.id;
            }).indexOf(value.id);
            $scope.service.selectedProjeto.funcionarios.splice(index, 1);
        });
    };

});
appGerProjAdmin.controller("ProjetoShowController", function ($scope, $stateParams, $state, ProjetoService, toaster) {

    $scope.pro_codigo = $stateParams.id;
    $scope.page_title = "Detalhes do Projeto #" + $scope.pro_codigo;
    $scope.service = ProjetoService;
    $scope.dowloadlink = function(id){
        document.location.href = downHost+id;
    };

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

appGerProjAdmin.service('ProjetoAnexosService', function ($q, toaster, AnexosProjeto) {
    var self = {
        novo_anexo: {nome: '', descricao: '', original: null},
        add_anexos: [],
        rm_anexos: [],
        zerar: function () {
            self.add_anexos = [];
            self.rm_anexos = [];
            self.novo_anexo = {nome: '', descricao: '', original: null};
        },
        addAnexo: function () {
            if (self.novo_anexo.nome !== '' &&
                    self.novo_anexo.descricao !== '' &&
                    self.novo_anexo.original !== null) {

                var novo = {
                    nome: self.novo_anexo.nome,
                    descricao: self.novo_anexo.descricao,
                    original: self.novo_anexo.original
                };

                self.add_anexos.push(novo);

                self.novo_anexo.nome = '';
                self.novo_anexo.descricao = '';
                self.novo_anexo.original = null;
                document.getElementById('novo_anexo_file').value=null;
            } else {
                alert('Favor preencher todos os campos para adicionar o anexo!');
            }
        },
        removeAnexoAntigo: function (anexo, listaAnexos) {
            var index = listaAnexos.map(function (e) {
                return e.id;
            }).indexOf(anexo.id);
            listaAnexos.splice(index, 1);
            self.rm_anexos.push(anexo.id);
        },
        removeAnexoAdicionado: function (anexo) {
            var index = self.add_anexos.map(function (e) {
                return e.original;
            }).indexOf(anexo.original);
            self.add_anexos.splice(index, 1);
        },
        saveAnexos: function (projeto_id) {
            var d = $q.defer();
            if (self.add_anexos.length > 0) {
                AnexosProjeto.addFiles(projeto_id, self.add_anexos, function (data) {
                    toaster.pop('success', data.message);
                    d.resolve();
                }, function (error, status) {
                    toaster.pop({
                        type: 'error',
                        body: '[' + status + '] Erro ao adicionar anexos ao projeto:<br/>' + error.error.nl2br(),
                        bodyOutputType: 'trustedHtml'
                    });
                });
            } else {
                d.resolve();
            }
            return d.promise;
        },
        deleteAnexos: function (projeto_id) {
            var d = $q.defer();
            if (self.rm_anexos.length > 0) {
                AnexosProjeto.deleteFiles(projeto_id, self.rm_anexos, function (data) {
                    toaster.pop('success', data.message);
                    d.resolve();
                }, function (error, status) {
                    toaster.pop({
                        type: 'error',
                        body: '[' + status + '] Erro ao remover anexos ao projeto:<br/>' + error.data.error.nl2br(),
                        bodyOutputType: 'trustedHtml'
                    });
                });
            } else {
                d.resolve();
            }
            return d.promise;
        }
    };
    return self;
});

appGerProjAdmin.service('ProjetoService', function (Projeto, Funcionario, Cliente, Anexo, $q, toaster) {
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
                toaster.pop('success', data.message.message);
                d.resolve(data.message.id);
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
