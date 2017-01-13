define([
    "dojox/layout/TableContainer",
    "dijit/form/TextBox",
    "dijit/form/RadioButton",
    "dijit/form/Select"
], function(
    TableContainer,
    TextBox,
    RadioButton,
    Select
){

    var table = new TableContainer({
        title: "Lot Summarized Properties",
        orientation: "vert",
        spacing: 6
    });

    var tab1 = new TableContainer({
        orientation: "horiz",
        cols: 2
    });

    // var tab2 = new TableContainer({
    //     orientation: "horiz",
    //     cols: 2
    // });

    var lbl1 = new TextBox({
        type: "hidden",
        colspan: 2,
        label: "<b>Agency:</b>"
    });

    // var lbl2 = new TextBox({
    //     type: "hidden",
    //     colspan: 2,
    //     label: "<b>Level:</b>"
    // });

    var dotBox = new RadioButton({
        name: "agency",
        label: "TxDOT data",
        id: "dbox",
        checked: true
    });

    var conBox = new RadioButton({
        name: "agency",
        label: "Contractor data",
        id: "cbox"
    });

    // var prjBox = new RadioButton({
    //     name: "level",
    //     label: "Data averaged by project",
    //     id: "pbox",
    //     checked: true
    // });

    // var lotBox = new RadioButton({
    //     name: "level",
    //     label: "Data averaged by lot",
    //     id: "lbox"
    // });

    var select = new Select({
        label: "<b>Select query:</b>",
        name: "qrySelect",
        options: [
            {
                value: "",
                label: "Select query to run",
                selected: true
            },
            {
                value: "gmb",
                label: "Lab molded density"
            },
            {
                value: "vim",
                label: "Inplace air voids"
            },
	    {
                value: "asg",
                label: "Avg. Actual SG (Ga)"
            },
            {
                value: "vma",
                label: "Plant produced VMA"
            },
            {
                value: "gmm",
                label: "Rice specific gravity"
            },
            {
                value: "pac",
                label: "Asphalt content"
            },
            {
                value: "eps",
                label: "Estimated percent stripping"
            },
            {
                value: "pdd",
                label: "Percent drain-down"
            },
            {
                value: "prpf",
                label: "Production pay factor"
            },
            {
                value: "plpf",
                label: "Placement pay factor"
            },
            {
                value: "acgrade",
                label: "AC Grade"
            },
            {
                value: "thermal_equip",
                label: "Thermal equipment"
            }
        ]
    });

    return {
        table: table,
        dbox: dotBox,
        cbox: conBox,
        //pbox: prjBox,
        //lbox: lotBox,
        select: select,
        builder: function(here) {
            tab1.addChild(lbl1);
            tab1.addChild(dotBox);
            tab1.addChild(conBox);
            // tab2.addChild(lbl2);
            // tab2.addChild(prjBox);
            // tab2.addChild(lotBox);
            table.addChild(tab1);
            // table.addChild(tab2);
            table.addChild(select);
            table.startup();
            here.addChild(table);
        }
    };
});
