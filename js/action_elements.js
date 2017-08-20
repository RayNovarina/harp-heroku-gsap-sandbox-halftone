// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function elements( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  options.sceneTag = 'elements';
  elements_reset( _this, { sceneTag: options.sceneTag } );
  updateSettings( _this, options );
  console.log( " ..*4.2) elements() " + "'. RenderParticleMap: '" + _this.settings.isRenderParticleMap +
               "' for active story '" + _this.activeStory.tag +
               "'. isOnlyIfNewElements: '" + _this.settings.isOnlyIfNewElements + "' *");

  if ( _this.settings.isOnlyIfNewElements &&
       _this.activeStory.timelines &&
       _this.activeStory.timelines.expandTimeline ) {
    console.log( " ..*4.2a) elements() OnlyIfNewElements: Ignored, " +
                 "we already have a expandTimeline. *");
    //if ( typeof callback == 'function' ) { callback( _this.activeScene ); return; }
    //return _this.activeScene;
  }

  // particleMap MUST have already been created.
  if ( !_this.activeStory.particleMap.particles ||
       _this.activeStory.particleMap.particles.length == 0 ) {
    alert( "photoTag: '" + _this.activeStory.tag + "'. You MUST create Particles first via the 'Particles' link.'" );
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }

  // Create animationElements from particles and build array of DOM elements
  // that can be animated via GSAP timeLine.
  // Optionally display default image in Panel specified by options (now in .settings).
  createScene( _this, {
    id: _this.activeStory.tag + '_particleMap',
    sceneTag: options.sceneTag,
    panel: settingsToPanel( _this ),
    createContainerParams: {
      width: _this.settings.img.width + 8,
      height: _this.settings.img.height,
      left: 0,
      top: 0,
      backgroundColor: _this.defaults.sceneBackgroundColor, //  '#E7F1F7', Climate Corp "halftone background blue"
      //  background color of Climate Corp profile photo for Meg: rgb(234, 233, 238) #eae9ee
      border: '',
    },
    createAnimationElementsParams: {
      method: _this.settings.isUseSVGelements ? 'createSvgElementsFromParticleMap'
              : _this.settings.isUseCanvasElements ? 'createCanvasElementsFromParticleMap'
              //: _this.settings.isUseDivElements ?
              : 'createDivElementsFromParticleMap',
      offsetX: 0, //-80,
      offsetY: 0, //-20,
    },
  },
  /*1-Resume here when done*/ function( activeScene ) {
  if ( _this.settings.autoPlay &&
       activeScene.story.timelines.expandTimeline ) {
    activeScene.story.timelines.expandTimeline.play();
  }
  if ( typeof callback == 'function' ) { callback( activeScene ); return; }
  return activeScene;
  /*1-*/});
};// end: elements()

//----------------------------------------------------------------------------
function elements_reset( _this, options ) {
  //----------------------------------------------------------------------------
  if ( _this.settings == 'undefined' ) {
    // onDomReady() init.
  } else {
    // Reset mode cboxes if out of sync.
    if ( !_this.settings.isElementsMode ) {
      _this.settings.isParticlesMode = false;
      _this.settings.isElementsMode = true;
      update_ep_mode_cboxes( _this );
    }
  }
}; // end: elements_reset()

