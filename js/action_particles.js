// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function particles( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  options.sceneTag = 'particles';
  particles_reset( _this, { sceneTag: options.sceneTag } );
  updateSettings( _this, options );
  console.log( " ..*4.1) particles() " + "'. RenderParticleMap: '" + _this.settings.isRenderParticleMap +
               "' for active story '" + _this.activeStory.tag + "' *");

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
      //  background color of Climate Corp profile photo for Meg: rgb(234, 233, 238) #eae9ee
      border: '',
    },
    createAnimationElementsParams: {
      // NOTE: default is RenderParticleMapAsSingleCanvas but checkbox overrides do apply.
      method: _this.settings.isUseSVGelements ? 'renderParticleMapAsSvgElements'
              : _this.settings.isUseCanvasElements ? 'renderParticleMapAsCanvasElements'
              : _this.settings.isUseDivElements ? 'renderParticleMapAsDivElements'
              // default. _this.settings.isRenderParticleMapAsSingleCanvas
              : 'renderParticleMapAsSingleCanvas',
      offsetX: 0,
      offsetY: 0,
    },
  },
  /*2-Resume here when done*/ function( scene ) {
  if ( _this.settings.isRenderParticleMapAsTweens &&
       numElements !== '0' ) {
    _this.activeStory.particlesTimeline.play();
  }
  //playSceneIfAutoPlay( _this, { scene: scene },
  ///*3-Resume here when done*/ function( timeline ) {
  if ( typeof callback == 'function' ) { callback( scene ); return; }
  return scene;
  /*2-*/});/*1-*/});
};// end: particles()

