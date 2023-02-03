//@ui5-bundle questions/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"questions/Component.js":function(){sap.ui.define(["sap/fe/core/AppComponent"],function(e){"use strict";return e.extend("questions.Component",{metadata:{manifest:"json"}})});
},
	"questions/i18n/i18n.properties":'# This is the resource bundle for questions\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Questions\n\n#YDES: Application description\nappDescription=A Fiori application.\n\nflpTitle=Questions\n\nflpSubtitle=\n',
	"questions/manifest.json":'{"_version":"1.48.0","sap.app":{"id":"questions","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:lrop","version":"1.8.3","toolsId":"a685d899-7381-4c06-a74e-fcd75fc796d5"},"dataSources":{"mainService":{"uri":"qa/","type":"OData","settings":{"annotations":["annotation"],"localUri":"localService/metadata.xml","odataVersion":"4.0"}},"annotation":{"type":"ODataAnnotation","uri":"annotations/annotation.xml","settings":{"localUri":"annotations/annotation.xml"}}},"crossNavigation":{"inbounds":{"questions-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"Question","action":"view","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":""}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.109.3","libs":{"sap.m":{},"sap.ui.core":{},"sap.ushell":{},"sap.fe.templates":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"questions.i18n.i18n"}},"":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"@i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties"}},"resources":{"css":[]},"routing":{"config":{},"routes":[{"pattern":":?query:","name":"QuestionsList","target":"QuestionsList"},{"pattern":"Questions({key}):?query:","name":"QuestionsObjectPage","target":"QuestionsObjectPage"}],"targets":{"QuestionsList":{"type":"Component","id":"QuestionsList","name":"sap.fe.templates.ListReport","options":{"settings":{"entitySet":"Questions","variantManagement":"Page","navigation":{"Questions":{"detail":{"route":"QuestionsObjectPage"}}}}}},"QuestionsObjectPage":{"type":"Component","id":"QuestionsObjectPage","name":"sap.fe.templates.ObjectPage","options":{"settings":{"editableHeaderContent":false,"entitySet":"Questions"}}}}}},"sap.fiori":{"registrationIds":[],"archeType":"transactional"}}'
}});
