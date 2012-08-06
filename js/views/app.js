define([
    'jquery',
    'underscore',
    'backbone',
    'common',
    'views/coloredit'
], function($, _, Backbone, common, ColorEditView) {
  'use strict';

  var AppView = Backbone.View.extend({
    el: '#main',
    
    initialize: function() {
      this.currentColorDiv = this.$('#maincurrentcolor');
      this.hexCodeLabel = this.$('#hexcode');
      this.rgbCodeLabel = this.$('#rgbcode');
      this.hslCodeLabel = this.$('#hslcode');
      common.currentColor.on('change', this.updateColor, this);
      this.colorEditView = new ColorEditView({model: common.currentColor});
    },

    updateColor: function() {
      var c = common.currentColor;
      this.currentColorDiv.css('background-color', c.get('hex'));
      this.hexCodeLabel.text(c.get('hex'));
      this.rgbCodeLabel.text(c.rgbString());
      this.hslCodeLabel.text(c.hslString());
    }

  });

  return AppView;
});
