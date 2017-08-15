// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function elements( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  options.sceneTag = 'elements';
  elements_reset( _this, { sceneTag: options.sceneTag } );
  updateSettings( _this, options );
  console.log( " ..*4.2) elements() " + "'. RenderParticleMap: '" + _this.settings.isRenderParticleMap +
               "' for active story '" + _this.activeStory.tag + "' *");

  // particleMap MUST have already been created.
  if ( !_this.activeStory.particleMap.particles ||
       _this.activeStory.particleMap.particles.length == 0 ) {
    alert('You MUST create Particles first via the "Particles" link.');
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }

  // display particles in Panel specified by options (now in .settings).
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
      method:   _this.settings.isRenderParticleMapAsSingleCanvas ? 'renderParticleMapAsSingleCanvas'
              : _this.settings.isUseSVGelements ? 'renderParticleMapAsSvgElements'
              : _this.settings.isUseCanvasElements ? 'renderParticleMapAsCanvasElements'
              //: _this.settings.isUseDivElements ?
              : 'renderParticleMapAsDivElements',
      offsetX: 0, //-80,
      offsetY: 0, //-20,
    },
  },
  /*1-Resume here when done*/ function( scene ) {
  // _this.movie.stories[0].scenes[0].animationElements.domElements.objects
  playSceneIfAutoPlay( _this, { scene: scene },
  /*2-Resume here when done*/ function( timeline ) {
  if ( typeof callback == 'function' ) { callback( scene ); return; }
  return scene;
  /*2-*/});/*1-*/});
};// end: elements()

//----------------------------------------------------------------------------
function elements_reset( _this, options ) {
  //----------------------------------------------------------------------------
  if ( _this.settings == 'undefined' ) {
    // onDomReady() init.
  } else {

  }
}; // end: elements_reset()

//----------------------------------------------------------------------------
function renderParticleMapAsSvgElements( _this, options, callback ) {
  //----------------------------------------------------------------------------
  updateSettings( _this, options );
  var particleAnimationElementMethod = '',
      particles = _this.activeStory.particleMap.particles,
      sceneContainerElem = _this.activeScene.container.html.elem,
      $sceneContainerElem = $( sceneContainerElem ),
      elementsContainer = _this.activeScene.animationElements.container,
      domElementsObjsArray = [];
  console.log( " ..*5a.1) For HomePositionParticles[].len = " + particles.length + ". *");

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

  // Assume container.style.display = 'none'. Now attach to specified Panel.
  $( _this.centerPanel ).children().last().append( elementsContainerElem );
  sceneContainerElem.style.display = 'block';
  setAnimationBoundaries( _this, options );

  var numElements = 0;
  _this.particlesTimeline = new TimelineMax( { repeat: 0, yoyo: false, repeatDelay: 0, paused: true } );

  $.each( particles, function( idx, particle ) {
    // NOTE: particleAnimationMethod should return a Tween for the element. And it
    // should call its own "make an element" method.
    // Create element "below the fold", i.e. element.y is off the bottom of the page.
    var element = createParticleAnimationSVGelement( _this, particle );
    if ( element ) {

      // Move element from element.x, element.y to home.x, home.y.
      $elementsContainerElem.append( element );
      domElementsObjsArray.push( element );

      _this.particlesTimeline.insert(
        TweenMax.to(
          element, _this.settings.tweenDuration,
          { attr: { cx: particle.x + _this.settings.animationElementOffsetX,
                    cy: particle.y + _this.settings.animationElementOffsetY,
                  },
    	      //autoAlpha: 0,
            //ease: Power0.easeInOut,
            ease: Power2.easeOut,
          }
        ) // end TweenMax.to()
      ); // end Timeline.insert()
      numElements += 1;
    } // end if ( element )
  }); // end $.each()

  $sceneContainerElem.attr( 'numElements', numElements + '' );
  var results = {
    animationElementsContainerElem: elementsContainerElem,
    domElementsObjsArray: domElementsObjsArray,
  };
  console.log( " ..*5a.2) renderParticleMapAsTweens(): Made " + $sceneContainerElem.attr( 'numElements' ) +
               " canvas AnimationElements. *");

  if ( typeof callback == 'function' ) { callback( results ); return; }
  return results;
}; // end renderParticleMapAsSvgElements()

//----------------------------------------------------------------------------
function createParticleAnimationSVGelement( _this, particle ) {
  //----------------------------------------------------------------------------
  //var panel_bottom = $(_this.settings.sceneContainer).height(),
  //    panel_width = $(_this.settings.sceneContainer).width(),
  //    left_boundaryX = Math.round( panel_width * 3/8 ),
  //    right_boundaryX = Math.round( panel_width - (panel_width * 3/8) );

  // Create element "below the fold" and in a column in the middle of the panel.
  // i.e. element.y is off the bottom of the page, element.x is in middle.
  var circle = $( makeSvgElementNS( 'circle' ) )
      .attr( 'cx', getRandom( _this.settings.animationPanelLeftBoundaryX, _this.settings.animationPanelRightBoundaryX ) )
      .attr( 'cy', _this.settings.animationPanelBottom - getRandom( 40, 50 ) )
      .attr( 'r', particle.r )
      .attr( 'fill', _this.settings.animationElementColor )
      .attr( 'hx', particle.x )
      .attr( 'hy', particle.y );
  return circle;
}; // end createParticleAnimationSVGelement()


  /* per: https://stackoverflow.com/questions/32637811/how-can-i-add-a-svg-graphic-dynamically-using-javascript-or-jquery
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "640");
    ...
    document.getElementById("div").appendChild(svg);

    per: http://chubao4ever.github.io/tech/2015/07/16/jquerys-append-not-working-with-svg-element.html

    ###html file
    < svg version="1.1" id="circle" width="400px" height="400px">
      < circle fill="#FFFFFF" stroke="#000000" stroke-width="4" stroke-miterlimit="10" cx="300" cy="300" r="55.5"/>
    </ svg>

    ###js file
    (function() {
      $(document).ready(function() {
        drawCircle();
        drawCircle(100,100,"red");
        drawCircle(200,200,"blue");
        drawCircle(400,400,"gray");
      });
    })();

    function SVG(tag) {
      return document.createElementNS('http://www.w3.org/2000/svg', tag);
    }

    var drawCircle = function(x,y,color) {
        var $svg = $("svg");
        $(SVG('circle'))
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 50)
            .attr('fill', color)
            .appendTo($svg);
    };
  */

