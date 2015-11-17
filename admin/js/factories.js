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
appGerProjAdmin.factory("TipoContato", function ($resource) {
    return $resource(wsHost + "tipo_contato/:id/", {id: '@id'});
});
appGerProjAdmin.factory("TipoEndereco", function ($resource) {
    return $resource(wsHost + "tipo_endereco/:id/", {id: '@id'});
});