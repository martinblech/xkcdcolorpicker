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

require([
    'views/app',
    'routers/router',
    'backbone',
    'common'
], function(AppView, Workspace, Backbone, common) {
  'use strict';

  var router = new Workspace();
  Backbone.history.start();

  new AppView({model: common.currentColor, router: router});

});
