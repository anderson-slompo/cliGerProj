appGerProjAdmin.controller("GantViewController", function ($scope, $stateParams, $state, GerProjGantt, toaster) {

    $scope.page_title = "Gráfico Gantt Projetos";
    $scope.data = [];

    GerProjGantt.tarefasGantt(function(data){        
        for (i in data){
            if(data[i].tasks!=undefined){
                data[i].tasks[0].from = moment(data[i].tasks[0].from, "YYYYMMDD");
                data[i].tasks[0].to = moment(data[i].tasks[0].to, "YYYYMMDD");
            }
        }
        $scope.data = data;
        console.log($scope.data);
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
    // $scope.data = [
    //     {name:"Projeto 1", children:['1', '2']},
    //     {name:'task1', id: '1',tasks:[
    //         {from: moment("20171031", "YYYYMMDD"), to: moment("20171102", "YYYYMMDD"),progress:50}
    //     ]},
    //     {name:'task2', id:'2', tasks:[
    //         {from: moment("20171102", "YYYYMMDD"), to: moment("20171110", "YYYYMMDD"),progress:80}
    //     ]},
    //     {name:"Projeto 3", children:['3', '4']},
    //     {name:'task3', id:'3', tasks:[
    //         {name: 'teste', from: moment("20171110", "YYYYMMDD"), to: moment("20171114", "YYYYMMDD"),progress:48}
    //     ]},
    //     {name:'task4',id:4, tasks:[
    //         {name: 'task4', from: moment("20171010", "YYYYMMDD"), to: moment("20171021", "YYYYMMDD"),progress:100}
    //     ]}
    // ]
});