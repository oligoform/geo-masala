import L from 'leaflet';
require('leaflet-toolbar');

let EditDrawAction = L.Toolbar2.Action.extend({
	options: {
		toolbarIcon: {
			className: 'leaflet-draw-edit-edit',
			tooltip: 'Edit Shape',
		}
	},
	initialize: function (map, shape, options) {
		this._map = map;
		this._shape = shape;
		this._shape.options.editing = this._shape.options.editing || {};
		L.Toolbar2.Action.prototype.initialize.call(this, map, options);
	},
	enable: function (e) {
		if ( e ) e.preventDefault();
		let map = this._map;
		let shape = this._shape;
		shape.editing.enable();
		map.removeLayer(this.toolbar);
		map.on('click', function () {
			this.save();
			shape.editing.disable();
		}, this);
	},
	save: function() {
		var map = this._map,
		shape = this._shape;
		if (shape.edited) {
			map.fire(L.Draw.Event.EDITED, { layer: shape });
		}
		shape.edited = false;
	}
});


export default EditDrawAction;