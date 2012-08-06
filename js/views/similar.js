define([
    'jquery',
    'underscore',
    'backbone',
    'collections/colors',
    'bootstrap/typeahead'
], function($, _, Backbone, ColorCollection) {
  'use strict';

  var ColorEditView = Backbone.View.extend({
    el: '#similarity',
    
    initialize: function() {
      var tableContainers = this.$('.tablecontainer');
      this.scrollContainers = _.throttle(function() {
        tableContainers.each(function() {
          var tc = $(this);
          if (tc.scrollTop() > 0) {
            tc.animate({scrollTop: 0}, 'fast');
          }
        });
      }, 500);
      this.similarTBody = this.$('#similar-colors tbody');
      this.dissimilarTBody = this.$('#dissimilar-colors tbody');
      this.model.on('change', _.throttle(this.render, 100), this);
      this.render();
    },

    events: {
      'click a': 'colorPicked'
    },

    render: _.throttle(function() {
      var count = 75,
          similar = ColorCollection.getSortedIdsByDistanceTo(this.model),
          best = similar.slice(0, count),
          worst = similar.slice(similar.length - count, similar.length);
      worst.reverse();
      this.scrollContainers();
      this.updateTBody(this.similarTBody, best);
      this.updateTBody(this.dissimilarTBody, worst);
    }, 200),

    updateTBody: function(element, ids) {
      var children = element.children(),
          diff = ids.length - children.length,
          firstChild;
      while (diff > 0) {
        if (typeof firstChild === 'undefined') {
          firstChild = children.first();
        }
        element.append(firstChild.clone());
        diff--;
      }
      element.find('tr').each(function(idx) {
        var $this = $(this),
            color = ColorCollection.get(ids[idx]),
            colorName = color.get('name'),
            previewDiv = $this.find('.colorpreview');
        previewDiv.css('background-color', color.get('hex'));
        previewDiv.text(colorName);
        previewDiv.addClass('hovered').delay(1000).queue(
          function(next) {
            $(this).removeClass('hovered');
            next();
          });
        $this.find('a').attr('href', '#!/' + colorName);
      });
    },

    colorPicked: function(e) {
      var colorName = e.currentTarget.hash.split('/')[1],
          color = ColorCollection.getByName(colorName);
      e.preventDefault();
      if (color) {
        this.model.set(color.attributes);
      }
    }

  });

  return ColorEditView;
});
