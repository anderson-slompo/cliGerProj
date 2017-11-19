appGerProjAdmin.controller("GantViewController", function ($scope, $stateParams, $state, GerProjGantt, toaster) {

    $scope.page_title = "Gráfico Gantt Projetos";
    
    GerProjGantt.tarefasGantt(function(data){        
        for (i in data){
            if(data[i].tasks!=undefined){
                data[i].tasks[0].from = moment(data[i].tasks[0].from, "YYYYMMDD");
                data[i].tasks[0].to = moment(data[i].tasks[0].to, "YYYYMMDD");
            }
        }
        $scope.data = data;
    });

    $scope.getColumnWidth = function (scale, zoom) {            
        if (scale.match(/.*?week.*?/)) {
            return 150 * zoom
        }    
        if (scale.match(/.*?month.*?/)) {
            return 300 * zoom
        }    
        if (scale.match(/.*?quarter.*?/)) {
            return 500 * zoom
        }    
        if (scale.match(/.*?year.*?/)) {
            return 800 * zoom
        }    
        return 40 * zoom
    }
});