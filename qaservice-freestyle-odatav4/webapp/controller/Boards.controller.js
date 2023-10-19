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
                newTopic: {
                    name: ""
                },

                newGroup: {
                    name: ""
                },

                newQuestion: {
                    text: "",
                    answer: "",
                    difficulty_ID: null
                },

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

        async onTopicCreate() {
            if (!this.createTopicDialog) {
                this.createTopicDialog = await this.loadFragment({
                    name: "qaservicefreestyleodatav4.fragment.CreateTopic"
                });
            }

            this.createTopicDialog.open();
        },

        async onSubmitTopicDialog() {
            const oTopicPayload = this._getTopicPayload();
            const oTopicBinding = this._getTopicsList().getBinding("items");
            
            await this._createFromBinding(oTopicBinding, oTopicPayload);
            
            this._resetTopicPayload();
            this.createTopicDialog.close();
        },

        onCloseTopicDialog() {
            this.createTopicDialog.close();
        },

        async onGroupCreate() {
            if (!this.createGroupDialog) {
                this.createGroupDialog = await this.loadFragment({
                    name: "qaservicefreestyleodatav4.fragment.CreateGroup"
                });
            }

            this.createGroupDialog.open();
        },

        async onSubmitGroupDialog() {
            const oGroupPayload = this._getGroupPayload();
            const oGroupBinding = this._getGroupsList().getBinding("items");

            await this._createFromBinding(oGroupBinding, oGroupPayload);

            this._resetGroupPayload();
            this.createGroupDialog.close();
        },

        onCloseGroupDialog() {
            this.createGroupDialog.close();
        },

        async onQuestionCreate() {
            if (!this.createQuestionDialog) {
                this.createQuestionDialog = await this.loadFragment({
                    name: "qaservicefreestyleodatav4.fragment.CreateQuestion"
                });
            }

            this.createQuestionDialog.open();
        },
        
        async onSubmitQuestionDialog() {
            const oQuestionPayload = this._getQuestionPayload();
            oQuestionPayload.topic_ID = this._getSelectedTopic().id;
            const oQuestionBinding = this._getQuestionsList().getBinding("items");

            await this._createFromBinding(oQuestionBinding, oQuestionPayload);

            this._resetQuestionPayload();
            this.createQuestionDialog.close();
        },

        onCloseQuestionDialog() {
            this.createQuestionDialog.close();
        },

        onTopicSelect(oEvent) {
            const oCtx = oEvent.getSource().getSelectedItem().getBindingContext();
            const oTopic = oCtx.getObject();
            this._bindQuestionsToSelectedTopic();
            this._setGroupsListCtx(oCtx);
            this._setTopicId(oTopic.ID);
            this._setTopicName(oTopic.name);
            this._setTopicSelected(true);
            this._resetGroup();
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
                    await this._handleConfirmDialogClose(sAction, this._deleteSelectedQuestion.bind(this));
                }.bind(this)
            });
        },

        onGroupDelete() {
            MessageBox.confirm("Are you sure, you want to delete this group?", {
                onClose: async function(sAction) {
                    await this._handleConfirmDialogClose(sAction, this._deleteSelectedGroup.bind(this));
                }.bind(this)
            });
        },

        onTopicDelete() {
            MessageBox.confirm("Are you sure, you want to delete this topic?", {
                onClose: async function(sAction) {
                    await this._handleConfirmDialogClose(sAction, this._deleteSelectedTopic.bind(this));
                }.bind(this)
            });
        },

        onTopicsReset() {
            this._bindQuestionsToRoot();
            this._bindGroupsToRoot();
            this._resetGroup();
            this._resetTopic();
            this._resetQuestions();
        },
        
        onGroupsReset() {
            this._bindQuestionsToSelectedTopic();
            this._resetGroup();
            this._resetQuestions();
        },

        onQuestionsReset() {
            this._resetQuestions();
        },
        
        formatHighlight(test) {
            return `Indication0${++test}`;
        },

        async _createFromBinding(oBinding, oPayload) {
            try {
                await oBinding.create(oPayload);
                MessageToast.show("Successfully created!");
            } catch (sError) {
                console.log(sError);
                MessageToast.show("Something went wrong");
            }
        },

        _getSelectedTopic() {
            return this.getView().getModel("app").getProperty("/selectedTopic");
        },

        _getQuestionPayload() {
            return this.getView().getModel("app").getProperty("/newQuestion");
        },

        _resetQuestionPayload() {
            this.getView().getModel("app").setProperty("/newQuestion/text", "");
            this.getView().getModel("app").setProperty("/newQuestion/answer", "");
            this.getView().getModel("app").setProperty("/newQuestion/difficulty_ID", null);
        },

        _getGroupPayload() {
            return this.getView().getModel("app").getProperty("/newGroup");
        },

        _resetGroupPayload() {
            this.getView().getModel("app").setProperty("/newGroup/name", "");
        },

        _getTopicPayload() {
            return this.getView().getModel("app").getProperty("/newTopic");
        },

        _resetTopicPayload() {
            this.getView().getModel("app").setProperty("/newTopic/name", "");
        },

        _bindGroupsToRoot() {
            const oCtx = this._getTopicsList().getBindingContext();
            this._setGroupsListCtx(oCtx);
        },

        _bindQuestionsToRoot() {
            this._bindQuestionsList("/Questions");
        },

        _bindQuestionsToSelectedTopic() {
            const oSelectedItem = this._getTopicsList().getSelectedItem();
            const oCtx = oSelectedItem.getBindingContext();
            this._setQuestionsListCtx(oCtx);
            this._bindQuestionsList("questions");
        },

        async _handleConfirmDialogClose(sAction, fnCallback) {
            if (sAction === MessageBox.Action.CANCEL) {
                return;
            }

            await fnCallback();
        },

        async _deleteSelectedTopic() {
            const oList = this._getTopicsList();
            await this._deleteSelectedItem(oList, "Topic deleted!");
            this._resetTopic();
            this._resetGroup();
            this._resetQuestions();
            this._bindQuestionsToRoot();
            this._bindGroupsToRoot();
        },

        async _deleteSelectedGroup() {
            const oList = this._getGroupsList();
            await this._deleteSelectedItem(oList, "Group deleted!");
            this._resetGroup();
            this._resetQuestions();
            this._bindQuestionsToSelectedTopic();
        },

        async _deleteSelectedQuestion() {
            const oList = this._getQuestionsList();
            await this._deleteSelectedItem(oList, "Question deleted!");
            this._resetQuestions();
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
            this._clearQuestionsListSelection();
            this._setQuestionAnswer("");
            this._setQuestionId("");
            this._setQuestionSelected(false);
        },

        _resetGroup() {
            this._clearGroupsListSelection();
            this._setGroupSelected(false);
            this._setGroupName("");
        },

        _resetTopic() {
            this._clearTopicsListSelection();
            this._setTopicSelected(false);
            this._setTopicName("");
        },

        _clearTopicsListSelection() {
            this._getTopicsList().removeSelections();
        },
        
        _clearGroupsListSelection() {
            this._getGroupsList().removeSelections();
        },

        _clearQuestionsListSelection() {
            this._getQuestionsList().removeSelections();
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

        _setTopicId(sId) {
            this.getView().getModel("app").setProperty("/selectedTopic/id", sId);
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
