// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function particles( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  options.sceneTag = 'particles';
  particles_reset( _this, { sceneTag: options.sceneTag } );
  updateSettings( _this, options );
  console.log( " ..*4.1) particles() " + "'. RenderParticleMap: '" + _this.settings.isRenderParticleMap + "'. *");

  // Create particle array by selecting pixels we want for a halftone image.
  createParticleMap( _this, {
    id: _this.settings.id,
    isRejectParticlesOutOfBounds: true,
    isRejectParticlesBelowIntensityThreshold: true,
    isRejectParticlesSameAsContainerBackground: true,
    sceneTag: options.sceneTag,
  },
  /*1-Resume here when done*/ function( maps ) {
  _this.particleMaps = maps;
  _this.particles = _this.particleMaps.homePostionParticles;
  // Optionally display particles in Panel specified by options (now in .settings).
  createScene( _this, {
    sceneTag: options.sceneTag,
    panel: xlatSettingsToPanel( _this ),
    container: {
      width: _this.settings.img.width + 8,
      height: _this.settings.img.height,
      left: 0,
      top: 0,
      backgroundColor: _this.defaults.sceneBackgroundColor, //  '#E7F1F7', Climate Corp "halftone background blue"
      //  background color of Climate Corp profile photo for Meg: rgb(234, 233, 238) #eae9ee
      border: '',
    },
    animationElements: {
      method:   _this.settings.isRenderParticleMapAsSingleCanvas ? 'renderParticleMapAsSingleCanvas'
              : _this.settings.isUseSVGelements ? 'renderParticleMapAsSvgElements'
              : _this.settings.isUseCanvasElements ? 'renderParticleMapAsCanvasElements'
              //: _this.settings.isUseDivElements ?
              : 'renderParticleMapAsDivElements',
      offsetX: 0, //-80,
      offsetY: 0, //-20,
    },
  },
  /*2-Resume here when done*/ function( scene ) {
  _this.scene = scene;
  playSceneIfAutoPlay( _this, { scene: scene },
  /*3-Resume here when done*/ function( timeline ) {
  if ( typeof callback == 'function' ) { callback(); return; }
  /*3-*/});/*2-*/});/*1-*/});
};// end: particles()

