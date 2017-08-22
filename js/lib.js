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
  _this.isVisiblePhoto = false;
  _this.selectedPhotoTag = '';

  img.onload =
  /*1-Resume here when done*/ function() {
  console.log( " ..*3a) newPhoto() img.onload() Loaded src: '" + $img.attr('src') +
               "'. img.width: '" + img.width + "'. img.height: '" + img.height +
               "'. *");
  getImgData( _this,
  /*2-Resume here when done*/ function( imgDataObj ) {
  _this.isVisiblePhoto = true;
  // Hide the active/visible sceneContainer.
  closeActiveSceneContainer( _this,
  /*3-Resume here when done*/ function( activeScene ) {
  if ( _this.activeStory ) {
    _this.activeStory.lastActiveScene = _this.activeScene || null;
  }
  _this.selectedPhotoTag = _this.settings.photoTag;
  selectedPhotoToStory( _this,
  /*4-Resume here when done*/ function( result ) {
  if ( !result.isFound ) {
    // This photo has not been selected before.
    result.item = newStory( _this, _this.selectedPhotoTag );
  }
  _this.movie.lastActiveStory = _this.activeStory || null;
  _this.activeStory = result.item;
  _this.activeStory.image = {
    html: {
      elem: img,
      src: $img.attr('src'),
    },
    ctxImgData: imgDataObj.data,
  };
  // Recover our last activeScene, if any, and make it visible.
  _this.activeScene = _this.activeStory.lastActiveScene;
  openSceneContainer( _this, _this.activeStory.lastActiveScene );
  console.log( " ..*3a) newPhoto() DONE. *");
  if ( typeof callback == 'function' ) { callback( _this.activeStory.imgage ); return; }
  return _this.activeStory.imgage;
  /*4-*/});/*3-*/});/*2-*/});/*1-*/}; // end img.onload()

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
  if ( typeof callback == 'function' ) { callback( _this.imgDataObj ); return; }
  return _this.imgDataObj;
} // end: getImgData()

//----------------------------------------------------------------------------
function createScene( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  console.log( " ..*3.2) createScene() For sceneTag: '" + _this.settings.sceneTag + "'. *");

  // Create container per panel and options specified in settings.
  createSceneContainer( _this, {
    sceneId: 'scene_Con_' + _this.settings.id,
    story: _this.activeStory,
  },
  /*1-Resume here when done*/ function( activeContainer ) {
  activeContainer.panelElem.appendChild( activeContainer.html.elem );
  // NOTE: container.style.display = 'none'. Will be enabled during animation.

  // Create AnimationElements per panel and options specified in settings.
  // Attach them as needed to the sceneContainer.
  createAnimationElements( _this, {
    scene: _this.activeScene,
  },
  /*2-Resume here when done*/ function( animationElementsContainerElem ) {
  if ( typeof callback == 'function' ) { callback( _this.activeScene ); return; }
  return _this.activeScene;
  /*2-*/});/*1-*/});
}; // end: createScene()

//----------------------------------------------------------------------------
function createSceneContainer( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  console.log( " ..*3.4) createSceneContainer() For '" + _this.settings.panel + "' Panel. *");

  // NOTE: will remove existing sceneContainer if it already exists.
  createSceneContainer_reset( _this,
  /*1-Resume here when done*/ function() {

  var sceneContainerElem = document.createElement( "div" ),
      $sceneContainerElem = $( sceneContainerElem );
  $sceneContainerElem
    .addClass( 'trr-scene-container' )
    .attr( 'id', _this.settings.sceneId )
    .attr( 'sceneTag', _this.settings.sceneTag )
    .attr( 'photoTag', _this.settings.photoTag )
    .attr( 'style', 'width: '           + _this.settings.createContainerParams.width + 'px; ' +
                    'height: '          + _this.settings.createContainerParams.height + 'px; ' +
                    'position: '        + 'absolute; ' +
                    'left: '            + _this.settings.createContainerParams.left + 'px; ' +
                    'top: '             + _this.settings.createContainerParams.top + 'px; ' +
                    'backgroundColor: ' + _this.settings.createContainerParams.backgroundColor + '; ' +
                    'border: '          + _this.settings.createContainerParams.border + '; ' +
                    'display: '         + 'none'
         );

  _this.activeScene.container = {
    panelElem: ( _this.settings.isCreateSceneInLeftPanel ? _this.leftPanel
                : _this.centerPanel ),
    html: {
      elem: sceneContainerElem,
    }
  };
  console.log( " ..*3.4a) createSceneContainer() container.width: '" +  _this.activeScene.container.html.elem.style.width +
               "'. container.height: '" + _this.activeScene.container.html.elem.style.height +
               "'. Container Offset left: '" + _this.activeScene.container.html.elem.style.left +
               "'. top: '" + _this.activeScene.container.html.elem.style.top + "' *");

  if ( typeof callback == 'function' ) { callback( _this.activeScene.container ); return; }
  return _this.activeScene.container;
  /*1-*/});
}; // end: createSceneContainer()

