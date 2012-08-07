define([
    'underscore',
    'backbone'
], function(_, Backbone) {
  'use strict';

  function rgbToCIE_Lab(r, g, b) {
    var x, y, z;

    r /= 255;
    g /= 255;
    b /= 255;

    if (r > 0.04045) {
      r = Math.pow((r + 0.055) / 1.055, 2.4);
    } else {
      r = r / 12.92;
    }
    if (g > 0.04045) {
      g = Math.pow((g + 0.055) / 1.055, 2.4);
    } else {
      g = g / 12.92;
    }
    if (b > 0.04045) {
      b = Math.pow((b + 0.055) / 1.055, 2.4);
    } else {
      b = b / 12.92;
    }

    r = r * 100;
    g = g * 100;
    b = b * 100;

    //Observer. = 2°, Illuminant = D65
    x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    z = r * 0.0193 + g * 0.1192 + b * 0.9505;

    // x = x / 95.047;          //ref_X =  95.047   Observer= 2°, Illuminant= D65
    // y = y / 100.00;          //ref_Y = 100.000
    // z = z / 108.883;         //ref_Z = 108.883

    if (x > 0.008856) {
      x = Math.pow(x, 1 / 3);
    } else {
      x = (7.787 * x) + (16 / 116);
    }
    if (y > 0.008856) {
      y = Math.pow(y, 1 / 3);
    } else {
      y = (7.787 * y) + (16 / 116);
    }
    if (z > 0.008856) {
      z = Math.pow(z, 1 / 3);
    } else {
      z = (7.787 * z) + (16 / 116);
    }

    return {
      CIE_L: ( 116 * y ) - 16,
      CIE_a: 500 * ( x - y ),
      CIE_b: 200 * ( y - z )
    };
  }

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
            hsl = rgbToHsl(rgb.r, rgb.g, rgb.b),
            CIE_Lab = rgbToCIE_Lab(rgb.r, rgb.g, rgb.b);
        var attrs = _.extend(rgb, hsl, CIE_Lab);
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
            hsl = rgbToHsl(r, g, b),
            CIE_Lab = rgbToCIE_Lab(r, g, b);
        var attrs = _.extend(hsl, CIE_Lab, {
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
            hex = rgbToHex(rgb.r, rgb.g, rgb.b),
            CIE_Lab = rgbToCIE_Lab(rgb.r, rgb.g, rgb.b);
        var attrs = _.extend(rgb, CIE_Lab, {
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

    rgbDistanceTo: function(color) {
      var dr = this.get('r') - color.get('r'),
          dg = this.get('g') - color.get('g'),
          db = this.get('b') - color.get('b');
      return dr*dr + dg*dg + db*db;
    },

    lowcostDistanceTo: function(color) {
      // from http://www.compuphase.com/cmetric.htm
      var rmean = (this.get('r') + color.get('r')) / 2,
          r = this.get('r') - color.get('r'),
          g = this.get('g') - color.get('g'),
          b = this.get('b') - color.get('b');
      return ((512+rmean)*r*r)/256 + 4*g*g + ((767-rmean)*b*b)/256;
    },

    cielabDistanceTo: function(color) {
      var dr = this.get('CIE_L') - color.get('CIE_L'),
          dg = this.get('CIE_a') - color.get('CIE_a'),
          db = this.get('CIE_b') - color.get('CIE_b');
      return dr*dr + dg*dg + db*db;
    }

  });

  return ColorModel;
});
