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
    },

    getByName: function(name) {
      return this._byName[name];
    },

    getSortedIdsByDistanceTo: function(color) {
      var ids = [],
          ds = {};
      this.each(function(c1) {
        var id = c1.id,
            d = color.distanceTo(c1);
        ids.push(id);
        ds[id] = d;
      });
      ids.sort(function(a, b) {
        return ds[a] - ds[b];
      });
      return ids;
    }
  });

  return new ColorsCollection();
});
