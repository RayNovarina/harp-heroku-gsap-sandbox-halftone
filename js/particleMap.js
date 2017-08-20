// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function createParticleMap( _this, options, /*Code to resume when done*/ callback ) {
  //----------------------------------------------------------------------------
  createParticleMap_reset( _this );
  updateSettings( _this, options );
  console.log( " ..*5) createParticleMap() for id: '" + options.id +
               "'. useTrrData: '" + _this.settings.isUseTrrData +
               "'. RenderParticleMap: '" + _this.settings.isRenderParticleMap +
               "'. particlesHomeOffsetLeft: '" + _this.settings.particlesHomeOffsetLeft +
               "'. particlesHomeOffsetTop: '" + _this.settings.particlesHomeOffsetTop +
               "'. *");
  _this.containerBackgroundRGB = _this.imgDataBackgroundRGB;
  _this.containerBackgroundRGBA = _this.imgDataBackgroundRGBA;

  if ( _this.settings.isUseTrrData ) {
    results = makeParticlesFromTrrMap( _this, {
      id: options.id,
      effectsDataAsJSONstring: effectsDataForRender[0].effectsDataAsJSONstring,
      additionalHomeOffsetLeft: 0,
      additionalHomeOffsetTop: 0,
      isMakeHomePositionMap: true,
      isMakePooledAtBottomMap: true,
    } );
  } else {
    results = makeCartesianGridParticles( _this, {
      id: options.id,
      additionalHomeOffsetLeft: 2,
      additionalHomeOffsetTop: 0,
      isMakeHomePositionMap: true,
      isMakePooledAtBottomMap: true,
    } );
  }
  _this.particles = results.particles;
  _this.activeStory.particleMap = {
    particles: results.particles,
    gridSize: results.gridSize,
    homeOffsetLeft: results.homeOffsetLeft,
    homeOffsetTop: results.homeOffsetTop,
  };
  console.log( " ..*5a) createParticleMap() Created HomePositionParticles[" + _this.activeStory.particleMap.particles.length + "] *");
  if ( typeof callback == 'function' ) { callback( results.particles ); return; }
  return results.particles;
}; // end: createParticleMap()

//----------------------------------------------------------------------------
function makeParticlesFromTrrMap( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  var effectsData = JSON.parse( _this.settings.effectsDataAsJSONstring );
  var particles = [],
      effectsDataParticles = effectsData.particles,
      edpParticle = {},
      homeOffsetLeft = _this.settings.particlesHomeOffsetLeft + _this.settings.additionalHomeOffsetLeft,
      homeOffsetTop = _this.settings.particlesHomeOffsetTop + _this.settings.additionalHomeOffsetTop;
  console.log( " ..*5.1) makeParticlesFromTrrMap() for id: " + _this.settings.id +
               ". effectsData.particles.len = " + effectsData.particles.length +
               ". effectsDataAsJSONstring.len = " + _this.settings.effectsDataAsJSONstring.length +
               ". Canvas Particles Home position Offset left: " + _this.settings.particlesHomeOffsetLeft +
               ". top: " + _this.settings.particlesHomeOffsetTop +
               ". MakeHomePositionMap: " + _this.settings.isMakeHomePositionMap +
               ".");

  if ( _this.settings.isMakeHomePositionMap ) {
    for( var i = 0; i < (effectsData.particles.length); i += 1 ) {
      edpParticle = effectsDataParticles[ i ];
      particles.push( {
          x: edpParticle.x + homeOffsetLeft,
          y: edpParticle.y + homeOffsetTop,
          r: edpParticle.r,
      });
    } //end for( var n )
  }
  var results = {
    particles: particles,
    gridSize: null,
    homeOffsetLeft: homeOffsetLeft,
    homeOffsetTop: homeOffsetTop,
  };
  if ( typeof callback == 'function' ) { callback( results ); return; }
  return results;
}; // end: makeParticlesFromTrrMap()

