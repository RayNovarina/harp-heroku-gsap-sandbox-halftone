// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function save( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) save() for activeStory: '" + _this.activeStory.tag + "' *");

  // animationElements MUST have already been created.
  if ( !_this.activeStory.timelines ||
       !_this.activeStory.timelines.collapse ) {
    alert( "photoTag: '" + _this.activeStory.tag + "'. You MUST create animationElements first via the 'Elements' link." );
    if ( typeof callback == 'function' ) { callback(); return; }
    return;
  }

  if ( typeof callback == 'function' ) { callback(); return; }
  return;

}; // end: save()
