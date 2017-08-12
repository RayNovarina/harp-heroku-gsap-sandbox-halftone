// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function updateSettings( _this, options ) {
  //--------------------------------------------------------------------------
  if ( options == 'undefined') {
    return _this.settings;
  }
  return _this.settings = $.extend( {}, _this.settings || _this.defaults, options );
}; // end updateSettings()

//----------------------------------------------------------------------------
function newPhoto( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*3) newPhoto() photoType: '" + options.photoType +
               "'. photoTag: '" + options.photoTag +
               "'. Current img.src: '" + _this.settings.img.src +
               "'. New imgSrc: '" + options.imgSrc + "'. *");
  updateSettings( _this, options );
  var src = _this.settings.imgSrc,
      img = _this.settings.img,
      $img = _this.settings.$img;

  img.onload =
  /*1-Resume here when done*/ function() {
  console.log( " ..*3a) newPhoto() img.onload() Loaded src: '" + $img.attr('src') +
               "'. img.width: '" + img.width + "'. img.height: '" + img.height +
               "'. *");
  getImgData( _this,
  /*2-Resume here when done*/ function() {
  if ( typeof callback == 'function' ) { callback( img ); return; }
  return img;
  /*2-*/});/*1-*/}; // end img.onload()

  $img.attr('src', src); // causes photo to be loaded and rendered.
}; // end: newPhoto()

//----------------------------------------------------------------------------
function getImgData( _this, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*3.1 getImgData() *");

  _this.effectsData = { canvasBackgroundColor: '', particles: [] };
  var canvasAndCtx = makeCanvasAndCtx();
  var imgCanvas = canvasAndCtx.canvas;
  var ctx = canvasAndCtx.ctx;
  _this.imgWidth = imgCanvas.width = _this.settings.img.naturalWidth;
  _this.imgHeight = imgCanvas.height = _this.settings.img.naturalHeight;
  ctx.drawImage( _this.settings.img, 0, 0 );
  // ImageData.data Is a Uint8ClampedArray representing a one-dimensional
  // array containing the data in the RGBA order, with integer values between
  // 0 and 255 (included). sarah.jpg imgData.len = '582400'
  _this.imgDataObj = ctx.getImageData( 0, 0, _this.imgWidth, _this.imgHeight );
  _this.imgData = _this.imgDataObj.data;
  _this.imgDataBackgroundRGBA = pixelToRgbxString( _this.imgData, 0, true );
  _this.imgDataBackgroundRGB = pixelToRgbxString( _this.imgData, 0, false );
  console.log( " ..*3.1 getImgData(): imgData.character.len = '" + _this.imgData.length +
  						 "'. imgData.RGBA_arrayCells = '" + _this.imgData.length / 4 +
  						 "'. imgWidth = '" + _this.imgWidth + "'. imgHeight = '" + _this.imgHeight +
  						 "'. Image Background RGB() = '" + _this.imgDataBackgroundRGB +
               "'. Image Background RGBA() = '" + _this.imgDataBackgroundRGBA + "' *");
  if ( typeof callback == 'function' ) { callback(); return; }
} // end: getImgData()

//----------------------------------------------------------------------------
function createScene( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  console.log( " ..*3.2) createScene() For sceneTag: '" + _this.settings.sceneTag + "'. *");
  if ( isSceneDisabled( _this, options ) ) {
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }
  createScene_reset( _this );
  // Create container per panel and options specified in settings.
  createSceneContainer( _this, {
    sceneId: 'scene_Con_' + _this.settings.id,
  },
  /*1-Resume here when done*/ function( sceneContainer ) {
  _this.settings.sceneContainer = sceneContainer;
  sceneContainer.panel.appendChild( sceneContainer );
  $ (sceneContainer).attr( 'sceneTag', _this.settings.sceneTag );
  // Create AnimationElements per panel and options specified in settings.
  // Attach them as needed to the sceneContainer.
  options.container = sceneContainer;
  createAnimationElements( _this, {
    container: sceneContainer,
  },
  /*2-Resume here when done*/ function( num_elements ) {
  // Assume container.style.display = 'none'. Now attach to specified Panel.
  //sceneContainer.panel.appendChild( sceneContainer );
  if ( typeof callback == 'function' ) { callback( sceneContainer ); return; }
  return sceneContainer;
  /*2-*/});/*1-*/});
}; // end: createScene()

