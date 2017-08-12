// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function convert( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  //convert_reset( _this );
  updateSettings( _this, options );
  console.log( " ..*4.1) convert() " + "'. RenderParticleMap: '" + _this.settings.isRenderParticleMap +
               "'. CreateAnimationElements: '" + _this.settings.isCreateAnimationElements +
               "'. CreateElementsInConversionPanel: '" + _this.settings.isCreateElementsInConversionPanel +
               "'. CreateElementsInAnimationPanel: '" + _this.settings.isCreateElementsInAnimationPanel +
               "'. RenderAnimationElements: '" + _this.settings.isRenderAnimationElements +
               "'. *");
  _this.settings.rgbChannel = 'blue'; // _this.settings.halftoneColor
  _this.particlesRejectedBecauseParticleIsOutOfBounds = 0;
  _this.particlesRejectedBecausePixelIntensityLessThanThreshold = 0;
  _this.particlesRejectedBecausePixelSameAsSceneContainerBackgroundRGB = 0;
  _this.particlesRejectedBecausePixelSameAsSceneContainerBackgroundRGBA = 0;
  _this.particlesRejectedBecauseIsExcludedNthPixell = 0;
  _this.particlesRejectedBecauseIsExcludedNotNthPixell = 0;
  _this.particlesRejectedBecauseIsNonCenterMemberOfCluster = 0;
  _this.settings.rgbChannelOffset = _this.RGB_CHANNEL_OFFSETS[ _this.settings.rgbChannel ];
  _this.settings.rgbChannelAngle = _this.RGB_CHANNEL_ANGLES[ _this.settings.rgbChannel ];

  var sceneTag = 'convert';

  // Create particle array by selecting pixels we want for a halftone image.
  // Optionally display particles in conversionPanel.
  createParticleMap( _this, {
    id: _this.settings.id,
    isRejectParticlesOutOfBounds: true,
    isRejectParticlesBelowIntensityThreshold: true,
    isRejectParticlesSameAsSceneContainerBackground: true,
    sceneTag: sceneTag,
  },
  /*1-Resume here when done*/ function( maps ) {
  _this.particles = maps.homePostionParticles;
  // Create elements (from the particle map) in a form that we can animate.
  createScene( _this, {
    sceneTag: sceneTag,
    animationElementWidth: 6,
    animationElementHeight: 6,
    animationElementOffsetX: -80,
    animationElementOffsetY: -20,
  },
  /*2-Resume here when done*/ function( scene ) {
  // If options say to, show scene in panel.
  playScene( _this, {
    sceneTag: sceneTag,
    scene: scene,
  },
  /*3-Resume here when done*/ function() {
  /*3-*/});/*2-*/});/*1-*/});
  if ( typeof callback == 'function' ) { callback(); return; }
};// end: convert()

//----------------------------------------------------------------------------
function createScene( _this, options, callback ) {
  //----------------------------------------------------------------------------
  var scene = {
    sceneTag: options.sceneTag,
    container: createSceneContainer( _this, options ),
  };

  // Create elements (from the particle map) in a form that we can animate.
  createAnimationElements( _this, {
    container: sceneContainer,
    animationElementWidth: 6,
    animationElementHeight: 6,
    animationElementOffsetX: -80,
    animationElementOffsetY: -20,
  },
  /*1-Resume here when done*/ function( elements ) {
  scene.elements = elements;
  /*1-*/});
  if ( typeof callback == 'function' ) { callback( scene ); return; }
  return scene;
};// end: createScene()

//----------------------------------------------------------------------------
function convert_reset( _this ) {
  //----------------------------------------------------------------------------
  if ( _this.settings == 'undefined' ) {
    // onDomReady() init.
  } else {
    // Reset link clicked after load. Maybe conversion, actions done.
    createSceneContainer_reset( _this );
    _this.sceneContainer;
    createParticleMap_reset( _this );
    _this.particles;
    //createAnimationElements_reset( _this );
  }
}; // end: convert_reset()
