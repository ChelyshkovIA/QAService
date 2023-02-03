/*global QUnit*/

sap.ui.define([
	"qaservice-freestyle/controller/TopicsList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("TopicsList Controller");

	QUnit.test("I should test the TopicsList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
