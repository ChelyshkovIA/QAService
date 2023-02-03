sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "./../model/TopicsListModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, JSONModel, TopicsModel, Filter, FilterOperator, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("qaservicefreestyle.controller.TopicsList", {
        onInit() {
            this._initAppModel();
            sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
        },

        onAfterRendering() {
            TopicsModel.init(this.getView().getModel());
        },

        onTopicItemPress(oEvent) {
            const sID = oEvent.getSource().getBindingContext().getObject().ID;
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteTopicDetails", {topicId: sID});
        },

        async onGoButtonPress() {
            const oTable = this._getTopicsTable();
            const oBinding = oTable.getBinding("items");
            const oTopicFilter = this._getTopicsListFilter();
            const oResult = oBinding.filter(oTopicFilter);
        },
        
        onBindingUpdateStarted() {
            this._showTopicsFilteredMessage();
        },

        async onDeleteButtonPress() {
            const bShouldBeDeleted = await this._showConfirmation();
            
            if(!bShouldBeDeleted) {
                return;
            }

            await this._deleteTopics();

        },

        onSearchLiveChange(oEvent) {
            const sTopicName = oEvent.getSource().getValue();
            const oTopicNameFilter = new Filter({
                path: "name",
                value1: sTopicName,
                operator: FilterOperator.Contains,
                caseSensitive: false
            });
            const oBinding = this._getTopicsTable().getBinding("items");
            oBinding.filter(oTopicNameFilter);
        },

        onEditPress() {
            this._enableEditMode();
        },

        async onCancelPress() {
            TopicsModel.reset();
            this._disableEditMode();
        },

        async onSavePress() {
            this._disableEditMode();
            await TopicsModel.submit();
        },

        async onOpenDialogPress() {
            if (!this.createTopicDialog) {
                this.createTopicDialog = await this.loadFragment({
                    name: "qaservicefreestyle.fragment.createTopicDialog"
                });
            }

            this.createTopicDialog.open();
        },

        onCloseDialogButtonPress() {
            this._closeCreateTopicDialog();
        },

        async onCreateTopicPress() {
            const sNewTopicName = this.getView().getModel("appModel").getProperty("/data/newTopicName");
            const bTopicCreated = await this._tryToCreateTopic({name: sNewTopicName});
            
            if(!bTopicCreated) {
                MessageToast.show("Something went wrong!");
                return;
            }

            MessageToast.show("Topic Created!");
            this._closeCreateTopicDialog();
        },

        onTableSelectionChange(oEvent) {
            const aSelectedCtx = oEvent.getSource().getSelectedContexts();
            const isSomethingSelected = aSelectedCtx.length > 0;
            this._setDeleteButtonVisibility(isSomethingSelected);
        },

        _enableEditMode() {
            this.getView().getModel("appModel").setProperty("/table/isEditMode", true);
        },
        
        _disableEditMode() {
            this.getView().getModel("appModel").setProperty("/table/isEditMode", false);
        },

        _setDeleteButtonVisibility(bIsVisible) {
            this.getView().getModel("appModel").setProperty("/table/isSomethingSelected", bIsVisible);
        },

        async _showConfirmation() {
            return new Promise(function(fnResolve, fnReject) {
                MessageBox.confirm("Are you sure you want to delete topics?", {
                    onClose(sAction) {
                        const bShouldBeDeleted = MessageBox.Action.OK === sAction;
                        fnResolve(bShouldBeDeleted);
                    }
                });
            });
        },

        async _deleteTopics() {
            const oTable = this._getTopicsTable();
            const aSelectedContexts = oTable.getSelectedContexts();
            const isTopicsDeleted = await this._tryToDeleteTopics(aSelectedContexts);
            if (!isTopicsDeleted) {
                MessageToast.show("Something went wrong!");
                return;
            }
            MessageToast.show("Topics deleted!");
            this._setDeleteButtonVisibility(false);
        },

        _clearTopicDialog() {
            this.getView().getModel("appModel").setProperty("/data/newTopicName", "");
        },

        _showTopicsFilteredMessage() {
            MessageToast.show("Filtered!");
        },

        _initAppModel() {
            const oAppModel = new JSONModel({
                filters: {
                    selectedTopics: []
                },
                data: {
                    newTopicName: ""
                },
                table: {
                    isSomethingSelected: false,
                    isEditMode: false
                }
            });

            this.getView().setModel(oAppModel, "appModel");
        },

        _getTopicsTable() {
            return this.getView().byId("_IDGenTable1");
        },

        _getTopicsListFilter() {
            const aSelectedTopicIds = this.getView().getModel("appModel").getProperty("/filters/selectedTopics");
            const aFilters = aSelectedTopicIds.map(sId => {
                return new Filter("ID", FilterOperator.EQ, sId);
            });
            return aFilters.length > 0 ? new Filter({
                filters: aFilters,
                and: false
            }) : [];
        },

        async _tryToCreateTopic(mPayload) {
            try {
                await TopicsModel.createTopic(mPayload);
                return true;
            } catch (oError) {
                console.log(oError);
                return false;
            }
        },

        async _tryToDeleteTopics(aDeleteTopicsContexts) {
            try {
                await TopicsModel.deleteTopics(aDeleteTopicsContexts);
                return true;
            } catch (oError) {
                console.log(oError);
                return false;
            }
        },

        _closeCreateTopicDialog() {
            const oAppModel = this.getView().getModel("appModel");
            oAppModel.setProperty("/data/newTopicName", "");
            this.createTopicDialog.close();
        }
    });
});
