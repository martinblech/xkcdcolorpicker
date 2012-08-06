define([
    'underscore',
    'backbone'
], function(_, Backbone) {
  'use strict';

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  function hue2rgb(p, q, t){
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }

  function hexToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  function rgbToHex(r, g, b) {
    r = Math.max(0, Math.min(255, Math.floor(r)));
    g = Math.max(0, Math.min(255, Math.floor(g)));
    b = Math.max(0, Math.min(255, Math.floor(b)));
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  };

  function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
      h = s = 0; // achromatic
    }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: h*360,
      s: s*100,
      l: l*100
    };
  };

  function hslToRgb(h, s, l){
    var r, g, b;
    h /= 360;
    s /= 100;
    l /= 100;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: r*256,
      g: g*256,
      b: b*256
    };
  };

  var ColorModel = Backbone.Model.extend({
    defaults: {
      name: 'black',
      hex: '#000000',
      r: 0,
      g: 0,
      b: 0,
      h: 0,
      s: 0,
      l: 0
    },

    initialize: function() {
      this.on('change:hex', function() {
        var hex = this.get('hex'),
            rgb = hexToRGB(hex),
            hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        var attrs = _.extend(rgb, hsl);
        if (ColorModel.hexToName) {
          attrs.name = ColorModel.hexToName[hex] || '';
        }
        this.set(attrs, {silent: true});
      });
      this.on('change:r change:g change:b', function() {
        var r = this.get('r'),
            g = this.get('g'),
            b = this.get('b'),
            hex = rgbToHex(r, g, b),
            hsl = rgbToHsl(r, g, b);
        var attrs = _.extend(hsl, {
          hex: hex,
          name: ColorModel.hexToName[hex] || ''
        });
        this.set(attrs, {silent: true});
      });
      this.on('change:h change:s change:l', function() {
        var h = this.get('h'),
            s = this.get('s'),
            l = this.get('l'),
            rgb = hslToRgb(h, s, l),
            hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        var attrs = _.extend(rgb, {
          hex: hex,
          name: ColorModel.hexToName[hex] || ''
        });
        this.set(attrs, {silent: true});
      });
    },

    idAttribute: 'hex',
    
    rgbString: function() {
      return 'rgb(' + Math.floor(this.get('r')) + ', ' +
          Math.floor(this.get('g')) + ', ' +
          Math.floor(this.get('b')) + ')';
    },
    
    hslString: function() {
      return 'hsl(' + Math.floor(this.get('h')) + ', ' +
          Math.floor(this.get('s')) + '%, ' +
          Math.floor(this.get('l')) + '%)';
    },

    distanceTo: function(color) {
      var dr = this.get('r') - color.get('r'),
          dg = this.get('g') - color.get('g'),
          db = this.get('b') - color.get('b');
      return dr*dr + dg*dg + db*db;
    }

  });

  return ColorModel;
});
