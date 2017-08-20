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
  trrPlugin.movie {
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
    photoTag: 'laura',
    photoType: 'color',
    imgSrc: './images/laura_600x600_webgl_filter_greyscale_more_contrast.png',
    isParticlesMode: true,
    isElementsMode: false,
    isLoadReadyForScroll: true,
    isTransformPixels: true,
    isAutoPlay: false,
    isExcludePixels: false,
    isProcessBySkipCount: true,
    isEvery1: true,
    nthPixelToProcess: 1,
    isEvery2: false,
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
    animationElementColor: '#0099cc', // '#70C0EF', // Climate Corp halftone dot blue.
    maxHalftoneDotSize: 1/150,
    pixelChannelIntensityThreshold: 0.05,
    imageScale: 1.0, // canvas.width / imgWidth;
    rgbChannel: 'blue',
    halftoneColor: 'blue',
    sceneBackgroundColor: '#E7F1F7', // Climate Corp "halftone background blue"
    animationElementOffsetX: -80,
    animationElementOffsetY: -20,
  };

  // Create inital settings/options from defaults.
  trrPlugin.settings = trrPlugin.defaults;
  trrPlugin.timeNow = new Date().getTime();
  updateSettings( trrPlugin, { timeNow: trrPlugin.timeNow, id: 'mapTrrEffect_' + trrPlugin.timeNow } );

  // Set default state of checkboxes.
  $( '#cbox_particles_mode' ).prop('checked', trrPlugin.defaults.isParticlesMode );
  $( '#cbox_elements_mode' ).prop('checked', trrPlugin.defaults.isElementsMode );
  $( '#cbox_load4scroll' ).prop('checked', false );
  $( '#cbox_transform' ).prop('checked', trrPlugin.defaults.isTransformPixels );
  $( '#cbox_exclude' ).prop('checked', trrPlugin.defaults.isExcludePixels );
  $( '#cbox_useTrr' ).prop('checked', trrPlugin.defaults.isUseTrrData );

  if ( trrPlugin.defaults.isParticlesMode ) {
    trrPlugin.settings.isUseCanvasElements = false;
    trrPlugin.settings.isUseSVGelements = false;
    trrPlugin.settings.isUseDivElements = false;
  }
  $( '#cbox_useCanvas' ).prop('checked', trrPlugin.settings.isUseCanvasElements );
  $( '#cbox_useSVG' ).prop('checked', trrPlugin.settings.isUseSVGelements );
  $( '#cbox_useDiv' ).prop('checked', trrPlugin.settings.isUseDivElements );

  $( '#cbox_every1' ).prop('checked', trrPlugin.defaults.isEvery1 );
  $( '#cbox_every2' ).prop('checked', trrPlugin.defaults.isEvery2 );
  $( '#cbox_every3' ).prop('checked', trrPlugin.defaults.isEvery3 );
  $( '#cbox_every4' ).prop('checked', trrPlugin.defaults.isEvery4 );
  $( '#cbox_1x1_cluster' ).prop('checked', trrPlugin.defaults.is1x1_cluster );
  $( '#cbox_3x3_cluster' ).prop('checked', trrPlugin.defaults.is3x3_cluster );
  $( '#cbox_5x5_cluster' ).prop('checked', trrPlugin.defaults.is5x5_cluster );
  $( '#cbox_7x7_cluster' ).prop('checked', trrPlugin.defaults.is7x7_cluster );

  // Add click handlers for various functions.
  // NOTE: within click handler 'this' refers to the dom element clicked, i.e.
  // <img> of a new photo.

  //----------------------------------------------------------------------------
  // People
  $( "#newPhotoChris" ).click( function( event ) {
    newPhoto( trrPlugin, { photoType: "color", photoTag: $(this).attr('photoTag'),
                           imgSrc: $(this).attr('data-src') } );
  });
  $( "#newPhotoCurt" ).click( function( event ) {
    newPhoto( trrPlugin, { photoType: "color", photoTag: $(this).attr('photoTag'),
                           imgSrc: $(this).attr('data-src') } );
  });
  //$( "#newPhotoMeg" ).click( function( event ) {
  //  newPhoto( trrPlugin, { photoType: "color", photoTag: $(this).attr('photoTag'),
  //                         imgSrc: $(this).attr('data-src') } );
  //});
  $( "#newPhotoLaura" ).click( function( event ) {
    newPhoto( trrPlugin, { photoType: "color", photoTag: $(this).attr('photoTag'),
                           imgSrc: $(this).attr('data-src') } );
  });
  $( "#newPhotoGary" ).click( function( event ) {
    newPhoto( trrPlugin, { photoType: "color", photoTag: $(this).attr('photoTag'),
                           imgSrc: $(this).attr('data-src') } );
  });
  //$( "#newPhotoMike" ).click( function( event ) {
  //  newPhoto( trrPlugin, { photoType: "color", photoTag: $(this).attr('photoTag'),
  //                         imgSrc: $(this).attr('data-src') } );
  //});
  //$( "#newCcHalftoneMike" ).click( function( event ) {
  //  newPhoto( trrPlugin, { photoType: "halftone", photoTag: $(this).attr('photoTag'),
  //                         imgSrc: $(this).attr('data-src') } );
  //});
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
      tweenDuration: 1.5,
    } );
  });
  $( "#expand" ).click( function() {
    expand( trrPlugin, { autoPlay: true, tweenDuration: 2.5 } );
  });
  $( "#collapse" ).click( function() {
    collapse( trrPlugin, { autoPlay: true, tweenDuration: 3 } );
  });
  //$( "#play" ).click( function() {
  //  playSegment( trrPlugin, {} );
  //});
  $( "#playStory" ).click( function() {
    playSelectedStory( trrPlugin, {} );
  });
  //$( "#playMovie" ).click( function() {
  //  playMovie( trrPlugin, {} );
  //});
  $( "#makeReadyForScroll" ).click( function( event ) {
    loadReadyForScroll( trrPlugin, { event: event } );
  });

  // "Scroll To" links.
  jQuery( '.trr-scroll-to' ).click( function( attribs ) {
    scrollTo( trrPlugin, { event: attribs } );
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


  // Select, display default photo.
  newPhoto( trrPlugin, { photoTag: trrPlugin.defaults.photoTag, photoType: trrPlugin.defaults.photoType, imgSrc: trrPlugin.defaults.imgSrc },
  /*1-Resume here when done*/ function( image ) {

  // Preload all photos, particles, elements, timelines.
  if ( trrPlugin.settings.isLoadReadyForScroll ) {
      loadReadyForScroll( trrPlugin, {} );
  }
  /*1-*/});

  // DONE
  if ( typeof callback == 'function' ) { callback( trrPlugin ); return; }
  return trrPlugin;
}; // end: trr_init()


// Private methods in context of plugIn instance, i.e. this
// NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin
//----------------------------------------------------------------------------
//function init_reset( _this ) {
//};// end: init_reset()
