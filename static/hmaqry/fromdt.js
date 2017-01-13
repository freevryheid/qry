define([
    "dijit/Calendar",
    "dijit/form/Button",
    "dijit/layout/ContentPane"
], function(
    Calendar,
    Button,
    ContentPane
){

    var fromDateCal = new Calendar({
        selectedDate: undefined,
        onChange: function(value) {
            this.selectedDate = value;
        }
    });

    var fromDateTab = new ContentPane({
        title: "From Date",
        content: fromDateCal
    });

    var clrButton = new Button({
        label: "Clear Date",
        onClick: function(){
            fromDateCal.set("value", undefined);
            fromDateCal.selectedDate = undefined;
        }
    });

    return {
        fromDate: fromDateCal,
        builder: function(here) {
            fromDateTab.addChild(clrButton);
            here.addChild(fromDateTab);
        }
    }
});