//----------------------------------------------------------------------------
function makeCartesianGridParticles( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  console.log( " ..*5.2) makeCartesianGridParticles() for id: " + _this.settings.id +
               ". Particles Home position Offset left: " + _this.settings.particlesHomeOffsetLeft +
               ". top: " + _this.settings.particlesHomeOffsetTop +
               ". Particles additional Offset left: " + _this.settings.additionalHomeOffsetLeft +
               ". top: " + _this.settings.additionalHomeOffsetTop +
               ". MakeHomePositionMap: " + _this.settings.isMakeHomePositionMap +
               ". maxHalftoneDotSize: " + _this.settings.maxHalftoneDotSize +
               ". pixelChannelIntensityThreshold: " + _this.settings.pixelChannelIntensityThreshold +
               ". imageScale: " + _this.settings.imageScale +

               ". isTransformPixels: " + _this.settings.isTransformPixels +
               ". isExcludePixels: " + _this.settings.isExcludePixels +
               ". isProcessBySkipCount: " + _this.settings.isProcessBySkipCount +
               ". nthPixelToProcess: " + _this.settings.nthPixelToProcess +

               ". isProcessByCluster: " + _this.settings.isProcessByCluster +
               ". pixelsPerClusterSide: " + _this.settings.pixelsPerClusterSide +

               ". isRejectParticlesOutOfBounds: " + _this.settings.isRejectParticlesOutOfBounds +
               ". isRejectParticlesBelowIntensityThreshold: " + _this.settings.isRejectParticlesBelowIntensityThreshold +
               ". isRejectParticlesSameAsContainerBackground: " + _this.settings.isRejectParticlesSameAsContainerBackground +                 ".");

  // Create local variables to reduce loop overhead.
  var homeOffsetLeft = _this.settings.particlesHomeOffsetLeft + _this.settings.additionalHomeOffsetLeft,
      homeOffsetTop = _this.settings.particlesHomeOffsetTop + _this.settings.additionalHomeOffsetTop,
      pixelsPerCluster = _this.settings.pixelsPerCluster,
      image_width = _this.settings.img.width,
      image_heigth = _this.settings.img.height,
      diagonal = Math.sqrt( (image_width * image_width) + (image_heigth * image_heigth) ),
      gridSize = _this.settings.maxHalftoneDotSize * diagonal,
      angle = _this.settings.rgbChannelAngle,
      cosAngle = Math.cos(angle),
      sinAngle = Math.sin(angle),
      diag = Math.max( image_width, image_heigth ) * _this.ROOT_2,
      cols = Math.ceil( diag / gridSize ),
      rows = Math.ceil( diag / gridSize ),
      maxNumOfParticles =  rows * cols,
      xyOffset = ( diag - image_width ) / 2,
      halfImageWidth = image_width / 2,
      halfImageHeigth = image_heigth / 2,
      halfGridSize = 0.5 * gridSize;

  console.log( " ..*5.2a) makeCartesianGridParticles(): BEGIN LOOP: " +
               ". gridSize = " + gridSize + ". rows = " + rows +
               ". columns = " + cols + ". Max number of particles = " +
               maxNumOfParticles + ". *");

  var particles = [];
  var carryOverResults = {};

  // Calculate the "home position", i.e. the image xy of each filtered pixel.
  var isTerminateLoop = false,
      previousStartingX1 = 0;
  var previousStartingY1 = -halfGridSize;
  for ( var row = 0; row < rows; row++ ) {
    if ( isTerminateLoop) {
      break;
    }
    var y1 = previousStartingY1 + gridSize; // y1 = ( row + 0.5 ) * gridSize;
    previousStartingY1 = y1;
    previousStartingX1 = -halfGridSize; // 0.5 * gridSize
    for ( var col = 0; col < cols; col++ ) {
      var home_position_x = 0, home_position_y = 0;
      var x1 = previousStartingX1 + gridSize; // x1 = ( col + 0.5 ) * gridSize;
      previousStartingX1 = x1;
      y1 = previousStartingY1; // y1 = ( row + 0.5 ) * gridSize;
      //var x1 = 0;
      //x1 = ( col + 0.5 ) * gridSize;
      //x1 -= ( diag - image_width ) / 2;
      //x1 -= image_width / 2;
      x1 = (x1 - xyOffset) - halfImageWidth;

      //var y1 = 0;
      //y1 = ( row + 0.5 ) * gridSize;
      //y1 -= ( diag - image_heigth ) / 2;
      //y1 -= image_heigth / 2;
      y1 = (y1 - xyOffset) - halfImageWidth;

      home_position_x = x1 * cosAngle - y1 * sinAngle; // home_position_x = x1 * Math.cos(angle) - y1 * Math.sin(angle);
      home_position_y = x1 * sinAngle + y1 * cosAngle; // home_position_y = x1 * Math.sin(angle) + y1 * Math.cos(angle);
      home_position_x += halfImageWidth; // home_position_x += image_width / 2;
      home_position_y += halfImageHeigth; // home_position_y += image_heigth / 2;

      // Returns null if rejected. Else returns Particle.
      // NOTE: rejected particle locations just stay whatever the canvas
      // background/fill color is.
      var filterResults = particleFilter( _this, _this.settings.rgbChannel, home_position_x, home_position_y, carryOverResults );
      if ( filterResults.isAccepted ) {
        particles.push( {
          x: filterResults.x + homeOffsetLeft,
          y: filterResults.y + homeOffsetTop,
          // NOTE: performance tradeoff? if particle.i is stored as pixelIntensity (0-255) then Less
          // chars are stored in string so we can just multiply with the CONSTANT gridSize. BUT we
          // have the multiplication overhead. IF calc when mapped, about 20chars are stored for
          // particle.r versus 3 for particle.i
          r: (filterResults.pixelChannelIntensity * gridSize) * .5,
        });
      }
    } // end for (col)
  } // end for (row)
  var results = {
    particles: particles,
    gridSize: gridSize,
    homeOffsetLeft: homeOffsetLeft,
    homeOffsetTop: homeOffsetTop,
  };

  console.log( " ..*5.2b) makeCartesianGridParticles(): END LOOP: HomePositionParticles[].len = " +
               particles.length + ". Out of " + maxNumOfParticles + " possible. " +
               "Particles Rejected Because Particle Is Out Of Bounds = '" +
               _this.particlesRejectedBecauseParticleIsOutOfBounds +
               "'. Particles Rejected Because Pixel Intensity Less Than Threshold = '" +
               _this.particlesRejectedBecausePixelIntensityLessThanThreshold +
               "'. Particles Rejected Because Pixel Same As Conversion Container Background RGBA = '" +
               _this.particlesRejectedBecausePixelSameAsContainerBackgroundRGBA +
               "'. Particles Rejected Because Pixel Same As Conversion Container Background RGB = '" +
               _this.particlesRejectedBecausePixelSameAsContainerBackgroundRGB +
               "'. Particles Rejected Because is Every Nth Pixell = '" +
               _this.particlesRejectedBecauseIsExcludedNthPixell +
               "'. Particles Rejected Because it is NOT the Nth Pixell = '" +
               _this.particlesRejectedBecauseIsExcludedNotNthPixell +
               "'. Particles Rejected Because is Non-center member of cluster = '" +
               _this.particlesRejectedBecauseIsNonCenterMemberOfCluster +
               "'. Particles Rejected Because PixelIndex Is Out Of Bounds = '" +
               _this.particlesRejectedBecausePixelIndexIsOutOfBounds +
               "'. *");

  if ( typeof callback == 'function' ) { callback( results ); return; }
  return results;
}; // end: makeParticles()

