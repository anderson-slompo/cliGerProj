
appGerProjAdmin.controller("TarefaCrudController", function ($q, $scope, $stateParams, $state, TarefaService, TarefaAnexosService, TarefaItensService, toaster) {

    $scope.service = TarefaService;
    $scope.serviceAnexos = TarefaAnexosService;
    $scope.serviceItens = TarefaItensService;
    $scope.projetos = [];
    $scope.tipos = [];
    $scope.status = [];

    $scope.loadTipos = function () {
        var d = $q.defer();
        $scope.service.getTipos(function (data) {
            for (var i in data) {
                $scope.tipos.push({id: i, nome: data[i]});
            }
            d.resolve();
        });
        return d.promise;
    };
    $scope.loadStatus = function () {
        var d = $q.defer();
        $scope.service.getStatus(function (data) {
            for (var i in data) {
                $scope.status.push({id: i, nome: data[i]});
            }
            d.resolve();
        });
        return d.promise;
    };
    $scope.loadProjetos = function () {
        var d = $q.defer();
        $scope.service.getProjetos(function (data) {
            $scope.projetos = data.results;
            d.resolve();
        });
        return d.promise;
    };

    if ($state.$current.name == 'tarefa-create') {
        $scope.page_title = "Nova Tarefa";
        $scope.tar_codigo = 0;
        $scope.submit_action = "Salvar";
        
        $scope.service.selectedTarefa = {
            nome: null,
            descricao: null,
            id_projeto: null,
            tipo: null,
            anexos: [],
            itens: []
        };
        
        $scope.loadTipos();
        $scope.loadStatus();
        $scope.loadProjetos();
        
        $scope.save = function () {
            $scope.service.createTarefa($scope.service.selectedTarefa, $scope.serviceItens.add_itens).then(function (tarefa_id) {
                $scope.serviceAnexos.saveAnexos(tarefa_id).then(function () {
                    $scope.serviceAnexos.deleteAnexos(tarefa_id).then(function () {
                        $state.go("tarefa-list");
                    });
                });
            });
        };
        
    } else {
        $scope.page_title = "Alterar Tarefa";
        $scope.tar_codigo = $stateParams.id;
        $scope.submit_action = "Salvar Alterações";
        
        TarefaService.getTarefa($stateParams.id, function (data) {
            $scope.loadTipos().then(function(){
                $scope.loadStatus().then(function(){
                    $scope.loadProjetos().then(function(){
                        $scope.service.selectedTarefa = data;
                    });
                });                
            });
        }, function (err) {
            toaster.pop({
                type: 'error',
                body: err.data.error
            });
            $state.go("tarefa-list");
        });

        $scope.save = function () {
            $scope.service.updateTarefa($scope.service.selectedTarefa).then(function () {
                $scope.serviceAnexos.saveAnexos($scope.tar_codigo).then(function () {
                    $scope.serviceAnexos.deleteAnexos($scope.tar_codigo).then(function () {
                        $state.go("tarefa-list");
                    });
                });
            });
        };
    }

});

appGerProjAdmin.controller('TarefaListController', function ($scope, $state, TarefaService) {
    $scope.page_title = "Relatório de Tarefas";
    $scope.service = TarefaService;
    $scope.projetos = [];
    $scope.tipos = [];
    $scope.status = [];
    $scope.tiposDesc = {};
    $scope.statusDesc = {};
    $scope.projetoDesc = {};

    $scope.service.getProjetos(function (data) {
        $scope.projetos = data.results;
        for (i in $scope.projetos){
            $scope.projetoDesc[$scope.projetos[i].id] = $scope.projetos[i].nome;
        }
    });
    $scope.service.getTipos(function (data) {
        $scope.tiposDesc = data;
        for (var i in data) {
            $scope.tipos.push({id: i, nome: data[i]});
        }
    });
    $scope.service.getStatus(function (data) {
        $scope.statusDesc = data;
        for (var i in data) {
            $scope.status.push({id: i, nome: data[i]});
        }
    });

    $scope.loadMore = function () {
        $scope.service.loadMore();
    };
    $scope.doSearch = function () {
        $scope.service.doSearch();
    };

    $scope.getDesc = function (source, search) {
        var index = source.map(function (e) {
            return e.id;
        }).indexOf(search);
        return source[index].nome;
    };
    
    $scope.service.doSearch();
});


