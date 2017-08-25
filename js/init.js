//------------------------------------------------------------------------------
function trr_init(/*Code to resume when done*/ callback ) {
  //----------------------------------------------------------------------------

  // Create plugIn instance, defaults.
  var trrPlugin = new TrrEffect();
  trrPlugin.$el = $( '#selectedPhoto' );;
  var $el = trrPlugin.$el;
  trrPlugin.leftPanel = document.getElementById( 'leftPanel' );
  trrPlugin.centerPanel = document.getElementById( 'centerPanel' );
  /*
  trrPlugin.movie {
    lastActiveStory: story,
    stories: [ {
      lastActiveScene: scene,
      tag: _this.settings.photoTag,
      timelines: {
        collapse: {
          sceneTag: 'convert',
          gsapTimeline: collapseTimeline,
          isReversed: false,
          isRandomizedCollapsedCore: false,
        },
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
    isLoadReadyForScroll: false,
    isTransformPixels: true,
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
    isParticlesFromFile: false,
    isParticlesFromPhoto: true,
    isRenderParticleMap: true,
    isRenderElementsImage: true,
    isCreateElementsObjArray: false,
    isUseSVGelements: true,
    elementsAnimationElementColor: '#0099cc', // '#70C0EF', // Climate Corp halftone dot blue.
    particleMapAnimationElementColor: 'black',
    maxHalftoneDotSize: 1/150,
    pixelChannelIntensityThreshold: 0.05,
    imageScale: 1.0, // canvas.width / imgWidth;
    rgbChannel: 'blue',
    isParticlesObjAsHashArray: true,
    isParticlesObjAsString: false,
    isParticlesObjAsArray: false,
    halftoneColor: 'blue',
    isCreateSceneInCenterPanel: true,
    sceneBackgroundColor: '#E7F1F7', // Climate Corp "halftone background blue"
    animationElementOffsetX: -80,
    animationElementOffsetY: -20,
  };

  // Create inital settings/options from defaults.
  trrPlugin.settings = trrPlugin.defaults;
  trrPlugin.timeNow = new Date().getTime();
  updateSettings( trrPlugin, { timeNow: trrPlugin.timeNow, id: 'mapTrrEffect_' + trrPlugin.timeNow } );

  // Set default state of checkboxes.
  $( '#cbox_load4scroll' ).prop('checked', false );
  $( '#cbox_fromFile' ).prop('checked', trrPlugin.defaults.isParticlesFromFile );
  $( '#cbox_fromPhoto' ).prop('checked', trrPlugin.defaults.isParticlesFromPhoto );
  $( '#cbox_useSVG' ).prop('checked', trrPlugin.settings.isUseSVGelements );
  $( '#cbox_exclude' ).prop('checked', trrPlugin.defaults.isExcludePixels );
  $( '#cbox_transform' ).prop('checked', trrPlugin.defaults.isTransformPixels );
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

  $( "#particles" ).click( function() {
    particles( trrPlugin, {
      isOnlyIfNewParticleMap: false,
      isRenderParticleMap: true,
    } );
  });
  $( "#elements" ).click( function() {
    elements( trrPlugin, {
      isOnlyIfNewParticleMap: true,
      isRenderElementsImage: true,
      isCreateElementsObjArray: false,
      tweenDuration: 2,
    } );
  });
  $( "#collapse" ).click( function() {
    collapse( trrPlugin, {} );
  });
  $( "#expand" ).click( function() {
    expand( trrPlugin, {} );
  });
  $( "#save" ).click( function() {
    save( trrPlugin, {} );
  });
  $( "#makeReadyForScroll" ).click( function( event ) {
    loadReadyForScroll( trrPlugin, { event: event,
      isOnlyIfNewParticleMap: false,
      isRenderParticleMap: false,
      isRenderElementsImage: true,
      isCreateElementsObjArray: false,
      tweenDuration: 2, } );
  });

  // "Scroll To" links.
  jQuery( '.trr-scroll-to' ).click( function( attribs ) {
    scrollTo( trrPlugin, { event: attribs } );
  });

  //----------------------------------------------------------------------------
  // Action checkboxes

  $( "#cbox_useSVG" ).click( function( event ) {
    cbox_useSVGelements( trrPlugin, { event: event } );
  });

  $( "#cbox_fromPhoto" ).click( function( event ) {
    cbox_particlesFromPhoto( trrPlugin, { event: event } );
  });
  $( "#cbox_fromFile" ).click( function( event ) {
    cbox_particlesFromFile( trrPlugin, { event: event } );
  });

  $( "#cbox_exclude" ).click( function( event ) {
    cbox_exclude( trrPlugin, { event: event } );
  });
  $( "#cbox_transform" ).click( function( event ) {
    cbox_transform( trrPlugin, { event: event } );
  });
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
