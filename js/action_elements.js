// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function elements( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  options.sceneTag = 'elements';
  elements_reset( _this, { sceneTag: options.sceneTag } );
  updateSettings( _this, options );
  console.log( " ..*4.2) elements() *");

  // display particles in Panel specified by options (now in .settings).
  createScene( _this, {
    sceneTag: options.sceneTag,
    panel: settingsToPanel( _this ),
    container: {
      width: _this.settings.img.width + 8,
      height: _this.settings.img.height,
      left: 0,
      top: 0,
      backgroundColor: _this.defaults.sceneBackgroundColor, //  '#E7F1F7', Climate Corp "halftone background blue"
      //  background color of Climate Corp profile photo for Meg: rgb(234, 233, 238) #eae9ee
      border: '',
    },
    animationElements: {
      method:   _this.settings.isRenderParticleMapAsSingleCanvas ? 'renderParticleMapAsSingleCanvas'
              : _this.settings.isUseSVGelements ? 'renderParticleMapAsSvgElements'
              : _this.settings.isUseCanvasElements ? 'renderParticleMapAsCanvasElements'
              //: _this.settings.isUseDivElements ?
              : 'renderParticleMapAsDivElements',
      offsetX: 0, //-80,
      offsetY: 0, //-20,
    },
  },
  /*2-Resume here when done*/ function( sceneContainer ) {
  _this.scene = sceneContainer;
  var aniContainerObj = $( sceneContainer ).find( '.trr-ani-elems-container' ),
      domElementsObjsArray = $( aniContainerObj ).children().toArray();
  _this.movie.stories.push( {
    tag: _this.settings.photoTag,
    particleMap: _this.particles,
    scenes: [ { tag: _this.settings.sceneTag,
                container: sceneContainer,
                animationElements: {
                  container: {
                    object: aniContainerObj,
                    htmlString: '',
                  },
                  domElements: {
                    objects: domElementsObjsArray,
                    htmlString: '',
                  },
                },
    } ],
  });
  // _this.movie.stories[0].scenes[0].animationElements.domElements.objects
  playSceneIfAutoPlay( _this, { scene: sceneContainer },
  /*3-Resume here when done*/ function( timeline ) {
  if ( typeof callback == 'function' ) { callback(); return; }
  /*3-*/});/*2-*/});
}; // end: elements()

//----------------------------------------------------------------------------
function elements_reset( _this, options ) {
  //----------------------------------------------------------------------------
  if ( _this.settings == 'undefined' ) {
    // onDomReady() init.
  } else {

  }
}; // end: elements_reset()


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