//----------------------------------------------------------------------------
function createSvgElementsFromParticleMap( _this, options, callback ) {
  //----------------------------------------------------------------------------
  updateSettings( _this, options );
  var particles = _this.activeStory.particleMap.particles,
      sceneContainerElem = _this.activeScene.container.html.elem,
      $sceneContainerElem = $( sceneContainerElem ),
      elementsContainer = _this.activeScene.animationElements.container,
      domElementsObjsArray = [],
      animationElementOffsetX = _this.settings.createAnimationElementsParams.offsetX,
      animationElementOffsetY = _this.settings.createAnimationElementsParams.offsetY;
  console.log( " ..*5a.1) createSvgElementsFromParticleMap() For Particles[].len = " + particles.length +
               "'. animationElementOffsetX: '" + animationElementOffsetX +
               "'. animationElementOffsetY: '" + animationElementOffsetY +
               ". *");

  // Insert the REQUIRED <svg> tag within the sceneContainer to contain the svg <circle> elements.
  // NOTE: browser can not directly add <svg> or <circle> tags, need to use "w3.org namespace".
  elementsContainer.html = {
    elem: $( makeSvgElementNS('svg') )
      .attr( 'id', 'aniElems_Con_' )
      .attr( 'width', '589' )
      .attr( 'height', '600' )
      .attr( 'trr-ani-elem-type', 'circle' )
      .addClass( 'trr-ani-elems-container' ),
    string: '',
  };
  var elementsContainerElem = elementsContainer.html.elem,
      $elementsContainerElem = $( elementsContainerElem );

  // attach to specified Panel.
  $( _this.centerPanel ).children().last().append( elementsContainerElem );
  // Assume activeScene container was made invisible in our _reset() and
  // make our container visible before we start filling it up.
  openSceneContainer( _this, _this.activeScene );
  setAnimationBoundaries( _this, options );

  var numElements = 0;
  var expandTimeline = new TimelineMax(
          { repeat: 0, yoyo: false, repeatDelay: 0, delay: 0, paused: true,
            //onComplete: expandTimelineCompleteCallback
            //onComplete: function( timeline ) {
            //  _this = window.trrPlugin;
            //  alert( "expandTimeline animation is complete for '" + _this.activeStory.tag +
            //  "'. expandTimelineIsReversed = '" + _this.activeStory.timelines.expandTimelineIsReversed + "'. " );
            //}
          } );

  $.each( particles, function( idx, particle ) {
    // NOTE: particleAnimationMethod should return a Tween for the element. And it
    // should call its own "make an element" method.
    // Create element in the "collapsed position column".
    var element = createCollapsedPositionSVGelement( _this, particle );
    if ( element ) {
      $elementsContainerElem.append( element );
      domElementsObjsArray.push( element );

      // We can optionally "animate" the collapsed elements to an expaded view.
      // Move elements from collapsed position to image home position.
      expandTimeline.insert(
        TweenMax.to(
          element, _this.settings.tweenDuration,
          // NOTE: we don't want to do math calculations when creating DOM elements.
          //       So require that all adjustments were made when the particle
          //       map was created.
          { attr: { cx: particle.x, // + animationElementOffsetX,
                    cy: particle.y, // + animationElementOffsetY,
                  },
    	      //autoAlpha: 0,
            //ease: Power0.easeInOut, // will case fade-out
            ease: Power2.easeOut,
          }
        ) // end TweenMax.to()
      ); // end expandTimeline.insert()
      numElements += 1;
    } // end if ( element )
  }); // end $.each()

  $sceneContainerElem.attr( 'numElements', numElements + '' );
  var results = {
    animationElementsContainerElem: elementsContainerElem,
    domElementsObjsArray: domElementsObjsArray,
    expandTimeline: expandTimeline,
  };
  console.log( " ..*5a.2)createSvgElementsFromParticleMap(): Made " + $sceneContainerElem.attr( 'numElements' ) +
               " canvas AnimationElements. *");

  if ( typeof callback == 'function' ) { callback( results ); return; }
  return results;
}; // end createSvgElementsFromParticleMap()

//----------------------------------------------------------------------------
function createCollapsedPositionSVGelement( _this, particle ) {
  //----------------------------------------------------------------------------
  // Create elements to start at our "collapsed core". i.e. in a column in the
  // middle of the panel.
  var circle = $( makeSvgElementNS( 'circle' ) )
      .attr( 'cx', getRandom( _this.settings.animationPanelLeftBoundaryX, _this.settings.animationPanelRightBoundaryX ) )
      .attr( 'cy', getRandom( _this.settings.animationPanelTopBoundary, _this.settings.animationPanelBottom ) )
      .attr( 'r', particle.r )
      .attr( 'fill', _this.settings.animationElementColor );
      // NOTE: hx/hy is the "home" position x,y for this particle.
      //.attr( 'hx', particle.x )
      //.attr( 'hy', particle.y );
  return circle;
  /*
  // Create element "below the fold" and in a column in the middle of the panel.
  // i.e. element.y is off the bottom of the page, element.x is in middle.
  .attr( 'cx', getRandom( _this.settings.animationPanelLeftBoundaryX, _this.settings.animationPanelRightBoundaryX ) )
  .attr( 'cy', _this.settings.animationPanelBottom - getRandom( 40, 50 ) )
  */
}; // end createCollapsedPositionSVGelement()

