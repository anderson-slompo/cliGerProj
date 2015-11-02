
appGerProjAdmin.factory("Cliente", function ($resource) {
    return $resource(wsHost+"clientes/:id/", {id: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
});


appGerProjAdmin.controller("ClienteCreateController", function ($scope, $state, ClienteService) {

    $scope.page_title = "Novo Cliente";
    $scope.cli_codigo = 0;
    $scope.clientes = ClienteService;

});
appGerProjAdmin.controller("ClienteEditController", function ($scope, $stateParams, $state, ClienteService) {

    $scope.page_title = "Alterar Cliente";
    $scope.cli_codigo = $stateParams.id;
    $scope.clientes = ClienteService;

});

appGerProjAdmin.controller('ClienteListController', function ($scope, $modal, ClienteService) {
    $scope.page_title = "Relatório de Clientes";
    $scope.clientes = ClienteService;

    $scope.id = "";
    $scope.nome = "";
    $scope.id_externo = "";

    $scope.loadMore = function () {
        $scope.clientes.loadMore();
    };
    $scope.doSearch = function(){
        $scope.clientes.doSearch();
    }
    $scope.clientes.loadClientes();
});

appGerProjAdmin.service('ClienteService', function (Cliente, $rootScope, $q, toaster) {


    var self = {
        'getPerson': function (id) {
            Cliente.get(params, function (data) {
                console.log(data);
            });
        },
        'page': 1,
        'hasMore': true,
        'isLoading': false,
        'isSaving': false,
        'selectedPerson': null,
        'clientes': [],
        'search_id': null,
        'search_nome': null,
        'search_id_externo': null,
        'ordering': 'nome',
        'doSearch': function () {
            self.hasMore = true;
            self.page = 1;
            self.clientes = [];
            self.loadClientes();
        },
        'doOrder': function () {
            self.hasMore = true;
            self.page = 1;
            self.clientes = [];
            self.loadClientes();
        },
        'loadClientes': function () {
            if (self.hasMore && !self.isLoading) {
                self.isLoading = true;

                var params = {
                    'page': self.page,
                    'search_id': self.search_id,
                    'search_nome': self.search_nome,
                    'search_id_externo': self.search_id_externo,
                    'order': self.ordering
                };

                Cliente.get(params, function (data) {
                    console.log(data);
                    angular.forEach(data.results, function (cli) {
                        self.clientes.push(new Cliente(cli));
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
                self.loadClientes();
            }
        },
        'updateCliente': function (cli) {
            var d = $q.defer();
            self.isSaving = true;
            cli.$update().then(function () {
                self.isSaving = false;
                toaster.pop('success', 'Atualizado #' + cliente.id + ' ' + cliente.nome);
                d.resolve()
            });
            return d.promise;
        },
        'removeCliente': function (cli) {
            var d = $q.defer();
            self.isDeleting = true;
            cli.$remove().then(function () {
                self.isDeleting = false;
                var index = self.clientes.indexOf(cli);
                self.clientes.splice(index, 1);
                self.selectedPerson = null;
                toaster.pop('success', 'Excluido #' + cliente.id + ' ' + cli.name);
                d.resolve()
            });
            return d.promise;
        },
        'createCliente': function (cli) {
            var d = $q.defer();
            self.isSaving = true;
            Cliente.save(cli).$promise.then(function () {
                self.isSaving = false;
                self.selectedPerson = null;
                self.hasMore = true;
                self.page = 1;
                self.clientes = [];
                self.loadClientes();
                toaster.pop('success', 'Criado ' + cliente.nome);
                d.resolve()
            });
            return d.promise;
        }
    };

    return self;

});
