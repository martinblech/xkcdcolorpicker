define([
	'jquery',
	'backbone',
    'common',
    'collections/colors'
], function( $, Backbone, common, ColorsCollection) {

  var Workspace = Backbone.Router.extend({
    routes:{
      ':color': 'color'
    },
    
    color: function(colorName) {
      var color = ColorsCollection.getByName(colorName);
      if (typeof color === 'undefined') {
        color = ColorsCollection.get(colorName);
      }
      if (typeof color !== 'undefined') {
        common.currentColor.set(color.attributes);
      } else {
        if (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorName)) {
          common.currentColor.set({hex: '#' + colorName});
        } else {
          this.navigate('');
        }
      }
    }
  });

  return Workspace;
});
