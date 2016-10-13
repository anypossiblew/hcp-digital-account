jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
jQuery.sap.require("sap.ui.test.opaQunit");
jQuery.sap.require("sap.ui.test.Opa5");

jQuery.sap.require("digacc.manager.test.integration.pages.Common");
jQuery.sap.require("digacc.manager.test.integration.pages.Worklist");
jQuery.sap.require("digacc.manager.test.integration.pages.Object");
jQuery.sap.require("digacc.manager.test.integration.pages.NotFound");
jQuery.sap.require("digacc.manager.test.integration.pages.Browser");
jQuery.sap.require("digacc.manager.test.integration.pages.App");

sap.ui.test.Opa5.extendConfig({
	arrangements: new digacc.manager.test.integration.pages.Common(),
	viewNamespace: "digacc.manager.view."
});

// Start the tests
jQuery.sap.require("digacc.manager.test.integration.WorklistJourney");
jQuery.sap.require("digacc.manager.test.integration.ObjectJourney");
jQuery.sap.require("digacc.manager.test.integration.NavigationJourney");
jQuery.sap.require("digacc.manager.test.integration.NotFoundJourney");
jQuery.sap.require("digacc.manager.test.integration.FLPIntegrationJourney");