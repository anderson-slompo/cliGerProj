appGerProjAdmin.factory("Cliente", function ($resource) {
    return $resource(wsHost + "clientes/:id/", {id: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
});

appGerProjAdmin.factory("Funcionario", function ($resource) {
    return $resource(wsHost + "funcionarios/:id/", {id: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
});

appGerProjAdmin.factory("Projeto", function ($resource) {
    return $resource(wsHost + "projetos/:id/", {id: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
});
appGerProjAdmin.factory("Tarefa", function ($resource) {
    return $resource(wsHost + "tarefas/:id/", {id: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
});

appGerProjAdmin.factory("TarefaInteracao", function ($resource) {
    return $resource(wsHost + "tarefa_interacao/:id/", {id: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
});

appGerProjAdmin.factory("Implantacao", function ($resource) {
    return $resource(wsHost + "implantacao/:id/", {id: '@id'}, {
        update: {
            method: 'PUT',
            url: wsHost + "implantacao/finish/:id"
        },
        dash:{
            method:'GET',
            isArray: true,
            url: wsHost + "implantacao/dash"
        }
    });
});

appGerProjAdmin.factory("TarefaAtribuicao", function ($http, $q) {
    var self = {
        getTarefa: function(id_tarefa, fncOk, fncErr){
            return $http.get(wsHost + 'tarefa_atribuicao/tarefa/'+id_tarefa).success(fncOk).error(fncErr);
        },
        save: function(atrib, fncOk, fncErr){
            return $http.post(wsHost + 'tarefa_atribuicao', atrib).success(fncOk).error(fncErr);
        },
        getAtribuicoes: function(fncOk, fncErr){
            $http.get(wsHost + 'tarefa_atribuicao/atuais').success(fncOk).error(fncErr);
        },
        getDisponiveisImplantacao: function(fncOk, fncErr){
            $http.get(wsHost + 'tarefa_atribuicao/disponiveis_implantacao').success(fncOk).error(fncErr);
        },
        get: function(id, fncOk, fncErr){
            return $http.get(wsHost + 'tarefa_atribuicao/'+id).success(fncOk).error(fncErr);
        }
    };
    return self;
});

appGerProjAdmin.factory("Erro", function ($http, $q) {
    var self = {
        save: function(erro, fncOk, fncErr){
            return $http.post(wsHost + 'erro', erro).success(fncOk).error(fncErr);
        },
        fix: function(id, fncOk, fncErr){
            return $http({
                method: 'PUT',
                url: wsHost + '/erro/fix/'+id
            }).success(fncOk).error(fncErr);
        }
    };
    return self;
});

appGerProjAdmin.factory("DashGerente", function($http, $q){
    var self = {
        tarefasAguardandoAtribuicao: function(fncOk){
            return $http.get(wsHost + 'dash/gerente/tarefasAguardandoAtribuicao').success(fncOk);
        },
        statusProjetos: function(fncOk){
            return $http.get(wsHost + 'dash/gerente/statusProjetos').success(fncOk);
        },
        tarefasAtrasadas: function(fncOk){
            return $http.get(wsHost + 'dash/gerente/tarefasAtrasadas').success(fncOk);
        },
        tarefasExecucao: function(fncOk){
            return $http.get(wsHost + 'dash/gerente/tarefasExecussao').success(fncOk);
        }
    };
    return self;
});

appGerProjAdmin.factory("TipoTarefa", function ($http, $q) {
    var self = {
        tipos: null,
        get: function () {
            var d = $q.defer();

            if (self.tipos !== null) {
                d.resolve(self.tipos);
            } else {
                $http.get(wsHost + 'tarefas/tipos').success(function (data) {
                    self.tipos = data;
                    d.resolve(self.tipos);
                });
            }
            return d.promise;
        },
        getID: function (id) {
            var d = $q.defer();
            $http.get(wsHost + 'tarefas/tipos/'+id).success(function (data) {
                d.resolve(data);
            });
            return d.promise;
        }
    };
    return self;
});
appGerProjAdmin.factory("StatusTarefa", function ($http, $q) {
    var self = {
        status: null,
        get: function () {
            var d = $q.defer();

            if (self.status !== null) {
                d.resolve(self.status);
            } else {
                $http.get(wsHost + 'tarefas/status').success(function (data) {
                    self.status = data;
                    d.resolve(self.status);
                });
            }
            return d.promise;
        },
        getID: function (id) {
            var d = $q.defer();
            $http.get(wsHost + 'tarefas/status/'+id).success(function (data) {
                d.resolve(data);
            });
            return d.promise;
        }
    };
    return self;
});

appGerProjAdmin.factory("TipoContato", function ($resource) {
    return $resource(wsHost + "tipo_contato/:id/", {id: '@id'});
});
appGerProjAdmin.factory("TipoEndereco", function ($resource) {
    return $resource(wsHost + "tipo_endereco/:id/", {id: '@id'});
});
appGerProjAdmin.factory("Departamento", function ($resource) {
    return $resource(wsHost + "departamentos/:id/", {id: '@id'});
});
appGerProjAdmin.factory("Anexo", function ($resource) {
    return $resource(wsHost + "anexos/:id/", {id: '@id'});
});
appGerProjAdmin.factory("AnexosProjeto", function ($http) {
    var self = {
        deleteFiles: function (projeto_id, anexos_id, fncOk, fncErr) {
            $http({
                method: 'DELETE',
                url: wsHost + '/projeto_anexos',
                data: {
                    projeto_id: projeto_id,
                    anexos_id: anexos_id
                }
            }).success(fncOk).error(fncErr);
        },
        addFiles: function (projeto_id, anexos, fncOk, fncErr) {
            var formData = new FormData();
            for (i in anexos) {
                formData.append('descricao[]', anexos[i].descricao);
                formData.append('nomes[]', anexos[i].nome);
                formData.append('anexos[]', anexos[i].original);
            }
            formData.append('projeto_id', projeto_id);
            $http.post(wsHost + '/projeto_anexos', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(fncOk).error(fncErr);
        }
    };
    return self;
});
appGerProjAdmin.factory("AnexosTarefa", function ($http) {
    var self = {
        deleteFiles: function (tarefa_id, anexos_id, fncOk, fncErr) {
            $http({
                method: 'DELETE',
                url: wsHost + '/tarefa_anexos',
                data: {
                    tarefa_id: tarefa_id,
                    anexos_id: anexos_id
                }
            }).success(fncOk).error(fncErr);
        },
        addFiles: function (tarefa_id, anexos, fncOk, fncErr) {
            var formData = new FormData();
            for (i in anexos) {
                formData.append('descricao[]', anexos[i].descricao);
                formData.append('nomes[]', anexos[i].nome);
                formData.append('anexos[]', anexos[i].original);
            }
            formData.append('tarefa_id', tarefa_id);
            $http.post(wsHost + '/tarefa_anexos', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(fncOk).error(fncErr);
        }
    };
    return self;
});

appGerProjAdmin.factory("GerProjGantt", function($http, $q){
    var self = {
        tarefasGantt: function(fncOk){
            return $http.get(wsHost + 'gantt/tarefasGantt').success(fncOk);
        }
    };
    return self;
});

appGerProjAdmin.factory("ChangePassword", function($http, $q){
    var self = {
        change: function(data, fncOk, fncErr){
            return $http.post(wsHost + 'password/change', data).success(fncOk).error(fncErr);
        }
    };
    return self;
});