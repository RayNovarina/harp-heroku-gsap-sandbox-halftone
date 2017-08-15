cd /users/raynovarina/sites/AtomProjects/harp/gsap-sandbox-halftone/

per: https://greensock.com/jump-start-js
     https://greensock.com/get-started-js#intro

Cloned from my repos:

$ git clone https://github.com/RayNovarina/harp-heroku-greensock-getting-started.git gsap-sandbox-halftone
$ cd gsap-sandbox-halftone/

Start harp server:
$ harp server -p 9008

Access via localhost:9008
============================

Modify package.json and Procfile files for Heroku deploy:
  package.json:

    {
      "name": "greensock-sandbox-halftone",
      "version": "0.0.1",
      "description": "Harp server App: javascript/greensock-sandbox-halftone",
      "dependencies": {
        "harp": "*"
      }
    }

  Procfile:

    web: harp server --port $PORT

At github account, create new repository: harp-heroku-gsap-sandbox-halftone and then
locally.
  $ git init
  $ git remote add origin https://github.com/RayNovarina/harp-heroku-gsap-sandbox-halftone.git

Create Heroku app:
  $ heroku create harp-gsap-sandbox-htone-94037

$ git remote -v
  heroku  https://git.heroku.com/harp-gsap-sandbox-htone-9403.git (fetch)
  heroku  https://git.heroku.com/harp-gsap-sandbox-htone-9403.git (push)
  origin  https://github.com/RayNovarina/harp-heroku-gsap-sandbox-halftone.git (fetch)
  origin  https://github.com/RayNovarina/harp-heroku-gsap-sandbox-halftone.git (push)

Deploy changes to github and heroku:
  $ git add .
  $ git commit -am "First Harp + Heroku commit"
  $ git push origin master
  $ git push heroku master

View on Heroku:

  https://harp-gsap-sandbox-htone-9403.herokuapp.com shows:

  Welcome to harp/gsap-sandbox-halftone.
  Deployed locally at http://localhost:9008/
  Deployed on Heroku at https://harp-gsap-sandbox-htone-94037.herokuapp.com/

=======================================================================
Create array of animation elements:
    That appear when attached to the conversionContainer.
OR timeline.scene1:
    Draw halftone image - from start till end of drawing image. Start
    with total fade out/invisible. Draw with
    tween.to(dot, homeX, homeY), duration: 0.
<img>.timeline:
  scene1:
      Collapse AnimationElements showing full image to center
      column that fades out.
=======================================================================



Notes:

* Convert link: Display converted particle map once it is done.
    Create particle map and then create a
    canvas in the conversionContainer and write the particle
    dots on it in one pass, i.e. without animation. Just call
    createAnimationElements() with isDrawOnSingleCanvas = true;
* Elements link: Create AnimationElements in the animationContainer. Pin them to
    their image home position, i.e. re-create the photo image.
Explode link: Create AnimationElements in the animationContainer. Pin them to
    their image home position, i.e. re-create the photo image.
    Delay and then apply the explode animation effect.
    Elements move up and out.
Collapse link: Create AnimationElements in the animationContainer. Pin them to
    their image home position, i.e. re-create the photo image.
    Delay and then apply the collapse animation effect.
    Elements move down and inward.
Rise Up link: Create AnimationElements in the animationContainer. Pin below
    their image bottom position, i.e. photo image is visible below the
    animationContainer.
    Delay and then apply the rise up animation effect.
    Elements move up and out.
All link: Create AnimationElements in the animationContainer. Pin them to
    their image home position, i.e. re-create the photo image.
    Delay and then animate a sequence of events: collaspe, rise up.

Create Particle Map: Get exclude and transform cluster logic working.

Create Animation Elements: Get <svg Ball> working, <div>ball</div> working.

All effects link: Add option to animate as GASP TimeLine of effects.

