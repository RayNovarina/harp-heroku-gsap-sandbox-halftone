// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function convert( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  console.log( " ..*4.1) particles() for active story '" + _this.activeStory.tag + "' *");

  getParticles( _this, options, _this.activeStory,
  /*1-Resume here when done*/ function( particlesInfo ) {
  _this.settings.particlesInfo = particlesInfo;
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
      particlesInfo: particlesInfo,
      nextParticleMethod:
          _this.settings.isParticlesObjAsHashArray ? 'nextParticleFromHashArray'
          : _this.settings.isParticlesObjAsArray ? 'nextParticleFromArray'
          // assume _this.settings.isParticlesObjAsString
          : 'nextParticleFromString',
      sceneTag: options.sceneTag,
      isRandomizeCollapsedCore: true,
      collapsedCoreX: 100,
      collapsedCoreY: 100,
      type: 'SvgCircle',
      method: 'createSvgElementsFromParticles',
      offsetX: 0, //-80,
      offsetY: 0, //-20,
    },
  },
  /*2-Resume here when done*/ function( activeScene ) {
  if ( typeof callback == 'function' ) { callback( activeScene ); return; }
  return activeScene;
  /*2-*/});/*1-*/});
};// end: convert()

//----------------------------------------------------------------------------
function getParticles( _this, options, story, callback ) {
  //----------------------------------------------------------------------------
  console.log( " ..*4.1) getParticles() for active story '" + _this.activeStory.tag + "' *");

  // Create particle array by selecting pixels we want for a halftone image.
  createParticleMap( _this, {
    id: _this.activeStory.tag + '_particleMap',
    isRejectParticlesOutOfBounds: true,
    isRejectParticlesBelowIntensityThreshold: true,
    isRejectParticlesSameAsContainerBackground: true,
    sceneTag: _this.settings.sceneTag,
    particlesHomeOffsetLeft: 0,
    particlesHomeOffsetTop: 0,
  },
  /*1-Resume here when done*/ function( particles ) {
  var source = 'image';
  var particlesInfo = {
    source: source,
    particles: particles,
    numParticles: particles.length,
    eof: particles.length - 1,
    nextIndex: 0,
  };
  if ( typeof callback == 'function' ) { callback( particlesInfo ); return; }
  return particlesInfo;
  /*1-*/});
}; // end getParticles()

//----------------------------------------------------------------------------
function getNextParticle(_this, options ) {
  //----------------------------------------------------------------------------
  var particle = null,
      particleProps = null,
      pcb = _this.settings.particlesInfo;
  if ( !(pcb.eof == -1) &&
       !(pcb.nextIndex == pcb.eof) ) {
    particleProps = window[ _this.settings.createAnimationElementsParams.nextParticleMethod ]( _this, options, pcb );
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
  return pcb.particles[ pcb.nextIndex ];
}; // end nextParticleFromHashArray()

//----------------------------------------------------------------------------
function nextParticleFromArray( _this, options, pcb ) {
  //----------------------------------------------------------------------------

}; // end nextParticleFromArray()

//----------------------------------------------------------------------------
function nextParticleFromString( _this, options, pcb ) {
  //----------------------------------------------------------------------------

}; // end nextParticleFromString()
