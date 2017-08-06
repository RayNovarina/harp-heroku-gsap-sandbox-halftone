// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function createParticleMap( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  console.log( " ..*5) createParticleMap() for id: '" + options.id +
               "'. useTrrData: '" + _this.settings.isUseTrrData + "'. *");

  var particles = [];
  if ( _this.settings.isUseTrrData ) {
    particles = makeParticlesFromTrrMap( _this, {
      id: options.id,
      effectsDataAsJSONstring: effectsDataForRender[0].effectsDataAsJSONstring,
      particlesHomeOffsetLeft: 80,
      particlesHomeOffsetTop: 20,
    } );
  } else {
    particles = makeCartesianGridParticles( _this, {
      id: options.id,
      particlesHomeOffsetLeft: 82,
      particlesHomeOffsetTop: 20,
    } );
  }
  console.log( " ..*5a) createParticleMap() Created particles[" + particles.length + "] *");
  if ( typeof callback == 'function' ) { callback( particles ); return; }
  return particles;
}; // end: createParticleMap()

//----------------------------------------------------------------------------
function makeParticlesFromTrrMap( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  var effectsData = JSON.parse( _this.settings.effectsDataAsJSONstring );
  console.log( " ..*5.1) makeParticlesFromTrrMap() for id: " + _this.settings.id +
               ". effectsData.particles.len = " + effectsData.particles.length +
               ". effectsDataAsJSONstring.len = " + _this.settings.effectsDataAsJSONstring.length +
               ". Canvas Particles Home position Offset left: " + _this.settings.particlesHomeOffsetLeft +
               ". top: " + _this.settings.particlesHomeOffsetTop + ".");

  var particles = new Array();
  var effectsDataParticles = effectsData.particles,
      edpParticle = {},
      homeOffsetLeft = _this.settings.particlesHomeOffsetLeft,
      homeOffsetTop = _this.settings.particlesHomeOffsetTop;

  for( var i = 0; i < (effectsData.particles.length); i += 1 ) {
      edpParticle = effectsDataParticles[ i ];
      particles.push( {
          x: edpParticle.x + homeOffsetLeft,
          y: edpParticle.y + homeOffsetTop,
          r: edpParticle.r,
      });
  } //end for( var n )

  if ( typeof callback == 'function' ) { callback( particles ); return; }
  return particles;
}; // end: makeParticlesFromTrrMap()

//----------------------------------------------------------------------------
function makeCartesianGridParticles( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  console.log( " ..*5.2) makeCartesianGridParticles() for id: " + _this.settings.id +
               ". Particles Home position Offset left: " + _this.settings.particlesHomeOffsetLeft +
               ". top: " + _this.settings.particlesHomeOffsetTop +
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
               ". isRejectParticlesSameAsConversionContainerBackground: " + _this.settings.isRejectParticlesSameAsConversionContainerBackground +                 ".");

  // Create local variables to reduce loop overhead.
  var particles = [],
      homeOffsetLeft = _this.settings.particlesHomeOffsetLeft,
      homeOffsetTop = _this.settings.particlesHomeOffsetTop,
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
          y: filterResults.y+ homeOffsetTop,
          r: filterResults.pixelChannelIntensity * gridSize,
        });
      }
    } // end for (col)
  } // end for (row)

  console.log( " ..*5.2b) makeCartesianGridParticles(): END LOOP: particles[].len = " +
               particles.length + ". Out of " + maxNumOfParticles + " possible. " +
               "Particles Rejected Because Particle Is Out Of Bounds = '" +
               _this.particlesRejectedBecauseParticleIsOutOfBounds +
               "'. Particles Rejected Because Pixel Intensity Less Than Threshold = '" +
               _this.particlesRejectedBecausePixelIntensityLessThanThreshold +
               "'. Particles Rejected Because Pixel Same As Conversion Container Background RGBA = '" +
               _this.particlesRejectedBecausePixelSameAsConversionContainerBackgroundRGBA +
               "'. Particles Rejected Because Pixel Same As Conversion Container Background RGB = '" +
               _this.particlesRejectedBecausePixelSameAsConversionContainerBackgroundRGB +
               "'. Particles Rejected Because is Every Nth Pixell = '" +
               _this.particlesRejectedBecauseIsExcludedNthPixell +
               "'. Particles Rejected Because it is NOT the Nth Pixell = '" +
               _this.particlesRejectedBecauseIsExcludedNotNthPixell +
               "'. Particles Rejected Because is Non-center member of cluster. = '" +
               _this.particlesRejectedBecauseIsNonCenterMemberOfCluster +
               "'. *");
  if ( typeof callback == 'function' ) { callback( particles ); return; }
   return particles;
}; // end: makeParticles()

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

  if ( _this.settings.isRejectParticlesBelowIntensityThreshold &&
       ( pixelInfo.channelIntensity < _this.settings.pixelChannelIntensityThreshold ) ) {
    _this.particlesRejectedBecausePixelIntensityLessThanThreshold += 1;
    return { isAccepted: false };
  }

  if ( _this.settings.isRejectParticlesSameAsConversionContainerBackground &&
       ( pixelInfo.rgbString == _this.conversionContainerBackgroundRGB ) ) {
    pixelInfo.rgbaString == _this.conversionContainerBackgroundRGBA
      ? _this.particlesRejectedBecausePixelSameAsConversionContainerBackgroundRGBA += 1
      : _this.particlesRejectedBecausePixelSameAsConversionContainerBackgroundRGB += 1;
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
