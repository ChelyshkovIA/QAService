sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, formatter, JSONModel) {
        "use strict";

        return Controller.extend("qaservicefreestylesmart.controller.QuestionList", {
            formatter: formatter,
            
            onInit: function () {
                this._initAppModel();
            },

            onRebind() {
                const oTable = this._getSmartTable();
                oTable.rebindTable();
            },

            onRebindForce() {
                const oTable = this._getSmartTable();
                oTable.rebindTable(true);
            },

            onEditToggled(oEvent) {
                oEvent.getSource().setEditable(oEvent.getParameter("editable"));
            },

            _getModel() {
                return this.getView().getModel();
            },

            _getSmartTable() {
                return this.getView().byId("questionsSmartTable");
            },

            _initAppModel() {
                const oModel = new JSONModel({
                    editTogglable: false
                });

                this.getView().setModel(oModel, "appModel");
            }
        });
    });
