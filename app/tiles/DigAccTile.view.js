/** Copyright © 2015 SAP SE or an affiliate company. All rights reserved. **/
( function() {
	"use strict";

	jQuery.sap.registerModulePath( "sap.hana.admin.cockpit", "/sap/hana/admin/cockpit" );
	jQuery.sap.require( "sap.hana.admin.cockpit.utils.TilesHandler" );

	jQuery.sap.declare( "sap.hana.admin.cockpit.app.tiles.DatabaseStatusTile" );
	jQuery.sap.require( "sap.hana.admin.cockpit.uilib.StatusTile" );
	jQuery.sap.require( "sap.hana.admin.cockpit.uilib.ContainerTile" );

	sap.ui.jsview( "digital-account.app.tiles.DigAccTile", {

        oMyBtn: null,
		oTileOverall: null,
		oTileHosts: null,
		oTileContainer: null,

		getControllerName: function() {
			return "digital-account.app.tiles.DigAccTile";
		},

		createContent: function( oController ) {
			this.setHeight( "100%" );
			this.setWidth( "100%" );

            var oProps = sap.hana.admin.cockpit.utils.TilesHandler.getProps(this);
			
			this.oTileOverall = new sap.hana.admin.cockpit.uilib.StatusTile( {
				statusTileType: sap.hana.admin.cockpit.uilib.StatusTileType.SINGLE,
				items: [ new sap.hana.admin.cockpit.uilib.StatusTileItem( {
					icon: sap.hana.admin.cockpit.uilib.StatusTileIcon.BAD,
					text: sap.hana.admin.cockpit.utils.TilesHandler.getResourceBundle().getText( "DBD_NOT_RUNNING" )
				} ) ]
			} );

			this.oTileServices = new sap.hana.admin.cockpit.uilib.StatusTile( {
				items: [ new sap.hana.admin.cockpit.uilib.StatusTileItem( {
					icon: sap.hana.admin.cockpit.uilib.StatusTileIcon.NUMBER,
					number: "0",
					numberColor: sap.hana.admin.cockpit.uilib.BaseColor.NEUTRAL,
					text: sap.hana.admin.cockpit.utils.TilesHandler.getResourceBundle().getText( "DBD_NOT_RUNNING" )
				} ), new sap.hana.admin.cockpit.uilib.StatusTileItem( {
					icon: sap.hana.admin.cockpit.uilib.StatusTileIcon.NUMBER,
					number: "0",
					numberColor: sap.hana.admin.cockpit.uilib.BaseColor.NEUTRAL,
					text: sap.hana.admin.cockpit.utils.TilesHandler.getResourceBundle().getText( "DBD_RUNNING" )
				} ) ]
			} );
            
            this.oTileContainer = new sap.hana.admin.cockpit.uilib.ContainerTile(oProps);
            
			return this.oTileContainer;
		}
	} );
}() );