/* per: https://en.wikipedia.org/wiki/RGBA_color_space
RGBA stands for red green blue alpha. While it is sometimes described as a color
space, it is actually simply a use of the RGB color model, with extra alpha
channel information. The color is RGB, and may belong to any RGB color space,
but an integral alpha value as invented by Catmull and Smith between 1971 and
1972 enables alpha compositing. The inventors named alpha after the Greek letter
in the classic linear interpolation formula α A + (1 − α) B.

The alpha channel is normally used as an opacity channel. If a pixel has a value
of 0% in its alpha channel, it is fully transparent (and, thus, invisible),
whereas a value of 100% in the alpha channel gives a fully opaque pixel
(traditional digital images). Values between 0% and 100% make it possible for
pixels to show through a background like a glass, an effect not possible with
simple binary (transparent or opaque) transparency. It allows easy image
compositing.

The 80 hex value, which is 128 in decimal, represents a 50.2% alpha value
because 128 is approximately 50.2% of the maximum value of 255 (FF hex)

The traditional halftone process converts different tones into dots of varying
size. The size of the dot behind each grid square is proportional to the
intensity of the light falling on it. Therefore the tones of the original
photograph are converted to dots of varying size on the high contrast film.

// using glfx.js at https://github.com/evanw/glfx.js
// demo tools at: https://github.com/evanw/webgl-filter/blob/master/www/script.js
//        and at: http://evanw.github.io/webgl-filter/
canvas.draw(texture).dotScreen(this.center.x, this.center.y, this.angle, this.size).update();
*/

