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
      method:   _this.settings.isRenderParticleMapAsSingleCanvas ? 'renderParticleMapAsSingleCanvas'
              : _this.settings.isUseSVGelements ? 'renderParticleMapAsSvgElements'
              : _this.settings.isUseCanvasElements ? 'renderParticleMapAsCanvasElements'
              //: _this.settings.isUseDivElements ?
              : 'renderParticleMapAsDivElements',
      offsetX: 0, //-80,
      offsetY: 0, //-20,
    },
  },
  /*2-Resume here when done*/ function( scene ) {
  // _this.movie.stories[0].scenes[0].animationElements.domElements.objects
  playSceneIfAutoPlay( _this, { scene: scene },
  /*3-Resume here when done*/ function( timeline ) {
  if ( typeof callback == 'function' ) { callback( scene ); return; }
  return scene;
  /*3-*/});/*2-*/});/*1-*/});
};// end: particles()

//----------------------------------------------------------------------------
function particles_reset( _this, options ) {
  //----------------------------------------------------------------------------
  if ( _this.settings == 'undefined' ) {
    // onDomReady() init.
  } else {
    //playScene_reset( _this, { sceneTag: options.sceneTag, } );
    //eraseCanvas( _this, canvas, context, '#E7F1F7' );
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
      sceneContainerElem = _this.activeScene.container.html.elem,
      $sceneContainerElem = $( sceneContainerElem ),
      elementsContainer = _this.activeScene.animationElements.container,
      imageElem = _this.activeStory.image.html.elem;
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

  // Assume container.style.display = 'none'. Now attach to specified Panel.
  $( _this.centerPanel ).children().last().append( elementsContainerElem );
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

  // Copy every particle to its home position on the white canvas.
  //   Each particle: maps.homePostionParticles.push( {
  //          x: filterResults.x + homeOffsetLeft,
  //          y: filterResults.y+ homeOffsetTop,
  //          r: filterResults.pixelChannelIntensity * gridSize,
  // Write a halftone ball with the specified radius (which was calculated
  // as bigger for lower intensity particles).
  context.fillStyle = _this.settings.animationElementColor;
  $.each( particles, function( idx, particle ) {
    context.beginPath();
    context.arc(
        particle.x + _this.settings.animationElementOffsetX,
        particle.y + _this.settings.animationElementOffsetY,
        particle.r,
        0, _this.TAU );
    context.fill();
    context.closePath();
  });
  $elementsContainerElem.append( element );

  $sceneContainerElem.attr( 'numElements', numElements + '' );
  console.log( " ..*5b.2) renderParticleMapAsSingleCanvas(): Made " + $sceneContainerElem.attr( 'numElements' ) +
               " canvas AnimationElements. *");
  if ( typeof callback == 'function' ) { callback( elementsContainerElem ); return; }
  return elementsContainerElem;
}; // end renderParticleMapAsSingleCanvas()
