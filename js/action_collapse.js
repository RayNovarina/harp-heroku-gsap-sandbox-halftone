// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function collapse( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.3) collapse() *");
  copyConversionContainerToAnimationContainer( _this, {} ); // { isActionsUseMovedConversionContainer: true }
  var particleContainer = _this.animationContainer,
      canvasParticles = $( particleContainer ).find( 'canvas' ),
      canvasParticlesLen = canvasParticles.length;
  console.log( " ..*4.3) collapse() particleContainer: '" + particleContainer.id +
               "' which has " + canvasParticles.length + " canvasParticles" +
               ". Tween Duration: '" + options.tweenDuration + "'. *");

	for( var i = 0; i < canvasParticlesLen; i++ ) {
		var canvasParticle = canvasParticles.eq(i);
    var particle = _this.particles[ i ];
		//var randX = getRandom(  -30 , -50 );
		//var randY = getRandom(  100 , 300 );

    // need to individually adjust top/y. NOTE: should calc and make part of
    // particle{} when map is created!
		var tmax = TweenMax.to( canvasParticle, options.tweenDuration, {
		  //left: randX,
			//top: randY,
			left: getRandom( 150, 250 ),
      top:  particle.y + getRandom( 10, 50 ),
			autoAlpha: 0,
      ease: Power0.easeInOut,
		}); // end TweenMax
	} // end for( var i )
  if ( typeof callback == 'function' ) { callback(); return; }
}; // end: collapse()
