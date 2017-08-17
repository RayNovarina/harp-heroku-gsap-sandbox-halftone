//------------------------------------------------------------------------------
function trr_init(/*Code to resume when done*/ callback ) {
  //----------------------------------------------------------------------------

  // Create plugIn instance, defaults.
  var trrPlugin = new TrrEffect();
  trrPlugin.$el = $( '#selectedPhoto' );;
  var $el = trrPlugin.$el;
  trrPlugin.leftPanel = document.getElementById( 'leftPanel' );
  trrPlugin.centerPanel = document.getElementById( 'centerPanel' );
  trrPlugin.rightPanel = document.getElementById( 'rightPanel' );
  /*
  _this.movie {
    lastActiveStory: story,
    stories: [ {
      lastActiveScene: scene,
      tag: _this.settings.photoTag,
      timelines: {
        particles: particlesTimeline,
        expand: expandTimeline,
        expandTimelineIsReversed: false,
        story: storyTimeline,
      },
      particleMap: {
        particles: _this.particles,
        gridSize: 5.568,
      },
      image: {
        html {
          elem: _this.img,
          src: img.src,
        },
        ctxImgData: [],
      },
      scenes: [ { story: story,
                  tag: _this.settings.sceneTag,
                  proxyContainerTag: elements.scene.tag,
                  container: {
                    panelElem: elem,
                    html: {
                      elem: sceneContainer,
                    },
                  },
                  animationElements: {
                    container: {
                      html: {
                        elem: aniContainerObj,
                        string: '',
                      },
                    },
                    domElements: {
                      html: {
                        elems: domElementsObjsArray[],
                        string: '',
                      },
                    },
                  },
              } ],
      ]
  });
  */
  trrPlugin.movie = newMovie( trrPlugin );

  trrPlugin.defaults = {
    img: document.getElementById( 'selectedPhoto'),
    $img: $el,
    photoTag: 'meg',
    photoType: 'color',
    imgSrc: './images/meg_makalou_CC_581x600.jpg',
    isParticlesMode: true,
    isElementsMode: false,
    isTransformPixels: true,
    isAutoPlay: false,
    isExcludePixels: false,
    isProcessBySkipCount: true,
    isEvery1: false,
    nthPixelToProcess: 2,
    isEvery2: true,
    isEvery3: false,
    isEvery4: false,
    is1x1_cluster: false,
    is3x3_cluster: false,
    is5x5_cluster: false,
    is7x7_cluster: false,
    isProcessByCluster: false,
    pixelsPerClusterSide: 5,
    isUseTrrData: false,
    isRenderParticleMap: false,
    isUseCanvasElements: false,
    isUseSVGelements: true,
    isUseDivElements: false,
    animationElementColor: '#70C0EF',
    maxHalftoneDotSize: 1/150,
    pixelChannelIntensityThreshold: 0.05,
    imageScale: 1.0, // canvas.width / imgWidth;
    rgbChannel: 'blue',
    halftoneColor: 'blue',
    sceneBackgroundColor: '#E7F1F7', // Climate Corp "halftone background blue"
    animationElementOffsetX: -80,
    animationElementOffsetY: -20,
  };
  init_reset( trrPlugin ); // includes selecting default photo.

  // Add click handlers for various functions.
  // NOTE: within click handler 'this' refers to the dom element clicked, i.e.
  // <img> of a new photo.

  //----------------------------------------------------------------------------
  // People
  $( "#newPhotoMike" ).click( function( event ) {
    newPhoto( trrPlugin, { photoType: "color", photoTag: $(this).attr('photoTag'),
                           imgSrc: $(this).attr('data-src') } );
  });
  $( "#newPhotoMeg" ).click( function( event ) {
    newPhoto( trrPlugin, { photoType: "color", photoTag: $(this).attr('photoTag'),
                           imgSrc: $(this).attr('data-src') } );
  });
  $( "#newPhotoLaura" ).click( function( event ) {
    newPhoto( trrPlugin, { photoType: "color", photoTag: $(this).attr('photoTag'),
                           imgSrc: $(this).attr('data-src') } );
  });
  $( "#newPhotoGary" ).click( function( event ) {
    newPhoto( trrPlugin, { photoType: "color", photoTag: $(this).attr('photoTag'),
                           imgSrc: $(this).attr('data-src') } );
  });
  $( "#newCcHalftoneMike" ).click( function( event ) {
    newPhoto( trrPlugin, { photoType: "halftone", photoTag: $(this).attr('photoTag'),
                           imgSrc: $(this).attr('data-src') } );
  });
  $( "#newCcHalftoneMeg" ).click( function( event ) {
    newPhoto( trrPlugin, { photoType: "halftone", photoTag: $(this).attr('photoTag'),
                           imgSrc: $(this).attr('data-src') } );
  });
  //----------------------------------------------------------------------------
  // Actions
  $( "#cbox_particles_mode" ).click( function( event ) {
    cbox_particles_mode( trrPlugin, { event: event } );
  });
  $( "#cbox_elements_mode" ).click( function( event ) {
    cbox_elements_mode( trrPlugin, { event: event } );
  });

  $( "#particles" ).click( function() {
    particles( trrPlugin, {
      // Display full image as halftone made from particleMap particles.
      isRenderParticleMap: true,
      isCreateSceneInCenterPanel: true,
    } );
  });
  $( "#elements" ).click( function() {
    elements( trrPlugin, {
      autoPlay: false, // expand from collapsed view to full image.
      isCreateSceneInCenterPanel: true,
      tweenDuration: 2,
    } );
  });
  $( "#collapse" ).click( function() {
    collapse( trrPlugin, { autoPlay: true, tweenDuration: 3 } );
  });
  $( "#expand" ).click( function() {
    expand( trrPlugin, { autoPlay: true, tweenDuration: 2.5 } );
  });
  //$( "#play" ).click( function() {
  //  playSegment( trrPlugin, {} );
  //});
  $( "#playStory" ).click( function() {
    playSelectedStory( trrPlugin, {} );
  });
  $( "#playMovie" ).click( function() {
    playMovie( trrPlugin, {} );
  });


  //----------------------------------------------------------------------------
  // Action checkboxesRow1

  $( "#cbox_transform" ).click( function( event ) {
    cbox_transform( trrPlugin, { event: event } );
  });
  $( "#cbox_exclude" ).click( function( event ) {
    cbox_exclude( trrPlugin, { event: event } );
  });
  $( "#cbox_useTrr" ).click( function( event ) {
    cbox_useTrr( trrPlugin, { event: event } );
  });
  $( "#cbox_useCanvas" ).click( function( event ) {
    cbox_useCanvas( trrPlugin, { event: event } );
  });
  $( "#cbox_useSVG" ).click( function( event ) {
    cbox_useSVG( trrPlugin, { event: event } );
  });
  $( "#cbox_useDiv" ).click( function( event ) {
    cbox_useDiv( trrPlugin, { event: event } );
  });

  //----------------------------------------------------------------------------
  // checkboxesRow1
  $( "#cbox_every1" ).click( function( event ) {
    cbox_every1( trrPlugin, { event: event } );
  });
  $( "#cbox_every2" ).click( function( event ) {
    cbox_every2( trrPlugin, { event: event } );
  });
  $( "#cbox_every3" ).click( function( event ) {
    cbox_every3( trrPlugin, { event: event } );
  });
  $( "#cbox_every4" ).click( function( event ) {
    cbox_every4( trrPlugin, { event: event } );
  });
  $( "#cbox_1x1_cluster" ).click( function( event ) {
    cbox_1x1_cluster( trrPlugin, { event: event } );
  });
  $( "#cbox_3x3_cluster" ).click( function( event ) {
    cbox_3x3_cluster( trrPlugin, { event: event } );
  });
  $( "#cbox_5x5_cluster" ).click( function( event ) {
    cbox_5x5_cluster( trrPlugin, { event: event } );
  });
  $( "#cbox_7x7_cluster" ).click( function( event ) {
    cbox_7x7_cluster( trrPlugin, { event: event } );
  });
  if ( typeof callback == 'function' ) { callback( trrPlugin ); return; }
  return trrPlugin;
}; // end: trr_init()


