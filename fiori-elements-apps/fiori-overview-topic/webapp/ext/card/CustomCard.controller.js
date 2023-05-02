sap.ui.define([
    "sap/ushell/Container"
], function(Container) {
    "use strict";

    const sPrefix = "[Custom Card] - ";

    return {
        onInit() {
            this.CrossNavigation = sap.ushell.Container.getService("CrossApplicationNavigation");
        },

        onAfterRendering() {
            console.log(`${sPrefix}onAfterRendering`);
        },

        onExit() {
            console.log(`${sPrefix}onExit`);
        },

        onQuestionsListLinkPress() {
            this.CrossNavigation.toExternal({
                target: {
                    shellHash: "Question-View"
                }
            });
        },
        
        onItemPress(oEvent) {
            const sQuestionsPath = oEvent.getSource().getBindingContext("mainModel").getPath();
            
            this.CrossNavigation.toExternal({
                target: {
                    shellHash: `Question-View?sap-ui-app-id-hint=saas_approuter_fioriquestions&${sQuestionsPath}`
                }
            });
        }
    }
});