==============================================
// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function elements( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  options.sceneTag = 'elements';
  elements_reset( _this, { sceneTag: options.sceneTag } );
  updateSettings( _this, options );
  console.log( " ..*4.2) elements() *");

  // display particles in Panel specified by options (now in .settings).
  createScene( _this, {
    sceneTag: options.sceneTag,
    panel: settingsToPanel( _this ),
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
  /*2-Resume here when done*/ function( sceneContainer ) {
  _this.scene = sceneContainer;
  var aniContainerObj = $( sceneContainer ).find( '.trr-ani-elems-container' ),
      domElementsObjsArray = $( aniContainerObj ).children().toArray();
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
  // _this.movie.stories[0].scenes[0].animationElements.domElements.objects
  playSceneIfAutoPlay( _this, { scene: sceneContainer },
  /*3-Resume here when done*/ function( timeline ) {
  if ( typeof callback == 'function' ) { callback(); return; }
  /*3-*/});/*2-*/});
}; // end: elements()

//----------------------------------------------------------------------------
function elements_reset( _this, options ) {
  //----------------------------------------------------------------------------
  if ( _this.settings == 'undefined' ) {
    // onDomReady() init.
  } else {

  }
}; // end: elements_reset()

===================================

//----------------------------------------------------------------------------
function createScene( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  console.log( " ..*3.2) createScene() For sceneTag: '" + _this.settings.sceneTag + "'. *");
  if ( isSceneDisabled( _this, options ) ) {
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }
  // Create container per panel and options specified in settings.
  createSceneContainer( _this, {
    sceneId: 'scene_Con_' + _this.settings.id,
    story: _this.activeStory,
  },
  /*1-Resume here when done*/ function( sceneContainer ) {
  sceneContainer.panel.appendChild( sceneContainer );

  // Create AnimationElements per panel and options specified in settings.
  // Attach them as needed to the sceneContainer.
  options.sceneContainer = sceneContainer;
  createAnimationElements( _this, {
    scene: _this.activeScene,
  },
  /*2-Resume here when done*/ function( num_elements ) {
  // Assume container.style.display = 'none'. Now attach to specified Panel.
  //sceneContainer.panel.appendChild( sceneContainer );
  if ( typeof callback == 'function' ) { callback( sceneContainer ); return; }
  return sceneContainer;
  /*2-*/});/*1-*/});
}; // end: createScene()

//----------------------------------------------------------------------------
function createSceneContainer( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  updateSettings( _this, options );
  console.log( " ..*3.4) createSceneContainer() For '" + _this.settings.panel + "' Panel. *");

  createSceneContainer_reset( _this,
  /*1-Resume here when done*/ function() {

  var container = document.createElement( "div" ),
      $container = $( container );
  container.id = _this.settings.sceneId;
  $container.addClass( 'trr-scene-container' )
            .attr( 'sceneTag', _this.settings.sceneTag )
            .attr( 'photoTag', _this.settings.photoTag );
  //container.style.display = 'none';
  container.panel = ( _this.settings.isCreateSceneInLeftPanel ? _this.leftPanel
    : _this.settings.isCreateSceneInCenterPanel ? _this.centerPanel
    : _this.rightPanel );
  container.style.width = _this.settings.container.width + "px";
  container.style.height = _this.settings.container.height + "px";
  container.style.position = "absolute";
  container.style.left = _this.settings.container.left + "px";
  container.style.top  = _this.settings.container.top + "px";
  container.style.backgroundColor  = _this.settings.container.backgroundColor;
  container.style.border  = _this.settings.container.border;

  _this.activeSceneContainer = container;
  _this.activeScene.container = container;

  console.log( " ..*3.4a) createSceneContainer() container.width: " +  container.style.width +
               ". container.height: " + container.style.height +
               ". Container Offset left: " + container.style.left + ". top: " + container.style.top + "'*");

  if ( typeof callback == 'function' ) { callback( container ); return; }
  return container;
  /*1-*/});
}; // end: createSceneContainer()

