define([
    "dijit/Calendar",
    "dijit/form/Button",
    "dijit/layout/ContentPane"
], function(
    Calendar,
    Button,
    ContentPane
){

    var toDateCal = new Calendar({
        selectedDate: undefined,
        onChange: function(value) {
            this.selectedDate = value;
        }
    });

    var toDateTab = new ContentPane({
        title: "To Date",
        content: toDateCal
    });

    var clrButton = new Button({
        label: "Clear Date",
        onClick: function(){
            toDateCal.set("value", undefined);
            toDateCal.selectedDate = undefined;
        }
    });

    return {
        toDate: toDateCal,
        builder: function(here) {
            toDateTab.addChild(clrButton);
            here.addChild(toDateTab);
        }
    }
});