/*
window.$canvas = $('#portrait-canvas')

window.canvas = document.getElementById('portrait-canvas')
    <canvas id="portrait-canvas" width="2000" height="1000">
window.canvas.width
  2000

window.ctx = window.canvas.getContext("2d")
  CanvasRenderingContext2D { canvas: <canvas#portrait-canvas>, mozCurrentTransform: Array[6], mozCurrentTransformInverse: Array[6], mozTextStyle: "10px sans-serif", mozImageSmoothingEnabled: true, globalAlpha: 1, globalCompositeOperation: "source-over", strokeStyle: "#000000", fillStyle: "#0098ce", filter: "none" }

window.imgData = window.ctx.getImageData(0,0,2000,1000)
  ImageData { width: 2000, height: 1000, data: Uint8ClampedArray[8000000] }

window.imgDataArray = window.imgData.data
  Uint8ClampedArray [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7999990 more… ]

window.imgDataArray = window.ctx.getImageData(0,0,2000,1000).data

window.imagDataArray_json = JSON.stringify(window.imgDataArray)
window.arr = window.imgDataArray

window.arr0to100k =

$(window.arr.slice(0,100000))
  Object [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99990 more… ]

  JSON.stringify(window.test)
  "[0,1,2,3]"
  window.JSON.arr0to100k = JSON.stringify(window.arr0to100k)
  "{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0,"37":0,"38":0,"39":0,"40":0,"41":0,"42":0,"43":0,"44":0,"45":0,"46":0,"47":0,"48":0,"49":0,"50":0,"51":0,"52":0,"53":0,"54":0,"55":0,"56":0,"57":0,"58":0,"59":0,"60":0,"61":0,"62":0,"63":0,"64":0,"65":0,"66":0,"67":0,"68":0,"69":0,"70":0,"71":0,"72":0,"73":0,"74":0,"75":0,"76":0,"77":0,"78":0,"79":0,"80":0,"81":0,"82":0,"83":0,"84":0,"85":0,"86":0,"87":0,"88":0,"89":0,"90":0,"91":0,"92":0,"93":0,"94":0,"95":0,"96":0,"97":0,"98":0,"99":0,"100":0,"101":0,"102":0,"103":0,"104":0,"105":0,"106":0,"107":0,"108":0,"109":0,"110":0,"111":0,"112":0,"113":0,"114":0,"115":0,"116":0,"117":0,"118":0,"119":0,"120":0,"121":0,"122":0,"123":0,"124":0,"125":0,"126":0,"127":0,"128":0,"129":0,"130":0,"131":0,"132":0,"133":0,"134":0,"135":0,"136":0,"137":0,"138""[…]

  window.$canvas = $('#portrait-canvas')

  window.canvas = document.getElementById('portrait-canvas')
      <canvas id="portrait-canvas" width="2000" height="1000">
  window.canvas.width
    2000

  window.ctx = document.getElementById('portrait-canvas').getContext("2d")

  Chrome/Firefox snippet to add console.save to file feature:
  http://bgrins.github.io/devtools-snippets/#console-save

  window.imgDataArray = window.ctx.getImageData(0,0,2000,1000).data
  console.save(data, [filename])

  //---------------
  www/script.js
  line: 381
  $('#save').click(function() {
      window.open(canvas.toDataURL('image/png'));
      // change to: (per: https://github.com/evanw/webgl-filter/issues/4)
      window.open(canvas.update().toDataURL('image/png'));
  });
 */
