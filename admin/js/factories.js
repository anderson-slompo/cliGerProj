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