//----------------------------------------------------------------------------
function createSceneContainer_reset( _this, callback ) {
  //--------------------------------------------------------------------------
  // NOTE: Assume we have an acitveStory{}.
  if ( _this.activeScene ) {
    // hide current scene before we create another one.
    _this.activeScene.container.html.elem.style.display = 'none';
  }
  // Case: just loaded, just created meg_story, meg_ParticleMap. Going to render
  //       particleMap for meg. need to create scene.
  tagToScene( _this, _this.settings.sceneTag, _this.settings.story,
  /*1-Resume here when done*/ function( result ) {
  if ( result.isFound ) {
    // This scene has been created before for this story.
    var scene = result.item,
        $sceneContainerElem = $( scene.container.html.elem );
    // Remove from DOM for this story.
    $sceneContainerElem.children( 'div' ).remove();
    $sceneContainerElem.empty();
    $sceneContainerElem.remove();
    // Remove it from this story.
    _this.settings.story.scenes.splice( result.index, 1 );
  }
  // Got rid of old scene, make a new scene object for the active story.
  _this.activeScene = newScene( _this, _this.settings.sceneTag );
  if ( typeof callback == 'function' ) { callback( _this.activeScene ); return; }
  return _this.activeScene;
  /*1-*/});
}; // end: createSceneContainer_reset()

//------------------------------------------------------------------------------
function createAnimationElements( _this, options, /*Code to resume when done*/ callback ) {
  //----------------------------------------------------------------------------
  updateSettings( _this, options );
  console.log( " ..*3.8) createAnimationElements() For " +
               "sceneTag: '" + _this.settings.scene.tag +
               "' in Panel: '" + _this.settings.panel +
               "' using method '" + _this.settings.createAnimationElementsParams.method +
               "' *");

  createAnimationElements_reset( _this,
  /*1-Resume here when done*/ function() {
  window[ _this.settings.createAnimationElementsParams.method ]( _this, options,
  /*2-Resume here when done*/ function( results ) {
  _this.activeScene.animationElements = {
    container: { html: { elem: results.animationElementsContainerElem, string: '', }, },
    domElements: { html: { elems: results.domElementsObjsArray, string: '', }, },
  };
  addTimelineToStory( _this, _this.activeStory, results.timelineProps );
  if ( typeof callback == 'function' ) { callback( results.animationElementsContainerElem ); return; }
  return results.animationElementsContainerElem;
  /*2-*/});/*1-*/});
}; // end: createAnimationElements()

