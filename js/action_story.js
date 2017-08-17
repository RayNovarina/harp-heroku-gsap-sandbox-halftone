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

  particles( _this, { isOnlyIfNewParticleMap: true, isRenderParticleMap: true, isCreateSceneInCenterPanel: true },
  /*1-Resume here when done*/ function( activeScene ) {
  setTimeout(function() {
  /*1a-Resume here when Timeout done*/
  elements( _this, { isOnlyIfNewElements: true, autoPlay: false, isCreateSceneInCenterPanel: true, tweenDuration: 2, },
  /*1b-Resume here when done*/ function( activeScene ) {
  setTimeout(function() {
  /*1c-Resume here when Timeout done*/
  // Play story for active/selectedPhoto. All scenes, i.e. expand and collapse.
  playStory( _this, photoTag, options,
  /*1d-Resume here when done*/ function( story ) {
  if ( typeof callback == 'function' ) { callback( story ); return; }
  return story;
/*1d-*/}); }, 2000); // end /*1c-timeout*/
/*1b-*/}); }, 500); // end /*1a-timeout*/
  /*1-*/});
}; // end: playFullStory()

//----------------------------------------------------------------------------
function playStory( _this, photoTag, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) playStory() Play story for '" + photoTag + "'. All scenes, i.e. expand and collapse. *");

  photoTagToStory( _this, photoTag,
  /*1-Resume here when done*/ function( result ) {
  if ( !result.isFound ||
       (!_this.activeStory.timelines ||
        !_this.activeStory.timelines.expandTimeline ) ) {
    alert( "photoTag: '" + photoTag + "'. A story has not been created for this photo yet! You MUST create animationElements first via the 'Particles, Elements' links." );
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }
  var story = result.item;
  var delayMsToWaitForCollapsedState = 0;
  if ( !_this.activeStory.timelines.expandTimelineIsReversed ) {
    delayMsToWaitForCollapsedState = 2000;
    _this.activeStory.timelines.expandTimeline.reverse();
    _this.activeStory.timelines.expandTimelineIsReversed = true;
  }
  setTimeout(function() {
  /*1a-Resume here when Timeout done*/
  _this.activeStory.timelines.expandTimeline.play();
  _this.activeStory.timelines.expandTimelineIsReversed = false;
  setTimeout(function() {
  /*1b-Resume here when Timeout done*/
  _this.activeStory.timelines.expandTimeline.reverse();
  _this.activeStory.timelines.expandTimelineIsReversed = true;
  if ( typeof callback == 'function' ) { callback( story ); return; }
  return story;
  }, 2500); // end /*1b-timeout*/
  }, delayMsToWaitForCollapsedState); // end /*1a-timeout*/
  /*1-*/});
}; // end: playStory()
