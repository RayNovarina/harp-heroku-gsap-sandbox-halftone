// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function elements( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) elements() *");

  if ( typeof callback == 'function' ) { callback(); return; }
}; // end: elements()

//----------------------------------------------------------------------------
function createAnimationElements( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  var scene = _this.scene,
      canvas = null,
      context = null
      particles = _this.particles,
      particlesLen = particles.length,
      canvasWidth = _this.settings.animationElementWidth,
      canvasHeight = _this.settings.animationElementHeight,
      dotsColor = _this.settings.animationElementColor,
      canvasOffsetX = _this.settings.animationElementOffsetX,
      canvasOffsetY = _this.settings.animationElementOffsetY;
  console.log( " ..*7) createAnimationElements() for " + particles.length + " particles. " +
               " Each canvasElement has width: '" + canvasWidth +
               "'. height: '" + canvasHeight + "'. dotsColor: '" + dotsColor + "'. *");

  for( var n = 0; n < particles.length; n++ ) {
    var particle = particles[ n ];

    canvas = document.createElement( "canvas" );
    context = canvas.getContext("2d");

    canvas.width = canvasWidth;
  	canvas.height = canvasHeight;
  	canvas.style.left = particle.x + canvasOffsetX + "px";
    // HACK:
    // canvas.style.top = (particle.y + 200) + canvasOffsetY + "px";
  	canvas.style.top = particle.y + canvasOffsetY + "px";
  	canvas.style.position = 'absolute';

    // NOTE: Callbacks available? else it seems browsers is busy making
    // canvas elems and we exit for loop.
    context.fillStyle = dotsColor;
    context.beginPath();
    context.arc( 0, 0, particle.r, 0, _this.TAU );
    context.fill();
    context.closePath();

    scene.appendChild( canvas );
  } // end for( var n)
  console.log( " ..*7a) createAnimationElements() DONE for " + particles.length + " particles. " +
               " Created " + $(scene).find( 'canvas' ).length + " canvasParticles. *");
  if ( typeof callback == 'function' ) { callback( scene ); return; }
  return scene;
}; // end: createAnimationElements()
