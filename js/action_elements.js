// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function elements( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  if (_this.logging){console.log( " ..*4) elements() for active story '" + _this.activeStory.tag +
               "'. ParticlesFromPhoto: '" +  _this.settings.isParticlesFromPhoto +
               "'. ParticlesFromFile: '" +  _this.settings.isParticlesFromFile + "' *");}

  getParticles( _this, options, _this.activeStory,
  /*1-Resume here when done*/ function( particlesInfo ) {
  // Hide the active/visible sceneContainer.
  closeActiveSceneContainer( _this,
  /*2-Resume here when done*/ function( activeScene ) {
  options.sceneTag = 'elements';
  // Create animationElements from particles and build array of DOM elements
  // that can be animated via GSAP timeLine.
  createScene( _this, {
    id: _this.activeStory.tag + '_particleMap',
    sceneTag: options.sceneTag,
    panel: settingsToPanel( _this ),
    createContainerParams: {
      width: _this.settings.img.width + 8,
      height: _this.settings.img.height,
      offsetX: 0,
      offsetY: 0,
      backgroundColor: _this.defaults.sceneBackgroundColor, //  '#E7F1F7', Climate Corp "halftone background blue"
      border: '',
    },
    createAnimationElementsParams: {
      particlesInfo: particlesInfo,
      nextParticleMethod:
          _this.settings.isParticlesObjAsHashArray ? 'nextParticleFromHashArray'
          : _this.settings.isParticlesObjAsArray ? 'nextParticleFromArray'
          // assume _this.settings.isParticlesObjAsString
          : 'nextParticleFromString',
      sceneTag: options.sceneTag,
      isRandomizeCollapsedCore: true,
      collapsedCoreX: 100,
      collapsedCoreY: 100,
      type: 'SvgCircle',
      method: 'createSvgElementsFromParticles',
      offsetX: 0, //-80,
      offsetY: 0, //-20,
    },
  },
  /*3-Resume here when done*/ function( activeScene ) {
  if ( typeof callback == 'function' ) { callback( activeScene ); return; }
  return activeScene;
  /*3-*/});/*2-*/});/*1-*/});
};// end: elements()

