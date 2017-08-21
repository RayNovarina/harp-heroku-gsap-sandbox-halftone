// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

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
  var collapsedTimeline = new TimelineMax(
          { repeat: 0, yoyo: false, repeatDelay: 0, delay: 0, paused: true,
            //onComplete: collapsedTimelineCompleteCallback
            //onComplete: function( timeline ) {
            //  _this = window.trrPlugin;
            //  alert( "collapsedTimeline animation is complete for '" + _this.activeStory.tag +
            //  "'. collapseTimelineIsReversed = '" + _this.activeStory.timelines.collapseTimelineIsReversed + "'. " );
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
      collapseTimeline.insert(
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
      ); // end collapseTimeline.insert()
      numElements += 1;
    } // end if ( element )
  }); // end $.each()

  $sceneContainerElem.attr( 'numElements', numElements + '' );
  var results = {
    animationElementsContainerElem: elementsContainerElem,
    domElementsObjsArray: domElementsObjsArray,
    collapseTimeline: collapseTimeline,
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

//function collapseTimelineCompleteCallback( timelineMax ) {
//  _this = window.trrPlugin;
//  alert( 'collapseTimeline animation is complete for ' + _this.activeStory.tag + '.' );
//}; // end collapseTimelineCompleteCallback

/*

//----------------------------------------------------------------------------
function makeParticlesFromTrrMap( _this, options, /*Code to resume when done/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  var effectsData = JSON.parse( _this.settings.effectsDataAsJSONstring );
  var particles = [],
      effectsDataParticles = effectsData.particles,
      edpParticle = {},
      homeOffsetLeft = _this.settings.particlesHomeOffsetLeft + _this.settings.additionalHomeOffsetLeft,
      homeOffsetTop = _this.settings.particlesHomeOffsetTop + _this.settings.additionalHomeOffsetTop;
  console.log( " ..*5.1) makeParticlesFromTrrMap() for id: " + _this.settings.id +
               ". effectsData.particles.len = " + effectsData.particles.length +
               ". effectsDataAsJSONstring.len = " + _this.settings.effectsDataAsJSONstring.length +
               ". Canvas Particles Home position Offset left: " + _this.settings.particlesHomeOffsetLeft +
               ". top: " + _this.settings.particlesHomeOffsetTop +
               ". MakeHomePositionMap: " + _this.settings.isMakeHomePositionMap +
               ".");

  if ( _this.settings.isMakeHomePositionMap ) {
    for( var i = 0; i < (effectsData.particles.length); i += 1 ) {
      edpParticle = effectsDataParticles[ i ];
      particles.push( {
          x: edpParticle.x + homeOffsetLeft,
          y: edpParticle.y + homeOffsetTop,
          r: edpParticle.r,
      });
    } //end for( var n )
  }
  var results = {
    particles: particles,
    gridSize: null,
    homeOffsetLeft: homeOffsetLeft,
    homeOffsetTop: homeOffsetTop,
  };
  if ( typeof callback == 'function' ) { callback( results ); return; }
  return results;
}; // end: makeParticlesFromTrrMap()
*/
