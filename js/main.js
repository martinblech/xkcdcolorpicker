/* Author: Martin Blech
*/
require.config({
	paths: {
		jquery: 'vendor/jquery-1.7.2',
		underscore: 'vendor/underscore-1.3.3',
		backbone: 'vendor/backbone-0.9.2',
		text: 'vendor/text-2.0.1'
	}

});
// require([
//     'jquery',
//     'underscore',
//     'backbone',
//     'text!../rgb.txt',
//     'bootstrap/typeahead'],
//     function($, _, Backbone, rgb) {
//   'use strict';
//   var colors = [],
//     typeaheadColorNames = [];
//   _.each(rgb.split('\n'), function(line) {
//     if (line) {
//       var splitLine = line.split('\t'),
//         color = {name: splitLine[0], hex: splitLine[1]};
//       colors.push(color);
//       typeaheadColorNames.push(color.name);
//     }
//   });
//   $(function() {
//     var colorRowTemplate = _.template($('#tmpl-color-row').html()),
//       tableBody = $('#similar-colors tbody'),
//       newTableBody = $('<tbody></tbody>');
//     _.each(colors, function(color) {
//       newTableBody.append(colorRowTemplate(color));
//     });
//     tableBody.replaceWith(newTableBody);
//     $('input[name="colorname"]').typeahead({
//       source:typeaheadColorNames
//     });
//   });
// });
require([
    'views/app',
    'routers/router',
    'backbone',
    'common'
], function(AppView, Workspace, Backbone, common) {
  'use strict';

  new Workspace();
  Backbone.history.start();

  new AppView();

});