//----------------------------------------------------------------------------
function createSvgElementsFromParticles( _this, options, callback ) {
  //----------------------------------------------------------------------------
  updateSettings( _this, options );
  var sceneContainerElem = _this.activeScene.container.html.elem,
      $sceneContainerElem = $( sceneContainerElem ),
      elementsContainer = _this.activeScene.animationElements.container,
      domElementsObjsArray = [];
  if (_this.logging){console.log( " ..*4.1) createSvgElementsFromParticleMap() Particles source: '" + _this.activeStory.particlesInfo.source +
               "'. numParticles = '" + _this.activeStory.particlesInfo.numParticles +
               "'. nextParticleMethod: '" + _this.settings.createAnimationElementsParams.nextParticleMethod +
               "'. RenderElementsImage: '" + _this.settings.isRenderElementsImage +
               "'. CreateElementsSceneContainer: '" + _this.settings.isCreateElementsSceneContainer +
               "'. RandomizeCollapsedCore: '" + _this.settings.createAnimationElementsParams.isRandomizeCollapsedCore +
               "'. mainTimeline.tweenDuration: '" + _this.settings.tweenDuration +
               "'. StartImageCollapsed: '" + _this.settings.isStartImageCollapsed +
               "'. ElementVisible: '" + _this.settings.isElementVisible +
               "'. *");}

  // Insert the REQUIRED <svg> tag within the sceneContainer to contain the svg <circle> elements.
  // NOTE: browser can not directly add <svg> or <circle> tags, need to use "w3.org namespace".
  elementsContainer.html = {
    elem: $( makeSvgElementNS('svg') )
      .attr( 'id', 'aniElems_Con_for_' + _this.activeStory.tag )
      .attr( 'width', '600' )
      .attr( 'height', '600' )
      .attr( 'trr-ani-elem-type', 'circle' )
      .addClass( 'trr-ani-elems-container' ),
    string: '',
  };
  var elementsContainerElem = elementsContainer.html.elem,
      $elementsContainerElem = $( elementsContainerElem );

  // attach to specified Panel.
  if ( _this.settings.isCreateElementsSceneContainer ) {
    $( _this.centerPanel ).children().last().append( elementsContainerElem );
  } else {
    $( _this.centerPanel ).append( elementsContainerElem );
  }
  // Assume activeScene container was made invisible.
  if ( _this.settings.isRenderElementsImage ) {
    // make our container visible before we start filling it up.
    openSceneContainer( _this, _this.activeScene );
  }
  if ( _this.settings.createAnimationElementsParams.isRandomizeCollapsedCore ) {
    setAnimationBoundaries( _this, options );
  }

  var numElements = 0;
  var mainTimeline = new TimelineMax(
          { repeat: 0, yoyo: false, repeatDelay: 0, delay: 0, paused: true,
            //onComplete: mainTimelineCompleteCallback
            //onComplete: function( timeline ) {
            //  _this = window.trrPlugin;
            //  alert( "mainTimeline animation is complete for '" + _this.activeStory.tag +
            //  "'. mainTimelineIsReversed = '" + _this.activeStory.timelines.mainTimelineIsReversed + "'. " );
            //}
          } );

  // Create element (svg <circle> in the particle's "expanded/home position" or
  // its "collapsed/core position". In any case we will need the coreXY values.
  var results = null;
  // results = { element: <circle>, particle{ props: {x:homeX, y:homeY} } }
  while ( (results = createPositionedSVGelement( _this, options )) ) {
    $elementsContainerElem.append( results.element );
    if ( _this.settings.isCreateElementsObjArray ) {
      domElementsObjsArray.push( results.element );
    }

    // Create timeline of tweens that either:
    //    "collapses" the halftone image to a shrunken core.
    //    or "expands" the halftone image from a shrunken core to a full image.
    if ( _this.settings.isStartImageCollapsed ) {

      //----------------------------------------------------
      // NOTE: particles(xy) image is currently Collapsed,
      //       we move em to a expanded/home position.
      // ---------------------------------------------------
      mainTimeline.insert(
        TweenMax.to(
          results.element, _this.settings.tweenDuration,
          // NOTE: we don't want to do math calculations when creating DOM elements.
          //       So require that all adjustments were made when the particle
          //       map was created.
          // At this point the <circle> has a cx/cy of the particle's image
          // 'collapsed' position.  So we move em to a expanded/home position.
          { attr: { cx: results.particle.props.x,
                    cy: results.particle.props.y,
                    opacity: 1,
                  },
            // autoAlpha - the same thing as "opacity" except that when the
            // value hits "0", the "visibility" property will be set to "hidden",
            // i.e. fade.
            //autoAlpha: 0,
            //ease: Power0.easeInOut,//ease: Power2.easeIn,

            //autoAlpha: 1,
            //ease: Power0.easeInOut,
            //ease: Power2.easeOut,
          }
        ) // end TweenMax.to()
      ); // end mainTimeline.insert(COLLAPSED)
    } else { // isStartImageExpanded

      //----------------------------------------------------
      // NOTE: particles(xy) image is currently EXPANDED,
      //       move em to a collapsed position.
      // ---------------------------------------------------
      mainTimeline.insert(
        TweenMax.to(
          results.element, _this.settings.tweenDuration,
          // At this point the <circle> has a cx/cy of the particle's image
          // 'home' position. So we move em to a collapsed position.
          { attr: { cx: results.coreX,
                    cy: results.coreY,
                  },
            // autoAlpha - the same thing as "opacity" except that when the
            // value hits "0", the "visibility" property will be set to "hidden",
            // i.e. fade.
            autoAlpha: 0,
            //ease: Power0.easeInOut,
          },
        ) // end TweenMax.to()
      ); // end mainTimeline.insert(EXPANDED)
    }
    numElements += 1;
  }; // end while ( results )
  // Resume here when all elements created.
  var results = {
    animationElementsContainerElem: elementsContainerElem,
    domElementsObjsArray: domElementsObjsArray,
    timelineProps: {
      sceneTag: _this.settings.sceneTag,
      gsapTimeline: mainTimeline,
      // Start position is always the reverse of where our timeline plays forward to.
      isReversed: true,
    },
  };
  if (_this.logging){console.log( " ..*4.1a)createSvgElementsFromParticleMap(): Made " + numElements +
               " " + _this.settings.createAnimationElementsParams.type +
               " AnimationElements that start in a '" +
                    (_this.settings.isStartImageCollapsed ? 'COLLAPSED' : 'EXPANDED') +
               "' position. *");}

  if ( typeof callback == 'function' ) { callback( results ); return; }
  return results;
}; // end createSvgElementsFromParticles()

//----------------------------------------------------------------------------
function createPositionedSVGelement( _this, options ) {
  //----------------------------------------------------------------------------
  var results = null,
      particle = null,
      element = null;
  if ( (particle = getNextParticle( _this, options )) ) {
    var coreX = calcCoreX( _this, particle ),
        coreY = calcCoreY( _this, particle );
    if ( _this.settings.isStartImageCollapsed ) {
      element = createCollapsedPositionSVGelement( _this, options, particle, coreX, coreY );
    } else {
      element = createExpandedPositionSVGelement( _this, options, particle, coreX, coreY )
    }
  } else {
    return null;
  }
  if ( _this.settings.isStartImageCollapsed &&
      !_this.settings.isElementVisible ) {
    $( element ).attr( 'opacity', 0 );
  }
  return {
    element: element, particle: particle, coreX: coreX, coreY: coreY,
  };
}; // end createPositionedSVGelement()

