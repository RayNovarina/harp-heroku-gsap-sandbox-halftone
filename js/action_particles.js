// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function particles( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  if (_this.logging){console.log( " ..*4.1) particles() for active story '" + _this.activeStory.tag +
               "'. ParticlesFromPhoto: '" +  _this.settings.isParticlesFromPhoto +
               "'. ParticlesFromFile: '" +  _this.settings.isParticlesFromFile +
               "'. RenderParticleMap: '" + _this.settings.isRenderParticleMap + "'. *");}

  getParticles( _this, options, _this.activeStory,
  /*1-Resume here when done*/ function( particlesInfo ) {

  // Optionally display particles in Panel specified by options (now in .settings).
  if ( !_this.settings.isRenderParticleMap ) {
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }

  // Hide the active/visible sceneContainer.
  closeActiveSceneContainer( _this,
  /*2-Resume here when done*/ function( activeScene ) {
  options.sceneTag = 'particles';
  createScene( _this, {
    id: _this.activeStory.tag + '_particleMap',
    sceneTag: options.sceneTag,
    panel: settingsToPanel( _this ),
    createContainerParams: {
      width: _this.settings.img.width + 8,
      height: _this.settings.img.height,
      offsetX: 0,
      offsetY: 0,
      backgroundColor: _this.defaults.sceneBackgroundColor, //  '#E7F1F7', Climate Corp "halftone background blue"
      border: '',
    },
    createAnimationElementsParams: {
      method: 'renderParticleMapAsSingleCanvas',
      offsetX: 0,
      offsetY: 0,
    },
  },
  /*3-Resume here when done*/ function( activeScene ) {
  if ( typeof callback == 'function' ) { callback( activeScene ); return; }
  return activeScene;
  /*3-*/});/*2-*/});/*1-*/});
};// end: particles()

//----------------------------------------------------------------------------
function getParticles( _this, options, story, callback ) {
  //----------------------------------------------------------------------------
  _this.settings.getParticlesMethod = _this.settings.isParticlesFromFile
        ? 'getParticlesFromDataFile' : 'getParticlesFromImage';

  if (_this.logging){console.log( " ..*4.1) getParticles() for story '" + story.tag +
               "'. getParticlesMethod: '" + _this.settings.getParticlesMethod + "'. *");}

  if ( _this.settings.isOnlyIfNewParticleMap &&
       _this.activeStory.particlesInfo.particles &&
       _this.activeStory.particlesInfo.particles.numParticles > 0 ) {
    if (_this.logging){console.log( " ..*4.1a) getParticles() OnlyIfNewParticleMap: True. Ignored, " +
                 "we already have a particleMap with '" + _this.activeStory.particlesInfo.particles.numParticles + "' particles. *");}
    // We are going to reuse these particles, reset pointers.
    _this.activeStory.particlesInfo.nextIndex = 0;
    if ( typeof callback == 'function' ) { callback( _this.activeStory.particlesInfo ); return; }
    return _this.activeStory.particlesInfo;
  }

  window[ _this.settings.getParticlesMethod ]( _this, options, _this.activeStory,
  /*1-Resume here when done*/ function( particlesInfo ) {
  _this.activeStory.particlesInfo = particlesInfo;

  if ( typeof callback == 'function' ) { callback( particlesInfo ); return; }
  return particlesInfo;
  /*1-*/});
};// end: getParticles()

//----------------------------------------------------------------------------
function getParticlesFromImage( _this, options, story, callback ) {
  //----------------------------------------------------------------------------
  _this.settings.createParticlesInfoMethod = 'createParticlesInfoFromImageDataObj';
  if (_this.logging){console.log( " ..*4.1) getParticlesFromImage() for active story '" + _this.activeStory.tag +
               "'. By converting photo file: '" + _this.settings.img.src +
               "'. Using createParticlesInfoMethod: '" + _this.settings.createParticlesInfoMethod + "'. *");}

  getImgData( _this,
  /*1-Resume here when done*/ function( imgDataObj ) {
  _this.activeStory.image.ctxImgData = imgDataObj.data;
  window[ _this.settings.createParticlesInfoMethod ]( _this, options, imgDataObj,
  /*2-Resume here when done*/ function( particlesInfo ) {
  if ( typeof callback == 'function' ) { callback( particlesInfo ); return; }
  return particlesInfo;
  /*2-*/});/*1-*/});
}; // end getParticlesFromImage()