//----------------------------------------------------------------------------
function createSceneContainer_reset( _this, callback ) {
  //--------------------------------------------------------------------------
  // NOTE: Assume we have an acitveStory{}.
  // Case: just loaded, just created meg_story, meg_ParticleMap. Going to render
  //       particleMap for meg. need to create scene.
  tagToScene( _this, _this.settings.sceneTag, _this.settings.story,
  /*1-Resume here when done*/ function( result ) {
  if ( result.isFound ) {
    // This scene has been created before for this story.
    $( result.item ).children( 'div' ).remove();
    $( result.item ).empty();
    // Remove it from this story.
    _this.settings.story.scenes.splice( result.index, 1 );
  }
  // Got rid of old scene, make a new scene object for the active story.
  _this.activeScene = newScene( _this, _this.settings.sceneTag );
  if ( typeof callback == 'function' ) { callback( _this.activeScene ); return; }
  return _this.activeScene;
  /*1-*/});
}; // end: createSceneContainer_reset()

//------------------------------------------------------------------------------
function createAnimationElements( _this, options, /*Code to resume when done*/ callback ) {
  //----------------------------------------------------------------------------
  updateSettings( _this, options );
  console.log( " ..*3.8) createAnimationElements() For " +
               "sceneTag: '" + _this.settings.scene.tag +
               "' in Panel: '" + _this.settings.panel +
               "' using method '" + _this.settings.animationElements.method +
               "' *");

  createAnimationElements_reset( _this,
  /*1-Resume here when done*/ function() {
  window[ _this.settings.animationElements.method ]( _this, options,
  /*2-Resume here when done*/ function( animationElementsContainer ) {
  if ( typeof callback == 'function' ) { callback( animationElementsContainer ); return; }
  return animationElementsContainer;
  /*2-*/});/*1-*/});
}; // end: createAnimationElements()

//------------------------------------------------------------------------------
function createAnimationElements_reset( _this, callback ) {
//----------------------------------------------------------------------------
  // Reset animationElementsContainer for _this.settings.scene.
  var newElementsObj = newAnimationElements( _this, _this.settings.scene );
  if ( typeof callback == 'function' ) { callback( newElementsObj ); return; }
  return newElementsObj;
}; // end: createAnimationElements_reset()

========================

//----------------------------------------------------------------------------
function createScene_reset( _this ) {
  //--------------------------------------------------------------------------
  //if ( _this.centerPanel !== undefined ) {
  //  $(_this.centerPanel).children( 'canvas' ).remove();
  //  $(_this.centerPanel).children( 'div' ).remove();
  //  $(_this.centerPanel).empty();
  //  //_this.centerPanel = document.createElement( "div" );
  //}

}; // end: createScene_reset()

//----------------------------------------------------------------------------
function selectedPhotoToStory( _this, callback ) {
  //----------------------------------------------------------------------------
  return photoTagToStory( _this, _this.selectedPhotoTag, callback );
};// end: selectedPhotoToStory()


//----------------------------------------------------------------------------
function photoTagToStory( _this, photoTag, callback ) {
  //----------------------------------------------------------------------------
  if ( _this.movie.stories.length == 0 ) {
    if ( typeof callback == 'function' ) { callback( false ); return; }
    return false;
  }
  var isReturnedResult = false;
  $.each( _this.movie.stories, function( idx, story ) {
    if ( story.tag == photoTag ) {
      isReturnedResult = true;
      if ( typeof callback == 'function' ) { callback( story ); return; }
      return story;
    }
    if ( !isReturnedResult && idx == _this.movie.stories.length - 1 ) {
      if ( typeof callback == 'function' ) { callback( false ); return; }
      return false;
    }
  }); // end $.each()
};// end: photoTagToStory()

