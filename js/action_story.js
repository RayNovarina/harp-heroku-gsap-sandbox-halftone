// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function playSelectedStory( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) playSelectedStory() for activeStory: '" + _this.activeStory.tag + "' *");

  // Hide the active/visible sceneContainer, we will replace it with ours.
  closeActiveSceneContainer( _this,
  /*1-Resume here when done*/ function( activeScene ) {
  tagToScene( _this, 'elements', _this.activeStory,
  /*2-Resume here when done*/ function( result ) {
  openSceneContainer( _this, result.item );

  // Play story for active/selectedPhoto. All scenes, i.e. expand and collapse.
  playStory( _this, _this.activeStory.tag, options,
  /*3-Resume here when done*/ function( story ) {
  if ( typeof callback == 'function' ) { callback( story ); return; }
  return story;
  /*3-*/});/*2-*/});/*1-*/});
}; // end: playSelectedStory()

//----------------------------------------------------------------------------
function playFullStory( _this, photoTag, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) playFullStory() create ParticleMap, animation elements, play story for '" + photoTag + "'. All scenes, i.e. expand and collapse. *");

  elements( _this, { isCreateSceneInCenterPanel: true, tweenDuration: 2, },
  /*1-Resume here when done*/ function( activeScene ) {
  // Play story for active/selectedPhoto. All scenes, i.e. expand and collapse.
  playStory( _this, photoTag, options,
  /*2-Resume here when done*/ function( story ) {
  if ( typeof callback == 'function' ) { callback( story ); return; }
  return story;
  /*1-*/});
  /*1-*/});
}; // end: playFullStory()

//----------------------------------------------------------------------------
function playStory( _this, photoTag, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) playStory() Play story for '" + photoTag + "'. All scenes, i.e. expand and collapse. *");

  photoTagToStory( _this, photoTag,
  /*1-Resume here when done*/ function( result ) {
  if ( !result.isFound ||
       (!result.item.timelines ||
        !result.item.timelines.collapse ) ) {
    alert( "photoTag: '" + photoTag + "'. A story has not been created for this photo yet! You MUST create animationElements first via the 'Elements' link." );
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }
  // NOTE: after elements are built they form an expanded image.
  var story = result.item;
  var delayMsToWaitForStartState = 0;
  // Note: collapse.isReversed means "image is expanded"
  if ( !story.timelines.collapse.isReversed ) {
    delayMsToWaitForStartState = 2000;
    story.timelines.collapse.gsapTimeline.reverse();
    story.timelines.collapse.isReversed = true;
  }
  // Wait for image to get into start position.
  setTimeout(function() {
  /*1a-Resume here when Timeout done*/
  // Collapse the image.
  story.timelines.collapse.gsapTimeline.play();
  story.timelines.collapse.isReversed = false;
  // Wait for collapse to complete.
  var delayMsToWaitForCollapsedState = 2500;
  setTimeout(function() {
  /*1b-Resume here when Timeout done*/
  // Expand the collapse image back to a full image.
  story.timelines.collapse.gsapTimeline.reverse();
  story.timelines.collapse.isReversed = true;
  // Wait for expand to complete.
  var delayMsToWaitForExpandedState = 1000;
  setTimeout(function() {
  /*1c-Resume here when Timeout done*/
  if ( typeof callback == 'function' ) { callback( story ); return; }
  return story;
  }, delayMsToWaitForExpandedState); // end /*1c-timeout*/
  }, delayMsToWaitForCollapsedState); // end /*1b-timeout*/
  }, delayMsToWaitForStartState); // end /*1a-timeout*/
  /*1-*/});
}; // end: playStory()
