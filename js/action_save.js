// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function save( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) save() for activeStory: '" + _this.activeStory.tag + "' *");

  // animationElements MUST have already been created.
  if ( !_this.activeStory.timelines ||
       !_this.activeStory.timelines.collapse ) {
    alert( "photoTag: '" + _this.activeStory.tag + "'. You MUST create animationElements first via the 'Particles and Elements' links." );
    if ( typeof callback == 'function' ) { callback(); return; }
    return;
  }

  /*
  stories: [ {
    ....
    particlesInfo: {
      source: 'file',
      particles: {
        type: 'HashArray',
        obj: particlesHashArray,
    },
  */
  var filename = _this.activeStory.tag + "_particles.js";

  // Save header{}, obj{} as JSON string.
  /*
  particlesDataAsString =
    'var laura_particles_data=\'{"tag":"laura","type":"HashArray","data":[{"x":22,"y":580,"r":2.8062433825913184}]}\'';
  */
  var particlesDataAsString =
    'var ' + _this.activeStory.tag + '_particles_data=' +
      '\'{"tag":"'   + _this.activeStory.tag +
        '","type":"' + _this.activeStory.particlesInfo.particles.type +
        '","data": ';
  if ( _this.activeStory.particlesInfo.particles.type == 'string' ) {
    particlesDataAsString += _this.activeStory.particlesInfo.particles.obj;
  } else { // _this.activeStory.particlesInfo.particles.type == 'Array' or 'HashArray'
    particlesDataAsString += JSON.stringify( _this.activeStory.particlesInfo.particles.obj, undefined, undefined );
  }
  particlesDataAsString += '}\'';

  // Save JSON string into a blob. Simulate a mouse click event on a download
  // link.
  var blob = new Blob( [particlesDataAsString], { type: 'text/json' } );
  var clickEvent = document.createEvent( 'MouseEvents' );
  var downloadLinkHtmlTag = document.createElement( 'a' );

  downloadLinkHtmlTag.download = filename;
  downloadLinkHtmlTag.href = window.URL.createObjectURL( blob );
  downloadLinkHtmlTag.dataset.downloadurl =  [
    'text/json',
    downloadLinkHtmlTag.download,
    downloadLinkHtmlTag.href ]
  .join( ':' );
  clickEvent.initMouseEvent( 'click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null );
  downloadLinkHtmlTag.dispatchEvent( clickEvent );

  if ( typeof callback == 'function' ) { callback(); return; }
  return;
}; // end: save()
