define([
    "cbtree/Tree",
    "cbtree/model/TreeStoreModel",
    "cbtree/store/ObjectStore",
    "dijit/layout/ContentPane"
], function(
    Tree,
    TreeStoreModel,
    TreeObjectStore,
    ContentPane
){
    var store = new TreeObjectStore({
        url:"/static/hmaqry/county.json",
        idProperty:"name"
    });

    var model = new TreeStoreModel({
        store: store,
        query: {name: "Root"},
        rootLabel: "Texas",
        checkedRoot: true,
        checkedAll: true,
        checkedState: true,
        checkedStrict: true
    });

    var checkBoxClicked = function(item, nodeWidget, event){
        alert( "The new state for " + this.getLabel(item) + " is: " + nodeWidget.get("checked"));
    };

    var tree = new Tree({
        model: model,
        id: "CountyTree"
    });

    var cntyTab = new ContentPane({
        title: "Locations",
        content: tree
    });

    return {
        store: store,
        builder: function(here) {
            here.addChild(cntyTab);
            // tree.on( "checkBoxClick", checkBoxClicked);
            tree.startup();
        }
    }
});
