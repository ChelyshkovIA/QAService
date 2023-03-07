sap.ui.define([
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/BindingMode"
], function(Filter, FilterOperator, BindingMode) {
    'use strict';
    
    return {
        _ENTITY_SET: {
            TOPIC: "/Topics",
            QUESTIONS: "/Questions",
            ANSWERS: "/Answers",
            GROUPS: "/Groups"
        },

        DIFFICULTY_ID: {
            ELEMENTARY: "891a0c87-5825-b3d7-d94d-243a77a314b6",
            BASIC: "af7d706e-199c-f4e9-b51e-3ecd815fd3b4",
            ADVANCED: "7a8eec66-b5a4-5c59-f4c7-b844cb506751",
            EXPERT: "405fa0bc-b8d6-946a-5997-34401cc47721"
        },

        init(oODataModel) {
            this.ODataModel = oODataModel;
            this.ODataModel.setDefaultBindingMode(BindingMode.TwoWay);
        },

        refresh() {
            return this.ODataModel.refresh();
        },

        reset() {
            this.ODataModel.resetChanges();
        },

        submit() {
            return new Promise(function(fnResolve, fnReject) {
                this.ODataModel.submitChanges({
                    success: fnResolve,
                    error: fnReject
                });
            }.bind(this));
        },

        createGroup(oPayload) {
            return this._createEntity(this._ENTITY_SET.GROUPS, oPayload);
        },

        createQuestion(oPayload) {
            return this._createEntity(this._ENTITY_SET.QUESTIONS, oPayload);
        },

        createAnswer(oPayload) {
            return this._createEntity(this._ENTITY_SET.ANSWERS, oPayload);
        },

        async getTopicGroupsWithQuestions(sTopicId, sDifficultyId) {
            const aGroupFilters = [new Filter("topic_ID", FilterOperator.EQ, sTopicId)];
            const sExpandString = sDifficultyId === "all" ? "questions($expand=progress)" : `questions($filter=difficulty_ID eq ${sDifficultyId};$expand=progress)`;

            return new Promise(function(fnResolve, fnReject) {
                this.ODataModel.read(this._ENTITY_SET.GROUPS, {
                    success(oData) {
                        fnResolve(oData.results);
                        console.log(oData.results);
                    },
                    error: fnReject,
                    filters: aGroupFilters,
                    urlParameters: {
                        "$expand": sExpandString
                    }
                });
            }.bind(this));
        },

        formatGroupsForTreeTable(aGroups) {
            const oFormattedGroups = {categories: []};
            oFormattedGroups.categories = aGroups.map(oGroup => {
                oGroup.categories = [...oGroup.questions.results];
                delete oGroup.questions;
                return oGroup;
            });
            return oFormattedGroups;
        },

        getQuestionsByTopicId(sTopicId) {
            const aFilters = [
                new Filter("topic_ID", FilterOperator.EQ, sTopicId)
            ];

            return this._loadEntitySet(this._ENTITY_SET.QUESTIONS, aFilters);
        },

        getQuestionsByTopicIdAndDifficulty(sTopicId, sDifficultyId) {
            const aFilters = [
                new Filter("topic_ID", FilterOperator.EQ, sTopicId),
                new Filter("difficulty_ID", FilterOperator.EQ, sDifficultyId)
            ];

            return this._loadEntitySet(this._ENTITY_SET.QUESTIONS, aFilters);
        },

        getAllTopicQuestionsCount(sTopicId) {
            return this._getTopicQuestionsCount(sTopicId);
        },

        async getElementaryTopicQuestionsCount(sTopicID) {
            const aDifficultyFilter = this._getDifficultyFilter(this.DIFFICULTY_ID.ELEMENTARY);
            try {
                return await this._getTopicQuestionsCount(sTopicID, aDifficultyFilter);
            } catch (sError) {
                console.log(sError);
                return 0;
            }
        },

        getBasicTopicQuestionsCount(sTopicId) {
            const aDifficultyFilter = this._getDifficultyFilter(this.DIFFICULTY_ID.BASIC);
            return this._getTopicQuestionsCount(sTopicId, aDifficultyFilter);
        },

        getAdvancedTopicQuestionsCount(sTopicId) {
            const aDifficultyFilter = this._getDifficultyFilter(this.DIFFICULTY_ID.ADVANCED);
            return this._getTopicQuestionsCount(sTopicId, aDifficultyFilter);
        },

        getExpertTopicQuestionsCount(sTopicId) {
            const aDifficultyFilter = this._getDifficultyFilter(this.DIFFICULTY_ID.EXPERT);
            return this._getTopicQuestionsCount(sTopicId, aDifficultyFilter);
        },

        loadTopicById(sId) {
            return this._loadEntityById(this._ENTITY_SET.TOPIC, sId);
        },

        _getTopicQuestionsCount(sTopicId, aFilters = []) {
            const aRequestFilters = [this._getTopicIdFilter(sTopicId)].concat(aFilters);

            return new Promise(function(fnResolve, fnReject) {
                this.ODataModel.read(`${this._ENTITY_SET.QUESTIONS}/$count`, {
                    success(oResult) {
                        fnResolve(oResult);
                    },
                    error(oError) {
                        fnReject(oError);
                    },
                    filters: aRequestFilters
                });
            }.bind(this));
        },

        _getTopicIdFilter(sTopicId) {
            return new Filter("topic_ID", FilterOperator.EQ, sTopicId);
        },

        _getDifficultyFilter(sDifficultyId) {
            return [new Filter("difficulty_ID", FilterOperator.EQ, sDifficultyId)];
        },

        _loadEntitySet(sEntitySet, aFilters) {
            return new Promise(function(fnResolve, fnReject) {
                this.ODataModel.read(sEntitySet, {
                    success(oResult) {
                        fnResolve(oResult.results);
                    },
                    error(oError) {
                        fnReject(oError);
                    },
                    filters: aFilters
                });
            }.bind(this));
        },

        _loadEntityById(sEntitySet, sId) {
            return new Promise(function(fnResolve, fnReject) {
                this.ODataModel.read(`${sEntitySet}(${sId})`, {
                    success(oResult) {
                        fnResolve(oResult);
                    },
                    error(oError) {
                        fnReject(oError);
                    }
                })
            }.bind(this));
        },

        _createEntity(sEntitySet, oPayload) {
            return new Promise(function(fnResolve, fnReject) {
                this.ODataModel.create(sEntitySet, oPayload, {
                    success(oData) {
                        fnResolve(oData)
                    },
                    error: fnReject
                });
            }.bind(this));
        }
    }
});