//----------------------------------------------------------------------------
function createParticlesInfoFromImageDataObj( _this, options, imgDataObj, callback ) {
  if (_this.logging){console.log( " ..*4.1) createParticlesInfoFromImageDataObj() *");}
  // Create particle array by selecting pixels we want for a halftone image.
  createParticleMap( _this, {
    id: _this.activeStory.tag + '_particleMap',
    sceneTag: _this.settings.sceneTag,
    particlesHomeOffsetLeft: 0,
    particlesHomeOffsetTop: 0,
  },
  /*1-Resume here when done*/ function( particles ) {
  var particlesInfo = {
    source: 'image',
    particles: particles,
    particles: {
      type: 'HashArray',
      obj: particles,
    },
    numParticles: particles.length,
    eof: particles.length - 1,
    nextIndex: 0,
    nextParticleMethod: 'nextParticleFromHashArray',
  };
  if ( typeof callback == 'function' ) { callback( particlesInfo ); return; }
  return particlesInfo;
  /*1-*/});
}; // end createParticlesInfoFromImageDataObj()

//----------------------------------------------------------------------------
function getParticlesFromDataFile( _this, options, story, callback ) {
  //----------------------------------------------------------------------------
  // NOTE: .js file contains a string that was evaluated by javascript when the
  // file loaded. Example:
  //    var laura_particles_data='{"tag":"laura","type":"HashArray","data":[{"x":22,"y":580,"r":2.8062433825913184}]}';

  var particles_data_file_var =
      ( _this.activeStory.tag == 'laura' ) ? laura_particles_data
    : ( _this.activeStory.tag == 'chris' ) ? chris_particles_data
    : ( _this.activeStory.tag == 'gary')   ? gary_particles_data
    :                                        curt_particles_data;

  // NOTE: particles_data_file_var NOW = JSON String as follows:
  // {"tag":"laura","type": "HashArray","data":[{"x":22,"y":580,"r":2.8062433825913184}]}
  particles_data_file_var = JSON.parse( particles_data_file_var );
  // NOTE: particles_data_file_contents NOW = hash object as follows:
  // { tag:  "laura",
  //   type: "HashArray",
  //   data: "[ {x:22,y:580,r:2.8062433825913184} ]"
  // }
  // NOTE: particles_data_file_contents.data = javascript object of type array of hashes.

   _this.settings.createParticlesInfoMethod =
            particles_data_file_var.type == 'HashArray' ? 'createParticlesInfoFromDataTypeHashArray'
          : particles_data_file_var.type == 'Array'     ? 'createParticlesInfoFromDataTypeArray'
          :                                                    'createParticlesInfoFromDataTypeString';

  if (_this.logging){console.log( " ..*4.1) getParticlesFromDataFile() for active story '" + _this.activeStory.tag +
               "'. From data file: '" + _this.activeStory.tag + "_particles_data" +
               "'. Using createParticlesInfoMethod: '" + _this.settings.createParticlesInfoMethod + "'. *");}

  window[ _this.settings.createParticlesInfoMethod ]( _this, options, particles_data_file_var,
  /*1-Resume here when done*/ function( particlesInfo ) {
  if ( typeof callback == 'function' ) { callback( particlesInfo ); return; }
  return particlesInfo;
  /*1-*/});
}; // end getParticlesFromDataFile()

