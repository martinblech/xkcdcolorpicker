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
require(['jquery', 'underscore', 'backbone', 'text!../rgb.txt'],
    function($, _, Backbone, rgb) {
  'use strict';
  _.each(rgb.split('\n'), function(line) {
    if (line) {
      var splitLine = line.split('\t'),
        color = {name: splitLine[0], hex: splitLine[1]};
      console.log(color);
    }
  });
  console.log($);
  console.log(_);
  console.log(Backbone);
});