//----------------------------------------------------------------------------
function tagToScene( _this, sceneTag, story, callback ) {
  //----------------------------------------------------------------------------
  if ( story.scenes.length == 0 ) {
    if ( typeof callback == 'function' ) { callback( false ); return; }
    return false;
  }
  $.each( story.scenes, function( idx, scene ) {
    if ( scene.tag == sceneTag ) {
      if ( typeof callback == 'function' ) { callback( scene ); return; }
      return scene;
    }
    if ( idx == _this.movie.stories.length - 1 ) {
      if ( typeof callback == 'function' ) { callback( false ); return; }
      return false;
    }
  }); // end $.each()
};// end: tagToScene()

======================

// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function particles( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  options.sceneTag = 'particles';
  particles_reset( _this, { sceneTag: options.sceneTag } );
  updateSettings( _this, options );
  console.log( " ..*4.1) particles() " + "'. RenderParticleMap: '" + _this.settings.isRenderParticleMap +
               "' for active story '" + _this.settings.activeStory.tag + "' *");

  // Create particle array by selecting pixels we want for a halftone image.
  createParticleMap( _this, {
    id: _this.settings.activeStory.tag + '_particleMap',
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
  /*2-Resume here when done*/ function( sceneContainer ) {
  _this.scene = sceneContainer;
  var aniContainerObj = $( sceneContainer ).find( '.trr-ani-elems-container' ),
      domElementsObjsArray = $( aniContainerObj ).children().toArray();
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
  // _this.movie.stories[0].scenes[0].animationElements.domElements.objects
  playSceneIfAutoPlay( _this, { scene: sceneContainer },
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
      .attr( 'height', '600' )
      .attr( 'trr-ani-elem-type', 'circle' ),
  $animationElementsContainer = $( _this.settings.animationElementsContainer );
  $animationElementsContainer.addClass( 'trr-ani-elems-container' );
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
  console.log( " ..*5a.1) renderParticleMapAsDivElements() For HomePositionParticles[].len = " + _this.particleMaps.homePostionParticles.length + ". *");

  _this.settings.animationElementsContainer =
    $( document.createElement( "div" ) )
      .attr( 'id', 'aniElems_Con_' )
      .attr( 'width', '589' )
      .attr( 'height', '600' )
      .attr( 'trr-ani-elem-type', 'div' ),
  $animationElementsContainer = $( _this.settings.animationElementsContainer );
  $animationElementsContainer.addClass( 'trr-ani-elems-container' );
  $( _this.centerPanel ).children().last().append( _this.settings.animationElementsContainer );

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
      _this.settings.animationElementsContainer.append( element );
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

===========================

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

==============================================
/*
var container = document.getElementById( "svgContainer" );
container.panel = ( _this.settings.isCreateSceneInLeftPanel ? _this.leftPanel
  : _this.settings.isCreateSceneInCenterPanel ? _this.centerPanel
  : _this.rightPanel );
container.style.backgroundColor  = 'white';
*/

<div id="centerPanel" class="centerPanel">
<!--  <svg id="svgContainer" width="400px" height="400px"
       style="border: 4px solid black;
              position: absolute; top: 0px; left: 0px;">
   <circle id="svgCircle"  cx="250" cy="400" r="8"  fill="red" />
   <circle id="svgCircle2" cx="200" cy="400" r="12"  fill="blue" />
   <circle id="svgCircle3" cx="300" cy="400" r="16"  fill="black" />
 </svg> -->
</div>

//----------------------------------------------------------------------------
function renderParticleMapAsTweens( _this, options, callback ) {
  //----------------------------------------------------------------------------
  var particleAnimationElementMethod =
    _this.settings.isUseCanvasElements ? 'createParticleAnimationCanvasElement'
    : _this.settings.isUseSVGelements ? 'createParticleAnimationSVGelement'
    : 'createParticleAnimationDivElement'
  console.log( " ..*5a.1) renderParticleMapAsTweens() using " + particleAnimationElementMethod +
               "(). For HomePositionParticles[].len = " + _this.particleMaps.homePostionParticles.length + ". *");

/*
  _this.settings.animationElementsContainer = document.createElement(
      _this.settings.isUseCanvasElements ? 'div'
      : _this.settings.isUseSVGelements ? 'svg'
      : 'div' );
  _this.settings.animationElementsContainer.id = 'aniElCon_' + _this.settings.id;
  if (  _this.settings.isUseSVGelements ) {
    _this.settings.animationElementsContainer.setAttribute( 'width', _this.settings.sceneContainer.style.width );
    _this.settings.animationElementsContainer.setAttribute( 'height', _this.settings.sceneContainer.style.height );
  } else {
    _this.settings.animationElementsContainer.style.width = _this.settings.sceneContainer.style.width;
    _this.settings.animationElementsContainer.style.height = _this.settings.sceneContainer.style.height;
  }
  _this.settings.animationElementsContainer.style.position = _this.settings.sceneContainer.style.position;
  _this.settings.animationElementsContainer.style.left = _this.settings.sceneContainer.style.left;
  _this.settings.animationElementsContainer.style.top  = _this.settings.sceneContainer.style.top;
  _this.settings.animationElementsContainer.style.backgroundColor  = "white";

  _this.settings.sceneContainer.appendChild( _this.settings.animationElementsContainer );
*/

if (  _this.settings.isUseSVGelements ) {
  $(_this.centerPanel).children( 'div' ).remove();
  $(_this.centerPanel).append(
    ' <svg id="svgContainer" width="400px" height="400px" ' +
        ' style="border: 4px solid black; ' +
              //'  position: absolute; top: 0px; left: 0px;' +
        '  "> ' +
        ' <circle id="svgCircle"  cx="250" cy="400" r="8"  fill="red" /> ' +
        ' <circle id="svgCircle2" cx="200" cy="400" r="12"  fill="blue" /> ' +
        ' <circle id="svgCircle3" cx="300" cy="400" r="16"  fill="black" /> ' +
    ' </svg> ');
  _this.settings.sceneContainer = document.getElementById( 'svgContainer' );
}

  var numElements = 0;
  _this.particlesTimeline = new TimelineMax( { repeat: 0, yoyo: false, repeatDelay: 0, paused: true } );

// Assume container.style.display = 'none'. Now attach to specified Panel.
//_this.settings.sceneContainer.style.display = 'block';
//_this.settings.sceneContainer.panel.appendChild( _this.settings.sceneContainer );

  $.each( _this.particleMaps.homePostionParticles, function( idx, particle ) {
if (idx < 1) {

    // NOTE: particleAnimationMethod should return a Tween for the element. And it
    // should call its own "make an element" method.
    // Create element "below the fold", i.e. element.y is off the bottom of the page.
    var element = window[ particleAnimationElementMethod ]( _this, particle );
    if ( element ) {

      // Move element from element.x, element.y to home.x, home.y.
      if ( _this.settings.isUseSVGelements ) {
        $( _this.settings.sceneContainer).append( element );
      } else {
        //_this.settings.animationElementsContainer.appendChild( element );
        _this.settings.sceneContainer.appendChild( element );
      }
  	   _this.particlesTimeline.insert(
        TweenMax.to(
          element, options.tweenDuration,
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
}
  }); // end $.each()

  $( _this.settings.sceneContainer ).attr( 'numElements', numElements + '' );
  console.log( " ..*5a.2) renderParticleMapAsTweens(): Made " + $( _this.settings.sceneContainer ).attr( 'numElements' ) +
               " canvas AnimationElements. *");

  if ( typeof callback == 'function' ) { callback( numElements ); return; }
  return numElements;
}; // end renderParticleMapAsTweens()

//----------------------------------------------------------------------------
function createParticleAnimationSVGelement( _this, particle ) {
  //----------------------------------------------------------------------------
  var elementWidth = 16,
      elementHeight = 16
      panel_bottom = $(_this.settings.sceneContainer).height(),
      panel_width = $(_this.settings.sceneContainer).width(),
      left_boundaryX = Math.round( panel_width * 3/8 ),
      right_boundaryX = Math.round( panel_width - (panel_width * 3/8) );

  // Create element "below the fold" and in a column in the middle of the panel.
  // i.e. element.y is off the bottom of the page, element.x is in middle.
  //var circle = document.createElement( 'circle' );
  // <circle id="svgCircle"  cx="250" cy="400" r="8"  fill="red" />
  //circle.setAttribute( 'fill', 'red' );
  //circle.setAttribute( 'r', 16 );
  //circle.setAttribute( 'cx', 200 );
  //circle.setAttribute( 'cy', 200 );
  //return circle;
  //return '<circle id="svgCircleX"  cx="250" cy="400" r="8"  fill="red"></circle>';

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

  var circle = $( document.createElementNS( 'http://www.w3.org/2000/svg', 'circle') )
      .attr('cx', 250)
      .attr('cy', 400)
      .attr('r', 50)
      .attr('fill', 'red');
  return circle;
}; // end createParticleAnimationSVGelement()

=====================================

//----------------------------------------------------------------------------
function renderParticleMapAsTweens( _this, options, callback ) {
  //----------------------------------------------------------------------------
  var particleAnimationElementMethod =
    _this.settings.isUseCanvasElements ? 'createParticleAnimationCanvasElement'
    : _this.settings.isUseSVGelements ? 'createParticleAnimationSVGelement'
    : 'createParticleAnimationDivElement'
  console.log( " ..*5a.1) renderParticleMapAsTweens() using " + particleAnimationElementMethod +
               "(). For HomePositionParticles[].len = " + _this.particleMaps.homePostionParticles.length + ". *");

  var numElements = 0;
  _this.collapseTimeline = new TimelineMax( { repeat: 0 } );

// Assume container.style.display = 'none'. Now attach to specified Panel.
//_this.settings.sceneContainer.style.display = 'block';
//_this.settings.sceneContainer.panel.appendChild( _this.settings.sceneContainer );

  $.each( _this.particleMaps.homePostionParticles, function( idx, particle ) {
if (idx < 10000) {
    // Create element "below the fold", i.e. element.y is off the bottom of the page.
    var element = window[ particleAnimationElementMethod ]( _this, particle );
    if ( element ) {
      _this.settings.sceneContainer.appendChild( element );

      // Move element from element.x, element.y to home.x, home.y.
  	  _this.collapseTimeline.insert(
        TweenMax.to(
            element,
            options.tweenDuration,
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
}
  }); // end $.each()

  $( _this.settings.sceneContainer ).attr( 'numElements', numElements + '' );
  console.log( " ..*5a.2) renderParticleMapAsTweens(): Made " + $( _this.settings.sceneContainer ).attr( 'numElements' ) +
               " canvas AnimationElements. *");

  if ( typeof callback == 'function' ) { callback( numElements ); return; }
  return numElements;
}; // end renderParticleMapAsTweens()

=============================

//----------------------------------------------------------------------------
function createParticleAnimationSVGelement( _this, particle ) {
  //----------------------------------------------------------------------------
  var elementWidth = 16,
      elementHeight = 16
      panel_bottom = $(_this.settings.sceneContainer).height(),
      panel_width = $(_this.settings.sceneContainer).width(),
      left_boundaryX = Math.round( panel_width * 3/8 ),
      right_boundaryX = Math.round( panel_width - (panel_width * 3/8) );

  /*
  // Create element "below the fold" and in a column in the middle of the panel.
  // i.e. element.y is off the bottom of the page, element.x is in middle.
  var svg = document.createElement( 'svg' );
  svg.style.position = 'absolute';
  svg.style.left = getRandom( 225, 425 ) + "px";
  svg.style.top = panel_bottom - getRandom( 40, 50 ) + "px";
  // Set svg center (cx, cy) to Math.round( radius ) + 1;
  // Set svg height and width to cx * cx;
  // <svg height="49" width="49">
  //   <circle cx="7" cy="7" r="6" fill="#70C0EF" />
  // </svg>
  var circle = document.createElement( 'circle' );
  circle.setAttribute( 'fill', _this.settings.animationElementColor );
  circle.setAttribute( 'r', particle.r * _this.particleMaps.gridSize );
  circle.setAttribute( 'cx', Math.round( particle.r * _this.particleMaps.gridSize ) + 1 );
  circle.setAttribute( 'cy', circle.getAttribute( 'cx' ) );
  svg.setAttribute( 'width', (circle.getAttribute( 'cx' ) * circle.getAttribute( 'cx' ) + 1) );
  svg.setAttribute( 'height', svg.getAttribute( 'width' ) );
  svg.appendChild( circle );
  return svg;
  */
}; // end createParticleAnimationSVGelement()

====================

//----------------------------------------------------------------------------
function renderParticleMapAsTweens( _this, options, callback ) {
  //----------------------------------------------------------------------------
  console.log( " ..*5a.1) renderParticleMapAsTweens(): For HomePositionParticles[].len = " + _this.particleMaps.homePostionParticles.length + ". *");

  var numElements = 1,
      canvasAndCtx = makeCanvasAndCtx(),
      canvas = canvasAndCtx.canvas,
      context = canvasAndCtx.ctx;

  // NOTE: eraseCanvas() also set canvas.width/height, fillStyle = color
  eraseCanvas( _this, canvas, context, '#E7F1F7' );

  // Move every particle to its home position on the white canvas.
  //   Each particle: maps.homePostionParticles.push( {
  //          x: filterResults.x + homeOffsetLeft,
  //          y: filterResults.y+ homeOffsetTop,
  //          r: filterResults.pixelChannelIntensity * gridSize,
  // Write a halftone ball with the specified radius (which was calculated
  // as bigger for lower intensity particles).
  /*
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
  */


  _this.collapseTimeline = new TimelineMax( { repeat: 0 } );

  $.each( _this.particleMaps.homePostionParticles, function( idx, particle ) {
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
        TweenMax.to( element, options.tweenDuration, {
          left: particle.x,
          top:  particle.y,
      		autoAlpha: 0,
          ease: Power0.easeInOut,
        })
      );

  	} // end for( var i )

    // Just collaspe down to our "compressed core". If we wanted the position of
    // all particles, we could call a function upon pause() and get the pos info.  via "vars"?
    _this.collapseTimeline.addPause( options.tweenDuration - ( options.tweenDuration * .30) );

    $( _this.settings.sceneContainer ).attr( 'numElements', numElements + '' );
    console.log( " ..*5a.2) renderParticleMapAsSingleCanvas(): Made " + $( _this.settings.sceneContainer ).attr( 'numElements' ) +
                 " canvas AnimationElements. *");

    if ( typeof callback == 'function' ) { callback( numElements ); return; }
    return numElements;
}; // end renderParticleMapAsTweens()

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

//----------------------------------------------------------------------------
function renderParticleMapAsSingleCanvas( _this, options, callback ) {
  //----------------------------------------------------------------------------
  console.log( " ..*5a.1) renderParticleMapAsSingleCanvas(): For HomePositionParticles[].len = " + _this.particleMaps.homePostionParticles.length + ". *");

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
  console.log( " ..*5a.2) renderParticleMapAsSingleCanvas(): Made " + $( _this.settings.sceneContainer ).attr( 'numElements' ) +
               " canvas AnimationElements. *");

  if ( typeof callback == 'function' ) { callback( numElements ); return; }
  return numElements;
}; // end renderParticleMapAsSingleCanvas()
