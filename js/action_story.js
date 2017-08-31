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

  // Play story for active/selectedPhoto. All scenes, i.e. expand and main.
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
  options.tweenDuration = 3;
  elements( _this, {
    isOnlyIfNewParticleMap: false,
    isRenderElementsImage: true,
    isCreateElementsObjArray: false,
    tweenDuration: options.tweenDuration,
    isCreateSceneInCenterPanel: true,
  },
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
        !result.item.timelines.main ) ) {
    alert( "photoTag: '" + photoTag + "'. A story has not been created for this photo yet! You MUST create animationElements first via the 'Elements' link." );
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }
  // NOTE: after elements are built they form an expanded image or an invisible collapsed core.
  var story = result.item;

  // NOTE: a story is a "collapse and expand" cycle. Play timeline forwards and in reverse.
  // First make sure we start in the "start" state.
  var delayMsToWaitForStartState = 0;
  if ( !isInStartPosition( _this, story ) ) {
    // The start position of a timeline depends on how the timeline was initially built.
    startPosition( _this, _this.activeStory, _this.activeStory.timelines.main );
    delayMsToWaitForStartState = (options.tweenDuration * 1000) + 500;
  }
  // Wait for image to get into start position.
  setTimeout(function() {
  /*1a-Resume here when Timeout done*/

  playTimelineForwards( _this.activeStory.timelines.main );
  // Wait for timeline.play() to complete.
  var delayMsToWaitForTimelinePlay = (options.tweenDuration * 1000) + 1500;
  setTimeout(function() {
  /*1b-Resume here when Timeout done*/

  playTimelineBackwards( _this.activeStory.timelines.main );
  // Wait for timeline.reverse() to complete.
  var delayMsToWaitForTimelineReverse = options.tweenDuration * 1000;
  setTimeout(function() {
  /*1c-Resume here when Timeout done*/

  if ( typeof callback == 'function' ) { callback( story ); return; }
  return story;

}, delayMsToWaitForTimelineReverse); // end /*1c-timeout*/
  }, delayMsToWaitForTimelinePlay); // end /*1b-timeout*/
  }, delayMsToWaitForStartState); // end /*1a-timeout*/
  /*1-*/});
}; // end: playStory()
