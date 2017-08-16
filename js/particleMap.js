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
  if ( typeof callback == 'function' ) { callback( particles ); return; }
  return particles;
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

  if (_this.settings.isMakeHomePositionMap) {
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
          r: filterResults.pixelChannelIntensity * gridSize,
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
