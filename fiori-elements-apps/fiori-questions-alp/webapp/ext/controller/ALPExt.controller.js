sap.ui.define([

], function() {
    return {
        onRefreshAllPress() {
            const oComponent = this.getOwnerComponent();
            oComponent.getModel().refresh();
        }
    };
});