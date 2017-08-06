//------------------------------------------------------------------------------
function trr_init(/*Code to resume when done*/ callback ) {
  //----------------------------------------------------------------------------

  // Create plugIn instance, defaults.
  var trrPlugin = new TrrEffect();
  trrPlugin.timeNow = new Date().getTime();
  trrPlugin.$el = $( '#selectedPhoto' );;
  var $el = trrPlugin.$el;

  trrPlugin.defaults = {
    img: document.getElementById( 'selectedPhoto'),
    $img: $el,
    photoTag: $el.attr('photoTag'),
    photoType: $el.attr('photoType'),
    isTransformPixels: true,
    isExcludePixels: false,
    isProcessBySkipCount: true,
    isEvery1: false,
    nthPixelToProcess: 3,
    isEvery2: false,
    isEvery3: true,
    isEvery4: false,
    is1x1_cluster: false,
    is3x3_cluster: false,
    is5x5_cluster: false,
    is7x7_cluster: false,
    isProcessByCluster: false,
    pixelsPerClusterSide: 5,
    isUseTrrData: false,
    isUseSVGelements: false,
    isYoyoEffect: false,
    isActionsUseMovedConversionContainer: false,
  };

  // Create settings for first time, will get settings from defaults.
  trrPlugin.settings = updateSettings( trrPlugin, {
      timeNow: trrPlugin.timeNow,
      id: 'mapTrrEffect_' + trrPlugin.timeNow } );

  trrPlugin.particles = [];
  trrPlugin.conversionContainer = document.getElementById( 'conversionContainer' );
  trrPlugin.animationContainer = document.getElementById( 'animationContainer' );

  // Set default state of checkboxes.
  $( '#cbox_transform' ).prop('checked', trrPlugin.defaults.isTransformPixels );
  $( '#cbox_exclude' ).prop('checked', trrPlugin.defaults.isExcludePixels );
  $( '#cbox_useTrr' ).prop('checked', trrPlugin.defaults.isUseTrrData );
  $( '#cbox_useSVG' ).prop('checked', trrPlugin.defaults.isUseSVGelements );
  $( '#cbox_yoyo' ).prop('checked', trrPlugin.defaults.isYoyoEffect );

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

  //----------------------------------------------------------------------------
  // Actions
  $( "#convert" ).click( function() {
    convert( trrPlugin );
    //trrPlugin.convert( trrPlugin, {},
    ///*1-Resume here when done/ function() {
    //var imgSrc = trrPlugin.settings.imgSrc;
    ///*1-/}.bind( trrPlugin ));
  });
  $( "#elements" ).click( function() {
    elements( trrPlugin );
  });
  $( "#explode" ).click( function() {
    explode( trrPlugin, { tweenDuration: 4.0 } );
  });
  $( "#collapse" ).click( function() {
    collapse( trrPlugin, { tweenDuration: 6.0 } );
  });
  $( "#riseUp" ).click( function() {
    riseUp( trrPlugin, { tweenDuration: 4.0 } );
  });
  $( "#combineAll" ).click( function() {
    combineAll( trrPlugin, { tweenDuration: 4.0 } );
  });
  //$( "#reset" ).click( function() {
  //  reset( trrPlugin );
  //});

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
  $( "#cbox_useSVG" ).click( function( event ) {
    cbox_useSVG( trrPlugin, { event: event } );
  });
  $( "#cbox_yoyo" ).click( function( event ) {
    cbox_yoyo( trrPlugin, { event: event } );
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