//----------------------------------------------------------------------------
function particleFilter( _this, rgbChannel, x, y, carryOverResults ) {
  //----------------------------------------------------------------------------
  if (_this.settings.imageScale !== 1.0 ) {
      x = Math.round( x / _this.settings.imageScale);
      y = Math.round( y / _this.settings.imageScale);
  } else {
    x = Math.round( x );
    y = Math.round( y );
  }

  if ( _this.settings.isRejectParticlesOutOfBounds &&
       ( x < 0 || x > _this.settings.img.width ||
         y < 0 || y > _this.settings.img.height ) ) {
    _this.particlesRejectedBecauseParticleIsOutOfBounds += 1;
    return { isAccepted: false };
  }

  if ( _this.settings.isProcessByCluster ) {
    return particleFilterByCluster( _this, rgbChannel, x, y, carryOverResults );
  }

  // isProcessBySkipCount
  if ( _this.settings.nthPixelToProcess > 1 ) {
    // Not every pixel is to be looked at.
    // Reject (if isExcludePixels) or accept (if isTransformPixels) every nth pixel.
    if ( y % _this.settings.nthPixelToProcess == 0 &&
         x % _this.settings.nthPixelToProcess == 0 ) {
      // _this is the nth pixel.
      if ( _this.settings.isExcludePixels ) {
        _this.particlesRejectedBecauseIsExcludedNthPixell += 1;
        return { isAccepted: false };
      }
    // Else _this is not the nth pixel.
    } else if ( _this.settings.isTransformPixels ) {
      // And we are only accepting the nth pixel.
      _this.particlesRejectedBecauseIsExcludedNotNthPixell += 1;
      return { isAccepted: false };
    }

    if ( _this.settings.isExcludePixels ) {
      // Reject every nth pixel.
      if ( y % _this.settings.nthPixelToProcess == 0 &&
           x % _this.settings.nthPixelToProcess == 0 ) {
        _this.particlesRejectedBecauseIsExcludedNthPixell += 1;
        return { isAccepted: false };
      }
    }  else { // isTransformPixels
      // Keep processing every nth pixel.

    }
  }
  // We are processing every pixel that gets here.
  var pixelInfo = getPixelInfo( _this, x, y, rgbChannel );
  if ( pixelInfo == null ) {
    _this.particlesRejectedBecausePixelIndexIsOutOfBounds += 1;
    return { isAccepted: false };
  }

  if ( _this.settings.isRejectParticlesBelowIntensityThreshold &&
       ( pixelInfo.channelIntensity < _this.settings.pixelChannelIntensityThreshold ) ) {
    // pixelChannelIntensityThreshold: 0.05
    _this.particlesRejectedBecausePixelIntensityLessThanThreshold += 1;
    return { isAccepted: false };
  }

  if ( _this.settings.isRejectParticlesSameAsContainerBackground &&
       ( pixelInfo.rgbString == _this.containerBackgroundRGB ) ) {
    _this.particlesRejectedBecausePixelSameAsContainerBackgroundRGB += 1;
    if ( pixelInfo.rgbaString == _this.containerBackgroundRGBA ) {
      _this.particlesRejectedBecausePixelSameAsContainerBackgroundRGBA += 1;
    }
    return { isAccepted: false };
  }

  return {
    isAccepted: true,
    x: x,
    y: y,
    pixelChannelIntensity: pixelInfo.channelIntensity,
  };
}; // end particleFilter()

//----------------------------------------------------------------------------
function particleFilterByCluster( _this, rgbChannel, x, y, carryOverResults ) {
  //--------------------------------------------------------------------------
  // _this.settings.pixelsPerClusterSide
  return { isAccepted: true };
  //if ( 2 == 0 ) {
  //  _this.particlesRejectedBecauseIsNonCenterMemberOfCluster += 1;
  //  return { isAccepted: true };
  //}
}; // end particleFilterByCluster()

//----------------------------------------------------------------------------
function getPixelInfo( _this, x, y, rgbChannel ) {
  //--------------------------------------------------------------------------
  // _this.imgData Is a Uint8ClampedArray representing a one-dimensional
  // array containing the data in the RGBA order, with integer values between
  // 0 and 255 (included). sarah.jpg imgData.len = '582400'
  var pixelIndex = ( x + y * _this.settings.img.width ) * 4;
  // NOTE: we have seen out of boundary data.
  if ( pixelIndex - 4 > _this.imgData.length ) {
    return null;
  }
  var pixelChannelValue = rgbChannel === 'lum'
        ? _this.getPixelLum( pixelIndex )
        : _this.imgData[ pixelIndex + _this.settings.rgbChannelOffset ]; // get the 'blue' value of the rgba item.
  pixelChannelValue =  1 - (pixelChannelValue / 255);
  return {
    channelIntensity: pixelChannelValue,
    rgbaString: pixelToRgbxString( _this.imgData, pixelIndex, true ),
    rgbString: pixelToRgbxString( _this.imgData, pixelIndex, false ),
  };
}; // end getPixelChannelIntensity()

//----------------------------------------------------------------------------
function getPixelLum( _this, pixelIndex ) {
  //----------------------------------------------------------------------------
  var r = _this.imgData[ pixelIndex + 0 ] / 255;
  var g = _this.imgData[ pixelIndex + 1 ] / 255;
  var b = _this.imgData[ pixelIndex + 2 ] / 255;
  var max = Math.max( r, g, b );
  var min = Math.min( r, g, b );
  return ( max + min ) / 2;
}; // end getPixelLum()

//----------------------------------------------------------------------------
function createParticleMap_reset( _this ) {
  //----------------------------------------------------------------------------
  if ( _this.particles !== 'undefined' ) {
    _this.particles = [];
  }
}; // end createParticleMap_reset()