//----------------------------------------------------------------------------
function renderParticleMapAsSvgElements( _this, options, callback ) {
  //----------------------------------------------------------------------------
  updateSettings( _this, options );
  var particleAnimationElementMethod = '';
  console.log( " ..*5a.1) For HomePositionParticles[].len = " + _this.particleMaps.homePostionParticles.length + ". *");

  // Insert the REQUIRED <svg> tag within the sceneContainer to contain the svg <circle> elements.
  // NOTE: browser can not directly add <svg> or <circle> tags, need to use "w3.org namespace".
  _this.settings.animationElementsContainer =
    $( makeSvgElementNS('svg') )
      .attr( 'id', 'aniElems_Con_' )
      .attr( 'width', '589' )
      .attr( 'height', '600' );
  $( _this.centerPanel ).children().last().append( _this.settings.animationElementsContainer );
  setAnimationBoundaries( _this, options );

  var numElements = 0;
  _this.particlesTimeline = new TimelineMax( { repeat: 0, yoyo: false, repeatDelay: 0, paused: true } );

// Assume container.style.display = 'none'. Now attach to specified Panel.
//_this.settings.sceneContainer.style.display = 'block';
//_this.settings.sceneContainer.panel.appendChild( _this.settings.sceneContainer );

  $.each( _this.particleMaps.homePostionParticles, function( idx, particle ) {
//if (idx < 100) {

    // NOTE: particleAnimationMethod should return a Tween for the element. And it
    // should call its own "make an element" method.
    // Create element "below the fold", i.e. element.y is off the bottom of the page.
    var element = createParticleAnimationSVGelement( _this, particle );
    if ( element ) {

      // Move element from element.x, element.y to home.x, home.y.
      $( _this.settings.animationElementsContainer ).append( element );
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
//}
  }); // end $.each()

  $( _this.settings.sceneContainer ).attr( 'numElements', numElements + '' );
  console.log( " ..*5a.2) renderParticleMapAsTweens(): Made " + $( _this.settings.sceneContainer ).attr( 'numElements' ) +
               " canvas AnimationElements. *");

  if ( typeof callback == 'function' ) { callback( numElements ); return; }
  return numElements;
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
      .attr( 'cx', getRandom( 225, 425 ) )
      .attr( 'cy', _this.settings.animationPanelBottom - getRandom( 40, 50 ) )
      .attr( 'r', particle.r )
      .attr( 'fill', _this.settings.animationElementColor );
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
  console.log( " ..*5a.1) renderParticleMapAsDivElements() For HomePositionParticles[].len = " + _this.particleMaps.homePostionParticles.length + ". *");

  setAnimationBoundaries( _this, options );
  var numElements = 0;
  _this.particlesTimeline = new TimelineMax( { repeat: 0, yoyo: false, repeatDelay: 0, paused: true } );

// Assume container.style.display = 'none'. Now attach to specified Panel.
//_this.settings.sceneContainer.style.display = 'block';
//_this.settings.sceneContainer.panel.appendChild( _this.settings.sceneContainer );

  $.each( _this.particleMaps.homePostionParticles, function( idx, particle ) {
    // Create element "below the fold", i.e. element.y is off the bottom of the page.
    var element = createParticleAnimationDivElement( _this, particle );
    if ( element ) {
      _this.settings.sceneContainer.appendChild( element );
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

  $( _this.settings.sceneContainer ).attr( 'numElements', numElements + '' );
  console.log( " ..*5a.2) renderParticleMapAsTweens(): Made " + $( _this.settings.sceneContainer ).attr( 'numElements' ) +
               " canvas AnimationElements. *");
  if ( typeof callback == 'function' ) { callback( numElements ); return; }
  return numElements;
}; // end renderParticleMapAsDivElements()

//----------------------------------------------------------------------------
function createParticleAnimationDivElement( _this, particle ) {
  //----------------------------------------------------------------------------

  // Create element "below the fold" and in a column in the middle of the panel.
  // i.e. element.y is off the bottom of the page, element.x is in middle.
  var div = document.createElement( 'div' );
  div.style.position = 'absolute';
  div.style.left = getRandom( 225, 425 ) + "px";
  div.style.top = _this.settings.animationPanelBottom - getRandom( 40, 50 ) + "px";
  // Math.round( particle.r * _this.particleMaps.gridSize
  // // max 8px, min 2px.
  var diameter = Math.round( particle.r * _this.particleMaps.gridSize );
  if ( diameter < 1 ) {
    return null;
  } else if ( diameter > ( 2 * _this.particleMaps.gridSize ) ) {
    diameter = diameter / 2;
    if ( diameter > ( 2 * _this.particleMaps.gridSize ) ) {
      diameter = ( 2 * _this.particleMaps.gridSize );
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
  var panel_bottom = $( _this.settings.sceneContainer ).height(),
      panel_width = $( _this.settings.sceneContainer ).width();
  _this.settings.animationPanelBottom = panel_bottom;
  _this.settings.animationPanelWidth = panel_width;
  _this.settings.animationPanelLeftBoundaryX = Math.round( panel_width * 3/8 );
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

//----------------------------------------------------------------------------
function renderParticleMapAsSingleCanvas( _this, options, callback ) {
  //----------------------------------------------------------------------------
  console.log( " ..*5b.1) renderParticleMapAsSingleCanvas(): For HomePositionParticles[].len = " + _this.particleMaps.homePostionParticles.length + ". *");

  var numElements = 1,
      canvasAndCtx = makeCanvasAndCtx(),
      canvas = canvasAndCtx.canvas,
      context = canvasAndCtx.ctx;

  // NOTE: eraseCanvas() also set canvas.width/height, fillStyle = color
  eraseCanvas( _this, canvas, context, '#E7F1F7' );

  // Copy every particle to its home position on the white canvas.
  //   Each particle: maps.homePostionParticles.push( {
  //          x: filterResults.x + homeOffsetLeft,
  //          y: filterResults.y+ homeOffsetTop,
  //          r: filterResults.pixelChannelIntensity * gridSize,
  // Write a halftone ball with the specified radius (which was calculated
  // as bigger for lower intensity particles).
  context.fillStyle = _this.settings.animationElementColor;
  $.each( _this.particleMaps.homePostionParticles, function( idx, particle ) {
    context.beginPath();
    context.arc(
        particle.x + _this.settings.animationElementOffsetX,
        particle.y + _this.settings.animationElementOffsetY,
        particle.r,
        0, _this.TAU );
    context.fill();
    context.closePath();
  });
  // Add our single canvas to the sceneContainer.
  _this.settings.sceneContainer.appendChild( canvas );
  $( _this.settings.sceneContainer ).attr( 'numElements', numElements + '' );
  console.log( " ..*5b.2) renderParticleMapAsSingleCanvas(): Made " + $( _this.settings.sceneContainer ).attr( 'numElements' ) +
               " canvas AnimationElements. *");

  if ( typeof callback == 'function' ) { callback( numElements ); return; }
  return numElements;
}; // end renderParticleMapAsSingleCanvas()

//----------------------------------------------------------------------------
function particles_reset( _this, options ) {
  //----------------------------------------------------------------------------
  if ( _this.settings == 'undefined' ) {
    // onDomReady() init.
  } else {
    playScene_reset( _this, { sceneTag: options.sceneTag, } );
    //eraseCanvas( _this, canvas, context, '#E7F1F7' );
    _this.particleMaps = {};
    _this.particles = [];
    _this.settings.particlesScene = null;
    _this.settings.rgbChannel = 'blue'; // _this.settings.halftoneColor
    _this.particlesRejectedBecauseParticleIsOutOfBounds = 0;
    _this.particlesRejectedBecausePixelIntensityLessThanThreshold = 0;
    _this.particlesRejectedBecausePixelSameAsContainerBackgroundRGB = 0;
    _this.particlesRejectedBecausePixelSameAsContainerBackgroundRGBA = 0;
    _this.particlesRejectedBecauseIsExcludedNthPixell = 0;
    _this.particlesRejectedBecauseIsExcludedNotNthPixell = 0;
    _this.particlesRejectedBecauseIsNonCenterMemberOfCluster = 0;
    _this.particlesRejectedBecausePixelIndexIsOutOfBounds = 0;
    _this.settings.rgbChannelOffset = _this.RGB_CHANNEL_OFFSETS[ _this.settings.rgbChannel ];
    _this.settings.rgbChannelAngle = _this.RGB_CHANNEL_ANGLES[ _this.settings.rgbChannel ];
  }
}; // end: particles_reset()
