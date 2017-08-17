// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function playMovie( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) playMovie() *");

  // Hide the active/visible sceneContainer, we will replace it with ours.
  closeActiveSceneContainer( _this,
  /*1-Resume here when done*/ function( activeScene ) {
  tagToScene( _this, 'elements', _this.activeStory,
  /*2-Resume here when done*/ function( result ) {
  openSceneContainer( _this, result.item );
  var photo_imgs = $( '.trr-photo-effect' ).toArray();
  $.each( photo_imgs, function( idx, photo_img ) {
  // Play story for active/selectedPhoto. All scenes, i.e. expand and collapse.
  playFullStory( _this, $(photo_img).attr('photoTag'), options,
  /*2a-Resume here when done*/ function( story ) {
  if ( idx == photo_imgs.length - 1 ) {
    if ( typeof callback == 'function' ) { callback( story ); return; }
    return story;
  }
  /*2a-*/});
  }); // end $.each()
  /*2-*/});/*1-*/});
}; // end: playMovie()
