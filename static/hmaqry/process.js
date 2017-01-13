define([
    "dojo/on",
    "dojo/request/xhr",
    "dojo/request/iframe",
    "dojox/layout/TableContainer",
    "dojo/data/ItemFileReadStore",
    "dojox/grid/DataGrid",
    "dojo/_base/array",
    "hmaqry/layout.js"
], function(
    on,
    xhr,
    iframe,
    TableContainer,
    ItemFileReadStore,
    DataGrid,
    arrayUtil,
    Layout
) {

    return {
        report: function(title, uuid) {

            var store = new ItemFileReadStore({
                url:"/qry/static/files/"+uuid+".json"
            });

            var fetchFailed = function(error, request){
                alert("Lookup failed.");
                alert(error);
            };

            var layout = [[
                {'name': 'Mix', 'field': 'mix', 'width': '300px'},
                {'name': 'Count', 'field': 'n', 'width': '100px'},
                {'name': 'Min', 'field': 'min', 'width': '100px'},
                {'name': 'Max', 'field': 'max', 'width': '100px'},
                {'name': 'Avg', 'field': 'avg', 'width': '100px'},
                {'name': 'Stdev', 'field': 'stdev', 'width': '100px'}
            ]];

            var grid = new DataGrid({
                // id: 'grid',
                structure: layout,
                rowSelector: '20px',
                height: '600px'
            });

            var showStats = function(){
                tab.addChild(grid);
                grid.startup();
                grid.setStore(store);

                // console.log("showing items now");
                // arrayUtil.forEach(items, function(item, index){
                //     //console.log(index, item);
                // });
            };

            var gotItems = function (items, request){
                //var iframe = new IFrame({});
                iframe._currentDfd = null;
                iframe("/qry/static/files/"+uuid+".csv", {
                    preventCache: true
                    // handleAs: "csv",
                }).then(function(data){
                  console.log("Got it!!!!");
                    // Do something with the CSV document
                    // xhr("/qry/uuid", {
                    //     query: {
                    //         uuid: uuid
                    //     },
                    //     handleAs: "text"
                    // }).then(function(data) {
                    //     // nada
                    // });
                }, function(err){
                    // Handle the error condition
                    alert("Error downloading csv");
                });
                showStats();
            };

            var tab = new TableContainer({
                cols: 1,
                showLabels: true,
                orientation: "vert",
                title: title,
                closable: true,
                onClose: function() {
                    delete store;
                    delete layout;
                    delete grid;

                    // console.log("Close tab");
                    tab.getParent().removeChild(tab);
                    tab.destroyRecursive();
                }
            });

            store.fetch({
                query: {},
                onComplete: gotItems,
                onError: fetchFailed
            });

            Layout.contentTabs.addChild(tab);
        }
    };
});