//----------------------------------------------------------------------------
function createParticlesInfoFromDataTypeHashArray( _this, options, data_file_var, callback ) {
  //----------------------------------------------------------------------------
  if (_this.logging){console.log( " ..*4.1) createParticlesInfoFromDataTypeHashArray() *");}
  // TypeHashArray: convert from JSON string of hash objects. Each hash object
  // already is of our format pixel(x,y,r), so nothing more to reformat.
  var particlesHashArray = data_file_var.data;
  var particlesInfo = {
    source: 'file',
    particles: {
      type: 'HashArray',
      obj: particlesHashArray,
    },
    numParticles: particlesHashArray.length,
    eof: particlesHashArray.length - 1,
    nextIndex: 0,
    nextParticleMethod: 'nextParticleFromHashArray',
  };
  if ( typeof callback == 'function' ) { callback( particlesInfo ); return; }
  return particlesInfo;
}; // createParticlesInfoFromDataTypeHashArray()

//----------------------------------------------------------------------------
function createParticlesInfoFromDataTypeArray( _this, options, data_file_var, callback ) {
  //----------------------------------------------------------------------------
  if (_this.logging){console.log( " ..*4.1) createParticlesInfoFromDataTypeArray() *");}
  // TypeArray: convert from JSON string of array items. Each pixel has three
  // array items for r,g,b values.
  var particlesArray = JSON.parse( data_file_var.data );
  var numParticles = particlesArray.length / 3;
  var particlesInfo = {
    source: 'image',
    particles: {
      type: 'Array',
      obj: particlesArray,
    },
    numParticles: numParticles,
    eof: numParticles - 1,
    nextIndex: 0,
    nextParticleMethod: 'nextParticleFromArray',
  };
  if ( typeof callback == 'function' ) { callback( particlesInfo ); return; }
  return particlesInfo;
}; // createParticlesInfoFromDataTypeArray()

//----------------------------------------------------------------------------
function createParticlesInfoFromDataTypeString( _this, options, data_file_var, callback ) {
  //----------------------------------------------------------------------------
  if (_this.logging){console.log( " ..*4.1) createParticlesInfoFromDataTypeString() *");}
  // TypeArray: convert from JSON string of pixel r,g,b values. Each value is
  // separated by a space.
  var particlesArray = JSON.parse( data_file_var.data ).split(' ');
  var numParticles = particlesArray.length / 3;
  var particlesInfo = {
    source: 'image',
    particles: {
      type: 'String',
      obj: particlesArray,
    },
    numParticles: numParticles,
    eof: numParticles - 1,
    nextIndex: 0,
    nextParticleMethod: 'nextParticleFromArray',
  };
  //  nextParticleMethod: 'nextParticleFromString',
  if ( typeof callback == 'function' ) { callback( particlesInfo ); return; }
  return particlesInfo;
}; // createParticlesInfoFromDataTypeString()

//----------------------------------------------------------------------------
function getNextParticle(_this, options ) {
  //----------------------------------------------------------------------------
  var particle = null,
      particleProps = null,
      pcb = _this.activeStory.particlesInfo;
  if ( !(pcb.eof == -1) &&
       ( (pcb.nextIndex == 0) || !(pcb.nextIndex == pcb.eof) ) ) {
    particleProps = window[ pcb.nextParticleMethod ]( _this, options, pcb );
    pcb.nextIndex += 1;
    particle = {
      props: particleProps,
    };
  }
  return particle;
}; // end getNextParticle()

//----------------------------------------------------------------------------
function nextParticleFromHashArray( _this, options, pcb ) {
  //----------------------------------------------------------------------------
  return pcb.particles.obj[ pcb.nextIndex ];
}; // end nextParticleFromHashArray()

//----------------------------------------------------------------------------
function nextParticleFromArray( _this, options, pcb ) {
  //----------------------------------------------------------------------------

}; // end nextParticleFromArray()

//----------------------------------------------------------------------------
function nextParticleFromString( _this, options, pcb ) {
  //----------------------------------------------------------------------------

}; // end nextParticleFromString()

