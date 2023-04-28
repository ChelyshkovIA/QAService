sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    "use strict";

    return {
        onInit() {},

        onCustomActionPress(sCustomAction) {
            return this[sCustomAction].bind(this);
        },

        onPopUp(oEvent) {
            const oTopic = this._getTopic(oEvent);

            MessageToast.show(this._getTopicString(oTopic));
        },

        onLog(oEvent) {
            const oTopic = this._getTopic(oEvent);

            console.log(this._getTopicString(oTopic));
        },

        _getTopicString(oTopic) {
            return `
                ID: ${oTopic.ID.split("-")[0]}-...,
                Name: ${oTopic.name}
            `;
        },

        _getTopic(oEvent) {
            const sContextPath = oEvent.getSource().getBindingContext().getPath();
            return this.getView().getModel().getProperty(sContextPath);
        }
    }
});