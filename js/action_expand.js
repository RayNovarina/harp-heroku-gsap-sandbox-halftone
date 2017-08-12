// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function expand( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) expand() *");
  //_this.mainTimeLine.reverse();
  _this.collapseTimeline.resume().reverse();
  if ( typeof callback == 'function' ) { callback(); return; }
}; // end: expand()
