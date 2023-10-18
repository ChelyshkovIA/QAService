sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
    "use strict";

    return Controller.extend("qaservicefreestyleodatav4.controller.Boards", {
        onInit() {
            this._defineJSONModel();
            this._bindQuestionsList("/Questions");
        },

        _defineJSONModel() {
            const oModel = new JSONModel({
                selectedQuestion: {
                    selected: false,
                    answer: ""
                },

                selectedTopic: {
                    id: "",
                    name: ""
                },

                selectedGroup: {
                    id: "",
                    name: ""
                }
            });

            this.getView().setModel(oModel, "app");
        },

        onTopicSelect(oEvent) {
            const oCtx = oEvent.getSource().getSelectedItem().getBindingContext();
            const oTopic = oCtx.getObject();
            this._setGroupsListCtx(oCtx);
            this._setTopicName(oTopic.name);
            this._setQuestionsListCtx(oCtx);
            this._bindQuestionsList("questions");
            this._setGroupName("");
        },

        onGroupSelect(oEvent) {
            const oGroupItem = oEvent.getSource().getSelectedItem();
            const oCtx = oGroupItem.getBindingContext();
            const oGroup = oCtx.getObject();
            this._setQuestionsListCtx(oCtx);
            this._bindQuestionsList("questions");
            this._setGroupName(oGroup.name);
        },

        onQuestionSelect(oEvent) {
            const oQuestionItem = oEvent.getSource().getSelectedItem();
            const oCtx = oQuestionItem.getBindingContext();
            const oQuestion = oCtx.getObject();
            this._setQuestionSelected(true);
            this._setQuestionAnswer(oQuestion.text);
        },

        onTopicsReset() {
            const oCtx = this._getTopicsList().getBindingContext();
            this._setTopicName("");
            this._setGroupName("");
            this._bindQuestionsList("/Questions");
            this._clearTopicsListSelection();
            this._clearGroupsListSelection();
            this._setGroupsListCtx(oCtx);
        },

        onGroupsReset() {
            const oSelectedItem = this._getTopicsList().getSelectedItem();
            const oCtx = oSelectedItem.getBindingContext();
            this._setQuestionsListCtx(oCtx);
            this._bindQuestionsList("questions");
            this._setGroupName("");
            this._clearGroupsListSelection();
        },
        
        formatHighlight(test) {
            return `Indication0${++test}`;
        },

        _clearTopicsListSelection() {
            this._getTopicsList().removeSelections();
        },
        
        _clearGroupsListSelection() {
            this._getGroupsList().removeSelections();
        },

        _getModel() {
            return this.getOwnerComponent().getModel();
        },

        _setQuestionsListCtx(oCtx) {
            this._getQuestionsList().setBindingContext(oCtx);
        },

        _setGroupsListCtx(oCtx) {
            this._getGroupsList().setBindingContext(oCtx);
        },

        _setQuestionSelected(isSelected) {
            this.getView().getModel("app").setProperty("/selectedQuestion/selected", isSelected);
        },

        _setQuestionAnswer(sAnswer) {
            this.getView().getModel("app").setProperty("/selectedQuestion/answer", sAnswer);
        },

        _setGroupName(sName) {
            this.getView().getModel("app").setProperty("/selectedGroup/name", sName);
        },
        
        _setTopicName(sName) {
            this.getView().getModel("app").setProperty("/selectedTopic/name", sName);
        },

        _bindQuestionsList(sPath) {
            const oList = this._getQuestionsList();
            const oTemplate = oList.getBindingInfo("items").template;
            oList.bindItems({path: sPath, template: oTemplate});
        },

        _getQuestionsList() {
            return this.getView().byId("questionsList");
        },

        _getGroupsList() {
            return this.getView().byId("groupsList");
        },

        _getTopicsList() {
            return this.getView().byId("topicsList");
        }
    });
});
