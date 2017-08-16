// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function collapse( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  selectedPhotoToStory( _this,
  /*1-Resume here when done*/ function( result ) {
  _this.activeStory = result.item;
  console.log( " ..*4.2) collapse() *");
  _this.activeStory.expandTimeline.reverse();
  if ( typeof callback == 'function' ) { callback(); return; }
  return;
  /*1-*/});
}; // end: collapse()


/*
//----------------------------------------------------------------------------
function collapse( _this, options, /*Code to resume when done/ callback ) {
  //--------------------------------------------------------------------------
  options.sceneTag = 'collapse';
  collapse_reset( _this, { sceneTag: options.sceneTag } );
  updateSettings( _this, options );

  selectedPhotoToStory( _this,
  /*1-Resume here when done/ function( result ) {
  _this.activeStory = result.item;

  // animationElements MUST have already been created.
  if ( !_this.activeStory.animationElements ||
       !_this.activeStory.animationElements.container ||
       _this.activeStory.animationElements.domElements.html.elems.length == 0 ) {
    alert('You MUST create Animation Elements first via the "Elements" link.');
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }

  tagToScene( _this, 'elements', _this.activeStory,
  /*2-Resume here when done/ function( result ) {
  var elementsScene = result.item
  // We need to create a new scene that uses the animationElements[] for the
  // activeStory.
  var collapseScene = newScene( _this, options.sceneTag );
  collapseScene.tag = options.sceneTag;
  collapseScene.container = elementsScene.container;
  collapseScene.animationElements = elementsScene.animationElements;
  collapseScene.proxyContainerTag = 'elements';
  _this.activeScene = collapseScene;
  var animationElements = _this.activeScene.animationElements.domElements.html.elems;

  console.log( " ..*4.3) collapse() animationElementsContainer: '" + $( _this.activeScene.animationElements.container.html.elem ).attr( 'id' ) +
               "' which has " + animationElements.length + " elements" +
               ". Tween Duration: '" + options.tweenDuration + "'. *");

  _this.activeStory.collapseTimeline = new TimelineMax( { repeat: 0, yoyo: false, repeatDelay: 0, paused: true } );
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
    // NOTE: if ( isSVGanimationElements)
    _this.activeStory.collapseTimeline.insert(
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
      /**-Resume here when done with $.each() loop./
      console.log( " ..*4.3a) collapse() Tweened " + ( animationElements.length - 1 ) +
                   " AnimationElements. *");
      playSceneIfAutoPlay( _this, { scene: collapseScene },
      /*2a-Resume here when done/ function( timeline ) {
      if ( typeof callback == 'function' ) { callback(); return; }
      return;
      /*2a-/});
    }
  }); // end $.each()
  /*2-/});/*1-/});
}; // end: collapse()

//----------------------------------------------------------------------------
function collapse_reset( _this, options ) {
  //----------------------------------------------------------------------------
  if ( _this.settings == 'undefined' ) {
    // onDomReady() init.
  } else {
    if ( _this.activeScene ) {
      // Hide the active/visible sceneContainer, we will replace it with ours.
      _this.activeScene.container.html.elem.style.display = 'none';
    }
  }
};// end: collapse_reset()
*/

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
