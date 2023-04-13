/*global QUnit*/

sap.ui.define([
	"qaservice-freestyle-smart/controller/QuestionList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("QuestionList Controller");

	QUnit.test("I should test the QuestionList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
