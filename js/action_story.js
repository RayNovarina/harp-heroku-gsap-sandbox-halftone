// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function playStory( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  selectedPhotoToStory( _this,
  /*1-Resume here when done*/ function( result ) {
  _this.activeStory = result.item;
  console.log( " ..*4.2) playStory() *");
  _this.activeStory.expandTimeline.play();
  // _this.activeStory.expandTimeline.reverse();
  if ( typeof callback == 'function' ) { callback(); return; }
  return;
  /*1-*/});
}; // end: playStory()