//----------------------------------------------------------------------------
function createScene_reset( _this ) {
  //--------------------------------------------------------------------------
  if ( _this.centerPanel !== undefined ) {
    $(_this.centerPanel).children( 'canvas' ).remove();
    $(_this.centerPanel).children( 'div' ).remove();
    $(_this.centerPanel).empty();
    //_this.centerPanel = document.createElement( "div" );
  }
}; // end: createSceneContainer_reset()

//----------------------------------------------------------------------------
function isSceneDisabled( _this, options ) {
  //----------------------------------------------------------------------------
  if ( ( options.sceneTag == 'particles' && !_this.settings.isRenderParticleMap ) ) {
    console.log( " ..*3.3) createScene() Rendering is disabled for sceneTag: '" + options.sceneTag + "'. *");
    if ( typeof callback == 'function' ) { callback( true ); return; }
    return true;
  }
  if ( typeof callback == 'function' ) { callback( false ); return; }
  return false;
}; // end isSceneDisabled()

//------------------------------------------------------------------------------
function xlatSettingsToPanel( _this ) {
  //----------------------------------------------------------------------------
  return  _this.settings.isCreateSceneInLeftPanel
      ? 'left' : _this.settings.isCreateSceneInCenterPanel ? 'center' : 'right';
}; // end xlatSettingsToPanel()

//----------------------------------------------------------------------------
function createSceneContainer( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  console.log( " ..*3.4) createSceneContainer() For '" + _this.settings.panel + "' Panel. *");

  var container = document.createElement( "div" );
  container.id = _this.settings.sceneId;
  //container.style.display = 'none';
  container.panel = ( _this.settings.isCreateSceneInLeftPanel ? _this.leftPanel
    : _this.settings.isCreateSceneInCenterPanel ? _this.centerPanel
    : _this.rightPanel );
  container.style.width = _this.settings.container.width + "px";
  container.style.height = _this.settings.container.height + "px";
  container.style.position = "absolute";
  container.style.left = _this.settings.container.left + "px";
  container.style.top  = _this.settings.container.top + "px";
  container.style.backgroundColor  = _this.settings.container.backgroundColor;
  container.style.border  = _this.settings.container.border;

  console.log( " ..*3.4a) createSceneContainer() container.width: " +  container.style.width +
               ". container.height: " + container.style.height +
               ". Container Offset left: " + container.style.left + ". top: " + container.style.top + "'*");

  if ( typeof callback == 'function' ) { callback( container ); return; }
  return container;
}; // end: createSceneContainer()

//------------------------------------------------------------------------------
function createAnimationElements( _this, options, /*Code to resume when done*/ callback ) {
  //----------------------------------------------------------------------------
  updateSettings( _this, options );
  //createAnimationElements_reset( _this );
  console.log( " ..*3.8) createAnimationElements() For " +
               "sceneTag: '" + $ ( _this.settings.container).attr( 'sceneTag' ) +
               "' in Panel: '" + _this.settings.panel +
               "' using method '" + _this.settings.animationElements.method +
               "' *");
  window[ _this.settings.animationElements.method ]( _this, options,
  /*1-Resume here when done*/ function( elements ) {
  if ( typeof callback == 'function' ) { callback( elements ); return; }
  return elements;
  /*1-*/});
}; // end: createAnimationElements()

//------------------------------------------------------------------------------
function createAnimationElements_reset( _this ) {
//----------------------------------------------------------------------------
  //if ( _this.animationContainer !== undefined ) {
  //  $(_this.animationContainer).empty();
  //  // Assume container.style.display = 'none'. Now attach to specified Panel.
  //  sceneContainer.panel.appendChild( sceneContainer );
  //}
}; // end: createAnimationElements_reset()

