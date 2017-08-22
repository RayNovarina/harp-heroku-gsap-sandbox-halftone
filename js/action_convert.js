// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function convert( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  console.log( " ..*4.1) particles() for active story '" + _this.activeStory.tag + "' *");
  options.sceneTag = 'convert';

  // Create animationElements from particles by selecting pixels we want for a
  // halftone image and build array of DOM elements that can be animated via GSAP timeLine.
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
      sceneTag: options.sceneTag,
      isRejectParticlesOutOfBounds: true,
      isRejectParticlesBelowIntensityThreshold: false,
      isRejectParticlesSameAsContainerBackground: true,
      isRandomizeCollapsedCore: true,
      collapsedCoreX: 100,
      collapsedCoreY: 100,
      method: 'createSvgElementsFromParticles',
      offsetX: 0, //-80,
      offsetY: 0, //-20,
    },
  },
  /*1-Resume here when done*/ function( activeScene ) {
  if ( typeof callback == 'function' ) { callback( activeScene ); return; }
  return activeScene;
  /*1-*/});
};// end: convert()
