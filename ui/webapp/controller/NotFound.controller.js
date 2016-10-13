sap.ui.define([
	"digacc/manager/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("digacc.manager.controller.NotFound", {

		/**
		 * Navigates to the worklist when the link is pressed
		 * @public
		 */
		onLinkPressed: function() {
			this.getRouter().navTo("worklist");
		}

	});

});