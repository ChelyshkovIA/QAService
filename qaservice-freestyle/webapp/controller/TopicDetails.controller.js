sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "./../model/TopicDetailsModel",
    "sap/m/MessageToast"
], function(Controller, JSONModel, TopicDetailsModel, MessageToast) {
    'use strict';
    
    return Controller.extend("qaservicefreestyle.controller.TopicDetails", {
        onInit() {
            this.Router = this.getOwnerComponent().getRouter();
            this.Router.attachRoutePatternMatched(this.onPatterMatched.bind(this));
        },

        onAfterRendering() {
            TopicDetailsModel.init(this.getView().getModel());
        },

        onRowSelectionChange(oEvent) {
            const oTable = oEvent.getSource();
            const sQuestionID = this._getSelectedQuestionId(oTable);
            this._setQuestionSelected(sQuestionID ? true : false);

            if (!sQuestionID) return;
            
            this._setSelectedQuestionId(sQuestionID);
            this._bindAnswerTextArea(sQuestionID);
        },

        _getQuestionsTreeTable() {
            return this.getView().byId("questionsTreeTable");
        },

        _setSelectedQuestionId(sId) {
            const oAppModel = this.getView().getModel("appModel");
            oAppModel.setProperty("/questionsTable/selectedQuestionId", sId);
        },

        _getSelectedQuestionId(oTable) {
            const aSelectedIndices = oTable.getSelectedIndices();

            if (aSelectedIndices.length === 0) return;

            const nIndex = aSelectedIndices[0];
            const oSelectedObject = oTable.getBinding("rows").getContextByIndex(nIndex).getObject();

            if (!("group_ID" in oSelectedObject)) return;

            return oSelectedObject.ID;
        },

        async onPatterMatched(oEvent) {
            const sTopicId = oEvent.getParameter("arguments").topicId;
            this._initAppModel(sTopicId);
            this._bindObjectPageToTopic();
            await this._updateQuestionsModel();
        },

        _setBusy(sProp, bState = true) {
            const oAppModel = this.getView().getModel("appModel");
            oAppModel.setProperty(`/busyStates/${sProp}`, bState);
        },
        
        async onDifficultySelect(oEvent) {
            this._removeTableSelections();
            await this._updateQuestionsModel();
        },

        async onQuestionsEditButtonPress(sSelectedQuestionId) {
            this._setSelectedQuestionId(sSelectedQuestionId);
            await this._openEditQuestionDialog();
            this._bindEditQuestionDialog(sSelectedQuestionId);
        },

        async onSaveQuestionPress() {
            await TopicDetailsModel.submit();
            this.editQuestionDialog.close();
            this._showEditSuccessMessage();
            await this._updateQuestionsModel();
        },

        _showEditSuccessMessage() {
            MessageToast.show("Updated successfuly");
        },
        
        async _openEditQuestionDialog() {
            if (!this.editQuestionDialog) {
                this.editQuestionDialog = await this.loadFragment({
                    name: "qaservicefreestyle.fragment.editQuestionDialog"
                });
            }
    
            this.editQuestionDialog.open();
        },

        _bindEditQuestionDialog(sSelectedQuestionId) {
            this.editQuestionDialog.bindElement(`/Questions(${sSelectedQuestionId})`);
        },
        
        onCloseEditQuestionDialog() {
            this.editQuestionDialog.close();
        },

        async onOpenNewQuestionDialogPress() {
            if (!this.newQuestionDialog) {
                this.newQuestionDialog = await this.loadFragment({
                    name: "qaservicefreestyle.fragment.createQuestionDialog"
                });

                this._bindGroupSelectBox();
            }

            this.newQuestionDialog.open();
        },

        onCloseNewQuestionDialogPress() {
            this.newQuestionDialog.close();
        },

        async onCreateQuestionPress() {
            const oQuestionPayload = await this._getNewQuestionPayload();
            
            const bIsQuestionCreated = await this._tryToCreateQuestion(oQuestionPayload);

            if (!bIsQuestionCreated) {
                MessageToast.show("Something went wrong!");
                return;
            }

            MessageToast.show("Question created");

            this._clearNewQuestionDialog();
            await this._updateQuestionsModel();
        },

        async _getNewQuestionPayload() {
            const oPayload = {};
            
            const oAppModel = this.getView().getModel("appModel");
            oPayload.topic_ID = oAppModel.getProperty("/topicId");
            oPayload.text = oAppModel.getProperty("/newQuestion/text");
            oPayload.difficulty_ID = oAppModel.getProperty("/newQuestion/difficulty_ID");

            if (this._isUsedExistingGroup()) {
                oPayload.group_ID = oAppModel.getProperty("/newQuestion/existingGroupId");
                return oPayload;
            }

            const oNewGroupPayload = {
                name: oAppModel.getProperty("/newQuestion/newGroupName"),
                topic_ID: oAppModel.getProperty("/topicId")
            };

            const oNewGroup = await TopicDetailsModel.createGroup(oNewGroupPayload);
            oPayload.group_ID = oNewGroup.ID;
            return oPayload;
        },

        _isUsedExistingGroup() {
            const oAppModel = this.getView().getModel("appModel");
            return oAppModel.getProperty("/newQuestion/useExistingGroup");
        },

        onEditAnswerPress() {
            this._setAnswerEditMode(true);
        },
        
        async onSaveAnswerPress() {
            await TopicDetailsModel.submit();
            this._setAnswerEditMode(false);
        },
        
        onCancelAnswerEditPress() {
            this._setAnswerEditMode(false);
            TopicDetailsModel.reset();
        },

        _setAnswerEditMode(bIsAnswerEditMode) {
            const oAppModel = this.getView().getModel("appModel");
            oAppModel.setProperty("/answer/editMode", bIsAnswerEditMode);    
        },

        async _loadQuestionsToSelectedDifficultySection(sTopicId, sDifficultyId) {
            const oAppModel = this.getView().getModel("appModel");
            let aQuestions = [];

            if (sDifficultyId === oAppModel.getProperty("/difficultyKey/ALL")) {
                aQuestions = await TopicDetailsModel.getQuestionsByTopicId(sTopicId);
            } else {
                aQuestions = await TopicDetailsModel.getQuestionsByTopicIdAndDifficulty(sTopicId, sDifficultyId);
            }
        
            oAppModel.setProperty("/questionsTable/questionsList", aQuestions);
        },

        async _updateQuestionsModel() {
            const oAppModel = this.getView().getModel("appModel");

            const sTopicId = oAppModel.getProperty("/topicId");
            const sDifficultyId = oAppModel.getProperty("/questionsTable/difficulty");

            this._setBusy("questionsTable");
            
            await Promise.all([
                await this._loadQuestionsCountInfo(sTopicId),
                await this._loadQuestionsToSelectedDifficultySection(sTopicId, sDifficultyId),
                await this._loadGroupsWithQuestions(sTopicId, sDifficultyId)
            ]);

            this._setBusy("questionsTable", false);
        },
        
        async _loadGroupsWithQuestions(sTopicId, sDifficultyId) {
            const oAppModel = this.getView().getModel("appModel");
            const aGroups = await TopicDetailsModel.getTopicGroupsWithQuestions(sTopicId, sDifficultyId);
            const aGroupsFormatted = TopicDetailsModel.formatGroupsForTreeTable(aGroups);
            oAppModel.setProperty("/groupsTable/data", aGroupsFormatted);
            console.log(aGroupsFormatted);
        },

        _clearNewQuestionDialog() {
            const oAppModel = this.getView().getModel("appModel");
            oAppModel.setProperty("/newQuestion/text", "");
            oAppModel.setProperty("/newQuestion/difficulty_ID", "");
            oAppModel.setProperty("/newQuestion/newGroupName", "");
            oAppModel.setProperty("/newQuestion/existingGroupId", "");
        },

        async _tryToCreateQuestion(oPayload) {
            try {
                await TopicDetailsModel.createQuestion(oPayload);
                return true;
            } catch (oError) {
                console.log(oError);
                return false;
            }
        },

        async _loadQuestionsCountInfo(sTopicId) {
            const sFullCount = await TopicDetailsModel.getAllTopicQuestionsCount(sTopicId);
            const sElementaryCount = await TopicDetailsModel.getElementaryTopicQuestionsCount(sTopicId);
            const sBasicCount = await TopicDetailsModel.getBasicTopicQuestionsCount(sTopicId);
            const sAdvancedCount = await TopicDetailsModel.getAdvancedTopicQuestionsCount(sTopicId);
            const sExpertCount = await TopicDetailsModel.getExpertTopicQuestionsCount(sTopicId);
            
            const oAppModel = this.getView().getModel("appModel");
            
            oAppModel.setProperty(_getProp("all"), sFullCount);
            oAppModel.setProperty(_getProp("elementary"), sElementaryCount);
            oAppModel.setProperty(_getProp("basic"), sBasicCount);
            oAppModel.setProperty(_getProp("advanced"), sAdvancedCount);
            oAppModel.setProperty(_getProp("expert"), sExpertCount);

            function _getProp(sDiff) {
                return `/topicDetails/questions/${sDiff}/count`;
            }
        },

        _initAppModel(sTopicId) {
            const oAppModel = new JSONModel({
                topicId: sTopicId,
                topicDetails: {
                    questions: {
                        all: {
                            count: ""
                        },
                        elementary: {
                            count: ""
                        },
                        basic: {
                            count: ""
                        },
                        advanced: {
                            count: ""
                        },
                        expert: {
                            count: ""
                        }
                    }
                },
                questionsTable: {
                    questionSelected: false,
                    questionsList: [],
                    difficulty: "all",
                    selectedQuestionId: ""
                },
                groupsTable: {
                    data: []
                },
                answer: {
                    text: "",
                    editMode: false
                },
                difficultyKey: {
                    ALL: "all",
                    ELEMENTARY: TopicDetailsModel.DIFFICULTY_ID.ELEMENTARY,
                    BASIC: TopicDetailsModel.DIFFICULTY_ID.BASIC,
                    ADVANCED: TopicDetailsModel.DIFFICULTY_ID.ADVANCED,
                    EXPERT: TopicDetailsModel.DIFFICULTY_ID.EXPERT
                },
                newQuestion: {
                    text: "",
                    difficulty_ID: "",
                    useExistingGroup: true,
                    existingGroupId: "",
                    newGroupName: ""
                },
                busyStates: {
                    iconFilterBar: false,
                    questionsTable: false
                }
            });

            this.getView().setModel(oAppModel, "appModel");
        },

        _bindObjectPageToTopic() {
            const sCurrentTopicId = this.getView().getModel("appModel").getProperty("/topicId");
            const oObjectPage = this._getQuestionsObjectPage();
            oObjectPage.bindElement(`/Topics(${sCurrentTopicId})`);
        },

        _getQuestionsObjectPage() {
            return this.getView().byId("topicDetailsObjectPage");
        },

        _removeTableSelections() {
            this._setQuestionSelected(false);
        },

        _bindAnswerTextArea(sSelectedQuestionId) {
            const oAnswerTextArea = this._getAnswerTextArea()
            oAnswerTextArea.bindElement(`/Questions(${sSelectedQuestionId})`);
            oAnswerTextArea.bindProperty("value", "answer");
        },

        _bindGroupSelectBox() {
            const oAppModel = this.getView().getModel("appModel");
            const oSelectBox = this._getGroupSelectBox();
            const sTopicId = oAppModel.getProperty("/topicId");
            oSelectBox.bindElement(`/Topics(${sTopicId})`);
        },

        _setQuestionSelected(bIsQuestionSelected) {
            const oAppModel = this.getView().getModel("appModel");
            oAppModel.setProperty("/questionsTable/questionSelected", bIsQuestionSelected);
        },

        _getGroupSelectBox() {
            return this.getView().byId("groupSelectBox");
        },

        _getAnswerSubSection() {
            return this.getView().byId("answerSubSection");
        },

        _getAnswerTextArea() {
            return this.getView().byId("answerTextArea");
        },

        _isAnswerEditMode() {
            const oAppModel = this.getView().getModel("appModel");
            return oAppModel.getProperty("/answer/editMode");
        }
    });
});