//----------------------------------------------------------------------------
// NOTE: eraseCanvas() also set canvas.width/height, fillStyle = color
function eraseCanvas( _this, canvas, context, color ) {
  //----------------------------------------------------------------------------
  // Create blank canvas with fillStyle = color param.
  canvas.width = _this.settings.img.width;
  canvas.height = _this.settings.img.height;
  context.clearRect( 0, 0, canvas.width, canvas.height );
  context.fillStyle = color;
  context.fillRect( 0, 0, canvas.width, canvas.height );
};

//----------------------------------------------------------------------------
function copyConversionContainerToAnimationContainer( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  // local option overrides defaults.
  var isUseConversionScene = options.isActionsUseMovedConversionContainer
    ? options.isActionsUseMovedConversionContainer
    : _this.settings.isActionsUseMovedConversionContainer;
  console.log( " ..*3.6) copyConversionContainerToAnimationContainer() " +
               "isUseConversionScene: '" + isUseConversionScene +
               ( isUseConversionScene ? "'. Copy nothing. animationContainer uses conversionContainer scene"
                                      : "'. Copy' scene in conversionContainer to the animationContainer" ) +
               "'. *");

  if ( isUseConversionScene ) {
    _this.animationContainer.appendChild( _this.scene );
    if ( typeof callback == 'function' ) { callback(); return; }
    return;
  }

  // NOTE: Most scene options are used from scene created for the conversionContainer.
  // Create animationContainer
  createSceneContainer( _this, {
    sceneId: 'scene_Ani_' + _this.settings.id,
  },
  /*1-Resume here when done*/ function( scene ) {
  _this.scene = scene;
  // NOTE: Use same options used for the conversionContainer elements.
  createAnimationElements( _this, {},
  /*2-Resume here when done*/ function() {
  // AnimationElements will display after append()
  _this.animationContainer.appendChild( _this.scene );
  if ( typeof callback == 'function' ) { callback(); return; }
  /*2-*/});/*1-*/});
}; // end: copyConversionContainerToAnimationContainer()

//------------------------------------------------------------------------------
function playSceneIfAutoPlay( _this, options, callback ) {
  //----------------------------------------------------------------------------
  if ( _this.settings.AutoPlay ) {
    playScene( _this, options, callback );
  }
}; // end: playSceneIfAutoPlay()

//------------------------------------------------------------------------------
function playScene( _this, options, callback ) {
  //----------------------------------------------------------------------------
  var numElements = parseInt( $(options.scene).attr( 'numElements' ) );
  console.log( " ..*3.7) playScene() SceneTag: '" + $(options.scene).attr( 'sceneTag' ) +
               "'. For numElements: '" + numElements + "'. *");

  if ( $(options.scene).attr( 'sceneTag' ) == 'particles' ) {
    if ( _this.settings.isRenderParticleMapAsSingleCanvas ) {
      if ( numElements !== '0' ) {
        //options.scene.style.display = 'block';
      }
      return;
    } else if ( _this.settings.isRenderParticleMapAsTweens ) {
      if ( numElements !== '0' ) {
        // Start animation at seek(starting seconds into animation)
        _this.particlesTimeline.play();
      }
      return;
    }
  } // isRenderParticleMapAsTweens
}; // end: playScene()

//------------------------------------------------------------------------------
function playScene_reset( _this, options ) {
  //----------------------------------------------------------------------------

}; // end: playScene_reset()

//======== ACTIONS Checkboxes =================
//=============================================

//----------------------------------------------------------------------------
function cbox_transform( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.5) cbox_transform() Box checked = '" + $( '#cbox_transform' ).prop('checked') + "'. *");
  _this.settings.isTransformPixels = $( '#cbox_transform' ).prop('checked');
  if ( _this.settings.isTransformPixels ) {
    _this.settings.isExcludePixels = false;
    $( '#cbox_exclude' ).prop('checked', false );
  }
  if ( typeof callback == 'function' ) { callback(); return; }
}; // end: function cbox_transform()

