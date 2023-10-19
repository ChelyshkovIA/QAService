sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function(Controller, JSONModel, MessageBox, MessageToast) {
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
                    answer: "",
                    id: ""
                },

                selectedTopic: {
                    selected: false,
                    id: "",
                    name: ""
                },

                selectedGroup: {
                    selected: false,
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
            this._setTopicSelected(true);
            this._setGroupSelected(false);
            this._resetQuestions();
        },

        onGroupSelect(oEvent) {
            const oGroupItem = oEvent.getSource().getSelectedItem();
            const oCtx = oGroupItem.getBindingContext();
            const oGroup = oCtx.getObject();
            this._setQuestionsListCtx(oCtx);
            this._bindQuestionsList("questions");
            this._setGroupName(oGroup.name);
            this._setGroupSelected(true);
            this._resetQuestions();
        },

        onQuestionSelect(oEvent) {
            const oQuestionItem = oEvent.getSource().getSelectedItem();
            const oCtx = oQuestionItem.getBindingContext();
            const oQuestion = oCtx.getObject();
            this._setQuestionSelected(true);
            this._setQuestionId(oQuestion.ID);
            this._setQuestionAnswer(oQuestion.text);
        },

        onQuestionDelete() {
            MessageBox.confirm("Are you sure, you want to delete this question?", {
                onClose: async function(sAction) {
                    if (sAction === MessageBox.Action.CANCEL) {
                        return;
                    }

                    await this._deleteSelectedQuestion();
                }.bind(this)
            });
        },

        onGroupDelete() {
            MessageBox.confirm("Are you sure, you want to delete this group?", {
                onClose: async function(sAction) {
                    if (sAction === MessageBox.Action.CANCEL) {
                        return;
                    }

                    await this._deleteSelectedGroup();
                }.bind(this)
            });
        },

        onTopicsReset() {
            const oCtx = this._getTopicsList().getBindingContext();
            this._setTopicName("");
            this._setGroupName("");
            this._bindQuestionsList("/Questions");
            this._clearTopicsListSelection();
            this._clearGroupsListSelection();
            this._setGroupsListCtx(oCtx);
            this._setGroupSelected(false);
            this._setTopicSelected(false);
            this._resetQuestions();
        },
        
        onGroupsReset() {
            const oSelectedItem = this._getTopicsList().getSelectedItem();
            const oCtx = oSelectedItem.getBindingContext();
            this._setQuestionsListCtx(oCtx);
            this._bindQuestionsList("questions");
            this._setGroupName("");
            this._clearGroupsListSelection();
            this._setGroupSelected(false);
            this._resetQuestions();
        },

        onQuestionsReset() {
            this._getQuestionsList().removeSelections();
            this._resetQuestions();
        },
        
        formatHighlight(test) {
            return `Indication0${++test}`;
        },

        async _deleteSelectedGroup() {
            const oList = this._getGroupsList();
            return this._deleteSelectedItem(oList, "Group deleted!");
        },

        async _deleteSelectedQuestion() {
            const oList = this._getQuestionsList();
            return this._deleteSelectedItem(oList, "Question deleted!");
        },

        async _deleteSelectedItem(oList, sMessage) {
            const oItem = oList.getSelectedItem();
            const oCtx = oItem.getBindingContext();

            try {
                await oCtx.delete();
                MessageToast.show(sMessage);
            } catch (sErr) {
                console.log(sErr);
            }
        },

        _resetQuestions() {
            this._setQuestionAnswer("");
            this._setQuestionId("");
            this._setQuestionSelected(false);
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

        _setQuestionId(sId) {
            this.getView().getModel("app").setProperty("/selectedQuestion/id", sId);
        },

        _setQuestionAnswer(sAnswer) {
            this.getView().getModel("app").setProperty("/selectedQuestion/answer", sAnswer);
        },

        _setGroupSelected(isSelected) {
            this.getView().getModel("app").setProperty("/selectedGroup/selected", isSelected);
        },

        _setGroupName(sName) {
            this.getView().getModel("app").setProperty("/selectedGroup/name", sName);
        },

        _setTopicSelected(isSelected) {
            this.getView().getModel("app").setProperty("/selectedTopic/selected", isSelected);
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
