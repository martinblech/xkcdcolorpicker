define([
    'underscore',
    'backbone',
    'models/color'
], function(_, Backbone, Color) {
  'use strict';

  var ColorsCollection = Backbone.Collection.extend({
    model: Color,

    initialize: function() {
      this._byName = {};
      this.on('add', function(color, _this) {
        _this._byName[color.get('name')] = color;
      });
      this.ids = {};
    },

    getByName: function(name) {
      return this._byName[name];
    },

    getSortedIdsByDistanceTo: function(color, distanceType) {
      var ds = {},
          distanceFunction;
      if (!this.ids[distanceType]) {
        this.ids[distanceType] = Object.keys(this._byId);
      }
      if (distanceType === 'rgb') {
        distanceFunction = color.rgbDistanceTo;
      } else if (distanceType === 'cielab') {
        distanceFunction = color.cielabDistanceTo;
      }
      this.each(function(c1) {
        var id = c1.id,
            d = distanceFunction.call(color, c1);
        ds[id] = d;
      });
      this.ids[distanceType].sort(function(a, b) {
        return ds[a] - ds[b];
      });
      return this.ids[distanceType];
    }
  });

  return new ColorsCollection();
});
