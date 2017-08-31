// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function expand( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  if (_this.logging){console.log( " ..*4.2) expand() for activeStory: '" + _this.activeStory.tag + "' *");}
  // animationElements MUST have already been created.
  if ( !_this.activeStory.timelines ||
       !_this.activeStory.timelines.main ) {
    alert( "photoTag: '" + _this.activeStory.tag + "'. You MUST create animationElements first via the 'Convert' link." );
    if ( typeof callback == 'function' ) { callback(); return; }
    return;
  }

  // Hide the active/visible sceneContainer, we will replace it with ours.
  closeActiveSceneContainer( _this,
  /*1-Resume here when done*/ function( activeScene ) {
  tagToScene( _this, _this.activeStory.timelines.main.sceneTag, _this.activeStory,
  /*2-Resume here when done*/ function( result ) {
  openSceneContainer( _this, result.item );

  if ( isInCollapsedPosition( _this, _this.activeStory ) ) {
    if (_this.logging){console.log( " ..*4.2a) expand(): " +
    "Image is currently collapsed. The direction we play the timeline depends " +
    "on how the timeline was initially built. *");}
    if ( _this.settings.isStartImageCollapsed ) {
      if (_this.logging){console.log( " ..*4.2b) expand(): " +
      "Image initially built in collapsed position. *");}
      // If built in collapsed position and currently collapsed, play timeline
      // forwards to move particles from collapsed position to full image position.
      playTimelineForwards( _this, _this.activeStory.timelines.main );
    } else { // _this.settings.isStartImageExpanded ) {
      if (_this.logging){console.log( " ..*4.2c) expand(): " +
      "Image initially built in expanded position. *");}
      // If built in expanded position and currently collapsed, play timeline in
      // reverse to move particles from collapsed position to full image position.
      playTimelineBackwards( _this, _this.activeStory.timelines.main );
    }
  } else {
    if (_this.logging){console.log( " ..*4.2d) expand(): " +
    "We are already in an expanded position, nothing to do. *");}
  }

  if ( typeof callback == 'function' ) { callback(); return; }
  return;
  /*2-*/});/*1-*/});
}; // end: expand()

/*
//----------------------------------------------------------------------------
function expand( _this, options, /*Code to resume when done/ callback ) {
  //--------------------------------------------------------------------------
  selectedPhotoToStory( _this,
  /*1-Resume here when done/ function( result ) {
  var selectedStory = result.item;
  if (_this.logging){console.log( " ..*4.2) expand() *");
  // Hide the active/visible sceneContainer, we will replace it with ours.
  _this.activeScene.container.html.elem.style.display = 'none';
  tagToScene( _this, 'elements', selectedStory,
  /*2-Resume here when done/ function( result ) {
  var elementsSceneForSelectedStory = result.item
  elementsSceneForSelectedStory.container.html.elem.style.display = 'block';
  selectedStory.collapseTimeline.play();
  if ( typeof callback == 'function' ) { callback(); return; }
  return;
  /*2-/});/*1-/});
}; // end: expand()
*/

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
  if (_this.logging){console.log( " ..*4.2) expand() *");

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
