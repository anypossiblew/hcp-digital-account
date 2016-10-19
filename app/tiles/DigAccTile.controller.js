/** Copyright © 2015 SAP SE or an affiliate company. All rights reserved. **/
( function() {
	"use strict";

	jQuery.sap.require( "sap.hana.admin.common.utils.NetUtils" );
	
	sap.ui.controller( "digital-account.app.tiles.DigAccTile", {
	    
		onInit: function() {
            sap.hana.admin.cockpit.utils.TilesHandler.addTile( this.getView() );
		},
		
		onExit: function() {
            sap.hana.admin.cockpit.utils.TilesHandler.removeTile( this.getView() );
		},

		show: function(data) {
			var oTileOverall = this.getView().oTileOverall;
			var oTileServices = this.getView().oTileServices;
			var oTileContainer = this.getView().oTileContainer;

			var oTile = this.getView().getContent()[ 0 ];

			oTile.removeAllItems();

			var tileData = data.result[ 0 ].tileData;

			oTile.addItem( oTileOverall );
			oTile.addItem( oTileServices );
			oTile.setTileSize( sap.hana.admin.cockpit.uilib.TileSize.SIZE_2x1 );

			var oOverallItem = oTileOverall.getItems()[ 0 ];

			oOverallItem.setText( sap.hana.admin.cockpit.utils.TilesHandler.getResourceBundle().getText( tileData[ 1 ].overallHealth.text ) );
			oOverallItem.setIcon( tileData[ 1 ].overallHealth.state );
            
			oTile.setSubtitle( tileData[ 0 ].numberOfHosts === 1 ? sap.hana.admin.cockpit.utils.TilesHandler.getResourceBundle().getText( "DBD_OVERALL_STATUS_HOST", tileData[ 0 ].sid ) :
			    sap.hana.admin.cockpit.utils.TilesHandler.getResourceBundle().getText( "DBD_OVERALL_STATUS_HOSTS", [ tileData[ 0 ].sid, tileData[ 0 ].numberOfHosts ] ) );

			var items = oTileServices.getItems();
			var servicesNotRunning = tileData[ 0 ].numberOfServicesNotRunning;
			items[ 0 ].setNumber( servicesNotRunning );
            if (servicesNotRunning > 0) {
    			items[ 0 ].setNumberColor( tileData[ 0 ].stateOfServicesNotRunning );            	
            }
			items[ 1 ].setNumber( tileData[ 0 ].numberOfServicesRunning );

			var alertsInfo = tileData[ 1 ].overallHealth.alertsInfo;
			if ( alertsInfo === "HIGHALERTS" ) {
			    var text = tileData[ 1 ].overallHealth.alertsCounter === 1 ? sap.hana.admin.cockpit.utils.TilesHandler.getResourceBundle().getText( "DBD_WITH_HIGH_ALERT" ) : 
			        sap.hana.admin.cockpit.utils.TilesHandler.getResourceBundle().getText( "DBD_WITH_HIGH_ALERTS", tileData[ 1 ].overallHealth.alertsCounter );
				oTileContainer.setInfo( text );
				oTileContainer.setInfoState(sap.ushell.ui.tile.State.Error);
			}
		}
		
	} );
}() );
