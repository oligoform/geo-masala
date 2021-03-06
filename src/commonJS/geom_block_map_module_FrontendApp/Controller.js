import Marionette from 'backbone.marionette';

import defaults 				from '../geom_block_map/defaults';
import getBlocksWithDefaults 	from '../geom_block_map/functions/getBlocksWithDefaults';
import AppLayout 				from './AppLayout';
import MapView					from './views/MapView';
import FeatureCollection		from '../geom_block_map/collections/FeatureCollection';

export default class Controller extends Marionette.Object {

    onStart() {
    	this.atts = getBlocksWithDefaults( JSON.parse( this.options.element.getAttribute('data-geom-map') ) );
    	this.appLayout = new AppLayout( this.options );
        this.showMapView();
    }

    showMapView() {
		this.appLayout.getRegion('mapRegion').show( this.getMapView() );
    }

    getMapView() {
		if ( ! this.mapView || this.mapView._isDestroyed ){
			this.mapView = new MapView({
				collection: this.getFeatureCollection(),
				controls: this.atts.controls,
				mapOptions: this.atts.mapOptions,
				mapDimensions: this.atts.mapDimensions,
			});
		}
    	return this.mapView;
    }

    getFeatureCollection(){
		if ( ! this.featureCollection ){
			this.featureCollection = new FeatureCollection();
			if ( this.atts.featureIds.length ) {
				this.featureCollection.fetch({
					data: {
						include: this.atts.featureIds.join(','),
						per_page: 100,
					}
				});
			}
		}
    	return this.featureCollection;
    }

	onError( collection, response, options ) {
		if ( appDefaults.debug ) console.log( 'error', response );
	}

}
