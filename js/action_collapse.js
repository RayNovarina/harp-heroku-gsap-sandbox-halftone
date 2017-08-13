// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function collapse( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  options.sceneTag = 'collaspe';
  collapse_reset( _this, { sceneTag: options.sceneTag } );
  updateSettings( _this, options );
  var story, scene, animationElements;
  photoTagToStory( _this, _this.settings.photoTag, options,
  /*1-Resume here when done*/ function( story ) {
  story = story;
  tagToScene( _this, 'particles', story,
  /*2-Resume here when done*/ function( scene ) {
  scene = scene;
  _this.scene = scene; // NOTE: hack needed for play button.
  animationElements = scene.animationElements.domElements.objects;

  console.log( " ..*4.3) collapse() animationElementsContainer: '" + $( scene.animationElements.container.object ).attr( 'id' ) +
               "' which has " + animationElements.length + " elements" +
               ". Tween Duration: '" + options.tweenDuration + "'. *");

  story.scenes.push( {
    tag: _this.settings.sceneTag,
    proxyContainerTag: scene.tag,
  } );

  _this.collapseTimeline = new TimelineMax( { repeat: 0, yoyo: false, repeatDelay: 0, paused: true } );
  // Just collaspe down to our "compressed core". If we wanted the position of
  // all particles, we could call a function upon pause() and get the pos info.  via "vars"?
  //_this.collapseTimeline.addPause( options.tweenDuration - ( options.tweenDuration * .30) );

  setAnimationBoundaries( _this, options );
  $.each( animationElements, function( idx, element ) {
    // NOTE: ASSUME that 'particles' scene has played and all animiation elements
    // are currently at their 'home' position.x/y.
    // Collaspe down to our "compressed core".
    // Move element from element.x, element.y to collasped.x, collasped.y.
    // NOTE: maybe each element should have attributes for home.x/y, collasped.x/y?
    _this.collapseTimeline.insert(
      TweenMax.to(
        element, _this.settings.tweenDuration,
        { attr: { cx: getRandom( _this.settings.animationPanelLeftBoundaryX, _this.settings.animationPanelRightBoundaryX ),
                  cy: getRandom( _this.settings.animationPanelTopBoundary, _this.settings.animationPanelBottom ),
                },
             	  //autoAlpha: 0,
                //ease: Power0.easeInOut,
                ease: Power2.easeOut,
        }
    )); // end Timeline.insert()
    if ( idx == animationElements.length - 1 ) {
      /**-Resume here when done with $.each() loop.*/
      console.log( " ..*4.3a) collapse() Tweened " + (animationElements.length - 1) +
                   " AnimationElements. *");
      playSceneIfAutoPlay( _this, { scene: scene },
      /*2a-Resume here when done*/ function( timeline ) {
      if ( typeof callback == 'function' ) { callback(); return; }
      return;
      /*2a-*/});
    }
  }); // end $.each()
  /*2-*/});/*1-*/});
}; // end: collapse()

/*
_this.movie.stories.push( {
  tag: _this.settings.photoTag,
  particleMap: _this.particles,
  scenes: [ { tag: _this.settings.sceneTag,
              container: sceneContainer,
              animationElements: {
                container: {
                  object: aniContainerObj,
                  htmlString: '',
                },
                domElements: {
                  objects: domElementsObjsArray,
                  htmlString: '',
                },
              },
  } ],
});
*/

//----------------------------------------------------------------------------
function tagToScene( _this, sceneTag, story, callback ) {
  //----------------------------------------------------------------------------
  $.each( story.scenes, function( idx, scene ) {
    if ( scene.tag == sceneTag ) {
      if ( typeof callback == 'function' ) { callback( scene ); return; }
      return scene;
    }
  }); // end $.each()
};// end: tagToScene()

//----------------------------------------------------------------------------
function photoTagToStory( _this, photoTag, options, callback ) {
  //----------------------------------------------------------------------------
  $.each( _this.movie.stories, function( idx, story ) {
    if ( story.tag == photoTag ) {
      if ( typeof callback == 'function' ) { callback( story ); return; }
      return story;
    }
  }); // end $.each()
};// end: collapse_reset()

//----------------------------------------------------------------------------
function collapse_reset( _this, options ) {
  //----------------------------------------------------------------------------
  if ( _this.settings == 'undefined' ) {
    // onDomReady() init.
  } else {
  }
};// end: collapse_reset()

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
