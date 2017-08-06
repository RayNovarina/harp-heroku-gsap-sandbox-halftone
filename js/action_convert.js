// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function convert( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.1) convert() *");
  _this.conversionContainerBackgroundRGB = _this.imgDataBackgroundRGB;
  _this.conversionContainerBackgroundRGBA = _this.imgDataBackgroundRGBA;
  _this.settings.rgbChannel = 'blue'; // _this.settings.halftoneColor
  _this.particlesRejectedBecauseParticleIsOutOfBounds = 0;
  _this.particlesRejectedBecausePixelIntensityLessThanThreshold = 0;
  _this.particlesRejectedBecausePixelSameAsConversionContainerBackgroundRGB = 0;
  _this.particlesRejectedBecausePixelSameAsConversionContainerBackgroundRGBA = 0;
  _this.particlesRejectedBecauseIsExcludedNthPixell = 0;
  _this.particlesRejectedBecauseIsExcludedNotNthPixell = 0;
  _this.particlesRejectedBecauseIsNonCenterMemberOfCluster = 0;
  _this.settings.rgbChannelOffset = _this.RGB_CHANNEL_OFFSETS[ _this.settings.rgbChannel ];
  _this.settings.rgbChannelAngle = _this.RGB_CHANNEL_ANGLES[ _this.settings.rgbChannel ];

  // Create conversionContainer
  createSceneContainer( _this, {
    sceneId: 'scene_Con_' + _this.settings.id,
    sceneWidth: 430,
    sceneHeight: 436,
    sceneLeft: 0,
    sceneTop: 0,
    sceneBackgroundColor: '#E7F1F7', // rgb(231, 241, 247) rgba(231, 241, 247, 1)
    //  background color of Climate Corp profile photo for Meg: rgb(234, 233, 238) #eae9ee
    sceneBorder: '',
  },
  /*1-Resume here when done*/ function( scene ) {
  _this.scene = scene;
  // Create particle array by selecting pixels we want for a halftone image.
  createParticleMap( _this, {
    id: _this.settings.id,
    maxHalftoneDotSize: 1/150,
    pixelChannelIntensityThreshold: 0.05,
    imageScale: 1.0, // canvas.width / imgWidth;
    // If isProcessBySkipCount is true. Default is 4.
    // NOTE: Use buttons for options. Risky to set override here.
    // nthPixelToProcess: 4,

    // NOTE: Use buttons for options. Risky to set override here.
    // If isProcessByCluster is true. Default is ?
    // pixelsPerClusterSide: 5,

    isRejectParticlesOutOfBounds: true,
    isRejectParticlesBelowIntensityThreshold: true,
    isRejectParticlesSameAsConversionContainerBackground: true,
  },
  /*2-Resume here when done*/ function( particles ) {
  _this.particles = particles;
  // Create elements (from the particle map) in a form that we can animate.
  createAnimationElements( _this, {
    animationElementWidth: 6,
    animationElementHeight: 6,
    animationElementColor: '#70C0EF',
    animationElementOffsetX: -80,
    animationElementOffsetY: -20,
  },
  /*3-Resume here when done*/ function() {
  // AnimationElements will display after append()
  _this.conversionContainer.appendChild( _this.scene );
  /*3-*/});/*2-*/});/*1-*/});
  if ( typeof callback == 'function' ) { callback(); return; }
}; // end: convert()