appGerProjAdmin.service('TarefaAnexosService', function ($q, toaster, AnexosTarefa) {
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
        saveAnexos: function (tarefa_id) {
            var d = $q.defer();
            if (self.add_anexos.length > 0) {
                AnexosTarefa.addFiles(tarefa_id, self.add_anexos, function (data) {
                    toaster.pop('success', data.message);
                    d.resolve();
                }, function (error, status) {
                    toaster.pop({
                        type: 'error',
                        body: '[' + status + '] Erro ao adicionar anexos à tarefa:<br/>' + error.error.nl2br(),
                        bodyOutputType: 'trustedHtml'
                    });
                });
            } else {
                d.resolve();
            }
            return d.promise;
        },
        deleteAnexos: function (tarefa_id) {
            var d = $q.defer();
            if (self.rm_anexos.length > 0) {
                AnexosTarefa.deleteFiles(tarefa_id, self.rm_anexos, function (data) {
                    toaster.pop('success', data.message);
                    d.resolve();
                }, function (error, status) {
                    toaster.pop({
                        type: 'error',
                        body: '[' + status + '] Erro ao remover anexos da tarefa:<br/>' + error.data.error.nl2br(),
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

appGerProjAdmin.service('TarefaItensService', function ($q, toaster, AnexosTarefa) {
    var self = {
        novo_item: {titulo: '', descricao: '', porcentagem: ''},
        add_itens: [],
        rm_itens: [],
        zerar: function () {
            self.add_itens = [];
            self.rm_itens = [];
            self.novo_item = {titulo: '', descricao: '', porcentagem: ''};
        },
        addItem: function () {
            if (self.novo_item.titulo !== '' &&
                    self.novo_item.descricao !== '' &&
                    self.novo_item.porcentagem !== '') {

                var novo = {
                    titulo: self.novo_item.titulo,
                    descricao: self.novo_item.descricao,
                    porcentagem: self.novo_item.porcentagem
                };

                self.add_itens.push(novo);

                self.novo_item.titulo = '';
                self.novo_item.descricao = '';
                self.novo_item.porcentagem = null;
                
            } else {
                alert('Favor preencher todos os campos para adicionar o item!');
            }
        },
        removeItemAntigo: function (item, listaItens) {
            var index = listaItens.map(function (e) {
                return e.id;
            }).indexOf(item.id);
            listaItens.splice(index, 1);
            self.rm_itens.push(item.id);
        },
        removeItemAdicionado: function (item) {
            var index = self.add_itens.map(function (e) {
                return e.titulo;
            }).indexOf(item.titulo);
            self.add_itens.splice(index, 1);
        }
    };
    return self;
});

appGerProjAdmin.service('TarefaService', function (Tarefa, Projeto, TipoTarefa, StatusTarefa, Anexo, $q, toaster) {
    var self = {
        getTarefa: function (id, fncOK, fncErr) {
            return Tarefa.get({id: id}, fncOK, fncErr);
        },
        getProjetos: function (fncOk) {
            return Projeto.get({skip_page: true}, fncOk);
        },
        getTipos: function (fncOk) {
            return TipoTarefa.get().then(fncOk);
        },
        getStatus: function (fncOk) {
            return StatusTarefa.get().then(fncOk);
        },
        page: 1,
        hasMore: true,
        isLoading: false,
        isSaving: false,
        selectedTarefa: null,
        tarefas: [],
        search: {
            id: null,
            nome: null,
            descricao: null,
            tipo: null,
            projeto: null,
            status: null
        },
        ordering: 'nome',
        doSearch: function () {
            self.hasMore = true;
            self.page = 1;
            self.tarefas = [];
            self.loadTarefas();
        },
        doOrder: function () {
            self.hasMore = true;
            self.page = 1;
            self.tarefas = [];
            self.loadTarefas();
        },
        loadTarefas: function () {
            if (self.hasMore && !self.isLoading) {
                self.isLoading = true;

                var params = {
                    page: self.page,
                    search_id: self.search.id,
                    search_nome: self.search.nome,
                    search_descricao: self.search.descricao,
                    search_projeto: self.search.projeto,
                    search_tipo: self.search.tipo,
                    search_status: self.search.status,
                    order: self.ordering
                };

                Tarefa.get(params, function (data) {
                    angular.forEach(data.results, function (proj) {
                        self.tarefas.push(new Tarefa(proj));
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
                self.loadTarefas();
            }
        },
        updateTarefa: function (tar) {
            var d = $q.defer();
            self.isSaving = true;
            tar.$update().then(function (data) {
                self.isSaving = false;
                toaster.pop('success', data.message);
                d.resolve();
            }, function (error) {
                toaster.pop({
                    type: 'error',
                    body: 'Erro ao atualizar tarefa #' + tar.id + '<br/>' + error.data.error.nl2br(),
                    bodyOutputType: 'trustedHtml'
                });
            });
            return d.promise;
        },
        createTarefa: function (tar, itens) {
            var d = $q.defer();
            self.isSaving = true;
            tar.add_itens = itens;
            Tarefa.save(tar).$promise.then(function (data) {
                self.isSaving = false;
                self.selectedTarefa = null;
                self.hasMore = true;
                self.page = 1;
                self.tarefas = [];
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
