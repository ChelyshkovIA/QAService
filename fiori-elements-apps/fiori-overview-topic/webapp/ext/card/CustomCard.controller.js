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

        onItemPress() {
            console.log("Item Pressed!");
        }
    }
});