//------------------------------------------------------------------------------
function createAnimationElements_reset( _this, callback ) {
//----------------------------------------------------------------------------
  // Reset animationElementsContainer for _this.settings.scene.
  var newElementsObj = newAnimationElements( _this, _this.settings.scene );
  if ( typeof callback == 'function' ) { callback( newElementsObj ); return; }
  return newElementsObj;
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


  /* per: https://stackoverflow.com/questions/32637811/how-can-i-add-a-svg-graphic-dynamically-using-javascript-or-jquery
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "640");
    ...
    document.getElementById("div").appendChild(svg);

    per: http://chubao4ever.github.io/tech/2015/07/16/jquerys-append-not-working-with-svg-element.html

    ###html file
    < svg version="1.1" id="circle" width="400px" height="400px">
      < circle fill="#FFFFFF" stroke="#000000" stroke-width="4" stroke-miterlimit="10" cx="300" cy="300" r="55.5"/>
    </ svg>

    ###js file
    (function() {
      $(document).ready(function() {
        drawCircle();
        drawCircle(100,100,"red");
        drawCircle(200,200,"blue");
        drawCircle(400,400,"gray");
      });
    })();

    function SVG(tag) {
      return document.createElementNS('http://www.w3.org/2000/svg', tag);
    }

    var drawCircle = function(x,y,color) {
        var $svg = $("svg");
        $(SVG('circle'))
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 50)
            .attr('fill', color)
            .appendTo($svg);
    };
  */

//------------------------------------------------------------------------------
function makeSvgElementNS( tag ) {
  //----------------------------------------------------------------------------
  // per: http://chubao4ever.github.io/tech/2015/07/16/jquerys-append-not-working-with-svg-element.html
  return document.createElementNS('http://www.w3.org/2000/svg', tag);
}; // end makeSvgElementNS()

//----------------------------------------------------------------------------
function setAnimationBoundaries( _this, options ) {
  //----------------------------------------------------------------------------
  // NOTE: options.sceneTag = scene id.
  var $sceneContainer = $( _this.activeScene.container.html.elem ),
      panel_bottom = $sceneContainer.height(),
      panel_width = $sceneContainer.width();
  // Set boundaries for "collapsed" view.
  _this.settings.animationPanelTop = 0;
  _this.settings.animationPanelTopBoundary = Math.round( panel_bottom * .45 );
  _this.settings.animationPanelBottom = panel_bottom;
  _this.settings.animationPanelWidth = panel_width;
  _this.settings.animationPanelLeftBoundaryX = Math.round( panel_width * .45 );
  _this.settings.animationPanelRightBoundaryX = Math.round( panel_width - _this.settings.animationPanelLeftBoundaryX );
}; // end setAnimationBoundaries()

//------------------------------------------------------------------------------
function settingsToPanel( _this ) {
  //----------------------------------------------------------------------------
  return  _this.settings.isCreateSceneInLeftPanel ? 'left' : 'center';
}; // end settingsToPanel()

//------------------------------------------------------------------------------
function newMovie( _this ) {
  //----------------------------------------------------------------------------
  return {
    lastActiveStory: null,
    stories: [],
  };
};// end: newMovie()

//------------------------------------------------------------------------------
function newStory( _this, photoTag ) {
  //----------------------------------------------------------------------------
  _this.movie.stories.push( {
    movie: _this.movie,
    lastActiveScene: null,
    tag: photoTag,
    particleMap: {},
    image: {},
    scenes: [],
    timelines: {},
  } );
  return _this.movie.stories[ _this.movie.stories.length - 1 ];
};// end: newStory()

//------------------------------------------------------------------------------
function newScene( _this, sceneTag ) {
  //--------------------------------------------------------------------------
  _this.activeStory.scenes.push( {
    story: _this.activeStory,
    tag: sceneTag,
    container: {},
    animationElements: {},
    proxyContainerTag: '',
  } );
  return _this.activeStory.scenes[ _this.activeStory.scenes.length - 1 ];
}// end: newScene()

//------------------------------------------------------------------------------
function newAnimationElements( _this, scene ) {
  //--------------------------------------------------------------------------
  scene.animationElements = {
    sceneContainer: scene.container,
    container: {},
    domElements: {},
  }
}// end: newAnimationElements()

//----------------------------------------------------------------------------
function addTimelineToStory( _this, story, props ) {
  //----------------------------------------------------------------------------
  if ( props.sceneTag == 'convert' ) {
    story.timelines.collapse = {
      sceneTag: props.sceneTag,
      gsapTimeline: props.gsapTimeline,
      isReversed: props.isReversed,
    };
  }
}// end: addTimelineToStory()

//----------------------------------------------------------------------------
function selectedPhotoToStory( _this, callback ) {
  //----------------------------------------------------------------------------
  return photoTagToStory( _this, _this.selectedPhotoTag, callback );
};// end: selectedPhotoToStory()

//----------------------------------------------------------------------------
function photoTagToStory( _this, photoTag, callback ) {
  //----------------------------------------------------------------------------
  return arrayEach(
    _this.movie.stories, // array to search.
    // Function to execute to test for "match" condition. Must return true/false
    function( story ) {
      return story.tag == photoTag;
    },
    callback );
};// end: photoTagToStory()

//----------------------------------------------------------------------------
function arrayEach( array, testFunction, callback ) {
  //----------------------------------------------------------------------------
  var result = { isFound: false, index: null, item: null };
  if ( array.length == 0 ) {
    if ( typeof callback == 'function' ) { callback( result ); return; }
    return result;
  }
  var isReturnedResult = false;
  $.each( array, function( idx, item ) {
    if ( testFunction(item) ) {
      isReturnedResult = true;
      result.isFound = true;
      result.index = idx;
      result.item = item;
      if ( typeof callback == 'function' ) { callback( result ); return; }
      return result;
    }
    if ( !isReturnedResult && idx == array.length - 1 ) {
      if ( typeof callback == 'function' ) { callback( result ); return; }
      return result;
    }
  }); // end $.each()
};// end: arrayEach()

//----------------------------------------------------------------------------
function tagToScene( _this, sceneTag, story, callback ) {
  //----------------------------------------------------------------------------
  return arrayEach( story.scenes, function( scene ) {
    return scene.tag == sceneTag;
  }, callback );
};// end: tagToScene()

//----------------------------------------------------------------------------
function openSceneContainer( _this, scene ) {
  //----------------------------------------------------------------------------
  console.log( " ..*3.7) openSceneContainer() sceneTag: '" +
               ( scene ? (scene.tag + "'. sceneContainer.id: '" + scene.container.html.elem.id)
                       : '*none' ) + "'. *");
  if ( !scene ) {
    return;
  }
  scene.container.html.elem.style.display = 'block';
};// end: openSceneContainer()

//----------------------------------------------------------------------------
function closeSceneContainer( _this, scene ) {
  //----------------------------------------------------------------------------
  console.log( " ..*3.7) closeSceneContainer() sceneTag: '" +
               ( scene ? (scene.tag + "'. sceneContainer.id: '" + scene.container.html.elem.id)
                       : '*none' ) + "'. *");
  if ( !scene ) {
    return;
  }
  scene.container.html.elem.style.display = 'none';
};// end: closeSceneContainer()

//----------------------------------------------------------------------------
function closeActiveSceneContainer( _this, callback ) {
  //----------------------------------------------------------------------------
  // NOTE: photo can be selected and is the activeStory but a sceneContainer may
  // not have been created yet for its particles or elements scene.
  if ( !_this.activeStory || !_this.activeScene ) {
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }
  console.log( " ..*3.7) closeActiveSceneContainer() activeStory: '" + _this.activeStory.tag +
               "'. activeScene: '" + _this.activeScene.tag +
               "'. activeSceneContainer: '" + _this.activeScene.container.html.elem.id + "'. *");

  _this.activeScene.container.html.elem.style.display = 'none';
  if ( typeof callback == 'function' ) { callback( _this.activeScene ); return; }
  return _this.activeScene;
};// end: closeActiveSceneContainer()

//----------------------------------------------------------------------------
function openLastActiveSceneContainer( _this, callback ) {
  //----------------------------------------------------------------------------
  // NOTE: photo can be selected and is the activeStory but a sceneContainer may
  // not have been created yet for its particles or elements scene.
  if ( !_this.activeStory ) {
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }

  // Recover our last activeScene, if any, and make it visible.
  var activeScene = _this.activeStory.lastActiveScene;
  if ( activeScene ) {
    activeScene.container.html.elem.style.display = 'block';
  }
  console.log( " ..*3.7) openLastActiveSceneContainer() activeStory: '" + _this.activeStory.tag +
               "'. activeScene: '" +
                      (activeScene ? (activeScene.tag + "'. activeSceneContainer: '" + activeScene.container.html.elem.id)
                                   : '*none*') +
               "'. *");

  if ( typeof callback == 'function' ) { callback( activeScene ); return; }
  return activeScene;
};// end: openLastActiveSceneContainer()

//======== ACTIONS Checkboxes =================
//=============================================

//----------------------------------------------------------------------------
function cbox_useTrr( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.5) cbox_useTrr() Box checked = '" + $( '#cbox_useTrr' ).prop('checked') + "'. *");
  _this.settings.isUseTrrData = $( '#cbox_useTrr' ).prop('checked');
  if ( typeof callback == 'function' ) { callback(); return; }
}; // end: cbox_useTrr()

//----------------------------------------------------------------------------
function cbox_useSVG( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.5) cbox_useSVG() Box checked = '" + $( '#cbox_useSVG' ).prop('checked') + "'. *");
  _this.settings.isUseSVGelements = $( '#cbox_useSVG' ).prop('checked');
  if ( typeof callback == 'function' ) { callback(); return; }
}; // end: function cbox_useSVG()

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
