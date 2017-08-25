// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function particles( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  options.sceneTag = 'particles';
  particles_reset( _this, { sceneTag: options.sceneTag } );
  updateSettings( _this, options );
  console.log( " ..*4.1) particles() " + "'. RenderParticleMap: '" + _this.settings.isRenderParticleMap +
               "' for active story '" + _this.activeStory.tag +
               "'. isOnlyIfNewParticleMap: '" + _this.settings.isOnlyIfNewParticleMap + "' *");

  if ( _this.settings.isOnlyIfNewParticleMap &&
       _this.activeStory.particleMap.particles &&
       _this.activeStory.particleMap.particles.length > 0 ) {
    console.log( " ..*4.1a) particles() OnlyIfNewParticleMap: Ignored, " +
                 "we already have a particleMap with '" + _this.activeStory.particleMap.particles.length + "' particles. *");
    //if ( typeof callback == 'function' ) { callback( _this.activeScene ); return; }
    //return _this.activeScene;
  }

  // Create particle array by selecting pixels we want for a halftone image.
  createParticleMap( _this, {
    id: _this.activeStory.tag + '_particleMap',
    isRejectParticlesOutOfBounds: true,
    isRejectParticlesBelowIntensityThreshold: true,
    isRejectParticlesSameAsContainerBackground: true,
    sceneTag: options.sceneTag,
    particlesHomeOffsetLeft: 0,
    particlesHomeOffsetTop: 0,
  },
  /*1-Resume here when done*/ function( particles ) {
  // Optionally display particles in Panel specified by options (now in .settings).
  createScene( _this, {
    id: _this.activeStory.tag + '_particleMap',
    sceneTag: options.sceneTag,
    panel: settingsToPanel( _this ),
    createContainerParams: {
      width: _this.settings.img.width + 8,
      height: _this.settings.img.height,
      left: 0,
      top: 0,
      backgroundColor: _this.defaults.sceneBackgroundColor, //  '#E7F1F7', Climate Corp "halftone background blue"
      border: '',
    },
    createAnimationElementsParams: {
      method: 'renderParticleMapAsSingleCanvas',
      offsetX: 0,
      offsetY: 0,
    },
  },
  /*2-Resume here when done*/ function( activeScene ) {
  if ( typeof callback == 'function' ) { callback( activeScene ); return; }
  return activeScene;
  /*2-*/});/*1-*/});
};// end: particles()

//----------------------------------------------------------------------------
function particles_reset( _this, options ) {
  //----------------------------------------------------------------------------
  if ( _this.settings == 'undefined' ) {
    // onDomReady() init.
  } else {
    _this.particles = [];
    _this.settings.rgbChannel = 'blue'; // _this.settings.halftoneColor
    _this.particlesRejectedBecauseParticleIsOutOfBounds = 0;
    _this.particlesRejectedBecausePixelIntensityLessThanThreshold = 0;
    _this.particlesRejectedBecausePixelSameAsContainerBackgroundRGB = 0;
    _this.particlesRejectedBecausePixelSameAsContainerBackgroundRGBA = 0;
    _this.particlesRejectedBecauseIsExcludedNthPixell = 0;
    _this.particlesRejectedBecauseIsExcludedNotNthPixell = 0;
    _this.particlesRejectedBecauseIsNonCenterMemberOfCluster = 0;
    _this.particlesRejectedBecausePixelIndexIsOutOfBounds = 0;
    _this.settings.rgbChannelOffset = _this.RGB_CHANNEL_OFFSETS[ _this.settings.rgbChannel ];
    _this.settings.rgbChannelAngle = _this.RGB_CHANNEL_ANGLES[ _this.settings.rgbChannel ];
  }
}; // end: particles_reset()

//----------------------------------------------------------------------------
function renderParticleMapAsSingleCanvas( _this, options, callback ) {
  //----------------------------------------------------------------------------
  var particleAnimationElementMethod = '',
      particles = _this.activeStory.particleMap.particles,
      gridSize = _this.activeStory.particleMap.gridSize,
      sceneContainerElem = _this.activeScene.container.html.elem,
      $sceneContainerElem = $( sceneContainerElem ),
      elementsContainer = _this.activeScene.animationElements.container,
      imageElem = _this.activeStory.image.html.elem,
      animationElementOffsetX = _this.settings.createAnimationElementsParams.offsetX,
      animationElementOffsetY = _this.settings.createAnimationElementsParams.offsetY,
      domElementsObjsArray = [];
  console.log( " ..*5b.1) renderParticleMapAsSingleCanvas(): For Particles[].len = " + particles.length + ". *");

  elementsContainer.html = {
    elem: $( document.createElement( "div" ) )
      .attr( 'id', 'aniElems_Con_' )
      .attr( 'width', '589px' )
      .attr( 'height', '600px' )
      .attr( 'trr-ani-elem-type', 'canvas' )
      .addClass( 'trr-ani-elems-container' ),
    string: '',
  };
  var elementsContainerElem = elementsContainer.html.elem,
      $elementsContainerElem = $( elementsContainerElem );

  // attach to specified Panel.
  $( _this.centerPanel ).children().last().append( elementsContainerElem );
  // Assume activeScene container was made invisible in our _reset() and
  // make our container visible before we start filling it up.
  openSceneContainer( _this, _this.activeScene );

  var numElements = 1,
      canvasAndCtx = makeCanvasAndCtx(),
      canvas = canvasAndCtx.canvas,
      context = canvasAndCtx.ctx,
      element = canvas;
  canvas.width = imageElem.width;
  canvas.height = imageElem.height;
  context.clearRect( 0, 0, canvas.width, canvas.height );
  context.fillStyle = '#E7F1F7'; // 'white'; #E7F1F7; /* Climate Corp "halftone background blue" */
  context.fillRect( 0, 0, canvas.width, canvas.height );

  // Recreate photo via particles[].

  // Place every particle in its home position on a white background.
  // Write a halftone ball with the specified radius (which was calculated
  // as bigger for lower intensity particles).
  context.fillStyle = _this.settings.animationElementColor;
  $.each( particles, function( idx, particle ) {
    context.beginPath();
    context.arc(
        particle.x + animationElementOffsetX, // NOTE: already adjusted when mapped.
        particle.y + animationElementOffsetY, // NOTE: already adjusted when mapped.
        // NOTE: performance tradeoff? if particle.i is stored as pixelIntensity (0-255) then Less
        // chars are stored in string so we can just multiply with the CONSTANT gridSize. BUT we
        // have the multiplication overhead. IF calc when mapped, about 20chars are stored for
        // particle.r versus 3 for particle.i
        particle.r, // * gridSize, // not needed, already adjusted when mapped.
        0, _this.TAU );
    context.fill();
    context.closePath();
  });
  $elementsContainerElem.append( element );
  domElementsObjsArray.push( document.createElement( 'canvas' ) );

  $sceneContainerElem.attr( 'numElements', numElements + '' );

  var results = {
    animationElementsContainerElem: elementsContainerElem,
    domElementsObjsArray: domElementsObjsArray,
  };
  console.log( " ..*5b.2) renderParticleMapAsSingleCanvas(): Made " + $sceneContainerElem.attr( 'numElements' ) +
               " canvas AnimationElements. *");
  if ( typeof callback == 'function' ) { callback( results ); return; }
  return results;
}; // end renderParticleMapAsSingleCanvas()