//----------------------------------------------------------------------------
function cbox_exclude( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.5) cbox_exclude() Box checked = '" + $( '#cbox_exclude' ).prop('checked') + "'. *");
  _this.settings.isExcludePixels = $( '#cbox_exclude' ).prop('checked');
  if ( _this.settings.isExcludePixels ) {
    _this.settings.isTransformPixels = false;
    $( '#cbox_transform' ).prop('checked', false );
  }
  if ( typeof callback == 'function' ) { callback(); return; }
}; // end: function cbox_exclude()

//----------------------------------------------------------------------------
function cbox_useTrr( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.5) cbox_useTrr() Box checked = '" + $( '#cbox_useTrr' ).prop('checked') + "'. *");
  _this.settings.isUseTrrData = $( '#cbox_useTrr' ).prop('checked');
  if ( typeof callback == 'function' ) { callback(); return; }
}; // end: cbox_useTrr()

//----------------------------------------------------------------------------
function cbox_useCanvas( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.5) cbox_useCanvas() Box checked = '" + $( '#cbox_useCanvas' ).prop('checked') + "'. *");
  _this.settings.isUseCanvasElements = $( '#cbox_useCanvas' ).prop('checked');
  if ( _this.settings.isUseCanvasElements ) {
    _this.settings.isUseSVGelements = false;
    $( '#cbox_useSVG' ).prop('checked', false );
    _this.settings.isUseDivElements = false;
    $( '#cbox_useDiv' ).prop('checked', false );
  }
  if ( typeof callback == 'function' ) { callback(); return; }
}; // end: function cbox_useCanvas()

//----------------------------------------------------------------------------
function cbox_useSVG( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.5) cbox_useSVG() Box checked = '" + $( '#cbox_useSVG' ).prop('checked') + "'. *");
  _this.settings.isUseSVGelements = $( '#cbox_useSVG' ).prop('checked');
  if ( _this.settings.isUseSVGelements ) {
    _this.settings.isUseCanvasElements = false;
    $( '#cbox_useCanvas' ).prop('checked', false );
    _this.settings.isUseDivElements = false;
    $( '#cbox_useDiv' ).prop('checked', false );
  }
  if ( typeof callback == 'function' ) { callback(); return; }
}; // end: function cbox_useSVG()

//----------------------------------------------------------------------------
function cbox_useDiv( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.5) cbox_useDiv() Box checked = '" + $( '#cbox_useDiv' ).prop('checked') + "'. *");
  _this.settings.isUseDivElements = $( '#cbox_useDiv' ).prop('checked');
  if ( _this.settings.isUseDivElements ) {
    _this.settings.isUseCanvasElements = false;
    $( '#cbox_useCanvas' ).prop('checked', false );
    _this.settings.isUseSVGelements = false;
    $( '#cbox_useSVG' ).prop('checked', false );
  }
  if ( typeof callback == 'function' ) { callback(); return; }
}; // end: function cbox_useDiv()


//================ Action sub options checkboxes.
//----------------------------------------------------------------------------
function cbox_every1( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.5) cbox_every1() Box checked = '" + $( '#cbox_every1' ).prop('checked') + "'. *");
  if ( $( '#cbox_every1' ).prop('checked') ) {
    _this.settings.isProcessBySkipCount = true;
    _this.settings.isProcessByCluster = false;
    _this.settings.nthPixelToProcess = 1;
    $( '#cbox_every2' ).prop('checked', false );
    $( '#cbox_every3' ).prop('checked', false );
    $( '#cbox_every4' ).prop('checked', false );
    $( '#cbox_1x1_cluster' ).prop('checked', false );
    $( '#cbox_3x3_cluster' ).prop('checked', false );
    $( '#cbox_5x5_cluster' ).prop('checked', false );
    $( '#cbox_7x7_cluster' ).prop('checked', false );
  }
  if ( typeof callback == 'function' ) { callback(); return; }
} // end: cbox_every1()

