// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function convert( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  console.log( " ..*4.1) particles() for active story '" + _this.activeStory.tag + "' *");

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
  options.sceneTag = 'elements';
  console.log( " ..*4.2) elements() for active story '" + _this.activeStory.tag + "' *");

  // Create animationElements from particles and build array of DOM elements
  // that can be animated via GSAP timeLine.
  // Optionally display default image in Panel specified by options (now in .settings).
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
      method: 'createSvgElementsFromParticleMap',
      offsetX: 0, //-80,
      offsetY: 0, //-20,
    },
  },
  /*2-Resume here when done*/ function( activeScene ) {
  if ( typeof callback == 'function' ) { callback( activeScene ); return; }
  return activeScene;
  /*2-*/});/*1-*/});
};// end: convert()
