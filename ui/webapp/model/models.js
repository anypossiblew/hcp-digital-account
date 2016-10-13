sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/resource/ResourceModel"
], function(JSONModel, Device, ODataModel, ResourceModel) {
	"use strict";

	function extendMetadataUrlParameters(aUrlParametersToAdd, oMetadataUrlParams, sServiceUrl) {
		var oExtensionObject = {},
			oServiceUri = new URI(sServiceUrl);

		aUrlParametersToAdd.forEach(function(sUrlParam) {
			var sLanguage,
				oUrlParameters,
				sParameterValue;

			if (sUrlParam === "sap-language") {
				// for sap-language we check if the launchpad can provide it.
				oMetadataUrlParams["sap-language"] = sap.ushell.Container.getUser().getLanguage();
			} else {
				oUrlParameters = jQuery.sap.getUriParameters();
				sParameterValue = oUrlParameters.get(sUrlParam);
				if (sParameterValue) {
					oMetadataUrlParams[sUrlParam] = sParameterValue;
					oServiceUri.addSearch(sUrlParam, sParameterValue);
				}
			}
		});

		jQuery.extend(oMetadataUrlParams, oExtensionObject);
		return oServiceUri.toString();
	}

	return {
		/**
		 *
		 * @param {object} oOptions a map which contains the following parameter properties
		 * @param {string} oOptions.url see {@link sap.ui.model.odata.v2.ODataModel#constructor.sServiceUrl}.
		 * @param {object} [oOptions.urlParametersForEveryRequest] If the parameter is present in the URL or in case of language the UShell can provide it,
		 * it is added to the odata models metadataUrlParams {@link sap.ui.model.odata.v2.ODataModel#constructor.mParameters.metadataUrlParams}, and to the service url.
		 * If you provided a value in the config.metadataUrlParams this value will be overwritten by the value in the url.
		 *
		 * Example: the app is started with the url query, and the user has an us language set in the launchpad:
		 *
		 * ?sap-server=serverValue&sap-host=hostValue
		 *
		 * The createODataModel looks like this.
		 *
		 * models.createODataModel({
		 *     urlParametersToPassOn: [
		 *         "sap-server",
		 *         "sap-language",
		 *         "anotherValue"
		 *     ],
		 *     url : "my/Url"
		 * });
		 *
		 * then the config will have the following metadataUrlParams:
		 *
		 * metadataUrlParams: {
		 *     // retrieved from the url
		 *     "sap-server" : "serverValue"
		 *     // language is added from the launchpad
		 *     "sap-language" : "us"
		 *     // anotherValue is not present in the url and will not be added
		 * }
		 *
		 * @param {object} [oOptions.config] see {@link sap.ui.model.odata.v2.ODataModel#constructor.mParameters} it is the exact same object, the metadataUrlParams are enriched by the oOptions.urlParametersToPassOn
		 * @returns {sap.ui.model.odata.v2.ODataModel}
		 */
		createODataModel: function(oOptions) {
			var aUrlParametersForEveryRequest,
				oConfig,
				sUrl;

			oOptions = oOptions || {};

			if (!oOptions.url) {
				jQuery.sap.log.error("Please provide a url when you want to create an ODataModel", "digacc/manager.model.models.createODataModel");
				return null;
			}

			// create a copied instance since we modify the config
			oConfig = jQuery.extend(true, {}, oOptions.config);

			aUrlParametersForEveryRequest = oOptions.urlParametersForEveryRequest || [];
			oConfig.metadataUrlParams = oConfig.metadataUrlParams || {};

			sUrl = extendMetadataUrlParameters(aUrlParametersForEveryRequest, oConfig.metadataUrlParams, oOptions.url);

			return this._createODataModel(sUrl, oConfig);
		},

		_createODataModel: function(sUrl, oConfig) {
			return new ODataModel(sUrl, oConfig);
		},

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createFLPModel: function() {
			var bIsShareInJamActive = sap.ushell.Container.getUser().isJamActive(),
				oModel = new JSONModel({
					isShareInJamActive: bIsShareInJamActive
				});
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createResourceModel: function(sBundleName) {
			var oResourceModel = new ResourceModel({
				"bundleName": sBundleName
			});
			return oResourceModel;
		}

	};

});