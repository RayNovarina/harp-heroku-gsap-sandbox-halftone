// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function reset( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.4) reset() plugIn #" + _this.settings.id +
               ". Empty containerId: " + _this.animationContainer.id +
               ".<canvas>.len: " + $(_this.animationContainer).find( 'canvas' ).length + ". *");

  // reset by module: Lower levels first, init() last.
  // per: https://stackoverflow.com/questions/14608999/is-there-a-simple-way-to-reset-a-timelinemax-javascript-object
  // myTimeline.pause(0, true); //Go back to the start (true is to suppress events)
  // myTimeline.remove();
  convert_reset( _this ); // scrubs particles, conversionContainer, animationContainer.
  init_reset( _this ); // includes selecting default photo.
  if ( typeof callback == 'function' ) { callback(); return; }
}; // end: reset()
