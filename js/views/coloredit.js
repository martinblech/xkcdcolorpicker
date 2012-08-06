define([
    'jquery',
    'underscore',
    'backbone',
    'collections/colors',
    'bootstrap/typeahead'
], function($, _, Backbone, ColorCollection) {
  'use strict';

  var ColorEditView = Backbone.View.extend({
    el: '#params',
    
    initialize: function() {
      var typeaheadColorNames = [];
      ColorCollection.each(function(color) {
        typeaheadColorNames.push(color.get('name'));
      });
      typeaheadColorNames.sort(function(a, b) {
        return a.length - b.length;
      });
      this.nameInput = this.$('#colorname');
      this.nameInput.typeahead({
        source:typeaheadColorNames
      });
      this.rInput = this.$('#r');
      this.gInput = this.$('#g');
      this.bInput = this.$('#b');
      this.hInput = this.$('#h');
      this.sInput = this.$('#s');
      this.lInput = this.$('#l');
      this.updating = false;
      this.rgbUpdating = false;
      this.hslUpdating = false;
      this.model.on('change', this.render, this);
      this.render();
    },

    events: {
      'change #colorname': 'colorNameChanged',
      'change .hsl input': 'hslChanged',
      'change .rgb input': 'rgbChanged'
    },

    render: function() {
      if (!this.updating) {
        this.updating = true;
        this.nameInput.val(this.model.get('name'));
        if (!this.rgbUpdating) {
          this.rInput.val(this.model.get('r'));
          this.gInput.val(this.model.get('g'));
          this.bInput.val(this.model.get('b'));
        }
        if (!this.hslUpdating) {
          this.hInput.val(this.model.get('h'));
          this.sInput.val(this.model.get('s'));
          this.lInput.val(this.model.get('l'));
        }
        this.updating = false;
      }
      return this;
    },

    colorNameChanged: function() {
      var colorName = this.nameInput.val(),
        color = ColorCollection.getByName(colorName);
      if (color) {
        this.nameInput.parent('.control-group').removeClass('error');
        var attribs = {
          hex: color.get('hex'),
          name: color.get('name')
        };
        this.model.set(attribs);
      } else {
        this.nameInput.parent('.control-group').addClass('error');
      }
    },

    hslChanged: function() {
      if (!this.hslUpdating) {
        this.hslUpdating = true;
        this.model.set({
          h: parseInt(this.hInput.val(), 10),
          s: parseInt(this.sInput.val(), 10),
          l: parseInt(this.lInput.val(), 10)
        });
        this.hslUpdating = false;
      }
    },

    rgbChanged: function() {
      if (!this.rgbUpdating) {
        this.rgbUpdating = true;
        this.model.set({
          r: parseInt(this.rInput.val(), 10),
          g: parseInt(this.gInput.val(), 10),
          b: parseInt(this.bInput.val(), 10)
        });
        this.rgbUpdating = false;
      }
    }

  });

  return ColorEditView;
});
