// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function loadReadyForScroll( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) loadReadyForScroll() *");
  var $clickedElem = $( (options.event ? options.event.currentTarget : '#makeReadyForScroll') );

  // To be able to use the scrollTo links smoothly, for each photo:
  //   1) make ParticleMap
  //   2) make Animation Elements
  //   3) Expand to Full Image
  //   4) Collapse to rest position.
  // When done with all: Scroll to default photo, checkmark the
  // "make ready for scrolling" checkbox, change text msg, make it bold.

  var photo_imgs = $( '.trr-photo-effect' ).toArray();
  var idx = 0;
  selectPhotoMakeParticlesAndElements( _this, options, photo_imgs, idx,
  /*1-Resume here when done*/ function( story ) {
  idx = 1;
  selectPhotoMakeParticlesAndElements( _this, options, photo_imgs, idx,
  /*2-Resume here when done*/ function( story ) {
  idx = 2;
  selectPhotoMakeParticlesAndElements( _this, options, photo_imgs, idx,
  /*3-Resume here when done*/ function( story ) {
  idx = 3;
  selectPhotoMakeParticlesAndElements( _this, options, photo_imgs, idx,
  /*4-Resume here when done*/ function( story ) {

  // Done with all: scrollTo default photo, expand the default image,
  // checkmark checkbox, change text msg, make it bold.
  scrollTo( _this, { toPhotoTag: _this.defaults.photoTag },
  /*5-Resume here when done*/ function( toPhotoTag ) {
  $( '#cbox_load4scroll' ).prop('checked', true ).prop('disabled', true );
  $clickedElem.css('font-weight', 'bold')
              .css('color', 'green')
              .css('text-decoration', 'none')
              .css('cursor', 'default')
              //.style('disabled', 'disabled')
              .html('READY FOR SCROLLING');
  if ( typeof callback == 'function' ) { callback(); return; }
  return;
  /*5-*/});/*4-*/});/*3-*/});/*2-*/});/*1-*/});
}; // end: loadReadyForScroll()

//--------------------------------------------------------------------------
function selectPhotoMakeParticlesAndElements(  _this, options, photo_imgs, photo_index, callback ) {
  //--------------------------------------------------------------------------
  var photo_img = photo_imgs[photo_index];
  var beforePlayFullStorylayDelayMs = 0,
      afterPlayFullStoryDelayMs = 1000,
      photoTag = $(photo_img).attr('photoTag');
  // Select, display specified photo.
  newPhoto( _this, { photoTag: photoTag, photoType: $(photo_img).attr('photoType'), imgSrc: $(photo_img).attr('data-src') },
  /*1-Resume here when done*/ function( image ) {
  console.log( " ..*4.2.1) selectPhotoMakeParticlesAndElements() NOW Waiting '" + beforePlayFullStorylayDelayMs +
               "ms' BEFORE creating particles and animation elements and playing story for '" + photoTag + "'. *");
  setTimeout(function() {
  /*1a-Resume here when Timeout done*/
  // make ParticleMap, Animation Elements at rest position, Expand to Full Image,
  // Collapse to rest position.
  playFullStory( _this, photoTag, options,
  /*1b-Resume here when done*/ function( story ) {
  console.log( " ..*4.2.2) selectPhotoMakeParticlesAndElements() NOW Waiting '" + afterPlayFullStoryDelayMs +
               "ms' AFTER playing story for '" + photoTag + "'. *");

  setTimeout(function() {
  /*1c-Resume here when Timeout done*/
  if ( typeof callback == 'function' ) { callback( story ); return; }
  return story;
}, afterPlayFullStoryDelayMs); // end /*1c-timeout*/
  /*1b-*/}); }, beforePlayFullStorylayDelayMs); // end /*1a-timeout*/
  /*1-*/});
}; // end: selectPhotoMakeParticlesAndElements()
