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
        url:"/static/hmaqry/hma_mixes.json",
        idProperty:"name"
    });

    var model = new TreeStoreModel({
        store: store,
        query: {name: "Root"},
        rootLabel: "HMA",
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
        id: "HMATree"
    });

    var hmaTab = new ContentPane({
        title: "Mixtures",
        content: tree
    });

    return {
        store: store,
        builder: function(here) {
            here.addChild(hmaTab);
            // tree.on( "checkBoxClick", checkBoxClicked);
            tree.startup();
        }
    }
});
