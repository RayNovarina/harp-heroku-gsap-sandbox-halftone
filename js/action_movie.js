// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function playMovie( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) playMovie() for activeStory: '" + _this.activeStory.tag + "' *");

  // animationElements MUST have already been created.
  if ( !_this.activeStory.timelines ||
       !_this.activeStory.timelines.storyTimeline ) {
    alert('You MUST create animationElements first via the "Particles, Elements" links.');
    if ( typeof callback == 'function' ) { callback(); return; }
    return;
  }

  // Hide the active/visible sceneContainer, we will replace it with ours.
  closeActiveSceneContainer( _this,
  /*1-Resume here when done*/ function( activeScene ) {
  tagToScene( _this, 'elements', _this.activeStory,
  /*2-Resume here when done*/ function( result ) {

  openSceneContainer( _this, result.item );
  var delayMsToWaitForCollapsedState = 0;
  if ( !_this.activeStory.timelines.expandTimelineIsReversed ) {
    delayMsToWaitForCollapsedState = 2000;
    _this.activeStory.timelines.expandTimeline.reverse();
    _this.activeStory.timelines.expandTimelineIsReversed = true;
  }
  setTimeout(function() {
  /*2a-Resume here when Timeout done*/
  _this.activeStory.timelines.expandTimeline.play();
  _this.activeStory.timelines.expandTimelineIsReversed = false;
  setTimeout(function() {
  /*2b-Resume here when Timeout done*/
  _this.activeStory.timelines.expandTimeline.reverse();
  _this.activeStory.timelines.expandTimelineIsReversed = true;
  if ( typeof callback == 'function' ) { callback(); return; }
  return;
  }, 2500); // end /*2b-timeout*/
  }, delayMsToWaitForCollapsedState); // end /*2a-timeout*/

  /*2-*/});/*1-*/});
}; // end: playMovie()
