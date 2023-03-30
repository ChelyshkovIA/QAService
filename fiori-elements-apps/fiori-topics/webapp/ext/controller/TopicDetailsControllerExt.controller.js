sap.ui.define([

], function() {
    const sQuestionsTableId = "fioritopics::sap.suite.ui.generic.template.ObjectPage.view.Details::Topics--questions::com.sap.vocabularies.UI.v1.LineItem::QuestionsLineItem::responsiveTable";
    const sGroupsTableId = "fioritopics::sap.suite.ui.generic.template.ObjectPage.view.Details::Topics--groups::com.sap.vocabularies.UI.v1.LineItem::GroupsLineItem::gridTable";
    
    return {
        onInit() {
            const oQuestionsTable = this._getQuestionsTable();
            const oGroupsTable = this._getGroupsTable();

            if (oQuestionsTable) {
                this._bindTableProperty(oQuestionsTable, "mode", "SingleSelectLeft", "None");
            }

            if (oGroupsTable) {
                this._bindTableProperty(oGroupsTable, "selectionMode", "MultiToggle", "None");
                oGroupsTable.removeAllPlugins();
            }
        },

        _bindTableProperty(oTable, sPropertyName, sFirstValue, sSecondValue) {
            oTable.bindProperty(sPropertyName, {
                path: "ui>/editable",
                formatter: function(sValue) {
                    return sValue ? sFirstValue : sSecondValue
                }
            });
        },

        _getQuestionsTable() {
            return this._byId(sQuestionsTableId);
        },

        _getGroupsTable() {
            return this._byId(sGroupsTableId);
        },

        _byId(sId) {
            return this.getView().byId(sId);
        }
    };
});