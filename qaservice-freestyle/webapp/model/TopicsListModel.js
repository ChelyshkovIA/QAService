sap.ui.define([
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(Filter, FilterOperator) {
    'use strict';
    
    return {
        _ENTITY_SETS: {
            TOPICS: "/Topics"
        },

        init(oODataModel) {
            this.ODataModel = oODataModel;
            this.ODataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
        },

        reset() {
            this.ODataModel.resetChanges();
        },

        refresh() {
            return this.ODataModel.refresh(true);
        },

        submit() {
            return new Promise(function(fnResolve, fnReject) {
                this.ODataModel.submitChanges({
                    success: fnResolve,
                    error: fnReject
                });
            }.bind(this));
        },

        loadTopic(sTopicId) {
            return this._loadEntityById(sTopicId);
        },

        loadTopics() {
            return this._loadEntitySet(this._ENTITY_SETS.TOPICS);
        },

        createTopic(oTopicPayload) {
            return this._createEntity(this._ENTITY_SETS.TOPICS, oTopicPayload);            
        },

        deleteTopics(aCtx) {
            const aDeleteTopicsPromises = aCtx.map(function(oCtx) {
                return this.deleteTopic(oCtx);
            }.bind(this));

            return Promise.all(aDeleteTopicsPromises);
        },

        deleteTopic(oCtx) {
            const sKey = this._generateKey(this._ENTITY_SETS.TOPICS, oCtx);
            return this._deleteEntity(sKey);
        },

        _generateKey(sEntitySet, oCtx) {
            return this.ODataModel.createKey(sEntitySet, oCtx.getObject());
        },

        _loadEntitySet(sEntitySetName) {
            return new Promise(function(fnResolve, fnReject) {
                this.ODataModel.read(sEntitySetName, {
                    success(oData) {
                        fnResolve(oData.results);
                    },

                    error(oError) {
                        console.log(`Error while EntituSet ${sEntitySetName} loading!`);
                        fnReject(oError);
                    }
                });
            }.bind(this));
        },

        _loadEntityById(sId) {
            return new Promise(function(fnResolve, fnReject) {
                this.ODataModel.read(`/Topics(${sId})`, {
                    success(oResult) {
                        fnResolve(oResult);
                    },
                    error(oError) {
                        fnReject(oError);
                    }
                })
            }.bind(this));
        },

        _createEntity(sEntitySet, mPayload) {
            return new Promise(function(fnResolve, fnReject) {
                return this.ODataModel.create(sEntitySet, mPayload, {
                    success: fnResolve,
                    error: fnReject
                });
            }.bind(this));
        },

        _deleteEntity(sKey) {
            return new Promise(function(fnResolve, fnReject) {
                this.ODataModel.remove(sKey, {
                    success: fnResolve,
                    error: fnReject
                });
            }.bind(this));
        }
    }
});