//----------------------------------------------------------------------------
function cbox_every2( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.5) cbox_every2() Box checked = '" + $( '#cbox_every2' ).prop('checked') + "'. *");
  if ( $( '#cbox_every2' ).prop('checked') ) {
    _this.settings.isProcessBySkipCount = true;
    _this.settings.isProcessByCluster = false;
    _this.settings.nthPixelToProcess = 2;
    $( '#cbox_every1' ).prop('checked', false );
    $( '#cbox_every3' ).prop('checked', false );
    $( '#cbox_every4' ).prop('checked', false );
    $( '#cbox_1x1_cluster' ).prop('checked', false );
    $( '#cbox_3x3_cluster' ).prop('checked', false );
    $( '#cbox_5x5_cluster' ).prop('checked', false );
    $( '#cbox_7x7_cluster' ).prop('checked', false );
  }
  if ( typeof callback == 'function' ) { callback(); return; }
} // end: cbox_every2()

//----------------------------------------------------------------------------
function cbox_every3( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.5) cbox_every3() Box checked = '" + $( '#cbox_every3' ).prop('checked') + "'. *");
  if ( $( '#cbox_every3' ).prop('checked') ) {
    _this.settings.isProcessBySkipCount = true;
    _this.settings.isProcessByCluster = false;
    _this.settings.nthPixelToProcess = 3;
    $( '#cbox_every1' ).prop('checked', false );
    $( '#cbox_every2' ).prop('checked', false );
    $( '#cbox_every4' ).prop('checked', false );
    $( '#cbox_1x1_cluster' ).prop('checked', false );
    $( '#cbox_3x3_cluster' ).prop('checked', false );
    $( '#cbox_5x5_cluster' ).prop('checked', false );
    $( '#cbox_7x7_cluster' ).prop('checked', false );
  }
  if ( typeof callback == 'function' ) { callback(); return; }
} // end: cbox_every3()

//----------------------------------------------------------------------------
function cbox_every4( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.5) cbox_every4() Box checked = '" + $( '#cbox_every4' ).prop('checked') + "'. *");
  if ( $( '#cbox_every4' ).prop('checked') ) {
    _this.settings.isProcessBySkipCount = true;
    _this.settings.isProcessByCluster = false;
    _this.settings.nthPixelToProcess = 4;
    $( '#cbox_every1' ).prop('checked', false );
    $( '#cbox_every2' ).prop('checked', false );
    $( '#cbox_every3' ).prop('checked', false );
    $( '#cbox_1x1_cluster' ).prop('checked', false );
    $( '#cbox_3x3_cluster' ).prop('checked', false );
    $( '#cbox_5x5_cluster' ).prop('checked', false );
    $( '#cbox_7x7_cluster' ).prop('checked', false );
  }
  if ( typeof callback == 'function' ) { callback(); return; }
} // end: cbox_every4()

//----------------------------------------------------------------------------
function cbox_1x1_cluster( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.5) cbox_1x1_cluster() Box checked = '" + $( '#cbox_1x1_cluster' ).prop('checked') + "'. *");
  if ( $( '#cbox_1x1_cluster' ).prop('checked') ) {
    _this.settings.isProcessBySkipCount = false;
    _this.settings.isProcessByCluster = true;
    _this.settings.pixelsPerClusterSide = 1;
    $( '#cbox_every1' ).prop('checked', false );
    $( '#cbox_every2' ).prop('checked', false );
    $( '#cbox_every3' ).prop('checked', false );
    $( '#cbox_every4' ).prop('checked', false );
    $( '#cbox_3x3_cluster' ).prop('checked', false );
    $( '#cbox_5x5_cluster' ).prop('checked', false );
    $( '#cbox_7x7_cluster' ).prop('checked', false );
  }
  if ( typeof callback == 'function' ) { callback(); return; }
} // end: cbox_1x1_cluster()

