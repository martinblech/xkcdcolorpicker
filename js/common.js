define([
    'underscore',
    'models/color',
    'collections/colors',
    'text!../rgb.txt'
], function(_, ColorModel, ColorsCollection, rgb) {
  'use strict';
  var hexToName = {};

  _.each(rgb.split('\n'), function(line) {
    if (line) {
      var splitLine = line.split('\t'),
          color = {name: splitLine[0], hex: splitLine[1]},
          colorModel = new ColorModel({name: color.name});
      colorModel.set({
        hex: color.hex
      });
      ColorsCollection.add(colorModel);
      hexToName[color.hex] = color.name;
    }
  });

  ColorModel.hexToName = hexToName;

  return {
    currentColor: ColorsCollection.getByName('hot pink').clone()
  }

});
