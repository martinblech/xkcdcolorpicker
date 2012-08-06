define([
    'jquery',
    'underscore',
    'backbone',
    'views/coloredit',
    'views/similar'
], function($, _, Backbone, ColorEditView, SimilarView) {
  'use strict';

  var AppView = Backbone.View.extend({
    el: '#main',
    
    initialize: function() {
      this.currentColorDiv = this.$('#maincurrentcolor');
      this.hexCodeLabel = this.$('#hexcode');
      this.rgbCodeLabel = this.$('#rgbcode');
      this.hslCodeLabel = this.$('#hslcode');
      this.model.on('change', this.render, this);
      this.model.on('change', _.throttle(this.navigate, 100), this);
      this.colorEditView = new ColorEditView({model: this.model});
      this.similarView = new SimilarView({model: this.model});
      this.render();
    },

    navigate: function() {
      var url = this.model.get('name') || this.model.id;
      this.options.router.navigate(url);
    },

    render: function() {
      this.currentColorDiv.css('background-color', this.model.get('hex'));
      this.currentColorDiv.text(this.model.get('name'));
      this.currentColorDiv.addClass('hovered').delay(1000).queue(
        function(next) {
          $(this).removeClass('hovered');
          next();
        });
      this.hexCodeLabel.text(this.model.get('hex'));
      this.rgbCodeLabel.text(this.model.rgbString());
      this.hslCodeLabel.text(this.model.hslString());
      return this;
    }

  });

  return AppView;
});
