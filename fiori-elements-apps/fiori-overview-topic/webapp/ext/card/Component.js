sap.ui.define([
    "sap/ovp/cards/custom/Component"
], function(Component) {
    return Component.extend("fiorioverviewtopic.ext.card.Component", {
        metadata: {
            properties: {
                contentFragment: {
                    type: "string",
                    defaultValue: "fiorioverviewtopic.ext.card.CustomCardContent"
                },
                headerFragment: {
                    type: "string",
                    defaultValue: "fiorioverviewtopic.ext.card.CustomCardHeader"
                },
                footerFragment: {
                    type: "string",
                    defaultValue: "fiorioverviewtopic.ext.card.CustomCardFooter"
                }
            },

            version: "${version}",

            library: "sap.ovp",

            includes: [],

            dependencies: {
                libs: ["sap.m"],
                components: []
            },

            config: {},

            customizing: {
                "sap.ui.controllerExtensions": {
                    "sap.ovp.cards.generic.Card": {
                        controllerName: "fiorioverviewtopic.ext.card.CustomCard"
                    }
                }
            }
        }
    });
});