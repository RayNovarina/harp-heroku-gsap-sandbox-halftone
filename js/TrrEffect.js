
// plugIn class in context of instance, i.e. _this or TrrEffect.xxxx
//------------------------------------------------------------------------------
function TrrEffect() {
  //----------------------------------------------------------------------------
  console.log( " ..*2) TrrEffect() Create new TrrEffect instance. *");
  // Public CONSTANTS accessible via TrrEffect.xxx
  this.TAU = Math.PI * 2;
  this.ROOT_2 = Math.sqrt( 2 );
  this.RGB_CHANNEL_OFFSETS = { red: 0, green: 1, blue: 2 };
  this.RGB_CHANNEL_ANGLES = { red: 1, green: 2.5, blue: 5, lum: 4 };
  var _this = this;

  /*
  //----------------------------------------------------------------------------
  _this.reset = function( options, /*Code to resume when done/ callback ) {
    //--------------------------------------------------------------------------
    console.log( " ..*4.4) reset() plugIn #" + __this.settings.id +
                 ". Empty containerId: " + __this.animationContainer.id +
                 ".<canvas>.len: " + $(__this.animationContainer).find( 'canvas' ).length + ". *");
    $( "#" + __this.settings.id ).empty().remove();
    $(__this.animationContainer).find( 'canvas' ).remove();

    //NOTE: still have <div id='scene_undefined'> in DOM.

    timeNow = new Date().getTime();
    __this.settings = __this.defaults;
    updateSettings( _this, { timeNow: timeNow } );
  	__this.particles = [];
    // Select, display default photo.
    __this.newPhoto( { photoType: "color", photoTag: "meg", imgSrc: './images/meg_CC_422x436.jpg' },
    /*1-Resume here when done* function() {
    if ( typeof callback == 'function' ) { callback(); return; }
  /*1-*}.bind( _this ));
  } // end: _this.reset function()
  */

  /*
  _this.fadeIn( {},
  /*4-Resume here when done/ function() {
  /*4-/}.bind( _this ));
  //----------------------------------------------------------------------------
  _this.fadeIn = function( options, /*Code to resume when done/ callback ) {
    //--------------------------------------------------------------------------
    console.log( " ..*8) fadeIn() *");
    _this.animationContainer.appendChild( _this.scene );
    if ( typeof callback == 'function' ) { callback(); return; }
  } // end: _this.fadeIn function()
  */

  // Private methods in context of plugIn instance, i.e. _this
  // // NOTE: Private methods MUST use __this to get '_this' for _this instance.

}; // end function TrrEffect()
