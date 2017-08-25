// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function scrollTo( _this, options, callback ) {
  //----------------------------------------------------------------------------
  var $scrolledToElem = ( options.toPhotoTag ? null : $( options.event.currentTarget ) ),
      toPhotoTag = options.toPhotoTag || $scrolledToElem.attr( 'photoTag' ),
      $toPhotoImg = $( '#' + 'newPhoto' + toPhotoTag.charAt( 0 ).toUpperCase() + toPhotoTag.slice(1).toLowerCase() ),
      fromPhotoTag = _this.activeStory.tag;
  //alert( "Clicked on ScrollTo '" + $scrolledToElem.attr( 'photoTag' ) + ".  Active halftone profile: '" + _this.activeStory.tag + "'. *" );
  console.log( " ..*4.5) scrollTo() Scroll To: '" + toPhotoTag + ".  Scroll From: '" + fromPhotoTag + "'. *" );

  var fromStory = _this.activeStory;
  if ( !fromStory.timelines ||
       !fromStory.timelines.collapse ) {
    alert( "Scroll From: '" + fromPhotoTag + "'. A story has not been created for this photo yet! You MUST create animationElements first via the 'Particles, Elements' links." );
    if ( typeof callback == 'function' ) { callback( toPhotoTag ); return; }
    return toPhotoTag;
  }

  photoTagToStory( _this, toPhotoTag,
  /*1-Resume here when done*/ function( results ) {
  if ( !results.isFound ||
       !results.item.timelines ||
       !results.item.timelines.collapse ) {
    alert( "Scroll To: '" + toPhotoTag + "'. A story has not been created for this photo yet! You MUST create animationElements first via the 'Particles, Elements' links." );
    if ( typeof callback == 'function' ) { callback( toPhotoTag ); return; }
    return toPhotoTag;
  }
  var toStory = results.item;

  //----------------------------------------------------------------------------
  // 1) Make sure selected photo animation Stage shows an expanded image.
  //    Then start its collapse.
  //----------------------------------------------------------------------------
  var story = fromStory;
  // NOTE: after elements are built they form an expanded image.
  var delayMsToWaitForStartState = 0;
  console.log( " ..*4.5) scrollTo() From Story: Halftone image for '" + fromPhotoTag + "' is CURRENTLY '" + (story.timelines.collapse.isReversed ? 'expanded' : 'collapsed' ) + "'. *" );
  // Note: collapse.isReversed means "image is expanded"
  if ( !story.timelines.collapse.isReversed ) {
    delayMsToWaitForStartState = 2000;
    console.log( " ..*4.5) scrollTo() From Story: Halftone image for '" + fromPhotoTag + "' IS NOW collapsed. Start expanding it. *" );
    story.timelines.collapse.gsapTimeline.reverse();
    story.timelines.collapse.isReversed = true;
  }
  console.log( " ..*4.5) scrollTo() Waiting '" + delayMsToWaitForStartState + "'ms for From Story Halftone image for '" + fromPhotoTag + "' to expand. *" );
  setTimeout(function() {
  /*1a-Resume here when WaitForStartState Timeout done*/
  console.log( " ..*4.5) scrollTo() From Story: Halftone image for '" + fromPhotoTag + "' IS NOW expanded. Start collapsing it. *" );
  story.timelines.collapse.gsapTimeline.play();
  story.timelines.collapse.isReversed = false;
  var delayMsToWaitForCollapsedState = 2000;
  console.log( " ..*4.5) scrollTo() Waiting '" + delayMsToWaitForCollapsedState + "'ms for From Story Halftone image for '" + fromPhotoTag + "' to collapse. *" );
  setTimeout(function() {
  /*1b-Resume here when WaitForCollapsedState Timeout done*/
  console.log( " ..*4.5) scrollTo() From Story: Halftone image for '" + fromPhotoTag + "' IS NOW collapsed. " +
               "Select, display photo we are scrolling to ('" + toPhotoTag + "'). *" );

  //----------------------------------------------------------------------------
  // 2) Select, display photo we are scrolling to.
  //    Make sure selected photo animation Stage shows a collapsed image.
  //    Then start its expansion.
  //----------------------------------------------------------------------------
  // Select, display photo we are scrolling to. NOTE: set new _this.activeStory.
  newPhoto( _this, { photoTag: toPhotoTag, photoType: $toPhotoImg.attr('photoType'), imgSrc: $toPhotoImg.attr('data-src') },
  /*1c-Resume here when newPhoto(toPhotoTag) done*/ function( image ) {
  story = toStory;
  console.log( " ..*4.5) scrollTo() To Story: Photo for '" + toPhotoTag + "' IS NOW being displayed as a '" +
               (story.timelines.collapse.isReversed ? 'expanded' : 'collapsed' ) + "' Halftone image. *" );

  delayMsToWaitForCollapsedState = 0;
  if ( story.timelines.collapse.isReversed ) {
    delayMsToWaitForCollapsedState = 2000;
    console.log( " ..*4.5) scrollTo() To Story: Halftone image for '" + toPhotoTag + "' is now expanded. Start collapsing it. *" );
    story.timelines.collapse.gsapTimeline.play();
    story.timelines.collapse.isReversed = false;
  }
  console.log( " ..*4.5) scrollTo() Waiting '" + delayMsToWaitForCollapsedState + "'ms for To Story Halftone image for '" + fromPhotoTag + "' to collapse. *" );
  setTimeout(function() {
  /*1d-Resume here when WaitForCollapsedState Timeout done*/
  console.log( " ..*4.5) scrollTo() To Story: Halftone image for '" + toPhotoTag + "' IS NOW collapsed. Start expanding it. *" );
  story.timelines.collapse.gsapTimeline.reverse();
  story.timelines.collapse.isReversed = true;
  delayMsToWaitForExpandedState = 2000;
  console.log( " ..*4.5) scrollTo() Waiting '" + delayMsToWaitForExpandedState + "'ms for To Story Halftone image for '" + fromPhotoTag + "' to expand. *" );
  setTimeout(function() {
  /*1e-Resume here when WaitForExpandedState Timeout done*/
  console.log( " ..*4.5) scrollTo() To Story: Halftone image for '" + toPhotoTag + "' IS NOW expanded. *" );
  // To Story:
  }, delayMsToWaitForExpandedState); // end /*1e-timeout*/
  }, delayMsToWaitForCollapsedState); // end /*1d-timeout*/

  // From Story:
  /*1c-*/}); }, delayMsToWaitForCollapsedState); // end /*1b-timeout*/
  }, delayMsToWaitForStartState); // end /*1a-timeout*/
  if ( typeof callback == 'function' ) { callback( toPhotoTag ); return; }
  return toPhotoTag;
  /*1-*/});
}; // end: scrollTo()