// Private methods in context of plugIn instance, i.e. this
// NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin
//----------------------------------------------------------------------------
function init_reset( _this ) {

  if ( _this.settings == 'undefined' ) {
    // onDomReady() init.
  } else {
    // Reset link clicked after load. Maybe conversion, actions done.
    //var previousId = _this.settings.
  }

  _this.settings = _this.defaults;
  _this.timeNow = new Date().getTime();
  updateSettings( _this, { timeNow: _this.timeNow, id: 'mapTrrEffect_' + _this.timeNow } );

  // Set default state of checkboxes.
  $( '#cbox_particles_mode' ).prop('checked', _this.defaults.isParticlesMode );
  $( '#cbox_elements_mode' ).prop('checked', _this.defaults.isElementsMode );
  $( '#cbox_transform' ).prop('checked', _this.defaults.isTransformPixels );
  $( '#cbox_exclude' ).prop('checked', _this.defaults.isExcludePixels );
  $( '#cbox_useTrr' ).prop('checked', _this.defaults.isUseTrrData );

  if ( _this.defaults.isParticlesMode ) {
    _this.settings.isUseCanvasElements = false;
    _this.settings.isUseSVGelements = false;
    _this.settings.isUseDivElements = false;
  }
  $( '#cbox_useCanvas' ).prop('checked', _this.settings.isUseCanvasElements );
  $( '#cbox_useSVG' ).prop('checked', _this.settings.isUseSVGelements );
  $( '#cbox_useDiv' ).prop('checked', _this.settings.isUseDivElements );

  $( '#cbox_every1' ).prop('checked', _this.defaults.isEvery1 );
  $( '#cbox_every2' ).prop('checked', _this.defaults.isEvery2 );
  $( '#cbox_every3' ).prop('checked', _this.defaults.isEvery3 );
  $( '#cbox_every4' ).prop('checked', _this.defaults.isEvery4 );
  $( '#cbox_1x1_cluster' ).prop('checked', _this.defaults.is1x1_cluster );
  $( '#cbox_3x3_cluster' ).prop('checked', _this.defaults.is3x3_cluster );
  $( '#cbox_5x5_cluster' ).prop('checked', _this.defaults.is5x5_cluster );
  $( '#cbox_7x7_cluster' ).prop('checked', _this.defaults.is7x7_cluster );

  // Add click handlers for our "Scroll To" links.
  jQuery( '.trr-scroll-to' ).click( function( attribs ) {
    scrollTo( trrPlugin, { event: attribs } );
  });

  // Select, display default photo.
  newPhoto( _this, { photoTag: _this.defaults.photoTag, photoType: _this.defaults.photoType, imgSrc: _this.defaults.imgSrc },
  /*1-Resume here when done*/ function( image ) {
  /*1-*/});

};// end: init_reset()
