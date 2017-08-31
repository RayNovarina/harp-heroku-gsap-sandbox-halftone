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
       !fromStory.timelines.main ) {
    alert( "Scroll From: '" + fromPhotoTag + "'. A story has not been created for this photo yet! You MUST create animationElements first via the 'Particles, Elements' links." );
    if ( typeof callback == 'function' ) { callback( toPhotoTag ); return; }
    return toPhotoTag;
  }

  photoTagToStory( _this, toPhotoTag,
  /*1-Resume here when done*/ function( results ) {
  if ( !results.isFound ||
       !results.item.timelines ||
       !results.item.timelines.main ) {
    alert( "Scroll To: '" + toPhotoTag + "'. A story has not been created for this photo yet! You MUST create animationElements first via the 'Particles, Elements' links." );
    if ( typeof callback == 'function' ) { callback( toPhotoTag ); return; }
    return toPhotoTag;
  }
  var toStory = results.item;
  //----------------------------------------------------------------------------
  // 1) Make sure selected photo animation Stage shows an expanded image.
  //----------------------------------------------------------------------------
  var story = fromStory;
  // First make sure we start in an expanded state.
  var delayMsToWaitForStartState = 0;
  console.log( " ..*4.5) scrollTo() From Story: Halftone image for '" + fromPhotoTag + "' is CURRENTLY '" + (isInExpandedPosition( _this, story ) ? 'expanded' : 'collapsed' ) + "'. *" );
  if ( !isInExpandedPosition( _this, story ) ) {
    // Image is currently collapsed. Expand it.
    expand( _this, {} );
    delayMsToWaitForStartState = 2000;
  }
  console.log( " ..*4.5) scrollTo() Waiting '" + delayMsToWaitForStartState + "'ms for From Story Halftone image for '" + fromPhotoTag + "' to expand. *" );
  setTimeout(function() {
  /*1a-Resume here when WaitForStartState Timeout done*/
  console.log( " ..*4.5) scrollTo() From Story: Halftone image for '" + fromPhotoTag + "' IS NOW expanded. Start collapsing it. *" );

  collapse( _this, {} );
  var delayMsToWaitForCollapsedState = 500;
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
               (isInExpandedPosition( _this, story ) ? 'expanded' : 'collapsed' ) + "' Halftone image. *" );

  delayMsToWaitForCollapsedState = 0;
  if ( isInExpandedPosition( _this, story ) ) {
    delayMsToWaitForCollapsedState = 2000;
    console.log( " ..*4.5) scrollTo() To Story: Halftone image for '" + toPhotoTag + "' is now expanded. Start collapsing it. *" );
    collapse( _this, {} );
  }
  console.log( " ..*4.5) scrollTo() Waiting '" + delayMsToWaitForCollapsedState + "'ms for To Story Halftone image for '" + fromPhotoTag + "' to collapse. *" );
  setTimeout(function() {
  /*1d-Resume here when WaitForCollapsedState Timeout done*/
  console.log( " ..*4.5) scrollTo() To Story: Halftone image for '" + toPhotoTag + "' IS NOW collapsed. Start expanding it. *" );

  expand( _this, {} );
  delayMsToWaitForExpandedState = 2000;
  console.log( " ..*4.5) scrollTo() Waiting '" + delayMsToWaitForExpandedState + "'ms for To Story Halftone image for '" + fromPhotoTag + "' to expand. *" );
  setTimeout(function() {
  /*1e-Resume here when WaitForExpandedState Timeout done*/
  console.log( " ..*4.5) scrollTo() To Story: Halftone image for '" + toPhotoTag + "' IS NOW expanded. *" );

  }, delayMsToWaitForExpandedState); // end /*1e-timeout*/
  }, delayMsToWaitForCollapsedState); // end /*1d-timeout*/

  // From Story:
  /*1c-*/}); }, delayMsToWaitForCollapsedState); // end /*1b-timeout*/
  }, delayMsToWaitForStartState); // end /*1a-timeout*/
  if ( typeof callback == 'function' ) { callback( toPhotoTag ); return; }
  return toPhotoTag;
  /*1-*/});
}; // end: scrollTo()
