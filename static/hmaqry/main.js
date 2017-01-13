require([
    "dojo/_base/declare",
    "dijit/registry",
    "dojo/on",
    "dojo/_base/unload",
    "dojo/_base/array",
    "dojo/request/xhr",
    "dojo/date/stamp",
    "dojox/widget/Standby",
    "dojox/layout/TableContainer",
    "dijit/form/TextBox",
    "hmaqry/layout.js",
    "hmaqry/hmatree.js",
    "hmaqry/cntytree.js",
    "hmaqry/fromdt.js",
    "hmaqry/todt.js",
    "hmaqry/qry.js",
    "hmaqry/process.js",
    "dojo/NodeList-data",
    "dojo/domReady!"
], function (
    declare,
    registry,
    on,
    baseUnload,
    array,
    xhr,
    stamp,
    Standby,
    TableContainer,
    TextBox,
    Layout,
    HMATree,
    CntyTree,
    FromDate,
    ToDate,
    Qry,
    Process
) {

    var Q = declare(null, {
        hmaStore: HMATree.store,
        cntyStore: CntyTree.store,
        qrytable: Qry.table,
        dbox: Qry.dbox,
        cbox: Qry.cbox,
        // pbox: Qry.pbox,
        // lbox: Qry.lbox,
        qrySelect: Qry.select,
        fromDate: FromDate.fromDate,
        toDate: ToDate.toDate,
        selectedMixes: undefined,
        selectedCounties: undefined,
        selectedFromDate: undefined,
        selectedToDate: undefined,
        standby: new Standby({}),
        report: function(value){
            var mixArray = [];
            var countyArray = [];
            var fDate = "";
            var tDate = "";
            var agency;
            // var level;
            if (typeof this.selectedMixes !== 'undefined') {
                this.selectedMixes.forEach(function(item) {
                    mixArray.push(item.value);
                });
            }
            if (typeof this.selectedCounties !== 'undefined') {
                this.selectedCounties.forEach(function(item) {
                    countyArray.push(item.value);
                });
            }
            if (typeof this.selectedFromDate !== 'undefined') {
                fDate = stamp.toISOString(this.selectedFromDate, {selector: "date"});
            }
            if (typeof this.selectedToDate !== 'undefined') {
                tDate = stamp.toISOString(this.selectedToDate, {selector: "date"});
            }
            if (this.dbox.checked) {
                agency = "dot";
            } else {
                agency = "con";
            }
            // if (this.pbox.checked) {
            //     level = "prj";
            // } else {
            //     level = "lot";
            // }
            xhr("/qry/qryDB", {
                query: {
                    value: value,
                    agency: agency,
                    // level: level,
                    mixArray: JSON.stringify(mixArray),
                    countyArray: JSON.stringify(countyArray),
                    fDate: fDate,
                    tDate: tDate
                },
                handleAs: "text"
            }).then(function(uuid) {
                //var dataStore = new ItemFileReadStore({data: data});
                Process.report(value, uuid);
                q.standby.hide();
            });
            q.qrySelect.set("value", "");
        },
        constructor: function(){
            Layout.builder();
            HMATree.builder(Layout.leftCol);
            CntyTree.builder(Layout.leftCol);
            FromDate.builder(Layout.leftCol);
            ToDate.builder(Layout.leftCol);
            Qry.builder(Layout.leftCol);
            Layout.appLayout.startup();
        },
    });
    var q = new Q();
    q.standby.target = q.qrytable.domNode;
    document.body.appendChild(q.standby.domNode);
    q.standby.startup();
    q.qrySelect.on("change", function(value) {
        if (value.length > 0) {
            var hmaRoot = q.hmaStore.query({"name": "Root"})[0];
            if (hmaRoot.checked !== true) {
                q.selectedMixes = q.hmaStore.query(function(item) {
                    return (item.checked === true && item.value !== "none");
                });
            }
            var cntyRoot = q.cntyStore.query({"name": "Root"})[0];
            if (cntyRoot.checked !== true) {
                q.selectedCounties = q.cntyStore.query(function(item) {
                    return (item.checked === true && item.value !== "none");
                });
            }
            q.selectedFromDate = q.fromDate.selectedDate;
            q.selectedToDate = q.toDate.selectedDate;
            q.standby.show();
            q.report(value);
        }
    });
});
