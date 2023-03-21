sap.ui.define([
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (Filter, FilterOperator, MessageToast) {
    "use strict";
    return {
        ID: {
            DIFFICULTY: {
                ELEMENTARY: "891a0c87-5825-b3d7-d94d-243a77a314b6",
                BASIC: "af7d706e-199c-f4e9-b51e-3ecd815fd3b4",
                ADVANCED: "7a8eec66-b5a4-5c59-f4c7-b844cb506751",
                EXPERT: "405fa0bc-b8d6-946a-5997-34401cc47721"
            },
            UI_CONTROL: {
                DIFFICULTY_FILTER: "CustomQuestionFilter--combobox"
            }
        },
        QUESTION_PROPS: {
            DIFFICULTY_ID: "difficulty_ID"
        },
        FILTERS: {
            DIFFICULTY: {
                EASY: "0",
                HARD: "1"
            }
        },

        onBeforeRebindTableExtension: function(oEvent) {
            const oComboBox = this.getView().byId(this.ID.UI_CONTROL.DIFFICULTY_FILTER);
            const sSelectedKey = oComboBox.getSelectedKey();
            const oBindingParams = oEvent.getParameter("bindingParams");
            oBindingParams.parameters = oBindingParams.parameters || {};
            console.log(sSelectedKey);
            this._updateFilters(oBindingParams);
        },

        onShowMessagePress() {
            MessageToast.show("Hello, I'm Custom Action!");
        },

        _updateFilters(oBindingParams) {
            this._updateDifficultyFilter(oBindingParams);
        },

        _updateDifficultyFilter(oBindingParams) {
            const sSelectedDifficulty = this._getSelectedDifficultyKey();

            if (sSelectedDifficulty === this.FILTERS.DIFFICULTY.EASY) {
                this._setEasyDifficultyFilter(oBindingParams);
                return;
            }
            
            if (sSelectedDifficulty === this.FILTERS.DIFFICULTY.HARD) {
                this._setHardDifficultyFilter(oBindingParams);
                return;
            }
        },

        _getSelectedDifficultyKey() {
            const oComboBox = this._getDifficultyComboBox();
            return oComboBox.getSelectedKey();
        },

        _getDifficultyComboBox() {
            return this.getView().byId(this.ID.UI_CONTROL.DIFFICULTY_FILTER);
        },

        _setEasyDifficultyFilter(oBindingParams) {
            oBindingParams.filters.push(new Filter({
                filters: [
                    new Filter(this.QUESTION_PROPS.DIFFICULTY_ID, FilterOperator.EQ, this.ID.DIFFICULTY.ELEMENTARY),
                    new Filter(this.QUESTION_PROPS.DIFFICULTY_ID, FilterOperator.EQ, this.ID.DIFFICULTY.BASIC)
                ],
                and: false
            }));
        },

        _setHardDifficultyFilter(oBindingParams) {
            oBindingParams.filters.push(new Filter({
                filters: [
                    new Filter(this.QUESTION_PROPS.DIFFICULTY_ID, FilterOperator.EQ, this.ID.DIFFICULTY.ADVANCED),
                    new Filter(this.QUESTION_PROPS.DIFFICULTY_ID, FilterOperator.EQ, this.ID.DIFFICULTY.EXPERT)
                ],
                and: false
            }));
        }
    };
});