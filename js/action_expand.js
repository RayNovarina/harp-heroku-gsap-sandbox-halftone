// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function expand( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  selectedPhotoToStory( _this,
  /*1-Resume here when done*/ function( result ) {
  var selectedStory = result.item;
  console.log( " ..*4.2) expand() *");
  // Hide the active/visible sceneContainer, we will replace it with ours.
  _this.activeScene.container.html.elem.style.display = 'none';
  tagToScene( _this, 'elements', selectedStory,
  /*2-Resume here when done*/ function( result ) {
  var elementsSceneForSelectedStory = result.item
  elementsSceneForSelectedStory.container.html.elem.style.display = 'block';
  selectedStory.expandTimeline.play();
  if ( typeof callback == 'function' ) { callback(); return; }
  return;
  /*2-*/});/*1-*/});
}; // end: expand()


/*
//----------------------------------------------------------------------------
function expand( _this, options, /*Code to resume when done/ callback ) {
  //--------------------------------------------------------------------------
  options.sceneTag = 'expand';
  expand_reset( _this, { sceneTag: options.sceneTag } );
  updateSettings( _this, options );

  selectedPhotoToStory( _this,
  /*1-Resume here when done/ function( result ) {
  _this.activeStory = result.item;
  console.log( " ..*4.2) expand() *");

  var expandScene = newScene( _this, options.sceneTag );
  playSceneIfAutoPlay( _this, { scene: expandScene },
  /*2-Resume here when done/ function( timeline ) {
  if ( typeof callback == 'function' ) { callback(); return; }
  return;
  /*2-/});/*1-/});
}; // end: expand()


//----------------------------------------------------------------------------
function expand_reset( _this, options ) {
  //----------------------------------------------------------------------------
  if ( _this.settings == 'undefined' ) {
    // onDomReady() init.
  } else {
    //if ( _this.activeScene ) {
    //  // Hide the active/visible sceneContainer, we will replace it with ours.
    //  _this.activeScene.container.html.elem.style.display = 'none';
    //}
  }
};// end: expand_reset()
*/
