sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(MessageToast, Filter, FilterOperator) {
    "use strict";

    return {
        onInit() {},

        getCustomFilters() {
            const aFilters = [];

            const sSelectedValue = this._getSelectedTopic();

            const oTopicFilter = this._getTopicFilter(sSelectedValue);

            if (sSelectedValue) aFilters.push(oTopicFilter);
            
            if (aFilters.length > 0) return new Filter(aFilters, true);
        },

        getCustomAppStateDataExtension(oCustomData) {
            if (oCustomData) {
                var oTopicFilter = this._getTopicFilter();
                if (oTopicFilter) {
                    oCustomData.TOPIC_KEY = oTopicFilter.getSelectedKey();
                }
            }
        },

        restoreCustomAppStateDataExtension(oCustomData) {
            if (oCustomData) {
                if (oCustomData.TOPIC_KEY) {
                    var oTopicFilter = this._getTopicFilter();
                    oTopicFilter.setSelectedKey(
                        oCustomData.TOPIC_KEY
                    );
                }
            }
        },

        onCustomParams(sCustomParam) {
            return this[sCustomParam];
        },

        getJSCoreTopicNavParameter() {
            // Excludes OData v4.0
            return [{
                path: "ID",
                operator: FilterOperator.EQ,
                value1: "6739629b-0e15-e76a-7a01-01d0fb6772d0",
                sign: "E"
            }];
        },

        onCustomActionPress(sCustomAction) {
            return this[sCustomAction].bind(this);
        },

        onFireGlobalAction() {
            MessageToast.show("Global Action Fired!");
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
        },

        _getTopicFilter(sKey) {
            if (sKey === "0") {
                return this._getJSClusterFilter();
            }
            
            if (sKey === "1") {
                return this._getOtherClusterFilter();
            }
        },

        _getJSClusterFilter() {
            return new Filter({
                filters: [
                    new Filter("ID", FilterOperator.EQ, "81f2573d-40f4-5186-6976-a56c6703b961"),
                    new Filter("ID", FilterOperator.EQ, "bab71ca5-3ca6-b217-375a-1cb884fc25e9"),
                    new Filter("ID", FilterOperator.EQ, "f1aa66cd-0b9d-7c34-7145-cdab9cb79098")
                ],
                and: false
            });
        },
        
        _getOtherClusterFilter() {
            return new Filter({
                filters: [
                    new Filter("ID", FilterOperator.NE, "81f2573d-40f4-5186-6976-a56c6703b961"),
                    new Filter("ID", FilterOperator.NE, "bab71ca5-3ca6-b217-375a-1cb884fc25e9"),
                    new Filter("ID", FilterOperator.NE, "f1aa66cd-0b9d-7c34-7145-cdab9cb79098")
                ],
                and: true
            });
        },

        _getSelectedTopic() {
            return this._byId("CustomTopicFilter--combobox").getSelectedKey();
        },

        _byId(sId) {
            return this.getView().byId(sId);
        }
    }
});