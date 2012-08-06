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
    }
  });

  return new ColorsCollection();
});