//----------------------------------------------------------------------------
function particles_reset( _this, options ) {
  //----------------------------------------------------------------------------
  if ( _this.settings == 'undefined' ) {
    // onDomReady() init.
  } else {
    _this.settings.isParticlesMode = true;
    _this.settings.isElementsMode = false;
    update_ep_mode_cboxes( _this );
    if ( _this.activeScene ) {
      // Hide the active/visible sceneContainer, we will replace it with ours.
      _this.activeScene.container.html.elem.style.display = 'none';
    }
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
  sceneContainerElem.style.display = 'block';

  var numElements = 1,
      canvasAndCtx = makeCanvasAndCtx(),
      canvas = canvasAndCtx.canvas,
      context = canvasAndCtx.ctx,
      element = canvas;
  canvas.width = imageElem.width;
  canvas.height = imageElem.height;
  context.clearRect( 0, 0, canvas.width, canvas.height );
  context.fillStyle = 'white';
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

//----------------------------------------------------------------------------
function renderParticleMapAsSvgElements( _this, options, callback ) {
  //----------------------------------------------------------------------------
  updateSettings( _this, options );
  var particles = _this.activeStory.particleMap.particles,
      sceneContainerElem = _this.activeScene.container.html.elem,
      $sceneContainerElem = $( sceneContainerElem ),
      elementsContainer = _this.activeScene.animationElements.container,
      domElementsObjsArray = [],
      animationElementOffsetX = _this.settings.createAnimationElementsParams.offsetX,
      animationElementOffsetY = _this.settings.createAnimationElementsParams.offsetY;
  console.log( " ..*5a.1) renderParticleMapAsSvgElements() For HomePositionParticles[].len = " + particles.length +
               "'. animationElementOffsetX: '" + animationElementOffsetX +
               "'. animationElementOffsetY: '" + animationElementOffsetY +
               ". *");

  // Insert the REQUIRED <svg> tag within the sceneContainer to contain the svg <circle> elements.
  // NOTE: browser can not directly add <svg> or <circle> tags, need to use "w3.org namespace".
  elementsContainer.html = {
    elem: $( makeSvgElementNS('svg') )
      .attr( 'id', 'aniElems_Con_' )
      .attr( 'width', '589' )
      .attr( 'height', '600' )
      .attr( 'trr-ani-elem-type', 'circle' )
      .addClass( 'trr-ani-elems-container' ),
    string: '',
  };
  var elementsContainerElem = elementsContainer.html.elem,
      $elementsContainerElem = $( elementsContainerElem );

  // Assume container.style.display = 'none'. Now attach to specified Panel.
  $( _this.centerPanel ).children().last().append( elementsContainerElem );
  // Assume activeScene container was made invisible in our _reset() and
  // make our container visible before we start filling it up.
  sceneContainerElem.style.display = 'block';
  setAnimationBoundaries( _this, options );
  var numElements = 0;

  // Recreate photo via particles[].
  // Place every particle in its home position on a white background.
  $.each( particles, function( idx, particle ) {
    var element = $( makeSvgElementNS( 'circle' ) )
        .attr( 'cx', particle.x + animationElementOffsetX ) // NOTE: already adjusted when mapped.)
        .attr( 'cy', particle.y + animationElementOffsetY ) // NOTE: already adjusted when mapped.)
        .attr( 'r', particle.r )
        .attr( 'fill', _this.settings.animationElementColor );
    $elementsContainerElem.append( element );
    numElements += 1
  }); // end $.each()

  $sceneContainerElem.attr( 'numElements', numElements + '' );
  var results = {
    animationElementsContainerElem: elementsContainerElem,
    domElementsObjsArray: domElementsObjsArray,
  };
  console.log( " ..*5a.2) renderParticleMapAsSvgElements(): Made " + $sceneContainerElem.attr( 'numElements' ) +
               " canvas AnimationElements. *");

  if ( typeof callback == 'function' ) { callback( results ); return; }
  return results;
}; // end renderParticleMapAsSvgElements()

//----------------------------------------------------------------------------
function renderParticleMapAsDivElements( _this, options, callback ) {
  //----------------------------------------------------------------------------
  updateSettings( _this, options );
  var particleAnimationElementMethod = '',
      particles = _this.activeStory.particleMap.particles,
      sceneContainerElem = _this.activeScene.container.html.elem,
      $sceneContainerElem = $( sceneContainerElem ),
      elementsContainer = _this.activeScene.animationElements.container,
      domElementsObjsArray = [],
      animationElementOffsetX = _this.settings.createAnimationElementsParams.offsetX,
      animationElementOffsetY = _this.settings.createAnimationElementsParams.offsetY;
  console.log( " ..*5a.1) renderParticleMapAsDivElements() For Particles[].len = " + particles.length +
               "'. animationElementOffsetX: '" + animationElementOffsetX +
               "'. animationElementOffsetY: '" + animationElementOffsetY +
               ". *");

  elementsContainer.html = {
    elem: $( document.createElement( "div" ) )
      .attr( 'id', 'aniElems_Con_' )
      .attr( 'width', '589px' )
      .attr( 'height', '600px' )
      .attr( 'trr-ani-elem-type', 'div' )
      .addClass( 'trr-ani-elems-container' ),
    string: '',
  };
  var elementsContainerElem = elementsContainer.html.elem,
      $elementsContainerElem = $( elementsContainerElem );

  // attach to specified Panel.
  $( _this.centerPanel ).children().last().append( elementsContainerElem );
  // Assume activeScene container was made invisible in our _reset() and
  // make our container visible before we start filling it up.
  sceneContainerElem.style.display = 'block';
  setAnimationBoundaries( _this, options );

  var numElements = 0;

  // Place every particle in its home position on a white background.
  $.each( particles, function( idx, particle ) {
    var element = createParticleAnimationDivElement( _this, particle, animationElementOffsetX, animationElementOffsetY );
    if ( element ) {
      elementsContainerElem.append( element );
      numElements += 1;
    } // end if ( element )
  }); // end $.each()

  $sceneContainerElem.attr( 'numElements', numElements + '' );
  var results = {
    animationElementsContainerElem: elementsContainerElem,
    domElementsObjsArray: domElementsObjsArray,
  };
  console.log( " ..*5a.1a) renderParticleMapAsDivElements(): Made " + $sceneContainerElem.attr( 'numElements' ) +
               " <div> AnimationElements. *");
  if ( typeof callback == 'function' ) { callback( results ); return; }
  return results;
}; // end renderParticleMapAsDivElements()

//----------------------------------------------------------------------------
function createParticleAnimationDivElement( _this, particle, animationElementOffsetX, animationElementOffsetY ) {
  //----------------------------------------------------------------------------
  var gridSize = _this.activeStory.particleMap.gridSize;
  // Place every particle in its home position
  var div = document.createElement( 'div' );
  div.style.position = 'absolute';
  div.style.left = ( particle.x + animationElementOffsetX ) + "px"; // NOTE: already adjusted when mapped.)
  div.style.top  = ( particle.y + animationElementOffsetY ) + "px"; // NOTE: already adjusted when mapped.)
  // Math.round( particle.r * _this.particleMaps.gridSize
  // // max 8px, min 2px.
  var diameter = Math.round( particle.r * gridSize );
  if ( diameter < 1 ) {
    return null;
  } else if ( diameter > ( 2 * gridSize ) ) {
    diameter = diameter / 2;
    if ( diameter > ( 2 * gridSize ) ) {
      diameter = ( 2 * gridSize );
    }
  }
  diameter = Math.round( diameter );

  div.style.width = diameter + "px";
  div.style.height = div.style.width;
  div.style.background = _this.settings.animationElementColor;
  div.style.borderRadius = '50%';

  return div;
}; // end createParticleAnimationDivElement()

//----------------------------------------------------------------------------
function createParticleAnimationCanvasElement( _this, particle ) {
  //----------------------------------------------------------------------------
  var canvasAndCtx = makeCanvasAndCtx(),
      canvas = canvasAndCtx.canvas,
      context = canvasAndCtx.ctx,
      elementWidth = 6,
      elementHeight = 6;

  // NOTE: canvas.width and heigth is set by the radius of the dot we write.

  // Create element "below the fold" and in a column in the middle of the panel.
  // i.e. element.y is off the bottom of the page, element.x is in middle.
  canvas.style.position = 'absolute';
  canvas.style.left = getRandom( 225, 425 ) + "px";
  canvas.style.top =  _this.settings.animationPanelBottom - getRandom( 40, 50 ) + "px";
  canvas.width = elementWidth;
  canvas.height = elementHeight;
  context.fillStyle = _this.settings.animationElementColor;
  context.beginPath();
  // NOTE: arc( x, y, radius )
  context.arc( 0, 0, particle.r, 0, _this.TAU );
  context.fill();
  context.closePath();
  return canvas;
}; // end createParticleAnimationCanvasElement()
