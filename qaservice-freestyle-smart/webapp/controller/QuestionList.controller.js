sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, formatter, JSONModel, Filter, FilterOperator, Sorter) {
        "use strict";

        return Controller.extend("qaservicefreestylesmart.controller.QuestionList", {
            formatter: formatter,
            
            onInit: function () {
                this._initAppModel();
                this._attachDefaultFilterToTheTable();
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

            _attachDefaultFilterToTheTable() {
                const oTable = this._getSmartTable();
                oTable.attachBeforeRebindTable(this._onBeforeRebindQuestionsTable.bind(this));
            },

            _onBeforeRebindQuestionsTable(oEvent) {
                const oBindingParameters = oEvent.getParameter("bindingParams");
                const oQuestionsFilter = this._getQuestionsFilter();
                const oQuestionsSorter = this._getQuestionsSorter();
                oBindingParameters.filters.push(oQuestionsFilter);
                oBindingParameters.sorter.push(oQuestionsSorter);
                oBindingParameters.parameters["expand"] = "group";
            },

            _getQuestionsSorter() {
                return new Sorter("group/name", false, true);
            },

            _getQuestionsFilter() {
                return new Filter("topic_ID", FilterOperator.EQ, "f1aa66cd-0b9d-7c34-7145-cdab9cb79098");
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
