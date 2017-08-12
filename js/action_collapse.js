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

  _this.collapseTimeline = new TimelineMax( { repeat: 0 } );


	for( var i = 0; i < canvasParticlesLen; i++ ) {
		var canvasParticle = canvasParticles.eq(i);
    var particle = _this.particles[ i ];

    //var randX = getRandom(  -30 , -50 );
		//var randY = getRandom(  100 , 300 );

    // need to individually adjust top/y. NOTE: should calc and make part of
    // particle{} when map is created!
		//var tmax = TweenMax.to( canvasParticle, options.tweenDuration, {
		//  //left: randX,
		//	//top: randY,
		//	left: getRandom( 150, 250 ),
    //  top:  particle.y + getRandom( 10, 50 ),
		//	autoAlpha: 0,
    //  ease: Power0.easeInOut,
		//}); // end TweenMax

		_this.collapseTimeline.insert(
      TweenMax.to( canvasParticle, options.tweenDuration, {
        left: getRandom( 150, 250 ),
        top:  particle.y + getRandom( 10, 50 ),
    		autoAlpha: 0,
        //ease: Power0.easeInOut,
      })
    );

	} // end for( var i )

  // Just collaspe down to our "compressed core". If we wanted the position of
  // all particles, we could call a function upon pause() and get the pos info.  via "vars"?
  _this.collapseTimeline.addPause( options.tweenDuration - ( options.tweenDuration * .30) );

  //_this.mainTimeLine.insert( _this.collapseTimeline );

  if ( typeof callback == 'function' ) { callback(); return; }
}; // end: collapse()

/*
var main_tl = new TimelineMax({repeat:-1});

   var planets = $(".planet"),
       sun = $("#sun");

   TweenMax.set(sun, {
       perspective:800
   });

   var timeGap = 4;

   planets.each(function (index, element){
       var waitDelay = index*timeGap;
       // rising animation
       TweenMax.from(element, 1, {ease:Power1.ease, scale:0, alpha:0, top:"50%", delay:waitDelay});
       // rotation loop
       var tl = new TimelineMax({delay:waitDelay+1, repeat:-1});
       tl.insert(TweenMax.to(element, 20, {bezier:{values:[{x:-200, y:-50}, {x:0, y:-100}, {x:200, y:-50}, {x:0, y:0}]}, ease:Linear.easeNone}), "rotation");
       tl.insert(TweenMax.to(element, 3, {alpha: 0.4, scale:0.6, zIndex:1, ease:Linear.easeNone}), "rotation+=3");;
       tl.insert(TweenMax.to(element, 3, {alpha: 1, scale:1, zIndex:100, ease:Linear.easeNone}), "rotation+=14");;

       main_tl.insert(tl);
   });

   sun.on('click', function() {
       main_tl.reverse();
   });

});


 */
