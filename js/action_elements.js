// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function elements( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  elements_reset( _this )
  console.log( " ..*4.2) elements() " +
               "'. CreateAnimationElements: '" + _this.settings.isCreateAnimationElements +
               "'. CreateElementsInConversionContainer: '" + _this.settings.isCreateElementsInConversionContainer +
               "'. CreateElementsInAnimationContainer: '" + _this.settings.isCreateElementsInAnimationContainer +
               "'. RenderAnimationElements: '" + _this.settings.isRenderAnimationElements +
               "'. *");

  if ( _this.sceneContainer == 'undefined' ||
       !_this.settings.isCreateAnimationElements ) {
    if ( typeof callback == 'function' ) { callback(); return; }
    return;
  }

  // Create elements (from the particle map) in a form that we can animate.
  createAnimationElements( _this, {
    animationElementWidth: 6,
    animationElementHeight: 6,
    animationElementOffsetX: -80,
    animationElementOffsetY: -20,
  },
  /*1-Resume here when done*/ function() {
  // AnimationElements will display after append()
  if ( _this.settings.isRenderAnimationElements ) {
    if ( _this.settings.isCreateElementsInConversionContainer ) {
        _this.conversionContainer.appendChild( _this.sceneContainer );
    } else if ( _this.settings.isCreateElementsInAnimationContainer ) {
        _this.animationContainer.appendChild( _this.sceneContainer );
    }
  }
  /*1-*/});
  if ( typeof callback == 'function' ) { callback(); return; }
}; // end: elements()

//----------------------------------------------------------------------------
function elements_reset( _this ) {
//----------------------------------------------------------------------------
  if ( _this.settings.isRenderAnimationElements &&
      _this.settings.isCreateElementsInConversionContainer ) {
    createSceneContainer_reset( _this );
  }
  createAnimationElements_reset( _this );
}; // end: elements_reset()
