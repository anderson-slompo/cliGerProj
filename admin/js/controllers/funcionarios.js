
appGerProjAdmin.controller("FuncionarioCreateController", function ($scope, $state, FuncionarioService) {

    $scope.page_title = "Novo Funcionario";
    $scope.fun_codigo = 0;
    $scope.funcionarios = FuncionarioService;
    $scope.submit_action = "Salvar";
    $scope.funcionarios.selectedFuncionario = {};

    $scope.save = function () {
        $scope.funcionarios.createFuncionario($scope.funcionarios.selectedFuncionario)
                .then(function () {
                    $state.go("funcionario-list");
                });
    };

});
appGerProjAdmin.controller("FuncionarioEditController", function ($scope, $stateParams, $state, FuncionarioService, toaster) {

    $scope.page_title = "Alterar Funcionario";
    $scope.fun_codigo = $stateParams.id;
    $scope.funcionarios = FuncionarioService;
    $scope.submit_action = "Salvar Alterações";
    $scope.novo_contato = {contato: '', tipo: ''};
    $scope.novo_endereco = {endereco: '', tipo: ''};
    $scope.tipos_contato = null;
    $scope.tipos_endereco = null;
    $scope.projetos = null;
    $scope.departamentos = null;
    $scope.comboProjeto = { disponiveis:[], associados:[] };
    $scope.comboDepartamento = { disponiveis:[], associados:[] };
    
    FuncionarioService.getFuncionario($stateParams.id, function (data) {
        data.status = data.status ? 't' : 'f';
        $scope.funcionarios.selectedFuncionario = data;
        
        $scope.loadTipos();
        $scope.loadDepartamentos();
        $scope.loadProjetos();
        
    }, function (err) {
        toaster.pop({
            type: 'error',
            body: err.data.error
        });
        $state.go("funcionario-list");
    });

    $scope.loadTipos = function () {
        FuncionarioService.getTiposContato(function (data) {
            $scope.tipos_contato = {};
            for (i in data.results) {
                $scope.tipos_contato[data.results[i].id] = data.results[i];
            }
        });
        FuncionarioService.getTiposEndereco(function (data) {
            $scope.tipos_endereco = {};
            for (i in data.results) {
                $scope.tipos_endereco[data.results[i].id] = data.results[i];
            }
        });
    }

    $scope.loadProjetos = function(){
        FuncionarioService.getProjetos(function (data) {
            var temp_projetos = data.results;
            for (var i in $scope.funcionarios.selectedFuncionario.projetos){
                var busca = $scope.funcionarios.selectedFuncionario.projetos[i];
                var index = temp_projetos.map(function(e) { return e.id; }).indexOf(busca.id);
                temp_projetos.splice(index,1);
            }
            $scope.projetos = temp_projetos;
        });
    }
    $scope.loadDepartamentos = function(){
        FuncionarioService.getDepartamentos(function (data) {
            var temp_departamentos = data.results;
            for (var i in $scope.funcionarios.selectedFuncionario.departamentos){
                var busca = $scope.funcionarios.selectedFuncionario.departamentos[i];
                var index = temp_departamentos.map(function(e) { return e.id; }).indexOf(busca.id);
                temp_departamentos.splice(index,1);
            }
            $scope.departamentos = temp_departamentos;
        });
    }
    $scope.removeContato = function (contato) {
        var index = $scope.funcionarios.selectedFuncionario.contatos.indexOf(contato);
        $scope.funcionarios.selectedFuncionario.contatos.splice(index, 1);
    }

    $scope.addContato = function () {
        if ($scope.novo_contato.contato != '' && $scope.novo_contato.tipo != '') {
            var novo = {
                id_tipo_contato: $scope.novo_contato.tipo,
                id_funcionario: $scope.fun_codigo,
                contato: $scope.novo_contato.contato,
                descricao: $scope.tipos_contato[$scope.novo_contato.tipo].descricao
            };
            $scope.funcionarios.selectedFuncionario.contatos.push(novo);
        } else {
            alert('Preencha todos os campos para adicionar o contato');
        }
    }
    $scope.removeEndereco = function (endereco) {
        var index = $scope.funcionarios.selectedFuncionario.enderecos.indexOf(endereco);
        $scope.funcionarios.selectedFuncionario.enderecos.splice(index, 1);
    }

    $scope.addEndereco = function () {
        if ($scope.novo_endereco.endereco != '' && $scope.novo_endereco.tipo != '') {
            var novo = {
                id_tipo_endereco: $scope.novo_endereco.tipo,
                id_funcionario: $scope.fun_codigo,
                endereco: $scope.novo_endereco.endereco,
                descricao: $scope.tipos_endereco[$scope.novo_endereco.tipo].descricao
            };
            $scope.funcionarios.selectedFuncionario.enderecos.push(novo);
        } else {
            alert('Preencha todos os campos para adicionar o endereço');
        }
    }
    
    $scope.addProjeto = function(){        
        var temp = $scope.comboProjeto.disponiveis;
        $scope.comboProjeto.disponiveis = [];
        angular.forEach(temp, function(value, key){
            $scope.funcionarios.selectedFuncionario.projetos.push(value);
            var index = $scope.projetos.map(function(e) { return e.id; }).indexOf(value.id);
            $scope.projetos.splice(index,1);
        });        
    }
    $scope.rmProjeto = function(){
        var temp = $scope.comboProjeto.associados;
        $scope.comboProjeto.associados = [];
        angular.forEach(temp, function(value, key){
            $scope.projetos.push(value);
            var index = $scope.funcionarios.selectedFuncionario.projetos.map(function(e) { return e.id; }).indexOf(value.id);
            $scope.funcionarios.selectedFuncionario.projetos.splice(index,1);
        }); 
    }

    $scope.addDepartamento = function(){
        var temp = $scope.comboDepartamento.disponiveis;
        $scope.comboDepartamento.disponiveis = [];
        angular.forEach(temp, function(value, key){
            $scope.funcionarios.selectedFuncionario.departamentos.push(value);
            var index = $scope.departamentos.map(function(e) { return e.id; }).indexOf(value.id);
            $scope.departamentos.splice(index,1);
        });
    }
    $scope.rmDepartamento = function(){
        var temp = $scope.comboDepartamento.associados;
        $scope.comboDepartamento.associados = [];
        angular.forEach(temp, function(value, key){
            $scope.departamentos.push(value);
            var index = $scope.funcionarios.selectedFuncionario.departamentos.map(function(e) { return e.id; }).indexOf(value.id);
            $scope.funcionarios.selectedFuncionario.departamentos.splice(index,1);
        });
    }

    $scope.save = function () {
        $scope.funcionarios.updateFuncionario($scope.funcionarios.selectedFuncionario).then(function () {
            $state.go("funcionario-list");
        })
    };

});
appGerProjAdmin.controller("FuncionarioShowController", function ($scope, $stateParams, $state, FuncionarioService, toaster) {

    $scope.fun_codigo = $stateParams.id;
    $scope.page_title = "Detalhes do Funcionario #" + $scope.fun_codigo;
    $scope.funcionarios = FuncionarioService;

    FuncionarioService.getFuncionario($stateParams.id, function (data) {
        $scope.funcionarios.selectedFuncionario = data;
    }, function (err) {
        toaster.pop({
            type: 'error',
            body: err.data.error
        });
        $state.go("funcionario-list");
    });

});
appGerProjAdmin.controller('FuncionarioListController', function ($scope, FuncionarioService) {
    $scope.page_title = "Relatório de Funcionários";
    $scope.funcionarios = FuncionarioService;
    $scope.funcionarios.search_status = $scope.funcionarios.listaStatus[0];
    $scope.funcionarios.listaStatus[0].name = '--Todos--';

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
appGerProjAdmin.service('FuncionarioService', function (Funcionario, $rootScope, $q, toaster, TipoContato, TipoEndereco, Projeto, Departamento) {
    var self = {
        getFuncionario: function (id, fncOK, fncErr) {
            return Funcionario.get({id: id}, fncOK, fncErr);
        },
        listaStatus: [
            {id: null, name: '--Selecione--'},
            {id: 't', name: "Ativo"},
            {id: 'f', name: "Inativo"}
        ],
        getTiposContato: function (fncOk) {
            return TipoContato.get(fncOk);
        },
        getTiposEndereco: function (fncOk) {
            return TipoEndereco.get(fncOk);
        },
        getProjetos: function (fncOk) {
            return Projeto.get(fncOk);
        },
        getDepartamentos: function (fncOk) {
            return Departamento.get(fncOk);
        },
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