//----------------------------------------------------------------------------
function cbox_3x3_cluster( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.5) cbox_3x3_cluster() Box checked = '" + $( '#cbox_3x3_cluster' ).prop('checked') + "'. *");
  if ( $( '#cbox_3x3_cluster' ).prop('checked') ) {
    _this.settings.isProcessBySkipCount = false;
    _this.settings.isProcessByCluster = true;
    _this.settings.pixelsPerClusterSide = 3;
    $( '#cbox_every1' ).prop('checked', false );
    $( '#cbox_every2' ).prop('checked', false );
    $( '#cbox_every3' ).prop('checked', false );
    $( '#cbox_every4' ).prop('checked', false );
    $( '#cbox_1x1_cluster' ).prop('checked', false );
    $( '#cbox_5x5_cluster' ).prop('checked', false );
    $( '#cbox_7x7_cluster' ).prop('checked', false );
  }
  if ( typeof callback == 'function' ) { callback(); return; }
} // end: cbox_3x3_cluster()

//----------------------------------------------------------------------------
function cbox_5x5_cluster( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.5) cbox_5x5_cluster() Box checked = '" + $( '#cbox_5x5_cluster' ).prop('checked') + "'. *");
  if ( $( '#cbox_5x5_cluster' ).prop('checked') ) {
    _this.settings.isProcessBySkipCount = false;
    _this.settings.isProcessByCluster = true;
    _this.settings.pixelsPerClusterSide = 5;
    $( '#cbox_every1' ).prop('checked', false );
    $( '#cbox_every2' ).prop('checked', false );
    $( '#cbox_every3' ).prop('checked', false );
    $( '#cbox_every4' ).prop('checked', false );
    $( '#cbox_1x1_cluster' ).prop('checked', false );
    $( '#cbox_3x3_cluster' ).prop('checked', false );
    $( '#cbox_7x7_cluster' ).prop('checked', false );
  }
  if ( typeof callback == 'function' ) { callback(); return; }
} // end: cbox_5x5_cluster()

//----------------------------------------------------------------------------
function cbox_7x7_cluster( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.5) cbox_7x7_cluster() Box checked = '" + $( '#cbox_7x7_cluster' ).prop('checked') + "'. *");
  if ( $( '#cbox_7x7_cluster' ).prop('checked') ) {
    _this.settings.isProcessBySkipCount = false;
    _this.settings.isProcessByCluster = true;
    _this.settings.pixelsPerClusterSide = 7;
    $( '#cbox_every1' ).prop('checked', false );
    $( '#cbox_every2' ).prop('checked', false );
    $( '#cbox_every3' ).prop('checked', false );
    $( '#cbox_every4' ).prop('checked', false );
    $( '#cbox_1x1_cluster' ).prop('checked', false );
    $( '#cbox_3x3_cluster' ).prop('checked', false );
    $( '#cbox_7x7_cluster' ).prop('checked', false );
  }
  if ( typeof callback == 'function' ) { callback(); return; }
} // end: cbox_7x7_cluster()

//==============================================================================
//******************************************************************************
//==============================================================================
// Static methods in context of window

//----------------------------------------------------------------------------
function makeCanvasAndCtx() {
  //--------------------------------------------------------------------------
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	return { canvas:canvas, ctx:ctx };
}; // end makeCanvasAndCtx()

//------------------------------------------------------------------------------
function getRandom( max, min ) {
  //----------------------------------------------------------------------------
  return Math.floor( Math.random() * ( 1 + max - min ) + min );
} // end function getRandom()

//------------------------------------------------------------------------------
function pixelToRgbxString( pixelArray, pixelIndex, isIncludeA ) {
  //----------------------------------------------------------------------------
  return "rgb"   + (isIncludeA ? "a" : "") +
         "( "    + pixelArray[ pixelIndex + 0 ] +
            ", " + pixelArray[ pixelIndex + 1 ] +
            ", " + pixelArray[ pixelIndex + 2 ] +
            (isIncludeA ?
            ", " + pixelArray[ pixelIndex + 3 ] : "") +
         " )";
} // end pixelToRgbxString()