//----------------------------------------------------------------------------
function createDivElementsFromParticleMap( _this, options, callback ) {
  //----------------------------------------------------------------------------
  updateSettings( _this, options );
  var particles = _this.activeStory.particleMap.particles,
      sceneContainerElem = _this.activeScene.container.html.elem,
      $sceneContainerElem = $( sceneContainerElem ),
      elementsContainer = _this.activeScene.animationElements.container,
      domElementsObjsArray = [],
      animationElementOffsetX = _this.settings.createAnimationElementsParams.offsetX,
      animationElementOffsetY = _this.settings.createAnimationElementsParams.offsetY;
  console.log( " ..*5a.1) createDivElementsFromParticleMap() For Particles[].len = " + particles.length +
               "'. animationElementOffsetX: '" + animationElementOffsetX +
               "'. animationElementOffsetY: '" + animationElementOffsetY +
               ". *");

  elementsContainer.html = {
    elem: $( document.createElement( "div" ) )
      .attr( 'id', 'aniElems_Con_' )
      .attr( 'width', '589' )
      .attr( 'height', '600' )
      .attr( 'trr-ani-elem-type', 'div' )
      .addClass( 'trr-ani-elems-container' ),
    string: '',
  };
  var elementsContainerElem = elementsContainer.html.elem,
      $elementsContainerElem = $( elementsContainerElem );

  // attach to specified Panel.
  $( _this.centerPanel ).children().last().append( elementsContainerElem );
  // Assume activeScene container was made invisible in our _reset() and
  // make our container visible before we start filling it up.
  openSceneContainer( _this, _this.activeScene );
  setAnimationBoundaries( _this, options );

  var numElements = 0;
  var expandTimeline = new TimelineMax(
          { repeat: 0, yoyo: false, repeatDelay: 0, delay: 0, paused: true } );

  $.each( particles, function( idx, particle ) {
    // Create element in the "collapsed position column".
    var element = createCollapsedPositionDivElement( _this, particle );
    if ( element ) {
      elementsContainerElem.append( element );
      domElementsObjsArray.push( element );

      // We can optionally "animate" the collapsed elements to an expaded view.
      // Move elements from collapsed position to image home position.
      expandTimeline.insert(
        TweenMax.to(
          element, _this.settings.tweenDuration,
          // NOTE: we don't want to do math calculations when creating DOM elements.
          //       So require that all adjustments were made when the particle
          //       map was created.
          { left: particle.x, // + animationElementOffsetX,
            top:  particle.y, // + animationElementOffsetY,
    	      //autoAlpha: 0,
            //ease: Power0.easeInOut,
            ease: Power2.easeOut,
          }
        ) // end TweenMax.to()
      ); // end expandTimeline.insert()
      numElements += 1;
    } // end if ( element )
  }); // end $.each()

  $sceneContainerElem.attr( 'numElements', numElements + '' );
  var results = {
    animationElementsContainerElem: elementsContainerElem,
    domElementsObjsArray: domElementsObjsArray,
    expandTimeline: expandTimeline
  };
  console.log( " ..*5a.1a) createDivElementsFromParticleMap(): Made " + $sceneContainerElem.attr( 'numElements' ) +
               " <div> AnimationElements. *");
  if ( typeof callback == 'function' ) { callback( results ); return; }
  return results;
}; // end createDivElementsFromParticleMap()

//----------------------------------------------------------------------------
function createCollapsedPositionDivElement( _this, particle ) {
  //----------------------------------------------------------------------------
  var circle = $( makeSvgElementNS( 'circle' ) )
      .attr( 'cx', getRandom( _this.settings.animationPanelLeftBoundaryX, _this.settings.animationPanelRightBoundaryX ) )
      .attr( 'cy', getRandom( _this.settings.animationPanelTopBoundary, _this.settings.animationPanelBottom ) )

  var gridSize = _this.activeStory.particleMap.gridSize;
  var div = document.createElement( 'div' );
  div.style.position = 'absolute';
  div.style.left = getRandom( _this.settings.animationPanelLeftBoundaryX, _this.settings.animationPanelRightBoundaryX ) + "px";
  div.style.top = getRandom( _this.settings.animationPanelTopBoundary, _this.settings.animationPanelBottom ) + "px";
  // Math.round( particle.r * _this.particleMaps.gridSize
  // // max 8px, min 2px.
  var diameter = Math.round( particle.r * gridSize );
  if ( diameter < 1 ) {
    return null;
  } else if ( diameter > ( 2 * gridSize ) ) {
    diameter = diameter / 2;
    if ( diameter > ( 2 * gridSize ) ) {
      diameter = ( 2 * gridSize );
    }
  }
  diameter = Math.round( diameter );

  div.style.width = diameter + "px";
  div.style.height = div.style.width;
  div.style.background = _this.settings.animationElementColor;
  div.style.borderRadius = '50%';

  return div;
  /*
  // Create element "below the fold" and in a column in the middle of the panel.
  // i.e. element.y is off the bottom of the page, element.x is in middle.
  div.style.left = getRandom( 225, 425 ) + "px";
  div.style.top = _this.settings.animationPanelBottom - getRandom( 40, 50 ) + "px";
  */
}; // end createCollapsedPositionDivElement()

//----------------------------------------------------------------------------
function createCollapsedPositionCanvasElement( _this, particle ) {
  //----------------------------------------------------------------------------
  var canvasAndCtx = makeCanvasAndCtx(),
      canvas = canvasAndCtx.canvas,
      context = canvasAndCtx.ctx,
      elementWidth = 6,
      elementHeight = 6;

  // NOTE: canvas.width and heigth is set by the radius of the dot we write.

  // Create element "below the fold" and in a column in the middle of the panel.
  // i.e. element.y is off the bottom of the page, element.x is in middle.
  canvas.style.position = 'absolute';
  canvas.style.left = getRandom( 225, 425 ) + "px";
  canvas.style.top =  _this.settings.animationPanelBottom - getRandom( 40, 50 ) + "px";
  canvas.width = elementWidth;
  canvas.height = elementHeight;
  context.fillStyle = _this.settings.animationElementColor;
  context.beginPath();
  // NOTE: arc( x, y, radius )
  context.arc( 0, 0, particle.r, 0, _this.TAU );
  context.fill();
  context.closePath();
  return canvas;
}; // end createCollapsedPositionCanvasElement()

//function expandTimelineCompleteCallback( timelineMax ) {
//  _this = window.trrPlugin;
//  alert( 'expandTimeline animation is complete for ' + _this.activeStory.tag + '.' );
//}; // end expandTimelineCompleteCallback