//----------------------------------------------------------------------------
function renderParticleMapAsSingleCanvas( _this, options, callback ) {
  //----------------------------------------------------------------------------
  updateSettings( _this, options );
  var sceneContainerElem = _this.activeScene.container.html.elem,
      $sceneContainerElem = $( sceneContainerElem ),
      elementsContainer = _this.activeScene.animationElements.container,
      imageElem = _this.activeStory.image.html.elem;
  if (_this.logging){console.log( " ..*5b.1) renderParticleMapAsSingleCanvas(): For Particles[].len = " + _this.activeStory.particlesInfo.numParticles + ". *");}

  elementsContainer.html = {
    elem: $( document.createElement( "div" ) )
      .attr( 'id', 'aniElems_Con_' )
      .attr( 'width', '600px' )
      .attr( 'height', '600px' )
      .attr( 'trr-ani-elem-type', 'canvas' )
      .addClass( 'trr-ani-elems-container' ),
    string: '',
  };

  var elementsContainerElem = elementsContainer.html.elem,
      $elementsContainerElem = $( elementsContainerElem ),
      numElements = 0;

  // attach to specified Panel.
  $( _this.centerPanel ).children().last().append( elementsContainerElem );
  // make our container visible before we start filling it up.
  openSceneContainer( _this, _this.activeScene );

  var canvasAndCtx = makeCanvasAndCtx(),
      canvas = canvasAndCtx.canvas,
      context = canvasAndCtx.ctx;
  canvas.width = imageElem.width;
  canvas.height = imageElem.height;
  context.clearRect( 0, 0, canvas.width, canvas.height );
  context.fillStyle = '#E7F1F7'; // 'white'; #E7F1F7; /* Climate Corp "halftone background blue" */
  context.fillRect( 0, 0, canvas.width, canvas.height );

  // Recreate photo via particles[].
  //
  // Place every particle in its home position on a white background.
  // Write a halftone ball with the specified radius (which was calculated
  // as bigger for lower intensity particles).
  context.fillStyle = _this.settings.particleMapAnimationElementColor;
  //var results = null; // context or null if end of file;
  while ( createExpandedPositionCanvasCircle( _this, options, context ) ) {
    // Just keep drawing circles on single canvas.context
  }; // end while ( results )
  // Resume here when all circles drawn.
  $elementsContainerElem.append( canvas );
  numElements += 1;

  var results = {
    animationElementsContainerElem: elementsContainerElem,
    domElementsObjsArray: [ document.createElement( 'canvas' ) ], // just a required placeholder.
    timelineProps: null,
  };
  if (_this.logging){console.log( " ..*5b.2) renderParticleMapAsSingleCanvas(): Made " + numElements +
               " canvas AnimationElements. *");}
  if ( typeof callback == 'function' ) { callback( results ); return; }
  return results;
}; // end renderParticleMapAsSingleCanvas()

//----------------------------------------------------------------------------
function createExpandedPositionCanvasCircle( _this, options, context ) {
  //----------------------------------------------------------------------------
  var results = null,
      particle = null;
  if ( (particle = getNextParticle( _this, options )) ) {
    // Create canvas circle at 'home position' which will recreate the photo image.
    context.beginPath();
    context.arc(
          particle.props.x, // + animationElementOffsetX, // NOTE: already adjusted when mapped.
          particle.props.y, // + animationElementOffsetY, // NOTE: already adjusted when mapped.
          // NOTE: performance tradeoff? if particle.i is stored as pixelIntensity (0-255) then Less
          // chars are stored in string so we can just multiply with the CONSTANT gridSize. BUT we
          // have the multiplication overhead. IF calc when mapped, about 20chars are stored for
          // particle.r versus 3 for particle.i
          particle.props.r, // * gridSize, // not needed, already adjusted when mapped.
          0, _this.TAU );
      context.fillStyle = particle.props.c || _this.settings.particleMapAnimationElementColor;
      context.fill();
      context.closePath();
    results = {};
  }
  return results;
}; // end createExpandedPositionCanvasCircle()