//------------------------------------------------------------------------------
function makeSvgElementNS( tag ) {
  //----------------------------------------------------------------------------
  // per: http://chubao4ever.github.io/tech/2015/07/16/jquerys-append-not-working-with-svg-element.html
  return document.createElementNS('http://www.w3.org/2000/svg', tag);
}; // end makeSvgElementNS()


//----------------------------------------------------------------------------
function renderParticleMapAsDivElements( _this, options, callback ) {
  //----------------------------------------------------------------------------
  updateSettings( _this, options );
  var particleAnimationElementMethod = '',
      particles = _this.activeStory.particleMap.particles,
      sceneContainerElem = _this.activeScene.container.html.elem,
      $sceneContainerElem = $( sceneContainerElem ),
      elementsContainer = _this.activeScene.animationElements.container,
      domElementsObjsArray = [];
  console.log( " ..*5a.1) renderParticleMapAsDivElements() For Particles[].len = " + particles.length + ". *");

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

  // Assume container.style.display = 'none'. Now attach to specified Panel.
  $( _this.centerPanel ).children().last().append( elementsContainerElem );
  sceneContainerElem.style.display = 'block';
  setAnimationBoundaries( _this, options );

  var numElements = 0;
  _this.particlesTimeline = new TimelineMax( { repeat: 0, yoyo: false, repeatDelay: 0, paused: true } );

// Assume container.style.display = 'none'. Now attach to specified Panel.
//_this.settings.sceneContainer.style.display = 'block';
//_this.settings.sceneContainer.panel.appendChild( _this.settings.sceneContainer );

  $.each( particles, function( idx, particle ) {
    // Create element "below the fold", i.e. element.y is off the bottom of the page.
    var element = createParticleAnimationDivElement( _this, particle );
    if ( element ) {
      elementsContainerElem.append( element );
      domElementsObjsArray.push( element );

      // Move element from element.x, element.y to home.x, home.y.
      _this.particlesTimeline.insert(
        TweenMax.to(
          element, _this.settings.tweenDuration,
          { left: particle.x + _this.settings.animationElementOffsetX,
            top:  particle.y + _this.settings.animationElementOffsetY,
    	      //autoAlpha: 0,
            //ease: Power0.easeInOut,
            ease: Power2.easeOut,
          }
        ) // end TweenMax.to()
      ); // end Timeline.insert()
      numElements += 1;
    } // end if ( element )
  }); // end $.each()

  $sceneContainerElem.attr( 'numElements', numElements + '' );
  var results = {
    animationElementsContainerElem: elementsContainerElem,
    domElementsObjsArray: domElementsObjsArray,
  };
  console.log( " ..*5a.1a) renderParticleMapAsDivElements(): Made " + $sceneContainerElem.attr( 'numElements' ) +
               " <div> AnimationElements. *");
  if ( typeof callback == 'function' ) { callback( results ); return; }
  return results;
}; // end renderParticleMapAsDivElements()

//----------------------------------------------------------------------------
function createParticleAnimationDivElement( _this, particle, gridSize ) {
  //----------------------------------------------------------------------------
  var gridSize = _this.activeStory.particleMap.gridSize;
  // Create element "below the fold" and in a column in the middle of the panel.
  // i.e. element.y is off the bottom of the page, element.x is in middle.
  var div = document.createElement( 'div' );
  div.style.position = 'absolute';
  div.style.left = getRandom( 225, 425 ) + "px";
  div.style.top = _this.settings.animationPanelBottom - getRandom( 40, 50 ) + "px";
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
}; // end createParticleAnimationDivElement()

//----------------------------------------------------------------------------
function setAnimationBoundaries( _this, particle ) {
  //----------------------------------------------------------------------------
  var $sceneContainer = $( _this.activeScene.container.html.elem ),
      panel_bottom = $sceneContainer.height(),
      panel_width = $sceneContainer.width();
  _this.settings.animationPanelTop = 0;
  _this.settings.animationPanelTopBoundary = Math.round( panel_bottom * .45 );
  _this.settings.animationPanelBottom = panel_bottom;
  _this.settings.animationPanelWidth = panel_width;
  _this.settings.animationPanelLeftBoundaryX = Math.round( panel_width * .42 );
  _this.settings.animationPanelRightBoundaryX = Math.round( panel_width - _this.settings.animationPanelLeftBoundaryX );
}; // end setAnimationBoundaries()

//----------------------------------------------------------------------------
function createParticleAnimationCanvasElement( _this, particle ) {
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
}; // end createParticleAnimationCanvasElement()