//----------------------------------------------------------------------------
function createCollapsedPositionSVGelement( _this, options, particle, coreX, coreY ) {
  //----------------------------------------------------------------------------
  // Create elements to start at their 'collapsed position' which will recreate
  // the photo image as a collapsed core of particles centered in the panel.
  return $( makeSvgElementNS( 'circle' ) )
            .attr( 'cx', coreX )
            .attr( 'cy', coreY )
            .attr( 'r', particle.props.r )
            .attr( 'fill', _this.settings.elementsAnimationElementColor );
}; // end createCollapsedPositionSVGelement()

//----------------------------------------------------------------------------
function createExpandedPositionSVGelement( _this, options, particle, coreX, coreY ) {
  //----------------------------------------------------------------------------
  // Create elements to start at their 'home position' which will recreate the
  // photo image.
  return $( makeSvgElementNS( 'circle' ) )
            .attr( 'cx', particle.props.x )
            .attr( 'cy', particle.props.y )
            .attr( 'r', particle.props.r )
            .attr( 'fill', _this.settings.elementsAnimationElementColor );
}; // end createExpandedPositionSVGelement()

//----------------------------------------------------------------------------
  function calcCoreX( _this, particle ) {
  //----------------------------------------------------------------------------
  if ( _this.settings.createAnimationElementsParams.isRandomizeCollapsedCore ) {
    return getRandom( _this.settings.animationPanelLeftBoundaryX, _this.settings.animationPanelRightBoundaryX );
  }
  return _this.settings.createAnimationElementsParams.collapsedCoreX;
}; // end calcCoreX()

//----------------------------------------------------------------------------
  function calcCoreY( _this, particle ) {
  //----------------------------------------------------------------------------
  if ( _this.settings.createAnimationElementsParams.isRandomizeCollapsedCore ) {
    return getRandom( _this.settings.animationPanelTopBoundary, _this.settings.animationPanelBottom );
  }
  return _this.settings.createAnimationElementsParams.collapsedCoreY;
}; // end calcCoreY()

//----------------------------------------------------------------------------
function playTimelineForwards( _this, tcb ) {
  //----------------------------------------------------------------------------
  if (_this.logging){console.log( " ..*4.2) playTimelineForwards(): will set isReversed to 'false' *");}
  tcb.gsapTimeline.play(); //pause(5);
  tcb.isReversed = false;
}; // end: playTimelineForwards()

//----------------------------------------------------------------------------
function playTimelineBackwards( _this, tcb ) {
  //----------------------------------------------------------------------------
  if (_this.logging){console.log( " ..*4.3) playTimelineBackwards(): will set isReversed to 'true' *");}
  tcb.gsapTimeline.reverse();
  tcb.isReversed = true;
}; // end: playTimelineBackwards()

//----------------------------------------------------------------------------
function isInStartPosition( _this, story ) {
  //----------------------------------------------------------------------------
  if (_this.logging){console.log( " ..*4.4) isInStartPosition(): " +
               "StartImageExpanded: '" + _this.settings.isStartImageExpanded +
               "'. Will return: '" + ( _this.settings.isStartImageExpanded
                    ? isInExpandedPosition( _this, story ) : isInCollapsedPosition( _this, story ) ) + "'*");}
  return _this.settings.isStartImageExpanded
    ? isInExpandedPosition( _this, story )
    : isInCollapsedPosition( _this, story );
}; // end: isInStartPosition()

//----------------------------------------------------------------------------
function startPosition( _this, story, tcb ) {
  //----------------------------------------------------------------------------
  // The start position of a timeline depends on how the timeline was initially built.
  if ( ( _this.settings.isStartImageExpanded  && !isInExpandedPosition( _this, story ) ) ||
       ( _this.settings.isStartImageCollapsed && !isInCollapsedPosition( _this, story ) ) ) {
    playTimelineBackwards( tcb );
  }
}

//----------------------------------------------------------------------------
function isInExpandedPosition( _this, story ) {
  //----------------------------------------------------------------------------
  if (_this.logging){console.log( " ..*4.5) isInExpandedPosition(): " +
               "StartImageExpanded: '" + _this.settings.isStartImageExpanded +
               "'. Will return: '" + ( _this.settings.isStartImageExpanded
                    ? story.timelines.main.isReversed : !story.timelines.main.isReversed ) + "'*");}
  if ( _this.settings.isStartImageExpanded ) {
    // Note: main.isReversed means "image is expanded"
    return story.timelines.main.isReversed;
  }
  // if ( _this.settings.isStartImageCollapsed ) {
  // Note: main.isReversed means "image is collapsed"
  return !story.timelines.main.isReversed;
}; // end: isInExpandedPosition()

//----------------------------------------------------------------------------
function isInCollapsedPosition( _this, story ) {
  //----------------------------------------------------------------------------
  if (_this.logging){console.log( " ..*4.6) isInCollapsedPosition(): " +
               "StartImageExpanded: '" + _this.settings.isStartImageExpanded +
               "'. Will return: '" + !isInExpandedPosition( _this, story ) + "'*");}
  return !isInExpandedPosition( _this, story );
}; // end: isInCollapsedPosition()
