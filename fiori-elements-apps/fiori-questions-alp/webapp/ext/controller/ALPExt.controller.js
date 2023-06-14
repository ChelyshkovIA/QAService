sap.ui.define([

], function() {
    return {
        onRefreshAllPress() {
            const oComponent = this.getOwnerComponent();
            oComponent.getModel().refresh();
        },

        onListNavigationExtension(oEvent) {
            const oNavigationController = this.extensionAPI.getNavigationController();
            const oBindingContext = oEvent.getSource().getBindingContext();
            const oObject = oBindingContext.getObject();

            /** Some condition here according to oObject values*/
            if (oObject.somePropValue) {
                oNavigationController.navigateExternal("SemanticObject");
            } else {
                /** False for default navigation */
                return false;
            }

            /** In case of first condition true will prevent default navigation */
            return true;
        }
    };
});