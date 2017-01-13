define([
    "dijit/registry",
    "dijit/layout/AccordionContainer",
    "dijit/layout/BorderContainer",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane"
], function(
    registry,
    AccordionContainer,
    BorderContainer,
    TabContainer,
    ContentPane
){
    var appLayout = new BorderContainer({
        design: "headline"
    }, "appLayout");

    var contentTabs = new TabContainer({
        region: "center",
        id: "contentTabs",
        tabPosition: "bottom",
        "class": "centerPanel"
    });

    var leftCol = new AccordionContainer({
        region: "left",
        id: "leftCol", "class": "edgePanel",
        splitter: true
    });

    var topRow = new ContentPane({
        region: "top",
        "class": "edgePanel",
        content: "<b>HMA SiteManager Query</b>"
    });

    var helpTab = new ContentPane({
        href: "/static/hmaqry/help.html",
        title: "Help",
        closable: true
    });

    var builder = function() {
        appLayout.addChild(contentTabs);
        appLayout.addChild(leftCol);
        appLayout.addChild(topRow);
        contentTabs.addChild(helpTab);
    };

    return {
        appLayout: appLayout,
        contentTabs: contentTabs,
        leftCol: leftCol,
        builder: builder
    };
});
