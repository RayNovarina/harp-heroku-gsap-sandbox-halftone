// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function explode( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  copyConversionContainerToAnimationContainer( _this, {} ); // { isActionsUseMovedConversionContainer: true }
  var particleContainer = _this.animationContainer,
      canvasParticles = $( particleContainer ).find( 'canvas' ),
      canvasParticlesLen = canvasParticles.length;
  console.log( " ..*4.2) explode() particleContainer: '" + particleContainer.id +
               "' which has " + canvasParticles.length + " canvasParticles" +
               ". Tween Duration: '" + options.tweenDuration + "'. *");

	for( var i = 0; i < canvasParticlesLen; i++ ) {
		var canvasParticle = canvasParticles.eq(i);
    var particle = _this.particles[ i ];
		var randX = getRandom(  30 , -30 );
		var randY = getRandom(  300 , -300 );

		var tmax = TweenMax.to( canvasParticle, options.tweenDuration, {
      // HACK:
      // left: particle.x, // randX,
			// top: particle.y, // randY,
		  left: randX,
			top: randY,
			autoAlpha: 0,
      ease: Power0.easeInOut
		}); // end TweenMax
	} // end for( var i )
  if ( typeof callback == 'function' ) { callback(); return; }
}; // end: explode()
